import '@testing-library/jest-dom/extend-expect';
import sv from '../i18n/messages.se';
import en from '../i18n/messages.en';

/**
 * Collects all key names from the provided object.
 * @param object        The object to traverse
 * @param keysToIgnore  Array containing key names whose objects should not be examined
 * @returns {[]}        Array of collected data (key names)
 */
const collectKeys = (object, keysToIgnore = []) => {
    return collectStuff(object, doCollectKeys, keysToIgnore);
};

/**
 * Collects all values of type string from the provided object.
 * @param object        The object to traverse
 * @param keysToIgnore  Array containing key names whose objects should not be examined
 * @returns {[]}        Array of collected data (string values)
 */
const collectStringValues = (object, keysToIgnore = []) => {
    return collectStuff(object, doCollectStringValues, keysToIgnore);
};

/**
 * Generic function used to traverse the object structure in search of data.
 * @param object        The object to traverse
 * @param doStuff       The function to call (which does the actual data extraction)
 * @param keysToIgnore  Array containing key names whose objects should not be examined
 * @returns {[]}        Array of collected data (usually strings)
 */
const collectStuff = (object, doStuff, keysToIgnore = []) => {
    const data = [];
    if ('object' === typeof object && !Array.isArray(object)) {
        for (const [key, val] of Object.entries(object)) {
            if (!keysToIgnore.find(v => v === key)) {
                doStuff(data, key, val);
            }
        }
    }
    return data;
};

/**
 * Perform the data extraction - in this case: get the key names
 * @param data  Array of keys found so far
 * @param key   Key name used for the current object
 * @param val   Current object to traverse in search of more keys
 */
function doCollectKeys(data, key, val) {
    data.push(key);
    if (Array.isArray(val)) return;
    if ('object' === typeof val) {
        data.push(...collectKeys(val));
    }
}

/**
 * Perform the data extraction - in this case: get all values of type string
 * @param data  Array of keys found so far
 * @param _     Key, which is not used in this particular function
 * @param val   Current object to traverse in search of more keys
 */
function doCollectStringValues(data, _, val) {
    if (Array.isArray(val)) return;
    if ('string' === typeof val) {
        data.push(val);
    } else if ('object' === typeof val) {
        data.push(...collectStringValues(val));
    }
}

describe('Message keys', () => {

    const keysToIgnore = ['courseImage']; // courseImage has keys which vary with language, i.e. will always differ

    test('The same keys are present in both Swedish and English', () => {
        const svKeys = collectKeys(sv, keysToIgnore).sort();
        const enKeys = collectKeys(en, keysToIgnore).sort();
        expect(svKeys).toEqual(enKeys);
    });
});

describe('Double quotes', () => {

    const keysToIgnore = [];

    describe('Quoting characters in Swedish', () => {

        test('No straight (") or opening (“) double quotes allowed', () => {
            const strings = collectStringValues(sv, keysToIgnore);
            const badEggs = strings.filter(s => s.includes('"') || s.includes('“'));
            expect(badEggs).toStrictEqual(keysToIgnore);
        });
    });

    describe('Quoting characters in English', () => {

        test('No straight (") double quotes allowed', () => {
            const strings = collectStringValues(en, keysToIgnore);
            const badEggs = strings.filter(s => s.includes('"'));
            expect(badEggs).toStrictEqual([]);
        });

        test('Every opening (“) double quote must have a corresponding closing (”) double quote', () => {
            const strings = collectStringValues(en, keysToIgnore);
            // either no quotes, or one opening and one closing (open/close can appear one or more times)
            const regex = /^([^“”]+|([^“”]*“[^“”]*”[^“”]*)+)$/;
            expect(strings.filter(s => !s.match(regex))).toStrictEqual([]);
        });
    });
});
