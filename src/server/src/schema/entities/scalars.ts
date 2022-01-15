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

export class FilterType extends String {
  private type: 'string' | 'number';

  constructor(value: string | number) {
    super(value);
    this.type = typeof value as 'string' | 'number';
  }

  public toString(): string {
    return super.toString()
  }

  public getValue(): string | number {
    return this.type === 'string' ? this.toString() : Number(this.toString())
  }

  public toJSON(): string {
    return this.toString();
  }
}

export class OperatorType extends String {
  override toString(): Operator {
    return super.toString() as Operator;
  }

  toJSON(): Operator {
    return this.toString();
  }
}

export const OperatorScalar = new GraphQLScalarType({
  name: "OperatorScalar",
  description: "Google datastore operator value scalar type",
  serialize(value: unknown): Operator {
    if (!(value instanceof OperatorType)) {
      throw new Error("OperatorScalar can only serialize OperatorType values");
    }
    return value.toString();
  },
  parseValue(value: unknown): OperatorType {
    if (typeof value === "string" && isOperator(value)) {
      return new OperatorType(value); // value sent to the client
    } else {
      throw new Error(`OperatorScalar must be one of ${operators.join(",")}`);
    }
  },
  parseLiteral(ast): OperatorType {
    if (ast.kind === Kind.STRING && isOperator(ast.value)) {
      return new OperatorType(ast.value);
    } else {
      throw new Error(`OperatorScalar must be one of ${operators.join(",")}`);
    }
  },
});

export const FilterScalar = new GraphQLScalarType({
  name: "FilterScalar",
  description: "Google datastore query filter scalar type",
  serialize(value: unknown): string | number {
    if (!(value instanceof FilterType)) {
      throw new Error("FilterScalar can only serialize FilterType values");
    }
    return value.getValue();
  },
  parseValue(value: unknown): FilterType {
    if (typeof value === "string" || typeof value === "number") {
      return new FilterType(value); // value sent to the client
    } else {
      throw new Error("FilterScalar must be a string or a number");
    }
  },
  parseLiteral(ast): FilterType {
    if (ast.kind === Kind.INT || ast.kind === Kind.STRING) {
      return new FilterType(ast.value);
    } else {
      throw new Error("FilterScalar can only parse a string or a number");
    }
  },
});
