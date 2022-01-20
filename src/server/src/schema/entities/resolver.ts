import { Key } from "@google-cloud/datastore";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import ValidateEmulatorRunning from "../../decorators/ValidateEmulatorRunning";
import { Context } from "../../types";
import isNullOrUndefined from "../../utils/isNullOrUndefined";
import normalizeAndSortColumns from "../../utils/normalizeAndSortColumns";
import { DataTypeEnum, OperatorEnum } from "./enums";
import { DataTypeMap, datatypes, operators, PathArrayType } from "./scalars";
import {
  EntitiesResult,
  Entity,
  GetEntitiesInput,
  RunQueryInfo,
  UpdateEntityInput,
} from "./types";

@Resolver()
class EntitiesResolver {
  @Query(() => [DataTypeEnum])
  async getDataTypes(): Promise<DataTypeEnum[]> {
    return datatypes;
  }

  @Query(() => [OperatorEnum])
  async getOperators(): Promise<OperatorEnum[]> {
    return operators;
  }

  @Query(() => EntitiesResult)
  @ValidateEmulatorRunning()
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

        if (value !== undefined) {
          query = query.filter(property, operator.toString(), value.serialize());
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
      const key = e[datastore.KEY] as Key;
      const id = key.id || key.name || e.id;

      return {
        entity: {
          id,
          ...e,
        },
        key: id,
        path: new PathArrayType(...key.serialized.path)
      };
    });

    const typesMap = new DataTypeMap();

    const columns: string[] = [];

    entities.forEach((entity) => {
      Object.keys(entity.entity).forEach((key) => {
        const value = entity.entity[key];

        if (!typesMap.has(key)) {
          columns.push(key);
        }

        typesMap.set(key, value);
      });
    });

    normalizeAndSortColumns(columns);

    const info = results[1] as RunQueryInfo;

    return { entities, info, typesMap, columns, availableTypes: datatypes };
  }

  @Mutation(() => Entity)
  @ValidateEmulatorRunning()
  async updateEntity(
    @Arg("input", { nullable: false }) { path, updates }: UpdateEntityInput,
    @Ctx() { datastore }: Context
  ): Promise<Entity> {
    const transaction = datastore.transaction();
    const key = datastore.key(path);

    await transaction.run();

    const [entity] = await transaction.get(key);

    const updatedEntity = {
      ...entity,
      ...updates,
    };

    const id = key.id || key.name || updatedEntity.id;

    transaction.save({
      key: key,
      data: updatedEntity,
    });

    await transaction.commit();

    const [finalEntity] = await datastore.get(key);

    return {
      entity: finalEntity,
      key: id,
      path: path
    };
  }
}

export default EntitiesResolver;
