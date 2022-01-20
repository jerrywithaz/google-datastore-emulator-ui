"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const child_process_1 = require("child_process");
const util_1 = require("util");
const types_1 = require("./types");
const removeTrailingSlash_1 = __importDefault(require("../../utils/removeTrailingSlash"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const ValidateEmulatorRunning_1 = __importDefault(require("../../decorators/ValidateEmulatorRunning"));
const ValidateEnv_1 = __importDefault(require("../../decorators/ValidateEnv"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
function getBackupName(backup, bucket) {
    return backup
        .replace(`gs://${bucket}`, "")
        .replace(/\//g, "");
}
function getDate(backup, bucket) {
    const date = getBackupName(backup, bucket).replace(/_\d+/, "");
    return new Date(date);
}
function getBackupInfo(backup, backupDir, bucket) {
    const name = getBackupName(backup, bucket);
    const potential_path = path.join(backupDir, name);
    const exists = fs.existsSync(path.resolve(potential_path));
    return { exists, path: potential_path };
}
let GsUtilResolver = class GsUtilResolver {
    async getProjectId({ env }) {
        return env.PROJECT_ID;
    }
    async getBackups({ env }) {
        const { stdout, stderr } = await execAsync(`gsutil ls gs://${env.DATASTORE_BACKUP_BUCKET}`);
        const backups = stdout
            .trim()
            .split(/\n/)
            .map((backup) => {
            return {
                id: (0, removeTrailingSlash_1.default)(backup),
                name: getBackupName(backup, env.DATASTORE_BACKUP_BUCKET),
                date: getDate(backup, env.DATASTORE_BACKUP_BUCKET),
                ...getBackupInfo(backup, env.DATASTORE_BACKUP_DIR, env.DATASTORE_BACKUP_BUCKET),
            };
        });
        if (stderr) {
            throw new Error(stderr);
        }
        return backups;
    }
    async startBackup({ env }) {
        const command = `gcloud datastore export gs://${env.DATASTORE_BACKUP_BUCKET} --project='${env.PROJECT_ID}' --format=json`;
        const { stdout, stderr } = await execAsync(command);
        if (stderr) {
            throw new Error(stderr);
        }
        const { metadata: { outputUrlPrefix }, } = JSON.parse(stdout);
        const timestamp = outputUrlPrefix.split("/").pop();
        return timestamp;
    }
    async downloadBackup(name, { env }) {
        const backup_bucket = env.DATASTORE_BACKUP_BUCKET;
        const outputDir = path.join(env.DATASTORE_BACKUP_DIR, name);
        const command = `gsutil -o GSUtil:parallel_process_count=1 -m cp -r "gs://${backup_bucket}/${name}/${name}.overall_export_metadata" "gs://${backup_bucket}/${name}/all_namespaces/" ${outputDir}`;
        fs.mkdirSync(outputDir);
        const { stderr } = await execAsync(command);
        if (stderr) {
            throw new Error(stderr);
        }
        return name;
    }
    async importBackup(name, { env }) {
        const input_url = path.join(env.DATASTORE_BACKUP_DIR, `${name}/${name}.overall_export_metadata`);
        const url = `${env.DATASTORE_PROJECT_URL}:import`;
        const command = `curl -d '{"input_url": "${input_url}"}' -H 'Content-Type: application/json' -X POST ${url}`;
        const { stderr } = await execAsync(command);
        if (stderr) {
            throw new Error(stderr);
        }
        return name;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GsUtilResolver.prototype, "getProjectId", null);
__decorate([
    (0, type_graphql_1.Query)(() => [types_1.DatastoreBackup]),
    (0, ValidateEnv_1.default)(['DATASTORE_BACKUP_BUCKET']),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GsUtilResolver.prototype, "getBackups", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, ValidateEnv_1.default)(['DATASTORE_BACKUP_BUCKET', 'PROJECT_ID']),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GsUtilResolver.prototype, "startBackup", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, ValidateEnv_1.default)(['DATASTORE_BACKUP_BUCKET', 'DATASTORE_BACKUP_DIR']),
    __param(0, (0, type_graphql_1.Arg)("name")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GsUtilResolver.prototype, "downloadBackup", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, ValidateEmulatorRunning_1.default)(),
    __param(0, (0, type_graphql_1.Arg)("name")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GsUtilResolver.prototype, "importBackup", null);
GsUtilResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], GsUtilResolver);
exports.default = GsUtilResolver;
