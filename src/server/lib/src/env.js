"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
function getEnv() {
    const { DATASTORE_EMULATOR_HOST = '', DATASTORE_BACKUP_BUCKET = '', PROJECT_ID = '', DATASTORE_BACKUP_DIR = '', } = process.env;
    const DATASTORE_EMULATOR_HOST_MATCHES = DATASTORE_EMULATOR_HOST.match(/\d+/);
    const DATASTORE_EMULATOR_PORT = Number(DATASTORE_EMULATOR_HOST_MATCHES ? DATASTORE_EMULATOR_HOST_MATCHES[0] : 0);
    const DATASTORE_PROJECT_URL = `${DATASTORE_EMULATOR_HOST}/v1/projects/${PROJECT_ID}`;
    const env = {
        DATASTORE_EMULATOR_HOST: DATASTORE_EMULATOR_HOST,
        DATASTORE_BACKUP_BUCKET: DATASTORE_BACKUP_BUCKET,
        DATASTORE_BACKUP_DIR: DATASTORE_BACKUP_DIR,
        PROJECT_ID: PROJECT_ID,
        DATASTORE_EMULATOR_PORT: DATASTORE_EMULATOR_PORT,
        DATASTORE_PROJECT_URL: DATASTORE_PROJECT_URL,
    };
    for (const key in env) {
        const typedKey = key;
        const element = env[typedKey];
        if (element) {
            console.log("✅", key, element);
        }
        else {
            console.log("❌", key, element);
        }
    }
    return env;
}
exports.default = getEnv;
