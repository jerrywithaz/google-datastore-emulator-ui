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
        const header = headers[indexOfId];

        headers.splice(indexOfId, 1);

        headers.unshift(header);
    }
    else {
        headers.unshift('id');
    }

    return headers;
}

export default getColumnHeaders;