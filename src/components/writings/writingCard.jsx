import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Ui Library import
import { Card, Text, Group, useMantineTheme, Center, Divider, rem } from '@mantine/core';

// Local imports
import { IconWriting, IconEdit, IconReaderText } from '@/components/icons';
import AuthorsAvatar from '@/components/authors/authorsAvatar';
import FavoriteButton from './favoriteButton';
import IconText from '@/components/iconText';
import If from '@/components/if';
import Img from '@/components/img';
import WritingDeleteButton from './writingDeleteButton';
//---------------------------------------
const IMAGE_HEIGHT = 450;

const WritingCard = ({ libraryId, writing, t }) => {
    const theme = useMantineTheme();

    const icon = <Center h={IMAGE_HEIGHT}><IconWriting width={rem(150)} style={{ color: theme.colors.dark[1] }} /></Center>;

    return (
        <Card shadow="sm" padding="lg" radius="md" key={writing.id} withBorder>
            <Card.Section>
                <Img h={IMAGE_HEIGHT} radius="sm" src={writing?.links?.image} fallback={icon} />
            </Card.Section>

            <Group justify="space-between" mt="md" mb="xs">
                <Text component={Link} to={`/libraries/${libraryId}/writings/${writing.id}/contents/edit`} truncate="end" fw={500}>{writing.title}</Text>
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
                        <IconText
                            tooltip={t('actions.edit')}
                            link={`/libraries/${libraryId}/writings/${writing.id}/edit`}
                            icon={<IconEdit height={16} style={{ color: theme.colors.dark[2] }} />} />
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
    writing: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        description: PropTypes.string,
        authors: PropTypes.array,
        pageCount: PropTypes.number,
        chapterCount: PropTypes.number,
        links: PropTypes.shape({
            update: PropTypes.string,
            delete: PropTypes.string,
            image: PropTypes.string
        })
    })
};

export default WritingCard