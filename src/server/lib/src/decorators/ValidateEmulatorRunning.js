"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const checkIfEmulatorRunning_1 = __importDefault(require("../utils/checkIfEmulatorRunning"));
function ValidateEmulatorRunning() {
    return (0, type_graphql_1.createMethodDecorator)(async (_, next) => {
        const emulatorRunning = await (0, checkIfEmulatorRunning_1.default)();
        if (!emulatorRunning) {
            throw new Error(`Unable to connect to google datastore emulator running at: ${process.env.DATASTORE_EMULATOR_HOST}. \nMake sure you either set the environment variable DATASTORE_EMULATOR_HOST or run the google-datastore-emulator with the -e or --emulator-host option.`);
        }
        return next();
    });
}
exports.default = ValidateEmulatorRunning;
