import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from 'react-i18next'
import propTypes from 'prop-types';

// UI Library
import { ActionIcon, Avatar, Button, Menu } from "@mantine/core";

// Local Import
import { languages, selectedLanguage, setLocale } from "@/store/slices/uiSlice";
//----------------------------------
const LanguageAvatar = ({ language, color = "grey" }) => (<Avatar radius="sm" color={color}>{language ? language.key : '-'}</Avatar>);
LanguageAvatar.propTypes = {
    language: propTypes.object,
    color: propTypes.string
};
//----------------------------------

const LanguageSwitch = () => {
    const dispatch = useDispatch();
    const lang = useSelector(selectedLanguage);
    const { i18n } = useTranslation();

    const onLanguageSelected = (val) => {
        i18n.changeLanguage(val);
        dispatch(setLocale(val));
    }

    return (
        <>
            <Button.Group hiddenFrom="sm">
                {Object.values(languages).map(item =>
                    <Button
                        key={item.key}
                        variant="outline"
                        disabled={item?.key == lang?.key}
                        onClick={() => onLanguageSelected(item.key)}
                    >
                        {item.key}
                    </Button>
                )}
            </Button.Group>
            <Menu shadow="md" width={200} visibleFrom="sm">
                <Menu.Target>
                    <ActionIcon variant="default" size="xl" aria-label="Select Language">
                        <LanguageAvatar language={lang} />
                    </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                    {Object.values(languages).map(item =>
                        <Menu.Item
                            key={item.key}
                            onClick={() => onLanguageSelected(item.key)}
                            leftSection={<LanguageAvatar language={item} />}
                        >
                            {item.name}
                        </Menu.Item>
                    )}
                </Menu.Dropdown>
            </Menu>
        </>
    );
}

export default LanguageSwitch;