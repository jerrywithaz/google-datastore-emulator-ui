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
const isNullOrUndefined_1 = __importDefault(require("../../utils/isNullOrUndefined"));
const normalizeAndSortColumns_1 = __importDefault(require("../../utils/normalizeAndSortColumns"));
const types_1 = require("./types");
function getType(datastore, value, key) {
    if (key.endsWith("_at") || key.endsWith("At"))
        return "date";
    if (value === "id")
        return "string";
    if (typeof value === "boolean")
        return "boolean";
    if (datastore.isDouble(value) || datastore.isInt(value))
        return "number";
    if (Array.isArray(value))
        return "array";
    return typeof value;
}
let EntitiesResolver = class EntitiesResolver {
    async getEntities({ kind, page, pageSize, filters, sortModel }, { datastore }) {
        let query = datastore
            .createQuery(kind)
            .limit(pageSize)
            .offset(page * pageSize);
        // Build filters
        if ((filters === null || filters === void 0 ? void 0 : filters.length) && Array.isArray(filters)) {
            for (let i = 0; i < filters.length; i++) {
                const { property, operator, value } = filters[i];
                if (value) {
                    query = query.filter(property, operator.toString(), value);
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
            const id = e[datastore.KEY].name || e[datastore.KEY].id || e.id;
            return {
                entity: {
                    id,
                    ...e,
                },
                id,
            };
        });
        const typesMap = {};
        const columns = [];
        entities.forEach((entity) => {
            Object.keys(entity.entity).forEach((key) => {
                if (!typesMap[key] && entity.entity[key]) {
                    typesMap[key] = getType(datastore, entity.entity[key], key);
                    columns.push(key);
                }
            });
        });
        (0, normalizeAndSortColumns_1.default)(columns);
        const info = results[1];
        return { entities, info, typesMap, columns };
    }
    async updateEntity({ path, updates }, { datastore }) {
        const transaction = datastore.transaction();
        const datastore_key = datastore.key(path);
        await transaction.run();
        const [entity] = await transaction.get(datastore_key);
        const updatedEntity = {
            ...entity,
            ...updates,
        };
        transaction.save({
            key: datastore_key,
            data: updatedEntity,
        });
        await transaction.commit();
        const key = updatedEntity[datastore.KEY].name ||
            updatedEntity[datastore.KEY].id ||
            updatedEntity.id;
        return {
            entity: {
                ...updatedEntity,
                id: key,
            },
            id: key,
        };
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => types_1.EntitiesResult),
    __param(0, (0, type_graphql_1.Arg)("input", { nullable: false })),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.GetEntitiesInput, Object]),
    __metadata("design:returntype", Promise)
], EntitiesResolver.prototype, "getEntities", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.Entity),
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
