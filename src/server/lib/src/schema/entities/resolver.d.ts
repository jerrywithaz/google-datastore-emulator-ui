import { Context } from "../../types";
import { EntitiesResult, Entity, GetEntitiesInput, UpdateEntityInput } from "./types";
declare class EntitiesResolver {
    getEntities({ kind, page, pageSize, filters, sortModel }: GetEntitiesInput, { datastore }: Context): Promise<EntitiesResult>;
    updateEntity({ path, updates }: UpdateEntityInput, { datastore }: Context): Promise<Entity>;
}
export default EntitiesResolver;
