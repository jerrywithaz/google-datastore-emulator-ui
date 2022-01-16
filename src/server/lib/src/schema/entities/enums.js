"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTypeEnum = exports.MoreResultsEnum = exports.OperatorEnum = void 0;
const type_graphql_1 = require("type-graphql");
var OperatorEnum;
(function (OperatorEnum) {
    OperatorEnum["equals"] = "=";
    OperatorEnum["less_than"] = "<";
    OperatorEnum["greater_than"] = ">";
    OperatorEnum["less_than_or_equal"] = "<=";
    OperatorEnum["greater_than_or_equal"] = ">=";
    OperatorEnum["has_ancestor"] = "HAS_ANCESTOR";
})(OperatorEnum = exports.OperatorEnum || (exports.OperatorEnum = {}));
var MoreResultsEnum;
(function (MoreResultsEnum) {
    MoreResultsEnum["MORE_RESULTS_TYPE_UNSPECIFIED"] = "MORE_RESULTS_TYPE_UNSPECIFIED";
    MoreResultsEnum["NOT_FINISHED"] = "NOT_FINISHED";
    MoreResultsEnum["MORE_RESULTS_AFTER_LIMIT"] = "MORE_RESULTS_AFTER_LIMIT";
    MoreResultsEnum["MORE_RESULTS_AFTER_CURSOR"] = "MORE_RESULTS_AFTER_CURSOR";
    MoreResultsEnum["NO_MORE_RESULTS"] = "NO_MORE_RESULTS";
})(MoreResultsEnum = exports.MoreResultsEnum || (exports.MoreResultsEnum = {}));
var DataTypeEnum;
(function (DataTypeEnum) {
    DataTypeEnum["string"] = "string";
    DataTypeEnum["number"] = "number";
    DataTypeEnum["boolean"] = "boolean";
    DataTypeEnum["undefined"] = "undefined";
    DataTypeEnum["object"] = "object";
    DataTypeEnum["date"] = "date";
    DataTypeEnum["nullish"] = "nullish";
    DataTypeEnum["array"] = "array";
    DataTypeEnum["buffer"] = "buffer";
})(DataTypeEnum = exports.DataTypeEnum || (exports.DataTypeEnum = {}));
(0, type_graphql_1.registerEnumType)(OperatorEnum, {
    name: "OperatorEnum",
    description: "The supported operators by google datastore",
});
(0, type_graphql_1.registerEnumType)(MoreResultsEnum, {
    name: "MoreResultsEnum",
    description: "The list of more results values from google datastore",
});
(0, type_graphql_1.registerEnumType)(DataTypeEnum, {
    name: "DataTypeEnum",
    description: "The list of available datatypes returned from the google datastore",
});
