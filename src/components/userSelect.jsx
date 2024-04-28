import { useState } from "react";

// 3rd party libraries
import { Empty, Select } from "antd";
import { FaUser } from "react-icons/fa";

// local imports
import { useGetWritersQuery } from "~/src/store/slices/accountsSlice";

// -------------------------------------------------


const UserSelect = ({
    libraryId,
    label,
    value,
    onChange,
    placeholder,
    t,
    addMeOption = false,
}) => {
    const [query, setQuery] = useState("");
    const {
        data: writers,
        error,
        isFetching,
    } = useGetWritersQuery({ libraryId, query, pageNumber: 1, pageSize: 10 });

    const onChangeHandler = (v) => onChange(v);
    const onSearchHandler = (v) => setQuery(v);

    return (
        <Select
            showSearch
            loading={isFetching}
            error={error}
            defaultValue={{ value, label }}
            defaultActiveFirstOption={false}
            onSearch={onSearchHandler}
            onChange={onChangeHandler}
            placeholder={placeholder}
            notFoundContent={
                <Empty
                    image={<FaUser size="2em" />}
                    description={t("users.empty.title")}
                />
            }
        >
            <Select.Option key="none" value="none">
                {t("users.none.title")}
            </Select.Option>
            {addMeOption && (
                <Select.Option key="me" value="me">
                    {t("users.me.title")}
                </Select.Option>
            )}
            <Select.OptGroup label={t("users.others.title")}>
                {writers &&
                    writers.map((user) => (
                        <Select.Option key={user.id} value={user.id}>
                            {user.name}
                        </Select.Option>
                    ))}
            </Select.OptGroup>
        </Select>
    );
};

export default UserSelect;
