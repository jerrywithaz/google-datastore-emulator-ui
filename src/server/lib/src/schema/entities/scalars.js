"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterScalar = exports.OperatorScalar = exports.OperatorType = exports.FilterType = void 0;
const graphql_1 = require("graphql");
const operators = ["=", "<", ">", "<=", ">=", "HAS_ANCESTOR"];
const operatorsMap = operators.reduce((map, operator) => {
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
class FilterType extends String {
    constructor(value) {
        super(value);
        this.type = typeof value;
    }
    toString() {
        return super.toString();
    }
    getValue() {
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
            throw new Error(`OperatorScalar must be one of ${operators.join(",")}`);
        }
    },
    parseLiteral(ast) {
        if (ast.kind === graphql_1.Kind.STRING && isOperator(ast.value)) {
            return new OperatorType(ast.value);
        }
        else {
            throw new Error(`OperatorScalar must be one of ${operators.join(",")}`);
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
        return value.getValue();
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
