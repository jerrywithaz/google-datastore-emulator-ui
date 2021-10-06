#!/usr/bin/env node

import { spawn, SpawnOptionsWithoutStdio } from "child_process";
import { Command } from 'commander';
import assert from "assert";
import { JSONSchemaForNPMPackageJsonFiles } from '@schemastore/package'

const { default: boostrapServer } = require('../src/server/lib');

async function getPackageJson(): Promise<JSONSchemaForNPMPackageJsonFiles> {
    return require('../package.json');
}

async function main() {

    const packageJson = await getPackageJson();

    if (!packageJson.version) throw new Error('Could not detect version from package.json');

    const program = new Command('google-datastore-emulator-ui');

    console.log(process.argv);
    
    program
        .version(packageJson.version)
        .option('-i, --id <project>', 'The id of the google datastore project.')
        .option('-e, --emulator-host <host>', 'The url of the emulator')
        .option('-D, --dev', 'Run in dev mode')
        .parse(process.argv);
    
    const options = program.opts();
    
    // Validate options
    
    assert(options.id, 'Missing a project, run with -i <projectId>');
    assert(options.emulatorHost, 'Missing a emulator host, run with -e <host>');
    
    // Set consts
    
    const DEV_MODE = Boolean(options.dev);
    const PROJECT_ID = options.id;
    const DATASTORE_EMULATOR_HOST = options.emulatorHost;
    
    function spawnProcess(command: string, options?: SpawnOptionsWithoutStdio) {
      const child_process = spawn(command, {
        shell: true,
      });
    
      child_process.stderr.on("data", (data) => console.log(data.toString()));
      child_process.stdout.on("data", (data) => console.log(data.toString()));
      child_process.on("error", console.error);
    
      return child_process;
    }
    
    function startClient() {
        if (DEV_MODE) spawnProcess(`npm run dev:client`);
        else spawnProcess(`npm run serve:client`);
    }
    
    function startServer() {
        if (DEV_MODE) {
            spawnProcess(`PROJECT_ID=${PROJECT_ID} DATASTORE_EMULATOR_HOST=${DATASTORE_EMULATOR_HOST} npm run dev:server`);
        }
        else {
            boostrapServer({ projectId: PROJECT_ID, emulatorHost: DATASTORE_EMULATOR_HOST });
        }
    }
    
    async function start() {
        startServer();
        startClient();
    }
    
    start();
}

main();

