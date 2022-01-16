"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const src_1 = __importDefault(require("../src"));
const projectId = process.env.PROJECT_ID || '';
const emulatorHost = process.env.DATASTORE_EMULATOR_HOST || '';
const port = Number(process.env.SERVER_PORT) || 8002;
(0, src_1.default)({ projectId, emulatorHost, port }).catch(console.error);
