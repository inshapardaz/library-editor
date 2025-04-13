import PropTypes from 'prop-types';

// Ui Library Imports
import { Divider, Group, Stack, Text, useMantineTheme } from '@mantine/core';

// Local import
import { IconAutoCorrect } from '@/components/icons';
import CommonWordEditButton from './commonWordEditButton';
import CommonWordDeleteButton from './commonWordDeleteButton';

// Local Imports
//-------------------------------------

const CommonWordListItem = ({ word, t }) => {
    const theme = useMantineTheme();
    return (<>
        <Group gap="sm" wrap="nowrap">
            <IconAutoCorrect height={32} style={{ color: theme.colors.dark[2] }} />
            <Stack>
                <Group gap="sm" wrap="nowrap">
                    <Text truncate="end" fw={500}>{word.word}</Text>
                </Group>
            </Stack>
            <span style={{ flex: 1 }} />
            <CommonWordEditButton t={t}
                variant="transparent"
                color="gray"
                word={word}
            />
            <CommonWordDeleteButton word={word} t={t} />
        </Group>
        <Divider />
    </>)
}

CommonWordListItem.propTypes = {
    t: PropTypes.any,
    word: PropTypes.shape({
        id: PropTypes.number,
        language: PropTypes.string,
        word: PropTypes.string,
        links: PropTypes.shape({
            update: PropTypes.string,
            delete: PropTypes.string
        })
    })
}

export default CommonWordListItem;