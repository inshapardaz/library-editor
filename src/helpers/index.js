const parseReadFilter = (readFilter) => {
    switch (readFilter) {
        case true:
            return 'read=true&';
        case false:
            return 'read=false&';
        default:
            return '';
    }
};
const defaultLibraryImage = '/images/library_placeholder.png';
const defaultAuthorImage = '/images/author_placeholder.jpg';
const defaultSeriesImage = '/images/series_placeholder.jpg';
const defaultBookImage = '/images/book_placeholder.jpg';
const defaultPageImage = '/images/page_placeholder.jpg';
const defaultPeriodicalImage = '/images/periodical_placeholder.png';
const defaultIssueImage = '/images/periodical_placeholder.png';

const helpers = {
    truncateWithEllipses: (text, max) => {
        if (!text) return text;
        return text.substr(0, max - 1) + (text.length > max ? '...' : '');
    },
    defaultLibraryImage,
    setDefaultLibraryImage: (ev) => {
        ev.target.src = defaultLibraryImage;
    },
    defaultAuthorImage,
    setDefaultAuthorImage: (ev) => {
        ev.target.src = defaultAuthorImage;
    },
    defaultSeriesImage,
    setDefaultSeriesImage: (ev) => {
        ev.target.src = defaultSeriesImage;
    },
    defaultBookImage,
    setDefaultBookImage: (ev) => {
        ev.target.src = defaultBookImage;
    },
    defaultPageImage,
    setDefaultPageImage: (ev) => {
        ev.target.src = defaultPageImage;
    },
    defaultPeriodicalImage,
    setDefaultPeriodicalImage: (ev) => {
        ev.target.src = defaultPeriodicalImage;
    },
    defaultIssueImage,
    setDefaultIssueImage: (ev) => {
        ev.target.src = defaultIssueImage;
    },

    parseNullableBool: (val) => {
        if (val === 'true') {
            return true;
        }
        if (val === 'false') {
            return false;
        }
        return null;
    },
    buildLinkToBooksPage: (
        location,
        page,
        pageSize,
        query,
        author,
        categories,
        series,
        sortBy,
        sortDirection,
        favorite,
        read,
        status,
    ) => {
        let querystring = '';
        querystring += page ? `pageNumber=${page}&` : '';
        querystring += pageSize ? `pageSize=${pageSize}&` : '';
        querystring += query ? `query=${query}&` : '';
        querystring += author ? `author=${author}&` : '';
        querystring += categories ? `categories=${categories}&` : '';
        querystring += series ? `series=${series}&` : '';
        querystring += sortBy && sortBy !== 'title' ? `sortBy=${sortBy}&` : '';
        querystring += sortDirection && sortDirection !== 'ascending' ? `sortDirection=${sortDirection}&` : '';
        querystring += favorite && favorite !== false ? 'favorite=true&' : '';
        querystring += parseReadFilter(read);
        querystring += status && status !== 'published' ? `status=${status}&` : '';

        if (querystring !== '') {
            if (querystring.substr(querystring.length - 1) === '&') {
                querystring = querystring.slice(0, -1);
            }

            return `${location}?${querystring}`;
        }

        return location;
    },
    updateLinkToBooksPage: (location, {
        pageNumber,
        pageSize,
        query,
        author,
        categories,
        series,
        sortBy,
        sortDirection,
        favorite,
        read,
        status, }) => {

        var searchParams = new URLSearchParams(location.search);
        if (pageNumber) {
            searchParams.set("pageNumber", pageNumber);
        }
        if (pageSize) {
            searchParams.set("pageSize", pageSize);
        }
        if (query) {
            searchParams.set("query", query);
        } else if (query === "") {
            searchParams.delete("query")
        }
        if (author) {
            searchParams.set("author", author);
        }
        if (categories) {
            searchParams.set("categories", categories);
        }
        if (series ) {
            searchParams.set("series", series);
        }
        if (sortBy) {
            searchParams.set("sortBy", sortBy);
        } else if (sortBy === "") {
            searchParams.delete("sortBy")
        }
        if (sortDirection) {
            searchParams.set("sortDirection", sortDirection);
        }
        if (favorite) {
            searchParams.set("favorite", favorite);
        }
        if (read) {
            searchParams.set("read", read);
        }
        if (status) {
            searchParams.set("status", status);
        }

        return `${location.pathname}?${searchParams.toString()}`;
    },
    buildLinkToAuthorsPage: (
        location,
        page,
        pageSize,
        query,
        authorType
    ) => {
        let querystring = '';
        querystring += page ? `pageNumber=${page}&` : '';
        querystring += pageSize ? `pageSize=${pageSize}&` : '';
        querystring += query ? `query=${query}&` : '';
        querystring += authorType ? `authorType=${authorType}&` : '';

        if (querystring !== '') {
            if (querystring.substr(querystring.length - 1) === '&') {
                querystring = querystring.slice(0, -1);
            }

            return `${location}?${querystring}`;
        }

        return location;
    },
    updateLinkToAuthorsPage: (location, {
        pageNumber,
        pageSize,
        query,
        authorType,
        sortBy,
        sortDirection}) => {

        var searchParams = new URLSearchParams(location.search);
        if (pageNumber) {
            searchParams.set("pageNumber", pageNumber);
        }
        if (pageSize) {
            searchParams.set("pageSize", pageSize);
        }
        if (query) {
            searchParams.set("query", query);
        } else if (query === "") {
            searchParams.delete("query")
        }
        if (authorType) {
            searchParams.set("author", authorType);
        }
        if (sortBy) {
            searchParams.set("sortBy", sortBy);
        } else if (sortBy === "") {
            searchParams.delete("sortBy")
        }
        if (sortDirection) {
            searchParams.set("sortDirection", sortDirection);
        }

        return `${location.pathname}?${searchParams.toString()}`;
    },
    buildLinkToSeriesPage: (
        libraryId,
        page,
        pageSize,
        query
    ) => {
        let querystring = '';
        querystring += page ? `pageNumber=${page}&` : '';
        querystring += pageSize ? `pageSize=${pageSize}&` : '';
        querystring += query ? `query=${query}&` : '';

        if (querystring !== '') {
            if (querystring.substr(querystring.length - 1) === '&') {
                querystring = querystring.slice(0, -1);
            }

            return `/libraries/${libraryId}/series?${querystring}`;
        }

        return null;
    },
    updateLinkToSeriesPage: (
        location, {
            pageNumber,
            pageSize,
            query,
            sortBy,
            sortDirection}
    ) => {
         var searchParams = new URLSearchParams(location.search);
        if (pageNumber) {
            searchParams.set("pageNumber", pageNumber);
        }
        if (pageSize) {
            searchParams.set("pageSize", pageSize);
        }
        if (query) {
            searchParams.set("query", query);
        } else if (query === "") {
            searchParams.delete("query")
        }
        if (sortBy) {
            searchParams.set("sortBy", sortBy);
        } else if (sortBy === "") {
            searchParams.delete("sortBy")
        }
        if (sortDirection) {
            searchParams.set("sortDirection", sortDirection);
        }

        return `${location.pathname}?${searchParams.toString()}`;
    },
    buildLinkToCategoriesList : (
        libraryId,
        page,
        pageSize,
        query
    ) => {
        let querystring = '';
        querystring += page ? `pageNumber=${page}&` : '';
        querystring += pageSize ? `pageSize=${pageSize}&` : '';
        querystring += query ? `query=${query}&` : '';

        if (querystring !== '') {
            if (querystring.substr(querystring.length - 1) === '&') {
                querystring = querystring.slice(0, -1);
            }

            return `/libraries/${libraryId}/categories?${querystring}`;
        }

        return null;
    },
    buildLinkToPeriodicalsPage: (
        location,
        page,
        pageSize,
        query,
        sortBy,
        sortDirection
    ) => {
        let querystring = '';
        querystring += page ? `pageNumber=${page}&` : '';
        querystring += pageSize ? `pageSize=${pageSize}&` : '';
        querystring += query ? `query=${query}&` : '';
        querystring += sortBy && sortBy !== 'title' ? `sortBy=${sortBy}&` : '';
        querystring += sortDirection && sortDirection !== 'ascending' ? `sortDirection=${sortDirection}&` : '';

        if (querystring !== '') {
            if (querystring.substr(querystring.length - 1) === '&') {
                querystring = querystring.slice(0, -1);
            }

            return `${location}?${querystring}`;
        }

        return location;
    },
    buildLinkToIssuesPage: (
        libraryId,
        periodicalId,
        page,
        sortBy,
        sortDirection,
    ) => {
        const path = `/libraries/${libraryId}/periodicals/${periodicalId}`;
        let querystring = '';
        querystring += page ? `pageNumber=${page}&` : '';
        querystring += sortBy && sortBy !== 'dateCreated' ? `sortBy=${sortBy}&` : '';
        querystring += sortDirection && sortDirection !== 'ascending' ? `sortDirection=${sortDirection}&` : '';

        if (querystring !== '') {
            if (querystring.substr(querystring.length - 1) === '&') {
                querystring = querystring.slice(0, -1);
            }

            return `${path}?${querystring}`;
        }

        return path;
    },
    buildLinkToBooksPagesPage: (location,
        pageNumber,
        pageSize,
        statusFilter,
        assignmentFilter,
        sortDirection) => {
        let querystring = 'section=pages&';
        querystring += pageNumber ? `pageNumber=${pageNumber}&` : '';
        querystring += pageSize && pageSize !== 12 ? `pageSize=${pageSize}&` : '';
        querystring += statusFilter ? `status=${statusFilter}&` : '';
        querystring += assignmentFilter ? `assignment=${assignmentFilter}&` : '';
        querystring += sortDirection ? `sortDirection=${sortDirection}&` : '';

        if (querystring !== '') {
            if (querystring.substr(querystring.length - 1) === '&') {
                querystring = querystring.slice(0, -1);
            }

            return `${location}?${querystring}`;
        }

        return location;
    },
    buildLinkToLibrariesPage: (location,
        page,
        query,
        pageSize = 12) => {
        let querystring = '';
        querystring += page ? `pageNumber=${page}&` : '';
        querystring += query ? `q=${query}&` : '';
        querystring += pageSize && pageSize !== 12 ? `pageSize=${pageSize}&` : '';

        if (querystring !== '') {
            if (querystring.substr(querystring.length - 1) === '&') {
                querystring = querystring.slice(0, -1);
            }

            return `${location.pathname}?${querystring}`;
        }

        return location.pathname;
    },
    buildLinkToLibraryUsersPage: (location,
        page,
        query,
        pageSize = 12) => {
        let querystring = '';
        querystring += page ? `pageNumber=${page}&` : '';
        querystring += query ? `q=${query}&` : '';
        querystring += pageSize && pageSize !== 12 ? `pageSize=${pageSize}&` : '';

        if (querystring !== '') {
            if (querystring.substr(querystring.length - 1) === '&') {
                querystring = querystring.slice(0, -1);
            }

            return `${location.pathname}?${querystring}`;
        }

        return location.pathname;
    },
    buildLinkToIssuePagesPage: (location,
        page,
        pageSize,
        statusFilter,
        assignmentFilter) => {
        let querystring = '';
        querystring += page ? `pageNumber=${page}&` : '';
        querystring += pageSize && pageSize !== 12 ? `pageSize=${pageSize}&` : '';
        querystring += statusFilter ? `filter=${statusFilter}&` : '';
        querystring += assignmentFilter ? `assignmentFilter=${assignmentFilter}&` : '';

        if (querystring !== '') {
            if (querystring.substr(querystring.length - 1) === '&') {
                querystring = querystring.slice(0, -1);
            }

            return `${location.pathname}?${querystring}`;
        }

        return location.pathname;
    },
    isJsonString: (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    },
    getDateFormatFromFrequency: (frequency) => {
        switch (frequency) {
            case "Weekly":
                return "week";
            case "Monthly":
                return "MMMM YYYY";
            case "Quarterly":
                return "Q YYYY";
            case "Annually":
                return "YYYY";
            case "Daily":
            case "FortNightly":
            default:
                return "LL";
        }
    }
};

export default helpers;
