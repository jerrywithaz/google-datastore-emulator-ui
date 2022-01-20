"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const ValidateEmulatorRunning_1 = __importDefault(require("../../decorators/ValidateEmulatorRunning"));
const isNullOrUndefined_1 = __importDefault(require("../../utils/isNullOrUndefined"));
const normalizeAndSortColumns_1 = __importDefault(require("../../utils/normalizeAndSortColumns"));
const enums_1 = require("./enums");
const scalars_1 = require("./scalars");
const types_1 = require("./types");
let EntitiesResolver = class EntitiesResolver {
    async getDataTypes() {
        return scalars_1.datatypes;
    }
    async getOperators() {
        return scalars_1.operators;
    }
    async getEntities({ kind, page, pageSize, filters, sortModel }, { datastore }) {
        let query = datastore
            .createQuery(kind)
            .limit(pageSize)
            .offset(page * pageSize);
        // Build filters
        if ((filters === null || filters === void 0 ? void 0 : filters.length) && Array.isArray(filters)) {
            for (let i = 0; i < filters.length; i++) {
                const { property, operator, value } = filters[i];
                if (value !== undefined) {
                    query = query.filter(property, operator.toString(), value.serialize());
                }
            }
        }
        // Build sort model
        if ((sortModel === null || sortModel === void 0 ? void 0 : sortModel.length) && Array.isArray(sortModel)) {
            for (let i = 0; i < sortModel.length; i++) {
                const { field, sort } = sortModel[i];
                query = query.order(field, {
                    descending: sort === "desc",
                });
            }
        }
        const results = await datastore.runQuery(query);
        const entities = results[0].filter(isNullOrUndefined_1.default).map((e) => {
            const key = e[datastore.KEY];
            const id = key.id || key.name || e.id;
            return {
                entity: {
                    id,
                    ...e,
                },
                key: id,
                path: new scalars_1.PathArrayType(...key.serialized.path)
            };
        });
        const typesMap = new scalars_1.DataTypeMap();
        const columns = [];
        entities.forEach((entity) => {
            Object.keys(entity.entity).forEach((key) => {
                const value = entity.entity[key];
                if (!typesMap.has(key)) {
                    columns.push(key);
                }
                typesMap.set(key, value);
            });
        });
        (0, normalizeAndSortColumns_1.default)(columns);
        const info = results[1];
        return { entities, info, typesMap, columns, availableTypes: scalars_1.datatypes };
    }
    async updateEntity({ path, updates }, { datastore }) {
        const transaction = datastore.transaction();
        const key = datastore.key(path);
        await transaction.run();
        const [entity] = await transaction.get(key);
        const updatedEntity = {
            ...entity,
            ...updates,
        };
        const id = key.id || key.name || updatedEntity.id;
        transaction.save({
            key: key,
            data: updatedEntity,
        });
        await transaction.commit();
        const [finalEntity] = await datastore.get(key);
        return {
            entity: finalEntity,
            key: id,
            path: path
        };
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [enums_1.DataTypeEnum]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EntitiesResolver.prototype, "getDataTypes", null);
__decorate([
    (0, type_graphql_1.Query)(() => [enums_1.OperatorEnum]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EntitiesResolver.prototype, "getOperators", null);
__decorate([
    (0, type_graphql_1.Query)(() => types_1.EntitiesResult),
    (0, ValidateEmulatorRunning_1.default)(),
    __param(0, (0, type_graphql_1.Arg)("input", { nullable: false })),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.GetEntitiesInput, Object]),
    __metadata("design:returntype", Promise)
], EntitiesResolver.prototype, "getEntities", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.Entity),
    (0, ValidateEmulatorRunning_1.default)(),
    __param(0, (0, type_graphql_1.Arg)("input", { nullable: false })),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.UpdateEntityInput, Object]),
    __metadata("design:returntype", Promise)
], EntitiesResolver.prototype, "updateEntity", null);
EntitiesResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], EntitiesResolver);
exports.default = EntitiesResolver;
