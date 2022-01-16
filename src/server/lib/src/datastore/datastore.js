"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datastore_1 = require("@google-cloud/datastore");
function createDatastore() {
    return new datastore_1.Datastore({
        projectId: process.env.PROJECT_ID,
        apiEndpoint: process.env.DATASTORE_EMULATOR_HOST,
    });
}
exports.default = createDatastore;
