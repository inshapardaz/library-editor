import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

// UI Library Import
import { ActionIcon, Center, Loader, LoadingOverlay, useDirection, useMantineColorScheme } from '@mantine/core';
import { useElementSize, useHotkeys, useViewportSize } from '@mantine/hooks';

// Local imports
import Error from '@/components/error';
import { IconLeft, IconRight } from '@/components/icon';
import If from '@/components/if';
import classes from './imageReader.module.css';
import useTouchSlide from '@/hooks/useTouchSlide';
//---------------------------------

const ImageReader = ({ page1, page2, onNext, onPrevious, onReload, isLoading, isError, direction, zoom }) => {
    const { t } = useTranslation();
    const { dir } = useDirection();
    const { colorScheme } = useMantineColorScheme();

    const finalDirection = useMemo(() => direction ? direction : dir, [dir, direction]);

    const [numberOfPages, setNumberOfPages] = useState(2);
    const { ref, height } = useElementSize();
    const { width } = useViewportSize();

    useEffect(() => {
        setNumberOfPages(width > 1000 ? 2 : 1)
    }, [width]);

    const hasNextPage = useMemo(() => numberOfPages == 2 ? page2?.links?.next != null : page1?.links?.next != null, [numberOfPages, page1?.links?.next, page2?.links?.next]);

    const onNavigateLeft = () => {
        finalDirection == "rtl" ? onNext({ numberOfPages }) : onPrevious({ numberOfPages })
    }

    const onNavigateRight = () => {
        finalDirection == "rtl" ? onPrevious({ numberOfPages }) : onNext({ numberOfPages })
    }

    useTouchSlide({
        ref,
        onSlideLeft: onNavigateLeft,
        onSlideRight: onNavigateRight
    });

    useHotkeys([
        ['ArrowLeft', onNavigateLeft],
        ['ArrowRight', onNavigateRight],
    ]);

    if (isLoading) {
        return <Center h={height}><Loader /></Center>
    }

    if (isError) {
        <Error title={t('book.error.loadingPage.title')}
            detail={t('book.error.loadingPage.detail')}
            onRetry={onReload} />
    }

    const hasPreviousPage = page1?.links?.previous != null;

    return <div className={classes.imageReader} ref={ref}>
        <div className={classes.imageReaderNavNextButton}>
            <ActionIcon disabled={!hasPreviousPage} loading={isLoading} size="xl" variant="default" onClick={() => onPrevious({ numberOfPages })}>
                {finalDirection == "rtl" ?
                    <IconRight />
                    :
                    <IconLeft />
                }
            </ActionIcon>
        </div>

        <div className={`${classes.imageReaderPagesContainer} ${numberOfPages == 2 ? classes.imageReaderPagesContainerDouble : classes.imageReaderPagesContainerSingle}`}>
            <LoadingOverlay visible={isLoading} />
            <img className={classes.imageReaderPageImage} src={page1?.links?.image} draggable='false' style={{ height: `calc(-154px + ${zoom}px + 100vh)`, filter: `invert(${colorScheme === 'dark' ? '90%' : '0'})` }} />
            <If condition={numberOfPages == 2 && page2}>
                <img className={classes.imageReaderPageImage} src={page2?.links?.image} draggable='false' style={{ height: `calc(-154px + ${zoom}px + 100vh)`, filter: `invert(${colorScheme === 'dark' ? '90%' : '0'})` }} />
            </If>
        </div>
        <div className={classes.imageReaderNavPrevButton}>
            <ActionIcon size="xl" disabled={!hasNextPage} loading={isLoading} variant="default" onClick={() => onNext({ numberOfPages })}>
                {finalDirection == "rtl" ?
                    <IconLeft />
                    :
                    <IconRight />
                }
            </ActionIcon>
        </div>
    </div >
}

ImageReader.propTypes = {
    page1: PropTypes.any,
    page2: PropTypes.any,
    onNext: PropTypes.func,
    onPrevious: PropTypes.func,
    onReload: PropTypes.func,
    isLoading: PropTypes.bool,
    isError: PropTypes.bool,
    direction: PropTypes.string,
    zoom: PropTypes.number
}
export default ImageReader;