import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

// 3rd party params
import { Input } from "antd";

// --------------------------------------------

const SearchBox = () => {
    const { t } = useTranslation();
    const { libraryId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [search, setSearch] = useState(searchParams.get("query"));

    const onSearch = () => {
        if (libraryId) {
            navigate(`/libraries/${libraryId}/search?query=${search}`);
        } else {
            navigate(`/libraries?query=${search}`);
        }
    };
    return (
        <Input.Search
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={onSearch}
            placeholder={t("search.placeholder")}
        />
    );
}

export default SearchBox;
