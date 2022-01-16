import { Context } from "../../types";
declare class NamespaceResolver {
    getNamespaces({ datastore }: Context): Promise<string[]>;
}
export default NamespaceResolver;
