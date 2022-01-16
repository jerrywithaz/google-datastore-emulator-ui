import { registerEnumType } from "type-graphql";

export enum OperatorEnum {
    "equals" = "=",
    "less_than" = "<",
    "greater_than" = ">",
    "less_than_or_equal" = "<=",
    "greater_than_or_equal" = ">=",
    "has_ancestor" = "HAS_ANCESTOR",
}

export enum MoreResultsEnum {
    "MORE_RESULTS_TYPE_UNSPECIFIED" = "MORE_RESULTS_TYPE_UNSPECIFIED",
    "NOT_FINISHED" = "NOT_FINISHED",
    "MORE_RESULTS_AFTER_LIMIT" = "MORE_RESULTS_AFTER_LIMIT",
    "MORE_RESULTS_AFTER_CURSOR" = "MORE_RESULTS_AFTER_CURSOR",
    "NO_MORE_RESULTS" = "NO_MORE_RESULTS",
}

export enum DataTypeEnum {
    "string" = "string",
    "number" = "number",
    "boolean" = "boolean",
    "undefined" = "undefined",
    "object" = "object",
    "date" = "date",
    "nullish" = "nullish",
    "array" = "array",
    "buffer" = "buffer",
}

registerEnumType(OperatorEnum, {
    name: "OperatorEnum", 
    description: "The supported operators by google datastore", 
});

registerEnumType(MoreResultsEnum, {
    name: "MoreResultsEnum", 
    description: "The list of more results values from google datastore", 
});

registerEnumType(DataTypeEnum, {
    name: "DataTypeEnum", 
    description: "The list of available datatypes returned from the google datastore", 
});