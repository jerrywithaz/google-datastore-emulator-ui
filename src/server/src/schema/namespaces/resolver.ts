import { Ctx, Query, Resolver } from "type-graphql";
import ValidateEmulatorRunning from "../../decorators/ValidateEmulatorRunning";
import { Context } from "../../types";
import isNullOrUndefined from "../../utils/isNullOrUndefined";

@Resolver()
class NamespaceResolver {
  @Query(() => [String])
  @ValidateEmulatorRunning()
  async getNamespaces(@Ctx() { datastore }: Context): Promise<string[]> {
    const query = datastore.createQuery("__namespace__").select("__key__");
    const results = await datastore.runQuery(query);
    const namespaces = results[0]
      .map((e) => e[datastore.KEY].name)
      .filter(isNullOrUndefined);

    return namespaces;
  }
}

export default NamespaceResolver;
