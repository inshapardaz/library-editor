import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

// Ui Library Imports
import { Divider, Group, Menu, Tooltip } from "@mantine/core";

// Local Imports
import classes from './appHeader.module.css';
import { IconAutoCorrect, IconPunctuation, IconChevronDown, IconTools, IconWords } from "@/components/icons";
import { selectedLanguage } from '@/store/slices/uiSlice';
import { correctionsUrl } from '@/utils/languageTools';
//-----------------------------------

const ToolsMenu = () => {
    const { t } = useTranslation();
    const [isOpen, setOpen] = useState(false);
    const language = useSelector(selectedLanguage).key;

    return (<>
        <Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: 'pop-top-right' }}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            withinPortal
        >
            <Menu.Target>
                <Tooltip label={t('header.tools')}>
                    <Group wrap="nowrap" gap={0} className={classes.link}>
                        <IconTools height="24px" />
                        <IconChevronDown
                            size={16}
                            stroke={1.5}
                            style={{
                                transform: !isOpen ? "rotate(0)" : "rotate(180deg)",
                                transitionDuration: "250ms"
                            }}
                        />
                    </Group>
                </Tooltip>
            </Menu.Target>
            <Menu.Dropdown>
                {/* The correction lists are managed in LanguageTools. */}
                <Menu.Item
                    component="a"
                    href={correctionsUrl('punctuation', language)}
                    leftSection={
                        <IconPunctuation size={16} stroke={1.5} />
                    }
                >
                    {t('editor.punctuation')}
                </Menu.Item>
                <Menu.Item
                    leftSection={
                        <IconAutoCorrect size={16} stroke={1.5} />
                    }
                    component="a"
                    href={correctionsUrl('autocorrect', language)}
                >
                    {t('editor.autoCorrect')}
                </Menu.Item>
                <Divider />
                <Menu.Item
                    leftSection={
                        <IconWords size={16} stroke={1.5} />
                    }
                    component={Link}
                    to='/tools/language/words'
                >
                    {t('commonWords.title')}
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    </>)
};

export default ToolsMenu;
