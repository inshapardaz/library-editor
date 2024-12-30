import PropTypes from 'prop-types';
import { useTranslation } from "react-i18next";

// UI Library Imports
import { Box, Button, rem, Stack, Text, Title, useMantineTheme } from "@mantine/core"

// Local imnports
import { IconAlert, IconRefreshAlert } from "@/components/icons";

//----------------------------------

const Error = ({ title, detail, onRetry }) => {
    const { t } = useTranslation();
    const theme = useMantineTheme();

    return (<Box h={rem(450)}>
        <Stack justify="center" align="center">
            <IconAlert height={rem(192)} style={{ color: theme.colors.gray[4] }} />
            {title && <Title>{title}</Title>}
            {detail && <Text c="dimmed" ta="center">{detail}</Text>}
            <Button variant='outline' color="gray.6" rightSection={<IconRefreshAlert />} onClick={onRetry}>{t('actions.retry')}</Button>
        </Stack>
    </Box>)
}

Error.propTypes = {
    title: PropTypes.string,
    detail: PropTypes.string,
    onRetry: PropTypes.func,
}
export default Error;