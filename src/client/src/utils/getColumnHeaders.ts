function getType(item: any) {
    if (Array.isArray(item) || typeof item === 'object') {
        return 'string';
    }

    return typeof item;
}

function getColumnHeaders(data: Record<string, unknown>[]) {
    // const headers: {type: string, key: string }[] = [];
    const map = new Map<string, {type: string, key: string }>();

    data.forEach((item) => {
        const keys = Object.keys(item);

        keys.forEach((key) => {
            if (key !== '__typename' && !map.has(key)) {
                const type = getType(item[key]);
                map.set(key, { key, type});
            }
        })
    });

    const headers = [...map.values()]

    headers.sort();

    const indexOfId = headers.findIndex(({ key }) => key.toLowerCase() === 'id');

    if (indexOfId > -1) {
        headers.splice(indexOfId, 1);

        headers.unshift({ key: 'id', type: 'string '});
    }
    else {
        headers.unshift({ key: 'id', type: 'string '});
    }

    const indexOfKey = headers.findIndex(({ key }) => key.toLowerCase() === '__key__');

    if (indexOfKey > -1) headers.splice(indexOfKey, 1);

    return headers;
}

export default getColumnHeaders;