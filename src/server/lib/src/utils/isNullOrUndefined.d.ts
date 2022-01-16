declare function isNullOrUndefined<I extends any = any>(item: I): item is Exclude<I, null | undefined>;
export default isNullOrUndefined;
