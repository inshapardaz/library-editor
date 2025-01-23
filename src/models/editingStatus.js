const EditingStatus = {
    All: "All",
    Available: "Available",
    Typing: "Typing",
    Typed: "Typed",
    InReview: "InReview",
    Completed: "Completed",
};

export default EditingStatus;

export const getStatusColor = (status) => {
    switch (status) {
        case EditingStatus.Available:
            return "green";
        case EditingStatus.Typing:
            return "yellow";
        case EditingStatus.Typed:
            return "cyan";
        case EditingStatus.InReview:
            return "orange";
        case EditingStatus.Completed:
            return "blue";
    }
}
