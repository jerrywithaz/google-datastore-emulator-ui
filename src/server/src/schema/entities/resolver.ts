import { Datastore } from "@google-cloud/datastore";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "../../types";
import isNullOrUndefined from "../../utils/isNullOrUndefined";
import {
  EntitiesResult,
  Entity,
  GetEntitiesInput,
  RunQueryInfo,
  UpdateEntityInput,
} from "./types";

function getType(datastore: Datastore, value: any, key: string) {

  if (key.endsWith('_at') || key.endsWith('At')) return 'date';

  if (value === 'id') return 'string';

  if (typeof value === 'boolean') return 'boolean';

  if (datastore.isDouble(value) || datastore.isInt(value)) return 'number';

  if (Array.isArray(value)) return 'array';

  return typeof value;
}

@Resolver()
class EntitiesResolver {
  @Query(() => EntitiesResult)
  async getEntities(
    @Arg("input", { nullable: false })
    { kind, page, pageSize, filters, sortModel }: GetEntitiesInput,
    @Ctx() { datastore }: Context
  ): Promise<EntitiesResult> {
    let query = datastore
      .createQuery(kind)
      .limit(pageSize)
      .offset(page * pageSize);

    // Build filters
    if (filters?.length && Array.isArray(filters)) {
      for (let i = 0; i < filters.length; i++) {
        const { property, operator, value } = filters[i];

        if (value) {
          query = query.filter(property, operator.toString(), value);
        }
      }
    }

    // Build sort model
    if (sortModel?.length && Array.isArray(sortModel)) {
      for (let i = 0; i < sortModel.length; i++) {
        const { field, sort } = sortModel[i];

        query = query.order(field, {
          descending: sort === "desc",
        });
      }
    }

    const results = await datastore.runQuery(query);

    const entities = results[0].filter(isNullOrUndefined).map((e) => {
      const id = e[datastore.KEY].name || e[datastore.KEY].id || e.id;

      return {
        entity: {
          ...e,
        },
        id,
      };
    });

    const typesMap: Record<string, string> = {};

    entities.forEach((entity) => {
      Object.keys(entity.entity).forEach((key) => {
        if (!typesMap[key] && entity.entity[key]) {
          typesMap[key] = getType(datastore, entity.entity[key], key);
        }
      });
    });

    const info = results[1] as RunQueryInfo;

    return { entities, info, typesMap };
  }

  @Mutation(() => Entity)
  async updateEntity(
    @Arg("input", { nullable: false }) { path, updates }: UpdateEntityInput,
    @Ctx() { datastore }: Context
  ): Promise<Entity> {
    const transaction = datastore.transaction();
    const datastore_key = datastore.key(path);

    await transaction.run();

    const [entity] = await transaction.get(datastore_key);

    const updatedEntity = {
      ...entity,
      ...updates,
    };

    transaction.save({
      key: datastore_key,
      data: updatedEntity,
    });

    await transaction.commit();

    const key =
      updatedEntity[datastore.KEY].name ||
      updatedEntity[datastore.KEY].id ||
      updatedEntity.id;

    return {
      entity: {
        ...updatedEntity,
        id: key,
      },
      id: key,
    };
  }
}

export default EntitiesResolver;
