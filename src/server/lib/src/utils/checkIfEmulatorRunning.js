"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
async function checkIfEmulatorRunning() {
    try {
        const { stderr, stdout } = await execAsync(`curl --write-out '%{http_code}' --silent --output /dev/null -X GET -L ${process.env.DATASTORE_EMULATOR_HOST}`);
        if (stdout.trim() === '200') {
            return true;
        }
        if (stderr) {
            return false;
        }
        return false;
    }
    catch (error) {
        return false;
    }
}
exports.default = checkIfEmulatorRunning;
