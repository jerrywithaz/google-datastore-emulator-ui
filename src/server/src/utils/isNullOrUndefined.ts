function isNullOrUndefined<I extends any = any>(item: I): item is I {
    if (item === undefined || item === null) {
        return false;
    }
    return true;
}

export default isNullOrUndefined;