import { GraphQLScalarType, Kind, ObjectFieldNode } from "graphql";
import { entity } from "@google-cloud/datastore/build/src/entity";
import isNullOrUndefined from "../../utils/isNullOrUndefined";
import { DataTypeEnum, OperatorEnum } from "./enums";

export type DataType = "string" | "number" | "boolean" | "undefined" | "object" | "date" | "null" | "array" | "buffer";

export const operators = ["=", "<", ">", "<=", ">=", "HAS_ANCESTOR"] as OperatorEnum[];

const operatorsMap = operators.reduce((map, operator) => {
    return {
        ...map,
        [operator]: operator
    }
}, {} as Record<string, OperatorEnum>);
function isOperator(value: any): value is OperatorEnum {
  if (typeof value === 'string' && operatorsMap[value]) return true;
  return false;
}


export const datatypes = ["string" , "number" , "boolean" , "undefined" , "object" , "date" , "null" , "array" , "buffer"] as DataTypeEnum[];

export class FilterType extends String {
  private type: 'string' | 'number';

  constructor(value: string | number) {
    super(value);
    this.type = typeof value as 'string' | 'number';
  }

  public toString(): string {
    return super.toString()
  }

  public serialize(): string | number {
    return this.type === 'string' ? this.toString() : Number(this.toString())
  }

  public toJSON(): string {
    return this.toString();
  }
}

export class OperatorType extends String {
  override toString(): OperatorEnum {
    return super.toString() as OperatorEnum;
  }

  toJSON(): OperatorEnum {
    return this.toString();
  }
}

export class DataTypeType extends String {
  override toString(): DataType {
    return super.toString() as DataType;
  }

  toJSON(): DataType {
    return this.toString();
  }
}

export class PathArrayType extends Array<string | entity.Int> {
  public serialize() {
    return super.map((item) => typeof item === 'string' ? item : parseInt(item.toString()));
  }
}

export class DataTypeMap {
  private values: Record<string, DataTypeEnum>
  constructor(value?: Record<string, any> | ObjectFieldNode[]) {
    this.values = value ? this.convertValue(value) : {};
  }

  private convertValue(value: Record<string, any> | ObjectFieldNode[]): Record<string, DataTypeEnum> {
    if (Array.isArray(value)) {
      return value.reduce((map, node) => {
        const name = node.name.value;
        const value = node.value.kind === 'StringValue' ? node.value.value as DataTypeEnum : undefined;
        if (value) {
          return {
            ...map,
            [name]: value
          };
        }
        return map;
      }, {} as Record<string, DataTypeEnum>)
    }
    return this.values;
  }

  private getDataType(value: Date | boolean | Buffer | number | string | Array<any> | Record<string, any> | entity.GeoPoint): DataTypeEnum {
    if (value instanceof Date) return DataTypeEnum.date;

    else if (typeof value === "boolean") return DataTypeEnum.boolean;
  
    else if (typeof value === "number") return DataTypeEnum.number;

    else if (typeof value === "string") return DataTypeEnum.string;
  
    else if (Array.isArray(value)) return DataTypeEnum.array;
  
    else if (value instanceof Buffer) return DataTypeEnum.buffer;
  
    else if (value === null) return DataTypeEnum.nullish;

    else if (value === undefined) return DataTypeEnum.undefined;

    else return DataTypeEnum.object;
  }

  public has(key: string) {
    return key in this.values;
  }

  public set(key: string, value: any): void {
    
    this.values[key] = this.getDataType(value);
  }

  public get(key: string): DataTypeEnum | undefined {
    return this.values[key];
  }

  public serialize() {
    return this.values;
  }
}

export const OperatorScalar = new GraphQLScalarType({
  name: "OperatorScalar",
  description: "Google datastore operator value scalar type",
  serialize(value: unknown): OperatorEnum {
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
    return value.serialize();
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

export const PathArrayScalar = new GraphQLScalarType({
  name: "PathArrayScalar",
  description: "Google datastore key path scalar type",
  serialize(value: unknown): (string | number)[] {
    if (!(value instanceof PathArrayType)) {
      throw new Error("PathArrayScalar can only serialize FilterType values");
    }
    return value.serialize();
  },
  parseValue(value: unknown): PathArrayType {
    if (Array.isArray(value)) {
      return new PathArrayType(...value); // value sent to the client
    } else {
      throw new Error("PathArrayScalar must be a string or a number");
    }
  },
  parseLiteral(ast): PathArrayType {
    if (ast.kind === Kind.LIST) {
      const values = ast.values.map((value) => {
        if (value.kind === 'StringValue') {
          return value.value;
        }
        if (value.kind === 'IntValue') {
          return new entity.Int(value.value);
        }
        return null;
      }).filter(isNullOrUndefined);

      return new PathArrayType(...values);
    } else {
      throw new Error("PathArrayScalar can only parse a string or a number");
    }
  },
});

export const DataTypeMapScalar = new GraphQLScalarType({
  name: "DataTypeMapScalar",
  description: "Google datastore data type scalar type",
  serialize(value: unknown): Record<string, DataTypeEnum> {
    if (!(value instanceof DataTypeMap)) {
      throw new Error("DataTypeMapScalar can only serialize DataTypeType values");
    }
    return value.serialize();
  },
  parseValue(value: unknown): DataTypeMap {
    if (typeof value === "object" && value !== null) {
      return new DataTypeMap(value); // value sent to the client
    } else {
      throw new Error(`DataTypeMapScalar must be an object`);
    }
  },
  parseLiteral(ast): DataTypeMap {
    if (ast.kind === Kind.OBJECT) {
      return new DataTypeMap(ast.fields);
    } else {
      throw new Error(`DataTypeMapScalar must be an object`);
    }
  },
});