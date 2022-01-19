declare namespace NodeJS {
    export interface ProcessEnv {
        PROJECT_ID: string;
        DATASTORE_EMULATOR_HOST: string;
        DATASTORE_BACKUP_BUCKET: string;
        DATASTORE_BACKUP_DIR: string;
    }
  }