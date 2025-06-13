import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// Ui Library Imports
import { Divider, Group, Menu, Space, Text } from "@mantine/core";

// Local Imports
import classes from './appHeader.module.css';
import { IconAutoCorrect, IconPunctuation, IconChevronDown, IconTools, IconWords } from "@/components/icons";
//-----------------------------------

const ToolsMenu = () => {
    const { t } = useTranslation();
    const [isOpen, setOpen] = useState(false);

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
                <Group wrap="nowrap" className={classes.link}>
                    <IconTools height="24px" />
                    <Space w="md" />
                    <Text visibleFrom="lg" size="sm">
                        {t('header.tools')}
                    </Text>
                    <IconChevronDown
                        size={16}
                        stroke={1.5}
                        style={{
                            transform: !isOpen ? "rotate(0)" : "rotate(180deg)",
                            transitionDuration: "250ms"
                        }}
                    />
                </Group>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item
                    component={Link}
                    to='/tools/language/punctuation'
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
                    component={Link}
                    to='/tools/language/autocorrect'
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
