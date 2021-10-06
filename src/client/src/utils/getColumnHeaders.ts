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

    return headers.sort();
}

export default getColumnHeaders;