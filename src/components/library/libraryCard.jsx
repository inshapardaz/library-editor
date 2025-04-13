import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Ui Library Imports
import { Card, Center, Divider, Group, Text, Tooltip, useMantineTheme } from '@mantine/core';

// Local Imports
import classes from './libraryCard.module.css';
import { IconWorld } from '@/components/icons';
import { IconLibrary, IconLibraryEditor } from '@/components/icons';
import IconText from '@/components/iconText';
import If from '@/components/if';
import Img from '@/components/img';
import LibraryDeleteButton from './libraryDeleteButton';
//-------------------------------------

const LibraryCard = ({ library }) => {
    const { t } = useTranslation();
    const theme = useMantineTheme();

    const icon = <Center> <IconLibrary height={200} style={{ color: theme.colors.dark[2] }} /></Center>;

    return (<Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
            <Img
                src={library.links?.image}
                h={200}
                radius="md"
                fallback={icon}
            />
        </Card.Section>

        <Group justify="space-between" mt="md" mb="xs">
            <Text component={Link} to={`/libraries/${library.id}`} truncate="end" fw={500}>{library.name}</Text>
        </Group>

        <Group justify="space-between" gap="xs">

            <Group gap="lg">
                <Center>
                    <IconWorld
                        height={16}
                        stroke={1.5}
                        style={{ color: theme.colors.dark[2] }}
                    />
                    <Text size="sm" className={classes.bodyText}>
                        {t(`languages.${library.language}`)}
                    </Text>
                </Center>
            </Group>
        </Group>

        <If condition={library?.description} elseChildren={<Text size="sm" fs="italic" c="dimmed" lineClamp={1}>
            {t('library.noDescription')}
        </Text>}>
            <Tooltip label={library.description} withArrow>
                <Text size="sm" c="dimmed" lineClamp={1}>
                    {library.description}
                </Text>
            </Tooltip>
        </If>
        <Group mt="md">
            <If condition={library.links.update}>
                <IconText
                    tooltip={t('actions.edit')}
                    link={`/libraries/${library.id}/edit`}
                    icon={<IconLibraryEditor height={16} style={{ color: theme.colors.dark[2] }} />} />
            </If>
            <If condition={library.links.delete != null}>
                <>
                    <Divider orientation="vertical" />
                    <LibraryDeleteButton library={library} t={t} />
                </>
            </If>
        </Group>
    </Card >)
}

LibraryCard.propTypes = {
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

export default LibraryCard;