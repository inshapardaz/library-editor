import { axiosPrivate } from "/src/util/axios.helpers";

const addChapterContent = ({ chapter, language, payload }) => {
    return axiosPrivate.post(chapter.links.add_content, payload, {
        headers: {
            "Content-Type": "application/json",
            "Content-Language": language || "en-US",
        },
    });
};

const updateChapterContent = ({ chapterContent, language, payload }) => {
    return axiosPrivate.put(chapterContent.links.update, payload, {
        headers: {
            "Content-Type": "application/json",
            "Content-Language": language || "en-US",
        },
    });
};

const addIssueArticleContent = ({ article, language, payload }) => {
    return axiosPrivate.post(article.links.add_content, payload, {
        headers: {
            "Content-Type": "application/json",
            "Content-Language": language || "en-US",
        },
    });
};

const updateIssueArticleContent = ({ articleContent, language, payload }) => {
    return axiosPrivate.put(articleContent.links.update, payload, {
        headers: {
            "Content-Type": "application/json",
            "Content-Language": language || "en-US",
        },
    });
};

export {
    addChapterContent,
    updateChapterContent,
    addIssueArticleContent,
    updateIssueArticleContent,
};
