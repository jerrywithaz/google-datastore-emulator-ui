"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTypeMapScalar = exports.PathArrayScalar = exports.FilterScalar = exports.OperatorScalar = exports.DataTypeMap = exports.PathArrayType = exports.DataTypeType = exports.OperatorType = exports.FilterType = exports.datatypes = exports.operators = void 0;
const graphql_1 = require("graphql");
const entity_1 = require("@google-cloud/datastore/build/src/entity");
const isNullOrUndefined_1 = __importDefault(require("../../utils/isNullOrUndefined"));
const enums_1 = require("./enums");
exports.operators = ["=", "<", ">", "<=", ">=", "HAS_ANCESTOR"];
const operatorsMap = exports.operators.reduce((map, operator) => {
    return {
        ...map,
        [operator]: operator
    };
}, {});
function isOperator(value) {
    if (typeof value === 'string' && operatorsMap[value])
        return true;
    return false;
}
exports.datatypes = ["string", "number", "boolean", "undefined", "object", "date", "null", "array", "buffer"];
class FilterType extends String {
    constructor(value) {
        super(value);
        this.type = typeof value;
    }
    toString() {
        return super.toString();
    }
    serialize() {
        return this.type === 'string' ? this.toString() : Number(this.toString());
    }
    toJSON() {
        return this.toString();
    }
}
exports.FilterType = FilterType;
class OperatorType extends String {
    toString() {
        return super.toString();
    }
    toJSON() {
        return this.toString();
    }
}
exports.OperatorType = OperatorType;
class DataTypeType extends String {
    toString() {
        return super.toString();
    }
    toJSON() {
        return this.toString();
    }
}
exports.DataTypeType = DataTypeType;
class PathArrayType extends Array {
    serialize() {
        return super.map((item) => typeof item === 'string' ? item : parseInt(item.toString()));
    }
}
exports.PathArrayType = PathArrayType;
class DataTypeMap {
    constructor(value) {
        this.values = value ? this.convertValue(value) : {};
    }
    convertValue(value) {
        if (Array.isArray(value)) {
            return value.reduce((map, node) => {
                const name = node.name.value;
                const value = node.value.kind === 'StringValue' ? node.value.value : undefined;
                if (value) {
                    return {
                        ...map,
                        [name]: value
                    };
                }
                return map;
            }, {});
        }
        return this.values;
    }
    getDataType(value) {
        if (value instanceof Date)
            return enums_1.DataTypeEnum.date;
        else if (typeof value === "boolean")
            return enums_1.DataTypeEnum.boolean;
        else if (typeof value === "number")
            return enums_1.DataTypeEnum.number;
        else if (typeof value === "string")
            return enums_1.DataTypeEnum.string;
        else if (Array.isArray(value))
            return enums_1.DataTypeEnum.array;
        else if (value instanceof Buffer)
            return enums_1.DataTypeEnum.buffer;
        else if (value === null)
            return enums_1.DataTypeEnum.nullish;
        else if (value === undefined)
            return enums_1.DataTypeEnum.undefined;
        else
            return enums_1.DataTypeEnum.object;
    }
    has(key) {
        return key in this.values;
    }
    set(key, value) {
        this.values[key] = this.getDataType(value);
    }
    get(key) {
        return this.values[key];
    }
    serialize() {
        return this.values;
    }
}
exports.DataTypeMap = DataTypeMap;
exports.OperatorScalar = new graphql_1.GraphQLScalarType({
    name: "OperatorScalar",
    description: "Google datastore operator value scalar type",
    serialize(value) {
        if (!(value instanceof OperatorType)) {
            throw new Error("OperatorScalar can only serialize OperatorType values");
        }
        return value.toString();
    },
    parseValue(value) {
        if (typeof value === "string" && isOperator(value)) {
            return new OperatorType(value); // value sent to the client
        }
        else {
            throw new Error(`OperatorScalar must be one of ${exports.operators.join(",")}`);
        }
    },
    parseLiteral(ast) {
        if (ast.kind === graphql_1.Kind.STRING && isOperator(ast.value)) {
            return new OperatorType(ast.value);
        }
        else {
            throw new Error(`OperatorScalar must be one of ${exports.operators.join(",")}`);
        }
    },
});
exports.FilterScalar = new graphql_1.GraphQLScalarType({
    name: "FilterScalar",
    description: "Google datastore query filter scalar type",
    serialize(value) {
        if (!(value instanceof FilterType)) {
            throw new Error("FilterScalar can only serialize FilterType values");
        }
        return value.serialize();
    },
    parseValue(value) {
        if (typeof value === "string" || typeof value === "number") {
            return new FilterType(value); // value sent to the client
        }
        else {
            throw new Error("FilterScalar must be a string or a number");
        }
    },
    parseLiteral(ast) {
        if (ast.kind === graphql_1.Kind.INT || ast.kind === graphql_1.Kind.STRING) {
            return new FilterType(ast.value);
        }
        else {
            throw new Error("FilterScalar can only parse a string or a number");
        }
    },
});
exports.PathArrayScalar = new graphql_1.GraphQLScalarType({
    name: "PathArrayScalar",
    description: "Google datastore key path scalar type",
    serialize(value) {
        if (!(value instanceof PathArrayType)) {
            throw new Error("PathArrayScalar can only serialize FilterType values");
        }
        return value.serialize();
    },
    parseValue(value) {
        if (Array.isArray(value)) {
            return new PathArrayType(...value); // value sent to the client
        }
        else {
            throw new Error("PathArrayScalar must be a string or a number");
        }
    },
    parseLiteral(ast) {
        if (ast.kind === graphql_1.Kind.LIST) {
            const values = ast.values.map((value) => {
                if (value.kind === 'StringValue') {
                    return value.value;
                }
                if (value.kind === 'IntValue') {
                    return new entity_1.entity.Int(value.value);
                }
                return null;
            }).filter(isNullOrUndefined_1.default);
            return new PathArrayType(...values);
        }
        else {
            throw new Error("PathArrayScalar can only parse a string or a number");
        }
    },
});
exports.DataTypeMapScalar = new graphql_1.GraphQLScalarType({
    name: "DataTypeMapScalar",
    description: "Google datastore data type scalar type",
    serialize(value) {
        if (!(value instanceof DataTypeMap)) {
            throw new Error("DataTypeMapScalar can only serialize DataTypeType values");
        }
        return value.serialize();
    },
    parseValue(value) {
        if (typeof value === "object" && value !== null) {
            return new DataTypeMap(value); // value sent to the client
        }
        else {
            throw new Error(`DataTypeMapScalar must be an object`);
        }
    },
    parseLiteral(ast) {
        if (ast.kind === graphql_1.Kind.OBJECT) {
            return new DataTypeMap(ast.fields);
        }
        else {
            throw new Error(`DataTypeMapScalar must be an object`);
        }
    },
});
