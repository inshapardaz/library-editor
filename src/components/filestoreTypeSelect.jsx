import PropTypes from 'prop-types';
import { useMemo } from 'react';

// 3rd party libraries
import { Combobox, Group, Input, InputBase, useCombobox } from '@mantine/core';

// Local Imports
import { IconTick } from '@/components/icons';
import { useTranslation } from 'react-i18next';
// -------------------------------------------------


const FilestoreTypeSelect = ({ defaultValue, placeholder, disabled, onChange, ...props }) => {
    const { t } = useTranslation();
    const typeOptions = useMemo(() => [
        { value: 'Database', label: 'library.fileStoreType.database' },
        { value: 'AzureBlobStorage', label: 'library.fileStoreType.azurebolbstorage' },
        { value: 'S3Storage', label: 'library.fileStoreType.s3storage' },
        { value: 'FileSystem', label: 'library.fileStoreType.filesystem' }
    ], []);
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: (eventSource) => {
            if (eventSource === 'keyboard') {
                combobox.selectActiveOption();
            } else {
                combobox.updateSelectedOptionIndex('active');
            }
        },
    });

    const options = typeOptions.map((item) => (
        <Combobox.Option value={item.value} key={item.value} active={item.value === defaultValue}>
            <Group gap="xs">
                {item.value === defaultValue && <IconTick size={12} />}
                <span>{t(item.label)}</span>
            </Group>
        </Combobox.Option>
    ));

    return (
        <Combobox {...props}
            store={combobox}
            withinPortal={true}
            onOptionSubmit={(val) => {
                onChange && onChange(val);
                combobox.updateSelectedOptionIndex('active');
                combobox.closeDropdown();
            }}
            disabled={disabled}
        >
            <Combobox.Target targetType="button">
                <InputBase
                    disabled={disabled}
                    component="button"
                    type="button"
                    pointer
                    rightSection={<Combobox.Chevron />}
                    rightSectionPointerEvents="none"
                    onClick={() => combobox.toggleDropdown()}
                >
                    {defaultValue && t(typeOptions.find(x => x.value == defaultValue)?.label) || <Input.Placeholder>{placeholder}</Input.Placeholder>}
                </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options>{options}</Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
};

FilestoreTypeSelect.propTypes = {
    defaultValue: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func
};


export default FilestoreTypeSelect;
