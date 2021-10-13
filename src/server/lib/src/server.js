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
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var datastore_1 = __importDefault(require("./datastore"));
var isNullOrUndefined_1 = __importDefault(require("./utils/isNullOrUndefined"));
function setEnv(_a) {
    var projectId = _a.projectId, emulatorHost = _a.emulatorHost, port = _a.port;
    process.env.PROJECT_ID = projectId;
    process.env.DATASTORE_EMULATOR_HOST = emulatorHost;
    process.env.SERVER_PORT = port.toString();
}
function boostrap(_a) {
    var _this = this;
    var projectId = _a.projectId, emulatorHost = _a.emulatorHost, port = _a.port;
    setEnv({ projectId: projectId, emulatorHost: emulatorHost, port: port });
    console.log('PROJECT_ID', projectId);
    console.log('DATASTORE_EMULATOR_HOST', emulatorHost);
    var app = (0, express_1.default)();
    var datastore = (0, datastore_1.default)();
    app.enable('trust proxy');
    app.use((0, cors_1.default)());
    app.get("/datastore/namespaces", function (_, res) { return __awaiter(_this, void 0, void 0, function () {
        var query, results, namespaces, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    query = datastore.createQuery("__namespace__").select("__key__");
                    return [4 /*yield*/, datastore.runQuery(query)];
                case 1:
                    results = _a.sent();
                    namespaces = results[0]
                        .map(function (e) { return e[datastore.KEY].name; })
                        .filter(isNullOrUndefined_1.default);
                    res.contentType("application/json");
                    res.status(200);
                    res.send(namespaces);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    res.status(500);
                    res.send(error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get("/datastore/kinds", function (_, res) { return __awaiter(_this, void 0, void 0, function () {
        var query, results, kinds, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    query = datastore.createQuery("__kind__").select("__key__");
                    return [4 /*yield*/, datastore.runQuery(query)];
                case 1:
                    results = _a.sent();
                    kinds = results[0]
                        .map(function (e) { return e[datastore.KEY].name; })
                        .filter(isNullOrUndefined_1.default);
                    res.contentType("application/json");
                    res.status(200);
                    res.send(kinds);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    res.status(500);
                    res.send(error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get("/datastore/entities/:kind", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var kind, page, pageSize, filters, sortModel, query, i, _a, property, operator, value, i, _b, field, sort, results, entities, info, error_3;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    kind = req.params.kind;
                    page = Number(req.query.page) || 0;
                    pageSize = Number(req.query.pageSize) || 25;
                    filters = req.query.filters;
                    sortModel = req.query.sortModel;
                    query = datastore.createQuery(kind).limit(pageSize).offset(page * pageSize);
                    // Build filters
                    if ((filters === null || filters === void 0 ? void 0 : filters.length) && Array.isArray(filters)) {
                        for (i = 0; i < filters.length; i++) {
                            _a = JSON.parse(filters[i]), property = _a[0], operator = _a[1], value = _a[2];
                            if (value) {
                                query = query.filter(property, operator, value);
                            }
                        }
                    }
                    // Build sort model
                    if ((sortModel === null || sortModel === void 0 ? void 0 : sortModel.length) && Array.isArray(sortModel)) {
                        for (i = 0; i < sortModel.length; i++) {
                            _b = JSON.parse(sortModel[i]), field = _b.field, sort = _b.sort;
                            query = query.order(field, {
                                descending: sort === 'desc',
                            });
                        }
                    }
                    return [4 /*yield*/, datastore.runQuery(query)];
                case 1:
                    results = _c.sent();
                    entities = results[0].filter(isNullOrUndefined_1.default)
                        .map(function (e) { return (__assign(__assign({}, e), { __key__: e[datastore.KEY].name || e[datastore.KEY].id })); });
                    info = results[1];
                    res.contentType("application/json");
                    res.status(200);
                    res.send({
                        info: info,
                        entities: entities,
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _c.sent();
                    res.status(500);
                    res.send(error_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.listen(port, function () {
        console.log("Listening on port: " + port);
        console.log("Server available at: http://localhost:" + port);
    });
}
exports.default = boostrap;
