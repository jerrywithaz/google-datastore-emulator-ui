import { DatastoreBackup } from "./types";
import { Context } from "../../types";
declare class GsUtilResolver {
    getProjectId({ env }: Context): Promise<string>;
    getBackups({ env }: Context): Promise<DatastoreBackup[]>;
    startBackup({ env }: Context): Promise<string>;
    downloadBackup(name: string, { env }: Context): Promise<string>;
    importBackup(name: string, { env }: Context): Promise<string>;
}
export default GsUtilResolver;
