import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

// 3rd party libraries
import { Button, FloatButton, Skeleton } from 'antd';
import ReactMarkdown from 'react-markdown'

// Local Imports
import styles from '../../styles/reader.module.scss'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'
import useKeyPress from '../../helpers/useKeyPress'
//------------------------------------------------

function calculatePageWidth(ref) {
    if (!ref.current) return 0;

    if (ref.current.offsetWidth > 533) {
        return ref.current.offsetWidth + 24;
    }
    else {
        return ref.current.offsetWidth + 44
    }
}

function calculatePageProgress(searchParams) {
    if (searchParams && searchParams.get('p')) {
        let p = parseInt(searchParams.get('p'))
        if (p > 0) return p
    }

    return 0
}

//------------------------------------------------

const Reader = ({ bookTitle, chapterTitle, contents, loading, mode, font, size, lineHeight, direction = 'ltr', hasPreviousChapter = false, onPreviousChapter = () => { }, hasNextChapter = false, onNextChapter = () => { } }) => {
    const [searchParams] = useSearchParams()
    const location = useLocation()
    const navigate = useNavigate()

    const ref = useRef(null);
    const refContents = useRef(null);
    const progress = calculatePageProgress(searchParams)
    const pageWidth = calculatePageWidth(ref)
    const contentWidth = refContents.current ? refContents.current.scrollWidth : 0;
    const pageCount = Math.ceil(contentWidth > 0 ? contentWidth / pageWidth : 0);

    const setProgressInUrl = useCallback((newProgress) => {
        navigate(`${location.pathname}?p=${newProgress}`);
    }, [location.pathname, navigate])

    const canGoPrevious = useCallback(() => {
        if (mode === 'vertical') return false;
        return progress > 0 || hasPreviousChapter;

    }, [hasPreviousChapter, mode, progress])

    const onPrevious = useCallback(() => {
        if (progress <= 0 && hasPreviousChapter)
        {
            onPreviousChapter()
            return true;
        }

        if (!canGoPrevious()) return false;

        setProgressInUrl(progress - 1)
        return true;
    }, [canGoPrevious, hasPreviousChapter, onPreviousChapter, progress, setProgressInUrl])

    const canGoNext = useCallback(() => {
        if (mode === 'vertical') return false;
        return progress < pageCount - 1 || hasNextChapter;
    }, [hasNextChapter, mode, pageCount, progress])

    const onNext = useCallback(() => {
        if (progress >= pageCount - 1 && hasNextChapter)
        {
            onNextChapter()
            return true;
        }

        if (!canGoNext()) return false;

        setProgressInUrl(progress + 1)

        return true;
    }, [canGoNext, hasNextChapter, onNextChapter, pageCount, progress, setProgressInUrl])

    // Keyboard Navigation
    const leftPressed = useKeyPress('ArrowLeft');
    const rightPressed = useKeyPress('ArrowRight');

    useEffect(() => {
        if (leftPressed) {
            if (direction === 'rtl') {
                onNext();
            } else {
                onPrevious();
            }
        }
    }, [direction, leftPressed, onNext, onPrevious]);

    useEffect(() => {
        if (rightPressed) {
            if (direction === 'rtl') {
                onPrevious();
            } else {
                onNext();
            }
        }
    }, [direction, onNext, onPrevious, rightPressed]);

    // Touch navigation
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (touchStart - touchEnd > 100) {
            onPrevious();
        }

        if (touchStart - touchEnd < -100) {
            onNext();
        }
    };


    const left =  `${pageWidth * progress }px`;

    const className = `${styles.reader} ${styles[mode]}`

    const previousButton = canGoPrevious() ? (<Button className={`${styles['reader__nav']} ${styles['reader__page-number--previous']}`} data-ft="nextButton" shape="circle" icon={<MdChevronRight />} onClick={onPrevious} />) : null
    const nextButton = canGoNext() ? (<Button className={`${styles['reader__nav']} ${styles['reader__page-number--next']}`} data-ft="previousButton" shape="circle" icon={<MdChevronLeft />} onClick={onNext} />) : null

    return (
    <div className={className} data-ft="reader-layout">
        {previousButton}
            <div className={styles[`reader__container`]} ref={ref} data-ft="reader-container" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
            { mode === 'singlePage' && <div className={styles[`reader__title`]}>{ bookTitle }</div> }
            {mode === 'flipBook' && (<div className={styles[`reader__title`]}>
                    <div className={styles[`reader__title--book`]}>{ bookTitle }</div>
                    <div className={styles[`reader__title--chapter`]}>{ chapterTitle }</div>
                </div>)}
            <div className={styles[`reader__page`]} style={{ left: left }}>
                    <div className={styles[`reader__contents`]} ref={refContents} style={{ fontFamily: font, fontSize: size, lineHeight: lineHeight }}>
                        { loading ? <Skeleton /> : <ReactMarkdown children={contents} />}
                </div>
            </div>
            { mode === 'singlePage' && <div className={styles[`reader__page-number`]}>{progress + 1} / { pageCount }</div> }
            {mode === 'flipBook' && (<div className={styles[`reader__page-number`]}>
                    <div className={styles[`reader__page-number--first`]}>{ (progress * 2) + 1 }</div>
                    <div className={styles[`reader__page-number--second`]}>{ (progress * 2) + 2 }</div>
                </div>)}
        </div>
        {nextButton}
        <FloatButton.BackTop />
    </div>)

}

export default Reader

