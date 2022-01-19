function isNullOrUndefined<I extends any = any>(item: I): item is Exclude<I , null | undefined>{
    if (item === undefined || item === null) {
        return false;
    }
    return true;
}

export default isNullOrUndefined;