import { axiosPrivate, axiosPublic } from "./axios.helpers";
import { removeLinks } from "./parseResponse";
import { API_URL } from "/src/config";
import { ProcessStatus } from "/src/models";

// --------------------------------------------------------------
const defaultLibraryImage = "/images/library_placeholder.png";
const defaultAuthorImage = "/images/author_placeholder.jpg";
const defaultSeriesImage = "/images/series_placeholder.jpg";
const defaultBookImage = "/images/book_placeholder.jpg";
const defaultArticleImage = "/images/article_placeholder.png";
const defaultPageImage = "/images/page_placeholder.jpg";
const defaultPeriodicalImage = "/images/periodical_placeholder.png";
const defaultIssueImage = "/images/periodical_placeholder.png";
// --------------------------------------------------------------

const parseReadFilter = (readFilter) => {
    switch (readFilter) {
        case true:
            return "read=true&";
        case false:
            return "read=false&";
        default:
            return "";
    }
};

// --------------------------------------------------------------

export const isJsonString = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

// --------------------------------------------------------------
export const libraryPlaceholderImage = defaultLibraryImage;
export const setDefaultLibraryImage = (ev) => {
    ev.target.src = libraryPlaceholderImage;
};
export const authorPlaceholderImage = defaultAuthorImage;
export const setDefaultAuthorImage = (ev) => {
    ev.target.src = defaultAuthorImage;
};
export const seriesPlaceholderImage = defaultSeriesImage;
export const setDefaultSeriesImage = (ev) => {
    ev.target.src = defaultSeriesImage;
};
export const bookPlaceholderImage = defaultBookImage;
export const setDefaultBookImage = (ev) => {
    ev.target.src = defaultBookImage;
};
export const articlePlaceholderImage = defaultArticleImage;
export const setDefaultArticleImage = (ev) => {
    ev.target.src = defaultArticleImage;
};
export const pagePlaceholderImage = defaultPageImage;
export const setDefaultPageImage = (ev) => {
    ev.target.src = defaultPageImage;
};
export const periodicalPlaceholderImage = defaultPeriodicalImage;
export const setDefaultPeriodicalImage = (ev) => {
    ev.target.src = defaultPeriodicalImage;
};
export const issuePlaceholderImage = defaultIssueImage;
export const setDefaultIssueImage = (ev) => {
    ev.target.src = defaultIssueImage;
};
// --------------------------------------------------------------

export const grid = {
    gutter: 8,
    xs: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4,
    xxl: 6,
};

// --------------------------------------------------------------
export const updateLinkToLibrariesPage = (
    location,
    { query, pageNumber, pageSize, statusFilter, sortDirection }
) => {
    var searchParams = new URLSearchParams(location.search);
    if (pageNumber) {
        searchParams.set("pageNumber", pageNumber);
    }
    if (pageSize) {
        searchParams.set("pageSize", pageSize);
    }
    if (statusFilter) {
        searchParams.set("status", statusFilter);
    }
    if (sortDirection) {
        searchParams.set("sortDirection", sortDirection);
    }
    if (query) {
        searchParams.set("query", query);
    } else if (query === "") {
        searchParams.delete("query");
    }

    return `${location.pathname}?${searchParams.toString()}`;
};

export const buildLinkToAuthorsPage = (
    location,
    page,
    pageSize,
    query,
    authorType
) => {
    let querystring = "";
    querystring += page ? `pageNumber=${page}&` : "";
    querystring += pageSize ? `pageSize=${pageSize}&` : "";
    querystring += query ? `query=${query}&` : "";
    querystring += authorType ? `authorType=${authorType}&` : "";

    if (querystring !== "") {
        if (querystring.substr(querystring.length - 1) === "&") {
            querystring = querystring.slice(0, -1);
        }

        return `${location}?${querystring}`;
    }

    return location;
};

export const updateLinkToAuthorsPage = (
    location,
    { pageNumber, pageSize, query, authorType, sortBy, sortDirection }
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
        searchParams.delete("query");
    }
    if (authorType) {
        searchParams.set("author", authorType);
    }
    if (sortBy) {
        searchParams.set("sortBy", sortBy);
    } else if (sortBy === "") {
        searchParams.delete("sortBy");
    }
    if (sortDirection) {
        searchParams.set("sortDirection", sortDirection);
    }

    return `${location.pathname}?${searchParams.toString()}`;
};

export const updateLinkToBooksPage = (
    location,
    {
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
        status,
    }
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
        searchParams.delete("query");
    }
    if (author) {
        searchParams.set("author", author);
    }
    if (categories) {
        searchParams.set("categories", categories);
    }
    if (series) {
        searchParams.set("series", series);
    }
    if (sortBy) {
        searchParams.set("sortBy", sortBy);
    } else if (sortBy === "") {
        searchParams.delete("sortBy");
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
};

export const updateLinkToBooksPagesPage = (
    location,
    {
        pageNumber,
        pageSize,
        statusFilter,
        assignmentFilter,
        reviewerAssignmentFilter,
        sortDirection,
    }
) => {
    var searchParams = new URLSearchParams(location.search);
    if (pageNumber) {
        searchParams.set("pageNumber", pageNumber);
    }
    if (pageSize) {
        searchParams.set("pageSize", pageSize);
    }
    if (statusFilter) {
        searchParams.set("status", statusFilter);
    }
    if (assignmentFilter) {
        searchParams.set("assignment", assignmentFilter);
    }
    if (reviewerAssignmentFilter) {
        searchParams.set("reviewerAssignment", reviewerAssignmentFilter);
    }
    if (sortDirection) {
        searchParams.set("sortDirection", sortDirection);
    }

    return `${location.pathname}?${searchParams.toString()}`;
};

export const buildLinkToCategoriesList = (libraryId, page, pageSize, query) => {
    let querystring = "";
    querystring += page ? `pageNumber=${page}&` : "";
    querystring += pageSize ? `pageSize=${pageSize}&` : "";
    querystring += query ? `query=${query}&` : "";

    if (querystring !== "") {
        if (querystring.substr(querystring.length - 1) === "&") {
            querystring = querystring.slice(0, -1);
        }

        return `/libraries/${libraryId}/categories?${querystring}`;
    }

    return null;
};

export const updateLinkToSeriesPage = (
    location,
    { pageNumber, pageSize, query, sortBy, sortDirection }
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
        searchParams.delete("query");
    }
    if (sortBy) {
        searchParams.set("sortBy", sortBy);
    } else if (sortBy === "") {
        searchParams.delete("sortBy");
    }
    if (sortDirection) {
        searchParams.set("sortDirection", sortDirection);
    }

    return `${location.pathname}?${searchParams.toString()}`;
};

export const buildLinkToBooksPagesPage = (
    location,
    pageNumber,
    pageSize,
    statusFilter,
    assignmentFilter,
    reviewerAssignmentFilter,
    sortDirection
) => {
    let querystring = "section=pages&";
    querystring += pageNumber ? `pageNumber=${pageNumber}&` : "";
    querystring += pageSize && pageSize !== 12 ? `pageSize=${pageSize}&` : "";
    querystring += statusFilter ? `status=${statusFilter}&` : "";
    querystring += assignmentFilter ? `assignment=${assignmentFilter}&` : "";
    querystring += reviewerAssignmentFilter
        ? `reviewerAssignment=${reviewerAssignmentFilter}&`
        : "";
    querystring += sortDirection ? `sortDirection=${sortDirection}&` : "";

    if (querystring !== "") {
        if (querystring.substr(querystring.length - 1) === "&") {
            querystring = querystring.slice(0, -1);
        }

        return `${location}?${querystring}`;
    }

    return location;
};

export const updateLinkToArticlesPage = (
    location,
    {
        pageNumber,
        pageSize,
        query,
        author,
        categories,
        type,
        sortBy,
        sortDirection,
        favorite,
        read,
        status,
    }
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
        searchParams.delete("query");
    }
    if (author) {
        searchParams.set("author", author);
    }
    if (categories) {
        searchParams.set("categories", categories);
    }
    if (type) {
        searchParams.set("type", type);
    }
    if (sortBy) {
        searchParams.set("sortBy", sortBy);
    } else if (sortBy === "") {
        searchParams.delete("sortBy");
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
};

export const buildLinkToPeriodicalsPage = (
    location,
    page,
    pageSize,
    query,
    sortBy,
    sortDirection
) => {
    let querystring = "";
    querystring += page ? `pageNumber=${page}&` : "";
    querystring += pageSize ? `pageSize=${pageSize}&` : "";
    querystring += query ? `query=${query}&` : "";
    querystring += sortBy && sortBy !== "title" ? `sortBy=${sortBy}&` : "";
    querystring +=
        sortDirection && sortDirection !== "ascending"
            ? `sortDirection=${sortDirection}&`
            : "";

    if (querystring !== "") {
        if (querystring.substr(querystring.length - 1) === "&") {
            querystring = querystring.slice(0, -1);
        }

        return `${location}?${querystring}`;
    }

    return location;
};

export const buildLinkToIssuesPage = (
    libraryId,
    periodicalId,
    page,
    sortBy,
    sortDirection
) => {
    const path = `/libraries/${libraryId}/periodicals/${periodicalId}`;
    let querystring = "";
    querystring += page ? `pageNumber=${page}&` : "";
    querystring +=
        sortBy && sortBy !== "dateCreated" ? `sortBy=${sortBy}&` : "";
    querystring +=
        sortDirection && sortDirection !== "ascending"
            ? `sortDirection=${sortDirection}&`
            : "";

    if (querystring !== "") {
        if (querystring.substr(querystring.length - 1) === "&") {
            querystring = querystring.slice(0, -1);
        }

        return `${path}?${querystring}`;
    }

    return path;
};

export const getDateFormatFromFrequency = (frequency) => {
    switch (frequency) {
        case "Weekly":
            return "week";
        case "Monthly":
            return "MMMM YYYY";
        case "Quarterly":
            return "Q (MMMM) YYYY";
        case "Annually":
            return "YYYY";
        case "Daily":
        case "FortNightly":
        default:
            return "LL";
    }
};
// ------------------  File functions --------------------------------------

export const downloadFile = async (url, onProgress = () => {}) => {
    const response = url.startsWith(API_URL)
        ? await axiosPrivate({
              url: url,
              method: "GET",
              responseType: "blob",
          })
        : await axiosPublic({
              url: url,
              method: "GET",
              responseType: "blob",
          });

    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = (e) => {
            const data = atob(e.target.result.replace(/.*base64,/, ""));
            resolve(data);
        };
        reader.onprogress = ({ loaded, total }) =>
            onProgress({ loaded, total });
        reader.onerror = () => {
            reader.abort();
            reject(new DOMException("Problem parsing input file."));
        };
        reader.readAsDataURL(response.data);
    });
};

export const loadPdfPage = async (pdf, index) => {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("className", "canv");
    canvas.setAttribute("willReadFrequently", true);
    var page = await pdf.getPage(index);
    var viewport = page.getViewport({ scale: 1.5 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    var render_context = {
        canvasContext: canvas.getContext("2d"),
        viewport: viewport,
    };
    await page.render(render_context).promise;
    const data = canvas.toDataURL("image/png");
    canvas.remove();
    return data;
};

export const dataURItoBlob = (dataURI) => {
    var byteString;
    if (dataURI.split(",")[0].indexOf("base64") >= 0)
        byteString = atob(dataURI.split(",")[1]);
    else byteString = unescape(dataURI.split(",")[1]);

    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
};

export const splitImage = ({ URI, splitPercentage, rtl = false }) => {
    if (splitPercentage === 0) return Promise.resolve(dataURItoBlob(URI));
    return new Promise(function (resolve, reject) {
        if (URI == null) return reject();
        var image = new Image();
        image.addEventListener(
            "load",
            function () {
                var imagePieces = [];
                const splitSize = (splitPercentage / 100) * image.width;

                // Draw the left part of the image
                var canvas1 = document.createElement("canvas");
                var context1 = canvas1.getContext("2d");
                canvas1.width = splitSize;
                canvas1.height = image.height;
                context1.drawImage(
                    image,
                    0,
                    0,
                    splitSize,
                    image.height,
                    0,
                    0,
                    splitSize,
                    image.height
                );

                imagePieces.push(canvas1.toDataURL());

                // Draw the right part of the image
                var canvas2 = document.createElement("canvas");
                var context2 = canvas2.getContext("2d");
                canvas2.width = image.width - splitSize;
                canvas2.height = image.height;
                context2.drawImage(
                    image,
                    splitSize,
                    0,
                    image.width - splitSize,
                    image.height,
                    0,
                    0,
                    image.width - splitSize,
                    image.height
                );
                imagePieces.push(canvas2.toDataURL());
                if (rtl) {
                    imagePieces = imagePieces.reverse();
                }
                resolve(imagePieces);
            },
            false
        );
        image.src = URI;
    });
};

export const readBinaryFile = (file) => {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = () => resolve(new Uint8Array(reader.result));
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
};

export const readBlob = (file) => {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = () =>
            resolve(
                new Blob(new Uint8Array(reader.result), { type: file.type })
            );
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
};
// ------------------  batch work --------------------------------------
export const processMultipleRequests = async ({
    baseQuery,
    method,
    url,
    requests,
    payload,
    onProgress,
}) => {
    let hasErrors = false;
    for (const request of requests) {
        try {
            request.status = ProcessStatus.InProcess;
            onProgress(request);
            let body =
                typeof payload === "function" ? payload(request.data) : payload;
            if (body) {
                const resolvedUrl =
                    typeof url === "function" ? url(request, payload) : url;
                var result = await baseQuery({
                    url: resolvedUrl,
                    method: method,
                    data: removeLinks(body),
                });

                if (result.error) {
                    request.status = ProcessStatus.Failed;
                    hasErrors = true;
                } else {
                    request.status = ProcessStatus.Completed;
                }
            } else {
                request.status = ProcessStatus.Skipped;
            }
            onProgress(request);
        } catch (e) {
            console.error(e);
            request.status = ProcessStatus.Failed;
            onProgress(request);
            hasErrors = true;
        }
    }
    if (hasErrors) {
        throw new Error("Some of the operations failed.");
    }

    return { data: requests };
};

// ------------------  REMOVE FOLLOWING --------------------------------------

const helpers = {
    truncateWithEllipses: (text, max) => {
        if (!text) return text;
        return text.substr(0, max - 1) + (text.length > max ? "..." : "");
    },

    parseNullableBool: (val) => {
        if (val === "true") {
            return true;
        }
        if (val === "false") {
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
        status
    ) => {
        let querystring = "";
        querystring += page ? `pageNumber=${page}&` : "";
        querystring += pageSize ? `pageSize=${pageSize}&` : "";
        querystring += query ? `query=${query}&` : "";
        querystring += author ? `author=${author}&` : "";
        querystring += categories ? `categories=${categories}&` : "";
        querystring += series ? `series=${series}&` : "";
        querystring += sortBy && sortBy !== "title" ? `sortBy=${sortBy}&` : "";
        querystring +=
            sortDirection && sortDirection !== "ascending"
                ? `sortDirection=${sortDirection}&`
                : "";
        querystring += favorite && favorite !== false ? "favorite=true&" : "";
        querystring += parseReadFilter(read);
        querystring +=
            status && status !== "published" ? `status=${status}&` : "";

        if (querystring !== "") {
            if (querystring.substr(querystring.length - 1) === "&") {
                querystring = querystring.slice(0, -1);
            }

            return `${location}?${querystring}`;
        }

        return location;
    },

    buildLinkToSeriesPage: (libraryId, page, pageSize, query) => {
        let querystring = "";
        querystring += page ? `pageNumber=${page}&` : "";
        querystring += pageSize ? `pageSize=${pageSize}&` : "";
        querystring += query ? `query=${query}&` : "";

        if (querystring !== "") {
            if (querystring.substr(querystring.length - 1) === "&") {
                querystring = querystring.slice(0, -1);
            }

            return `/libraries/${libraryId}/series?${querystring}`;
        }

        return null;
    },

    updateLinkToArticlesEditPage: (location, { section, language }) => {
        var searchParams = new URLSearchParams(location.search);
        if (section) {
            searchParams.set("section", section);
        }
        if (language) {
            searchParams.set("language", language);
        }

        return `${location.pathname}?${searchParams.toString()}`;
    },

    buildLinkToLibrariesPage: (location, page, query, pageSize = 12) => {
        let querystring = "";
        querystring += page ? `pageNumber=${page}&` : "";
        querystring += query ? `q=${query}&` : "";
        querystring +=
            pageSize && pageSize !== 12 ? `pageSize=${pageSize}&` : "";

        if (querystring !== "") {
            if (querystring.substr(querystring.length - 1) === "&") {
                querystring = querystring.slice(0, -1);
            }

            return `${location.pathname}?${querystring}`;
        }

        return location.pathname;
    },

    buildLinkToLibraryUsersPage: (location, page, query, pageSize = 12) => {
        let querystring = "";
        querystring += page ? `pageNumber=${page}&` : "";
        querystring += query ? `q=${query}&` : "";
        querystring +=
            pageSize && pageSize !== 12 ? `pageSize=${pageSize}&` : "";

        if (querystring !== "") {
            if (querystring.substr(querystring.length - 1) === "&") {
                querystring = querystring.slice(0, -1);
            }

            return `${location.pathname}?${querystring}`;
        }

        return location.pathname;
    },
    buildLinkToIssuePagesPage: ({
        location,
        pageNumber,
        pageSize,
        statusFilter,
        assignmentFilter,
        reviewerAssignmentFilter,
        sortDirection,
    }) => {
        var searchParams = new URLSearchParams(location.search);
        if (pageNumber) {
            searchParams.set("pageNumber", pageNumber);
        }
        if (pageSize) {
            searchParams.set("pageSize", pageSize);
        }
        if (sortDirection) {
            searchParams.set("sortDirection", sortDirection);
        }
        if (statusFilter) {
            searchParams.set("status", statusFilter);
        }

        if (assignmentFilter) {
            searchParams.set("assignment", assignmentFilter);
        }
        if (reviewerAssignmentFilter) {
            searchParams.set("reviewerAssignment", reviewerAssignmentFilter);
        }

        return `${location.pathname}?${searchParams.toString()}`;
    },

    splitImageUrl: (URI, splitPercentage) => {
        if (splitPercentage === 0) return Promise.resolve(dataURItoBlob(URI));
        return new Promise(function (resolve, reject) {
            if (URI == null) return reject();
            var image = new Image();
            image.addEventListener(
                "load",
                function () {
                    var imagePieces = [];
                    const splitSize = (splitPercentage / 100) * image.width;

                    // Draw the left part of the image
                    var canvas1 = document.createElement("canvas");
                    var context1 = canvas1.getContext("2d");
                    canvas1.width = splitSize;
                    canvas1.height = image.height;
                    context1.drawImage(
                        image,
                        0,
                        0,
                        splitSize,
                        image.height,
                        0,
                        0,
                        splitSize,
                        image.height
                    );

                    imagePieces.push(canvas1.toDataURL());

                    // Draw the right part of the image
                    var canvas2 = document.createElement("canvas");
                    var context2 = canvas2.getContext("2d");
                    canvas2.width = image.width - splitSize;
                    canvas2.height = image.height;
                    context2.drawImage(
                        image,
                        splitSize,
                        0,
                        image.width - splitSize,
                        image.height,
                        0,
                        0,
                        image.width - splitSize,
                        image.height
                    );
                    imagePieces.push(canvas2.toDataURL());

                    resolve(imagePieces);
                },
                false
            );
            image.src = URI;
        });
    },
};

export default helpers;
