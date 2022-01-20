"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const util_1 = require("util");
const env_1 = __importDefault(require("../env"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
async function checkIfEmulatorRunning() {
    try {
        const { stderr, stdout } = await execAsync(`curl -X GET -L ${env_1.default.DATASTORE_EMULATOR_HOST}`);
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
