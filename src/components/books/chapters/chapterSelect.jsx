import React from "react";

// 3rd party libraries
import { Empty, Select } from "antd";
import { FaUser } from "react-icons/fa";

// local imports
import { useGetBookChaptersQuery } from "../../../features/api/booksSlice";

// -------------------------------------------------

const ChapterSelect = ({
    libraryId,
    book,
    label,
    value,
    onChange,
    placeholder,
    t,
}) => {
    const {
        data: chapters,
        error,
        isFetching,
    } = useGetBookChaptersQuery({
        libraryId,
        bookId: book.id,
        pageNumber: 1,
        pageSize: 10,
    });

    const onChangeHandler = (v) => onChange(v);

    return (
        <Select
            loading={isFetching}
            error={error}
            defaultValue={{ value, label }}
            defaultActiveFirstOption={false}
            onChange={onChangeHandler}
            placeholder={placeholder}
            notFoundContent={
                <Empty
                    image={<FaUser size="2em" />}
                    description={t("chapters.empty.title")}
                />
            }
        >
            {chapters &&
                chapters.data.map((chapter) => (
                    <Select.Option key={chapter.id} value={chapter.id}>
                        {chapter.title}
                    </Select.Option>
                ))}
        </Select>
    );
};

export default ChapterSelect;
