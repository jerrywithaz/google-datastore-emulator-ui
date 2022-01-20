export declare type Env = {
    DATASTORE_EMULATOR_HOST: string;
    DATASTORE_BACKUP_BUCKET: string;
    DATASTORE_BACKUP_DIR: string;
    PROJECT_ID: string;
    DATASTORE_EMULATOR_PORT: number;
    DATASTORE_PROJECT_URL: string;
};
declare function getEnv(): Env;
export default getEnv;
