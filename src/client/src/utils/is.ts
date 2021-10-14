import isValid from 'date-fns/isValid';

export function isObject<O extends Record<string, unknown>>(value: unknown): value is O {
    return typeof value === 'object' && value !== null;
}

export function isArray<T extends any>(value: unknown): value is Array<T> {
    return Array.isArray(value);
}

export function isJsonParseable(value: unknown) {
    try {
        if (typeof value === 'string') {
            const result = JSON.parse(value);

            if (isObject(result) || isArray(result)) {
                return true;
            }
        }
        return false;
    } catch (error) {
        return false;
    }
}

export function isDate(value: any): value is string | number | Date {
    return isValid(new Date(value));
}