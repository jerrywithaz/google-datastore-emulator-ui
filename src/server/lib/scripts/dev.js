"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var src_1 = __importDefault(require("../src"));
var projectId = process.env.PROJECT_ID || '';
var emulatorHost = process.env.DATASTORE_EMULATOR_HOST || '';
var port = Number(process.env.SERVER_PORT) || 8002;
(0, src_1.default)({ projectId: projectId, emulatorHost: emulatorHost, port: port });
