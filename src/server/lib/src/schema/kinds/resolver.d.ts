import { Context } from "../../types";
declare class KindsResolver {
    getKinds({ datastore }: Context): Promise<string[]>;
}
export default KindsResolver;
