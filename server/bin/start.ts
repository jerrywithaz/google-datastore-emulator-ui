#!/usr/bin/env node

import boostrap from "../src/server";
import { Command } from 'commander';
import assert from "assert";

const program = new Command('google-datastore-emulator-ui');

program
    .version('1.0.0')
    .option('-p, --port <number>', 'The port to run the server on.')
    .option('-i, --id <project>', 'The id of the google datastore project.')
    .option('-e, --emulator-host <host>', 'The url of the emulator')
    .parse(process.argv);

const options = program.opts();

// Validate options

assert(options.port, 'A port was not defined, run with -p <port>');
assert(options.id, 'Missing a project, run with -i <projectId>');
assert(options.emulatorHost, 'Missing a emulator host, run with -e <host>');

// Set env vars

process.env.PROJECT_ID = options.id;
process.env.DATASTORE_EMULATOR_HOST = options.emulatorHost;

console.log('Running with options: ', options);

// Start server

boostrap({ port: Number(options.port) });
