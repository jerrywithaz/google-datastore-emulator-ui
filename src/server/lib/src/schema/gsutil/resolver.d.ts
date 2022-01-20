import { DatastoreBackup } from "./types";
declare class GsUtilResolver {
    getProjectId(): Promise<string>;
    getBackups(): Promise<DatastoreBackup[]>;
    startBackup(): Promise<string>;
    downloadBackup(name: string): Promise<string>;
    importBackup(name: string): Promise<string>;
}
export default GsUtilResolver;
