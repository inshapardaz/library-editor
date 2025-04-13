import PropTypes from 'prop-types';

// Ui Library Imports
import { Divider, Group, Stack, Text, useMantineTheme } from '@mantine/core';

// Local import
import { IconAutoCorrect, IconLanguage, IconCompleteWord } from '@/components/icons';
import If from '@/components/if';
import IconText from '@/components/iconText';
import CorrectionEditButton from './correctionEditButton';
import CorrectionDeleteButton from './correctionDeleteButton';

// Local Imports
//-------------------------------------

const CorrectionListItem = ({ correction, t }) => {
    const theme = useMantineTheme();
    return (<>
        <Group gap="sm" wrap="nowrap">
            <IconAutoCorrect height={32} style={{ color: theme.colors.dark[2] }} />
            <Stack>
                <Group gap="sm" wrap="nowrap">
                    <Text truncate="end" fw={500}>{correction.incorrectText}</Text>
                    <Text truncate="end" fw={500}>{correction.correctText}</Text>
                </Group>
                <Group gap="sm" wrap="nowrap">
                    <IconText size="sm" icon={<IconLanguage height={24} style={{ color: theme.colors.dark[2] }} />} text={t(`languages.${correction.language}`)} />
                    <If condition={correction.completeWord}>
                        <Divider orientation='vertical' />
                        <IconText size="sm" icon={<IconCompleteWord height={24} style={{ color: theme.colors.dark[2] }} />} text={t('corrections.completeWord.title')} />
                    </If>
                </Group>

            </Stack>
            <span style={{ flex: 1 }} />
            <CorrectionEditButton t={t}
                variant="transparent"
                color="gray"
                profile={correction.profile}
                correction={correction}
            />
            <CorrectionDeleteButton correction={correction} t={t} />
        </Group>
        <Divider />
    </>)
}

CorrectionListItem.propTypes = {
    t: PropTypes.any,
    correction: PropTypes.shape({
        id: PropTypes.number,
        language: PropTypes.string,
        profile: PropTypes.string,
        incorrectText: PropTypes.string,
        correctText: PropTypes.string,
        completeWord: PropTypes.bool,
        links: PropTypes.shape({
            image: PropTypes.string,
            update: PropTypes.string,
            delete: PropTypes.string
        })
    })
}

export default CorrectionListItem;