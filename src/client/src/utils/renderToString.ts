import format from 'date-fns/format';
import isValid from 'date-fns/isValid';

function isValidDate(value: any): value is string | number | Date {
    return isValid(Date.parse(value));
}

function renderJSON(value: unknown) {
    try {
        if (typeof value === 'string') {
            const result = JSON.parse(value);

            if (typeof result === 'object' || Array.isArray(result)) {
                return value;
            }
        }
        throw new Error('Not a string');
    } catch (error) {
        throw error;
    }
}

function renderDate(value: unknown) {
    try {
        if (isValidDate(value)) {
            return format(new Date(value), 'PPpp')
        }
        throw new Error('Not a string');
    } catch (error) {
        throw error;
    }
}

function renderToString(value: unknown): string {
    try {
        return renderJSON(value);
    } catch (error) {
        try {
            return renderDate(value)
        }
        catch {
            return String(value);
        }
    }
}

export default renderToString;
