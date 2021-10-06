#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var server_1 = __importDefault(require("../server"));
var commander_1 = require("commander");
var assert_1 = __importDefault(require("assert"));
var program = new commander_1.Command('google-datastore-emulator-ui');
program
    .version('1.0.0')
    .option('-i, --id <project>', 'The id of the google datastore project.')
    .option('-e, --emulator-host <host>', 'The url of the emulator')
    .option('-D, --dev', 'Run in dev mode')
    .parse(process.argv);
var options = program.opts();
// Validate options
assert_1.default(options.id, 'Missing a project, run with -i <projectId>');
assert_1.default(options.emulatorHost, 'Missing a emulator host, run with -e <host>');
// Set consts
var DEV_MODE = Boolean(options.dev);
var PROJECT_ID = options.id;
var DATASTORE_EMULATOR_HOST = options.emulatorHost;
function spawnProcess(command, options) {
    var child_process = child_process_1.spawn(command, {
        shell: true,
    });
    child_process.stderr.on("data", function (data) { return console.log(data.toString()); });
    child_process.stdout.on("data", function (data) { return console.log(data.toString()); });
    child_process.on("error", console.error);
    return child_process;
}
function startClient() {
    if (DEV_MODE)
        spawnProcess("npm run dev:client");
    else
        spawnProcess("npm run serve:client");
}
function startServer() {
    if (DEV_MODE) {
        spawnProcess("PROJECT_ID=" + PROJECT_ID + " DATASTORE_EMULATOR_HOST=" + DATASTORE_EMULATOR_HOST + " npm run dev:server");
    }
    else {
        server_1.default({ projectId: PROJECT_ID, emulatorHost: DATASTORE_EMULATOR_HOST });
    }
}
function start() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            startServer();
            startClient();
            return [2 /*return*/];
        });
    });
}
start();
//# sourceMappingURL=start.js.map