import { Ctx, Query, Resolver } from "type-graphql";
import ValidateEmulatorRunning from "../../decorators/ValidateEmulatorRunning";
import { Context } from "../../types";
import isNullOrUndefined from "../../utils/isNullOrUndefined";

@Resolver()
class KindsResolver {
  @Query(() => [String])
  @ValidateEmulatorRunning()
  async getKinds(@Ctx() { datastore }: Context): Promise<string[]> {
    const query = datastore.createQuery("__kind__").select("__key__");
    const [results] = await datastore.runQuery(query);
    const kinds = results
      .map((e) => e[datastore.KEY].name)
      .filter(isNullOrUndefined);

    return kinds;
  }
}

export default KindsResolver;
