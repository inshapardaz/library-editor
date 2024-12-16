import PropTypes from 'prop-types';
import { useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Markdown from 'react-markdown'

// Ui Library Imports
import { useInViewport, useHotkeys, useViewportSize, useElementSize } from '@mantine/hooks';
import { ActionIcon, useDirection } from '@mantine/core';

// Local Import
import useTouchSlide from '@/hooks/useTouchSlide';
import classes from './flipBook.module.css'
import { IconLeft, IconRight } from '@/components/icon';
import If from '@/components/if';
//---------------------------------

const FlipBookReader = ({ markdown, canGoNext, onNext, canGoPrevious, onPrevious, showNavigation = true, pagesToShow = 1, direction }) => {
    const readerFont = useSelector(state => state.ui.readerFont);
    const readerFontSize = useSelector(state => state.ui.readerFontSize);
    const readerLineHeight = useSelector(state => state.ui.readerLineHeight);
    const { dir } = useDirection();
    const finalDirection = useMemo(() => direction ? direction : dir, [dir, direction]);

    const { ref, inViewport } = useInViewport();
    const { width } = useViewportSize();
    const { ref: pageRef, width: pageWidth } = useElementSize();
    const [page, setPage] = useState(1);

    const pages = useMemo(() => width < 1440 ? 1 : pagesToShow, [pagesToShow, width]);
    const containerClass = useMemo(() => pages === 2 ? classes.readerContainerDouble : classes.readerContainerSingle, [pages]);
    const readerLayoutClass = useMemo(() => pages === 2 ? classes.flipBookReaderDouble : classes.flipBookReaderSingle, [pages]);

    const left = useMemo(() => {
        return (page - 1) * (pageWidth + 64);
    }, [page, pageWidth]);

    const canGoNextPage = useMemo(() => !inViewport, [inViewport]);
    const canGoPreviousPage = useMemo(() => page > 1, [page]);

    const onNextPage = () => {
        if (canGoNextPage) {
            setPage(p => p + 1)
        } else if (canGoNext) {
            onNext();
        }
    }

    const onPreviousPage = () => {
        if (canGoPreviousPage) {
            setPage(p => p - 1)
        } else if (canGoPrevious) {
            onPrevious();
        }
    }

    const onNavigateLeft = () => {
        finalDirection == "rtl" ? onNextPage() : onPreviousPage()
    }

    const onNavigateRight = () => {
        finalDirection == "rtl" ? onPreviousPage() : onNextPage()
    }

    const dragRef = useRef(null);
    useTouchSlide({
        ref: dragRef,
        onSlideLeft: onNavigateLeft,
        onSlideRight: onNavigateRight
    });


    useHotkeys([
        ['ArrowLeft', onNavigateLeft],
        ['ArrowRight', onNavigateRight]
    ]);

    return (
        <div className={classes.container}>
            <If condition={showNavigation}>
                <div className={classes.navButton}>
                    <ActionIcon
                        visibleFrom="md"
                        variant='default'
                        size="lg"
                        onClick={onPreviousPage}
                        disabled={!canGoPreviousPage && !canGoPrevious}>
                        {finalDirection == "rtl" ?
                            <IconRight />
                            :
                            <IconLeft />
                        }
                    </ActionIcon>
                </div>
            </If>
            <div className={`${classes.flipBookReader} ${readerLayoutClass}`}
                ref={dragRef}
                style={{
                    fontFamily: readerFont,
                    fontSize: readerFontSize,
                    lineHeight: `${readerLineHeight}em`
                }}>
                <div className={`${classes.readerContainer} ${containerClass}`}
                    style={{ left: `${left}px` }}
                    ref={pageRef}
                >
                    <Markdown>{markdown}</Markdown>
                    <span ref={ref} />
                </div>
            </div>
            <If condition={showNavigation}>
                <div className={classes.navButton}>
                    <ActionIcon
                        visibleFrom="md"
                        variant='default'
                        size="lg"
                        onClick={onNextPage}
                        disabled={!canGoNextPage && !canGoNext}>
                        {finalDirection == "rtl" ?
                            <IconLeft />
                            :
                            <IconRight />
                        }
                    </ActionIcon>
                </div>
            </If>
        </div>)
}

FlipBookReader.propTypes = {
    markdown: PropTypes.string,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    layout: PropTypes.string,
    showNavigation: PropTypes.bool,
    canGoNext: PropTypes.bool,
    onNext: PropTypes.func,
    canGoPrevious: PropTypes.bool,
    onPrevious: PropTypes.func,
    pagesToShow: PropTypes.number,
    direction: PropTypes.string
}

export default FlipBookReader;