import { Operator } from "@google-cloud/datastore/build/src/query";
import { GraphQLScalarType } from "graphql";
export declare class FilterType extends String {
    private type;
    constructor(value: string | number);
    toString(): string;
    getValue(): string | number;
    toJSON(): string;
}
export declare class OperatorType extends String {
    toString(): Operator;
    toJSON(): Operator;
}
export declare const OperatorScalar: GraphQLScalarType;
export declare const FilterScalar: GraphQLScalarType;
