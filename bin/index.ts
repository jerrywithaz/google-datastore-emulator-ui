#!/usr/bin/env node

require('dotenv').config();

import { spawn, SpawnOptionsWithoutStdio } from "child_process";
import { Command } from 'commander';
import assert from "assert";
import { JSONSchemaForNPMPackageJsonFiles } from '@schemastore/package'
import { join } from "path";
import * as fs from 'fs';
import * as path from 'path';

const { default: boostrapServer } = require('../src/server');

function outputServerConfigToClient(port: number, isDev: boolean) {
    const clientPath = path.resolve(__dirname, '..', 'src', 'client');

    const configPath = path.resolve(clientPath, isDev ? 'public' : 'build', 'server_config.json');

    console.log('Located client server config at: ', configPath);

    const config = JSON.parse(fs.readFileSync(configPath).toString());

    const newConfig = {
        ...config,
        port
    };

    console.log('Updating client server config at: ', configPath, newConfig);

    fs.writeFileSync(configPath, JSON.stringify(newConfig));
}

async function getPackageJson(): Promise<JSONSchemaForNPMPackageJsonFiles> {
    return require('../package.json');
}

async function main() {

    const packageJson = await getPackageJson();

    if (!packageJson.version) throw new Error('Could not detect version from package.json');

    const program = new Command('google-datastore-emulator-ui');

    program
        .version(packageJson.version)
        .option('-i, --id <project>', 'The id of the google datastore project.', process.env.PROJECT_ID)
        .option('-e, --emulator-host <host>', 'The url of the emulator', process.env.DATASTORE_EMULATOR_HOST)
        .option('-p, --port <port>', 'The port to run the express server on', process.env.SERVER_PORT || '8002')
        .option('-D, --dev', 'Run in dev mode', process.env.NODE_ENV === 'development')
        .parse(process.argv);
    
    const options = program.opts();
    
    // Validate options
    
    assert(options.id, 'Missing a project, run with -i <projectId>');
    assert(options.emulatorHost, 'Missing a emulator host, run with -e <host>');
    
    // Set consts
    
    const DEV_MODE = Boolean(options.dev);
    const PROJECT_ID = options.id;
    const DATASTORE_EMULATOR_HOST = options.emulatorHost;
    const PORT = Number(options.port);
    
    outputServerConfigToClient(PORT, DEV_MODE);

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
        else spawnProcess(`serve -s ${join(__dirname, '..', 'src', 'client', 'build')}`);
    }
    
    function startServer() {
        if (DEV_MODE) {
            spawnProcess(`PROJECT_ID=${PROJECT_ID} DATASTORE_EMULATOR_HOST=${DATASTORE_EMULATOR_HOST} PORT=${PORT} npm run dev:server`);
        }
        else {
            boostrapServer({ projectId: PROJECT_ID, emulatorHost: DATASTORE_EMULATOR_HOST, port: PORT });
        }
    }
    
    async function start() {
        startServer();
        startClient();
    }
    
    start();
}

main();

