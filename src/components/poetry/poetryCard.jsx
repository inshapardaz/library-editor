import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Ui Library import
import { Card, Text, Group, useMantineTheme, Center, Divider, rem, Checkbox } from '@mantine/core';

// Local imports
import { IconPoetry, IconEdit, IconReaderText } from '@/components/icons';
import AuthorsAvatar from '@/components/authors/authorsAvatar';
import FavoriteButton from './favoriteButton';
import PoetryAssignButton from './poetryAssignButton';
import PoetryDeleteButton from './poetryDeleteButton';
import PoetryEditForm from './poetryEditForm';
import IconText from '@/components/iconText';
import EditingStatusIcon from '@/components/editingStatusIcon';
import If from '@/components/if';
import Img from '@/components/img';
//---------------------------------------
const IMAGE_HEIGHT = 450;

const PoetryCard = ({ libraryId, poetry, t, isSelected = false, onSelectChanged = () => { } }) => {
    const theme = useMantineTheme();

    const icon = <Center h={IMAGE_HEIGHT} ><IconPoetry width={rem(150)} style={{ color: theme.colors.dark[1] }} /></Center>;

    return (
        <Card shadow="sm" padding="lg" radius="md" key={poetry.id} withBorder>
            <Card.Section>
                <Img h={IMAGE_HEIGHT} radius="sm" src={poetry?.links?.image} fallback={icon} />
            </Card.Section>

            <Group justify="space-between" mt="md" mb="xs" wrap='nowrap'>
                <Group>
                    <Checkbox checked={isSelected}
                        onChange={e => onSelectChanged(e.currentTarget.checked)} />
                    <EditingStatusIcon editingStatus={poetry.status} width={24} style={{ color: theme.colors.dark[2] }} />
                    <Text component={Link} to={`/libraries/${libraryId}/poetry/${poetry.id}/contents/edit`} truncate="end" fw={500}>{poetry.title}</Text>
                </Group>

                <FavoriteButton poetry={poetry} readonly />
            </Group>

            <Group justify="space-between" mb="xs">
                <AuthorsAvatar libraryId={libraryId} authors={poetry?.authors} />
            </Group>
            <Group justify='center'>
                <IconText
                    icon={<IconReaderText height={16} style={{ color: theme.colors.dark[2] }} />}
                    tooltip={t('poetry.actions.read.title')}
                    link={`/libraries/${libraryId}/poetry/${poetry.id}/`} />
                <If condition={poetry.links.update}>
                    <Divider orientation="vertical" />
                    <PoetryAssignButton t={t} libraryId={libraryId}
                        articles={[poetry]} type="transparent" />
                    <Divider orientation="vertical" />
                    <PoetryEditForm libraryId={libraryId} article={poetry} >
                        <IconText
                            tooltip={t('actions.edit')}
                            icon={<IconEdit height={16} style={{ color: theme.colors.dark[2] }} />} />
                    </PoetryEditForm>
                </If>
                <If condition={poetry.links.delete != null}>
                    <>
                        <Divider orientation="vertical" />
                        <PoetryDeleteButton libraryId={libraryId} poetry={poetry} t={t} />
                    </>
                </If>
            </Group>
        </Card>
    )
}

PoetryCard.propTypes = {
    libraryId: PropTypes.string,
    t: PropTypes.any,
    isSelected: PropTypes.bool,
    onSelectChanged: PropTypes.func,
    poetry: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        type: PropTypes.string,
        isPublic: PropTypes.bool,
        authors: PropTypes.array,
        categories: PropTypes.array,
        status: PropTypes.string,
        links: PropTypes.shape({
            update: PropTypes.string,
            delete: PropTypes.string,
            image: PropTypes.string
        })
    })
};

export default PoetryCard