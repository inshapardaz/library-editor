import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Ui Library Imports
import { Avatar, Divider, Group, Stack, Text, Tooltip, useMantineTheme } from '@mantine/core';

// Local Imports
import { IconWorld, IconLibrary, IconLibraryEditor } from '@/components/icons';
import If from '@/components/if';
import IconText from '@/components/iconText';
import LibraryDeleteButton from './libraryDeleteButton';
//-------------------------------------

const LibraryListItem = ({ library }) => {
    const { t } = useTranslation();
    const theme = useMantineTheme();

    return (<>
        <Group gap="sm">
            <Avatar size={64} radius={30} ><IconLibrary /></Avatar>
            <Stack>
                <Text component={Link} to={`/libraries/${library.id}`} truncate="end" fw={500}>{library.name}</Text>
                {library?.description ?
                    (<Tooltip label={library.description} withArrow>
                        <Text size="sm" c="dimmed" lineClamp={1}>
                            {library.description}
                        </Text>
                    </Tooltip>) :
                    (<Text size="sm" fs="italic" c="dimmed" lineClamp={1}>
                        {t('library.noDescription')}
                    </Text>)}
                <Group>
                    <IconWorld
                        height={16}
                        stroke={1.5}
                        style={{ color: theme.colors.dark[2] }}
                    />
                    <Text size="xs" c="dimmed">
                        {t(`languages.${library.language}`)}
                    </Text>
                </Group>
            </Stack>
            <span style={{ flex: 1 }} />
            <Group>
                <If condition={library.links.update}>
                    <>
                        <Divider orientation="vertical" />
                        <IconText
                            tooltip={t('actions.edit')}
                            link={`/libraries/${library.id}/edit`}
                            icon={<IconLibraryEditor height={16} style={{ color: theme.colors.dark[2] }} />} />
                    </>
                </If>
                <If condition={library.links.delete != null}>
                    <>
                        <Divider orientation="vertical" />
                        <LibraryDeleteButton library={library} t={t} />
                    </>
                </If>
            </Group>
        </Group>
        <Divider />
    </>
    )
}

LibraryListItem.propTypes = {
    library: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        description: PropTypes.string,
        language: PropTypes.string,
        links: PropTypes.shape({
            image: PropTypes.string,
            update: PropTypes.string,
            delete: PropTypes.string
        })
    })
}

export default LibraryListItem;