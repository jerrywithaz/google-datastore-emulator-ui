#!/usr/bin/env node

require('dotenv').config();

const path = require('path');
const { mkdirSync } = require('fs');
const { spawn, execSync } = require('child_process');

const [, , ...args] = process.argv;

const command = args[0];
const project = process.env.PROJECT_ID;
const host = process.env.DATASTORE_EMULATOR_HOST;
const backup_bucket = process.env.DATASTORE_BACKUP_BUCKET;
const port = Number(host.match(/\d+/)[0]);
const url = `${host}/v1/projects/${project}`;
const dir = 'gcloud_datastore';

function spawnProcess(command) {
  const child_process = spawn(command, {
    shell: true
  });

  child_process.stderr.on('data', data => console.log(data.toString()));
  child_process.stdout.on('data', data => console.log(data.toString()));
  child_process.on('error', error => console.log(error));

  return child_process;
}

function getEmulatorPids() {
  return new Promise((resolve, reject) => {
    const command = `lsof -i :${port} | awk '{ print $2; }' | grep -v PID`;

    let pids = new Set();

    const lsof = spawnProcess(command);

    lsof.stdout.on('data', data => {
      const result = data.toString();

      pids = new Set(
        result
          .trim()
          .split(/\n/)
          .map(e => Number(e.trim()))
      );
    });

    lsof.on('close', () => {
      resolve(pids);
    });

    lsof.on('error', error => {
      reject(error);
    });
  });
}
async function downloadBackup() {
  // example: 2021-09-29T21:49:01_40437
  const timestamp = args[1];
  const outputDir = `./${dir}/backups/${timestamp}`;
  const command = `gsutil -m cp -r "gs://${backup_bucket}/${timestamp}/${timestamp}.overall_export_metadata" "gs://${backup_bucket}/${timestamp}/all_namespaces/" ${outputDir}`;

  mkdirSync(path.join(process.cwd(), outputDir));
  spawnProcess(command);
}

async function stopEmulator() {
  const pids = await getEmulatorPids();

  pids.forEach(pid => {
    console.log(`Killing process with pid: ${pid}`);
    try {
      execSync(`kill -9 ${pid}`);
    } catch (error) { }
  });
}

async function startEmulator() {
  const pids = await getEmulatorPids();

  if (pids.size === 0) {
    const host_port = host.replace('http://', '');
    const command = `gcloud beta emulators datastore start --data-dir=./${dir} --project=${project} --host-port=${host_port}`;

    spawnProcess(command);

    process.on('SIGINT', stopEmulator);
  } else {
    const values = [...pids.values()];

    console.log(
      `Emulator is already running on: ${values.join(
        ','
      )}. Run "npm run gcloud:emulator:stop"`
    );
  }
}

async function importEntities() {
  const name = args[1];
  const input_url = path.join(
    process.cwd(),
    `/${dir}/backups/${name}/${name}.overall_export_metadata`
  );
  const command = `curl -d '{"input_url": "${input_url}"}' -H 'Content-Type: application/json' -X POST ${url}:import`;

  try {

    return new Promise((resolve, reject) => {
      const p = spawnProcess(command);

      p.on('close', resolve);
      p.on('exit', resolve);
      p.on('reject', reject);
    });
  } catch (error) {
    console.log('Unable to import entities, failed with error: ', error);
  }
}

async function exportEntities() {
  const output_url_prefix = `/${dir}/backups/${new Date().toISOString()}`;
  const command = `curl -d '{"output_url_prefix": "${output_url_prefix}"}' -H 'Content-Type: application/json' -X POST ${url}:export`;

  try {

    return new Promise((resolve, reject) => {
      const p = spawnProcess(command);

      p.on('close', resolve);
      p.on('exit', resolve);
      p.on('reject', reject);
    });
  } catch (error) {
    console.log('Unable to export entities, failed with error: ', error);
  }
}

async function main() {
  if (command === 'download') await downloadBackup();
  if (command === 'stop') await stopEmulator();
  if (command === 'start') await startEmulator();
  if (command === 'import') await importEntities();
  if (command === 'export') await exportEntities();
}

main();