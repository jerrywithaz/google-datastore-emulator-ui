import boostrap from "../src";
import { Command } from 'commander';

const program = new Command('google-datastore-emulator-ui');

program.version('1.0.0');

program.option('-p, --port', 'The port to run the ui on.');

program.option('-i, --id', 'The id of the google datastore project.');

program.parse(process.argv);

const options = program.opts();

console.log(options);
