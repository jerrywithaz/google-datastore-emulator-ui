import { OperatorType, FilterType } from "./scalars";
export declare enum OperatorEnum {
    "=" = "=",
    "<" = "<",
    ">" = ">",
    "<=" = "<=",
    ">=" = ">=",
    "HAS_ANCESTOR" = "HAS_ANCESTOR"
}
export declare enum MoreResultsEnum {
    "MORE_RESULTS_TYPE_UNSPECIFIED" = "MORE_RESULTS_TYPE_UNSPECIFIED",
    "NOT_FINISHED" = "NOT_FINISHED",
    "MORE_RESULTS_AFTER_LIMIT" = "MORE_RESULTS_AFTER_LIMIT",
    "MORE_RESULTS_AFTER_CURSOR" = "MORE_RESULTS_AFTER_CURSOR",
    "NO_MORE_RESULTS" = "NO_MORE_RESULTS"
}
export declare class RunQueryInfo {
    endCursor?: string;
    moreResults?: MoreResultsEnum;
}
export declare class Entity {
    readonly entity: Record<string, any>;
    readonly id: string;
}
export declare class EntitiesResult {
    entities: Entity[];
    readonly typesMap: Record<string, any>;
    columns: string[];
    info: RunQueryInfo;
}
export declare class FilterModel {
    property: string;
    operator: OperatorType;
    readonly value: FilterType;
}
export declare class SortModel {
    field: string;
    sort: string;
}
export declare class GetEntitiesInput {
    kind: string;
    page: number;
    pageSize: number;
    filters: FilterModel[];
    sortModel: SortModel[];
}
export declare class UpdateEntityInput {
    path: string[];
    readonly updates: Record<string, any>;
}
