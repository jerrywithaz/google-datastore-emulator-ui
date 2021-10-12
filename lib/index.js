#!/usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
require('dotenv').config();
var child_process_1 = require("child_process");
var commander_1 = require("commander");
var assert_1 = __importDefault(require("assert"));
var path_1 = require("path");
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var boostrapServer = require('../src/server').default;
function outputServerConfigToClient(port, isDev) {
    var clientPath = path.resolve(process.cwd(), 'src', 'client');
    var configPath = path.resolve(clientPath, isDev ? 'public' : 'build', 'server_config.json');
    console.log('Located client server config at: ', configPath);
    var config = JSON.parse(fs.readFileSync(configPath).toString());
    var newConfig = __assign(__assign({}, config), { port: port });
    console.log('Updating client server config at: ', configPath, newConfig);
    fs.writeFileSync(configPath, JSON.stringify(newConfig));
}
function getPackageJson() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, require('../package.json')];
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        function spawnProcess(command, options) {
            var child_process = (0, child_process_1.spawn)(command, {
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
                spawnProcess("serve -s " + (0, path_1.join)(__dirname, '..', 'src', 'client', 'build'));
        }
        function startServer() {
            if (DEV_MODE) {
                spawnProcess("PROJECT_ID=" + PROJECT_ID + " DATASTORE_EMULATOR_HOST=" + DATASTORE_EMULATOR_HOST + " PORT=" + PORT + " npm run dev:server");
            }
            else {
                boostrapServer({ projectId: PROJECT_ID, emulatorHost: DATASTORE_EMULATOR_HOST, port: PORT });
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
        var packageJson, program, options, DEV_MODE, PROJECT_ID, DATASTORE_EMULATOR_HOST, PORT;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getPackageJson()];
                case 1:
                    packageJson = _a.sent();
                    if (!packageJson.version)
                        throw new Error('Could not detect version from package.json');
                    program = new commander_1.Command('google-datastore-emulator-ui');
                    program
                        .version(packageJson.version)
                        .option('-i, --id <project>', 'The id of the google datastore project.', process.env.PROJECT_ID)
                        .option('-e, --emulator-host <host>', 'The url of the emulator', process.env.DATASTORE_EMULATOR_HOST)
                        .option('-p, --port <port>', 'The port to run the express server on', process.env.SERVER_PORT || '8002')
                        .option('-D, --dev', 'Run in dev mode', process.env.NODE_ENV === 'development')
                        .parse(process.argv);
                    options = program.opts();
                    // Validate options
                    (0, assert_1.default)(options.id, 'Missing a project, run with -i <projectId>');
                    (0, assert_1.default)(options.emulatorHost, 'Missing a emulator host, run with -e <host>');
                    DEV_MODE = Boolean(options.dev);
                    PROJECT_ID = options.id;
                    DATASTORE_EMULATOR_HOST = options.emulatorHost;
                    PORT = Number(options.port);
                    outputServerConfigToClient(PORT, DEV_MODE);
                    start();
                    return [2 /*return*/];
            }
        });
    });
}
main();
//# sourceMappingURL=index.js.map