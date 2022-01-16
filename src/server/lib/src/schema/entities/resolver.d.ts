import { Context } from "../../types";
import { DataTypeEnum, OperatorEnum } from "./enums";
import { EntitiesResult, Entity, GetEntitiesInput, UpdateEntityInput } from "./types";
declare class EntitiesResolver {
    getDataTypes(): Promise<DataTypeEnum[]>;
    getOperators(): Promise<OperatorEnum[]>;
    getEntities({ kind, page, pageSize, filters, sortModel }: GetEntitiesInput, { datastore }: Context): Promise<EntitiesResult>;
    updateEntity({ path, updates }: UpdateEntityInput, { datastore }: Context): Promise<Entity>;
}
export default EntitiesResolver;
