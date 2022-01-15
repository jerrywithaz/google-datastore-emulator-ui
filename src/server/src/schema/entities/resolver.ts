import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { Context } from "../../types";
import isNullOrUndefined from "../../utils/isNullOrUndefined";
import { EntitiesResult, GetEntitiesInput, RunQueryInfo } from "./types";

@Resolver()
class EntitiesResolver {
  @Query(() => EntitiesResult)
  async getEntities(
    @Arg("input", { nullable: false }) { kind, page, pageSize, filters, sortModel }: GetEntitiesInput,
    @Ctx() { datastore }: Context
  ): Promise<EntitiesResult> {
    let query = datastore
      .createQuery(kind)
      .limit(pageSize)
      .offset(page * pageSize);

      // Build filters
      if (filters?.length && Array.isArray(filters)) {
        for (let i = 0; i < filters.length; i++) {
          const { property, operator, value } = filters[i]

          if (value) {
            query = query.filter(property, operator.toString(), value)
          }
        }
      }

      // Build sort model
      if (sortModel?.length && Array.isArray(sortModel)) {
        for (let i = 0; i < sortModel.length; i++) {
          const {field, sort} = sortModel[i];

          query = query.order(field, {
            descending: sort === 'desc',
          });
        }
      }

    const results = await datastore.runQuery(query);

    const entities = results[0]
      .filter(isNullOrUndefined)
      .map((e) => {
        const key = e[datastore.KEY].name || e[datastore.KEY].id;

        return {
          entity: {
            ...e,
            id: key,
          },
          key: key,
        }
      });

    const info = results[1] as RunQueryInfo;

    return { entities, info };
  }
}

export default EntitiesResolver;
