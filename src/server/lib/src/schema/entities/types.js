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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEntityInput = exports.GetEntitiesInput = exports.SortModel = exports.FilterModel = exports.EntitiesResult = exports.Entity = exports.RunQueryInfo = void 0;
const type_graphql_1 = require("type-graphql");
const graphql_type_json_1 = require("graphql-type-json");
const scalars_1 = require("./scalars");
const enums_1 = require("./enums");
let RunQueryInfo = class RunQueryInfo {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RunQueryInfo.prototype, "endCursor", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => enums_1.MoreResultsEnum, { nullable: true }),
    __metadata("design:type", String)
], RunQueryInfo.prototype, "moreResults", void 0);
RunQueryInfo = __decorate([
    (0, type_graphql_1.ObjectType)()
], RunQueryInfo);
exports.RunQueryInfo = RunQueryInfo;
let Entity = class Entity {
};
__decorate([
    (0, type_graphql_1.Field)(() => graphql_type_json_1.GraphQLJSONObject),
    __metadata("design:type", Object)
], Entity.prototype, "entity", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    __metadata("design:type", String)
], Entity.prototype, "key", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => scalars_1.PathArrayScalar),
    __metadata("design:type", scalars_1.PathArrayType)
], Entity.prototype, "path", void 0);
Entity = __decorate([
    (0, type_graphql_1.ObjectType)()
], Entity);
exports.Entity = Entity;
let EntitiesResult = class EntitiesResult {
};
__decorate([
    (0, type_graphql_1.Field)(() => [Entity]),
    __metadata("design:type", Array)
], EntitiesResult.prototype, "entities", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => scalars_1.DataTypeMapScalar, { description: 'The data types for each key in an entity.' }),
    __metadata("design:type", scalars_1.DataTypeMap)
], EntitiesResult.prototype, "typesMap", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], EntitiesResult.prototype, "columns", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => RunQueryInfo),
    __metadata("design:type", RunQueryInfo)
], EntitiesResult.prototype, "info", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [enums_1.DataTypeEnum]),
    __metadata("design:type", Array)
], EntitiesResult.prototype, "availableTypes", void 0);
EntitiesResult = __decorate([
    (0, type_graphql_1.ObjectType)()
], EntitiesResult);
exports.EntitiesResult = EntitiesResult;
let FilterModel = class FilterModel {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FilterModel.prototype, "property", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => scalars_1.OperatorScalar),
    __metadata("design:type", scalars_1.OperatorType)
], FilterModel.prototype, "operator", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => scalars_1.FilterScalar),
    __metadata("design:type", scalars_1.FilterType)
], FilterModel.prototype, "value", void 0);
FilterModel = __decorate([
    (0, type_graphql_1.InputType)()
], FilterModel);
exports.FilterModel = FilterModel;
let SortModel = class SortModel {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], SortModel.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], SortModel.prototype, "sort", void 0);
SortModel = __decorate([
    (0, type_graphql_1.InputType)()
], SortModel);
exports.SortModel = SortModel;
let GetEntitiesInput = class GetEntitiesInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], GetEntitiesInput.prototype, "kind", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true, defaultValue: 0 }),
    __metadata("design:type", Number)
], GetEntitiesInput.prototype, "page", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true, defaultValue: 25 }),
    __metadata("design:type", Number)
], GetEntitiesInput.prototype, "pageSize", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [FilterModel], { nullable: true, defaultValue: [] }),
    __metadata("design:type", Array)
], GetEntitiesInput.prototype, "filters", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [SortModel], { nullable: true, defaultValue: [] }),
    __metadata("design:type", Array)
], GetEntitiesInput.prototype, "sortModel", void 0);
GetEntitiesInput = __decorate([
    (0, type_graphql_1.InputType)()
], GetEntitiesInput);
exports.GetEntitiesInput = GetEntitiesInput;
let UpdateEntityInput = class UpdateEntityInput {
};
__decorate([
    (0, type_graphql_1.Field)(() => scalars_1.PathArrayScalar),
    __metadata("design:type", scalars_1.PathArrayType)
], UpdateEntityInput.prototype, "path", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_type_json_1.GraphQLJSONObject),
    __metadata("design:type", Object)
], UpdateEntityInput.prototype, "updates", void 0);
UpdateEntityInput = __decorate([
    (0, type_graphql_1.InputType)()
], UpdateEntityInput);
exports.UpdateEntityInput = UpdateEntityInput;
