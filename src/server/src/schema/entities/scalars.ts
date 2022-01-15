import { Operator } from "@google-cloud/datastore/build/src/query";
import { GraphQLScalarType, Kind } from "graphql";

const operators = ["=", "<", ">", "<=", ">=", "HAS_ANCESTOR"] as Operator[];
const operatorsMap = operators.reduce((map, operator) => {
    return {
        ...map,
        [operator]: operator
    }
}, {} as Record<string, Operator>);

function isOperator(value: any): value is Operator {
  if (typeof value === 'string' && operatorsMap[value]) return true;
  return false;
}

export const FilterScalar = new GraphQLScalarType({
  name: "ObjectId",
  description: "Google datastore filter scalar type",
  serialize(value: unknown): [string, string, string] {
    if (!Array.isArray(value)) {
      throw new Error("FilterScalar must be an array");
    }

    return value as any; // value sent to the client
  },
  parseValue(value: unknown): [string, string, string] {
    // check the type of received value
    if (!Array.isArray(value)) {
      throw new Error("FilterScalar must be an array");
    }
    if (value.length === 3) {
      throw new Error("FilterScalar must have 3 values in the array");
    }

    console.log(value);

    return value as any; // value from the client input variables
  },
  parseLiteral(ast): [string, string, string] {
    // check the type of received value
    if (ast.kind !== Kind.LIST) {
      throw new Error("FilterScalar can only parse list values");
    }
    return ast.values as any; // value from the client query
  },
});

export const OperatorValue = new GraphQLScalarType({
  name: "OperatorValue",
  description: "Google datastore filter value scalar type",
  serialize(value: unknown): Operator {
    if (typeof value === "string" && isOperator(value)) {
      return value; // value sent to the client
    } else {
      throw new Error("OperatorValue must be a string or a number");
    }
  },
  parseValue(value: unknown): Operator {
    if (typeof value === "string" && isOperator(value)) {
      return value; // value sent to the client
    } else {
      throw new Error("OperatorValue must be a string or a number");
    }
  },
  parseLiteral(ast): Operator {
    if (ast.kind === Kind.STRING && isOperator(ast.value)) {
      return ast.value;
    } else {
      throw new Error("OperatorValue can only parse a string or a number");
    }
  },
});

export const FilterValue = new GraphQLScalarType({
  name: "FilterValue",
  description: "Google datastore filter value scalar type",
  serialize(value: unknown): string | number {
    if (typeof value === "string" || typeof value === "number") {
      return value; // value sent to the client
    } else {
      throw new Error("FilterScalar must be a string or a number");
    }
  },
  parseValue(value: unknown): string | number {
    if (typeof value === "string" || typeof value === "number") {
      return value; // value sent to the client
    } else {
      throw new Error("FilterScalar must be a string or a number");
    }
  },
  parseLiteral(ast): string | number {
    if (ast.kind === Kind.INT || ast.kind === Kind.STRING) {
      return ast.value;
    } else {
      throw new Error("FilterScalar can only parse a string or a number");
    }
  },
});
