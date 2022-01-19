import { OperatorType, FilterType, PathArrayType, DataTypeMap } from "./scalars";
import { DataTypeEnum, MoreResultsEnum } from "./enums";
export declare class RunQueryInfo {
    endCursor?: string;
    moreResults?: MoreResultsEnum;
}
export declare class Entity {
    readonly entity: Record<string, any>;
    readonly key: string;
    readonly path: PathArrayType;
}
export declare class EntitiesResult {
    entities: Entity[];
    readonly typesMap: DataTypeMap;
    columns: string[];
    info: RunQueryInfo;
    availableTypes: DataTypeEnum[];
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
    readonly path: PathArrayType;
    readonly updates: Record<string, any>;
}
