declare type BoostrapOptions = {
    projectId: string;
    emulatorHost: string;
    port: number;
};
declare function boostrap({ projectId, emulatorHost, port }: BoostrapOptions): Promise<void>;
export default boostrap;
