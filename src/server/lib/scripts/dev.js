"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = __importDefault(require("../src"));
var projectId = process.env.PROJECT_ID || '';
var emulatorHost = process.env.DATASTORE_EMULATOR_HOST || '';
(0, src_1.default)({ projectId: projectId, emulatorHost: emulatorHost });
