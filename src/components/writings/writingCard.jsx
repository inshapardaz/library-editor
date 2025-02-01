import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Ui Library import
import { Card, Text, Group, useMantineTheme, Center, Divider, rem, Checkbox } from '@mantine/core';

// Local imports
import { IconWriting, IconEdit, IconReaderText } from '@/components/icons';
import AuthorsAvatar from '@/components/authors/authorsAvatar';
import FavoriteButton from './favoriteButton';
import IconText from '@/components/iconText';
import If from '@/components/if';
import Img from '@/components/img';
import WritingDeleteButton from './writingDeleteButton';
import WritingEditForm from './writingEditForm';
import WritingAssignButton from './writingAssignButton';
import EditingStatusIcon from '@/components/editingStatusIcon';
//---------------------------------------
const IMAGE_HEIGHT = 450;

const WritingCard = ({ libraryId, writing, t, isSelected = false, onSelectChanged = () => { } }) => {
    const theme = useMantineTheme();

    const icon = <Center h={IMAGE_HEIGHT}><IconWriting width={rem(150)} style={{ color: theme.colors.dark[1] }} /></Center>;

    return (
        <Card shadow="sm" padding="lg" radius="md" key={writing.id} withBorder>
            <Card.Section>
                <Img h={IMAGE_HEIGHT} radius="sm" src={writing?.links?.image} fallback={icon} />
            </Card.Section>

            <Group justify="space-between" mt="md" mb="xs">
                <Group>
                    <Checkbox checked={isSelected}
                        onChange={e => onSelectChanged(e.currentTarget.checked)} />
                    <EditingStatusIcon editingStatus={writing.status} width={24} style={{ color: theme.colors.dark[2] }} />
                    <Text component={Link} to={`/libraries/${libraryId}/writings/${writing.id}/contents/edit`} truncate="end" fw={500}>{writing.title}</Text>
                </Group>
                <FavoriteButton article={writing} readonly />
            </Group>

            <Group justify="space-between" mt="md" mb="xs">
                <AuthorsAvatar libraryId={libraryId} authors={writing?.authors} />
            </Group>
            <Group justify='center'>
                <IconText
                    icon={<IconReaderText height={16} style={{ color: theme.colors.dark[2] }} />}
                    tooltip={t('writing.actions.read.title')}
                    link={`/libraries/${libraryId}/writings/${writing.id}/`} />
                <If condition={writing.links.update}>
                    <>
                        <Divider orientation="vertical" />
                        <WritingAssignButton t={t} libraryId={libraryId}
                            articles={[writing]} type="transparent" />
                        <Divider orientation="vertical" />
                        <WritingEditForm libraryId={libraryId} article={writing} >
                            <IconText
                                tooltip={t('actions.edit')}
                                icon={<IconEdit height={16} style={{ color: theme.colors.dark[2] }} />} />
                        </WritingEditForm>
                    </>
                </If>
                <If condition={writing.links.delete != null}>
                    <>
                        <Divider orientation="vertical" />
                        <WritingDeleteButton libraryId={libraryId} writing={writing} t={t} />
                    </>
                </If>
            </Group>
        </Card >
    )
}

WritingCard.propTypes = {
    libraryId: PropTypes.string,
    t: PropTypes.any,
    isSelected: PropTypes.bool,
    onSelectChanged: PropTypes.func,
    writing: PropTypes.shape({
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

export default WritingCard