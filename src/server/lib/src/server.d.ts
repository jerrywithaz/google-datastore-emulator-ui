declare type BoostrapOptions = {
    projectId: string;
    emulatorHost: string;
    backupBucket: string;
    backupDir: string;
    port: number;
};
declare function boostrap({ projectId, emulatorHost, port, backupBucket, backupDir }: BoostrapOptions): Promise<void>;
export default boostrap;
