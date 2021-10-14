import { isJsonParseable } from '../is';

describe('utils/is', () => {
    describe('isJsonParseable', () => {
        it('recognizes string object as json', () => {
            const result = isJsonParseable('{"test": true}');

            expect(result).toBe(true);
        });
        it('recognizes string array as json', () => {
            const result = isJsonParseable('[]');

            expect(result).toBe(true);
        });
        it('returns false for number', () => {
            const result = isJsonParseable('4');

            expect(result).toBe(false);
        });
    });
})