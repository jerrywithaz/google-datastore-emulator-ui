"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
async function checkIfEmulatorRunning() {
    try {
        const { stderr, stdout } = await execAsync(`curl -X GET -L ${process.env.DATASTORE_EMULATOR_HOST}`);
        if (stderr) {
            return false;
        }
        if (stdout === "ok") {
            return true;
        }
        return false;
    }
    catch (error) {
        return false;
    }
}
exports.default = checkIfEmulatorRunning;
