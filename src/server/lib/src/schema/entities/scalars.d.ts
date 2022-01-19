import { GraphQLScalarType, ObjectFieldNode } from "graphql";
import { entity } from "@google-cloud/datastore/build/src/entity";
import { DataTypeEnum, OperatorEnum } from "./enums";
export declare type DataType = "string" | "number" | "boolean" | "undefined" | "object" | "date" | "null" | "array" | "buffer";
export declare const operators: OperatorEnum[];
export declare const datatypes: DataTypeEnum[];
export declare class FilterType extends String {
    private type;
    constructor(value: string | number);
    toString(): string;
    serialize(): string | number;
    toJSON(): string;
}
export declare class OperatorType extends String {
    toString(): OperatorEnum;
    toJSON(): OperatorEnum;
}
export declare class DataTypeType extends String {
    toString(): DataType;
    toJSON(): DataType;
}
export declare class PathArrayType extends Array<string | entity.Int> {
    serialize(): (string | number)[];
}
export declare class DataTypeMap {
    private values;
    constructor(value?: Record<string, any> | ObjectFieldNode[]);
    private convertValue;
    private getDataType;
    has(key: string): boolean;
    set(key: string, value: any): void;
    get(key: string): DataTypeEnum | undefined;
    serialize(): Record<string, DataTypeEnum>;
}
export declare const OperatorScalar: GraphQLScalarType;
export declare const FilterScalar: GraphQLScalarType;
export declare const PathArrayScalar: GraphQLScalarType;
export declare const DataTypeMapScalar: GraphQLScalarType;
