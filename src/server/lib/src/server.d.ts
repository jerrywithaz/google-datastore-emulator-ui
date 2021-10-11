declare type BoostrapOptions = {
    projectId: string;
    emulatorHost: string;
};
declare function boostrap({ projectId, emulatorHost }: BoostrapOptions): void;
export default boostrap;
