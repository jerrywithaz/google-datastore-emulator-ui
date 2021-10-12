function getColumnHeaders(data: Record<string, unknown>[]) {
    const headers: string[] = [];

    data.forEach((item) => {
        const keys = Object.keys(item);

        keys.forEach((key) => {
            if (!headers.includes(key)) {
                headers.push(key)
            }
        })
    });


    headers.sort();

    const indexOfId = headers.findIndex((header) => header.toLowerCase() === 'id');

    if (indexOfId > -1) {
        headers.splice(indexOfId, 1);

        headers.unshift('id');
    }
    else {
        headers.unshift('id');
    }

    const indexOfKey = headers.findIndex((header) => header.toLowerCase() === '__key__');

    if (indexOfKey > -1) headers.splice(indexOfKey, 1);

    return headers;
}

export default getColumnHeaders;