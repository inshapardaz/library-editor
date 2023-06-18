const parseResponse = (source) => {
    if (source) {
        if (source.links) {
            const newLinks = {};
            source.links.forEach((link) => {
                newLinks[link.rel.replace(/-/g, '_')] = link.href;
            });
            source.links = newLinks;
        }

        if (source.data) {
            const newItems = [];
            source.data.forEach((item) => newItems.push(parseResponse(item)));
            source.data = newItems;
        }

        if (source.files) {
            const newItems = [];
            source.files.forEach((item) => newItems.push(parseResponse(item)));
            source.files = newItems;
        }

        if (source.contents) {
            const newItems = [];
            source.contents.forEach((item) => newItems.push(parseResponse(item)));
            source.contents = newItems;
        }

        if (source.authors) {
            const newItems = [];
            source.authors.forEach((item) => newItems.push(parseResponse(item)));
            source.authors = newItems;
        }

        if (Array.isArray(source)) {
            const newItems = [];
            source.forEach((item) => newItems.push(parseResponse(item)));
            return newItems;
        }
    }

    return source;
};

export { parseResponse }
