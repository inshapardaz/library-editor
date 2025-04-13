import PropTypes from 'prop-types';

// Ui Library Imports

// Local Import
import ScrollReader from './scrollReader';
import FlipBookReader from './flipBookReader';
//---------------------------------

const MarkdownReader = ({ markdown, title, subTitle, canGoNext, onNext, canGoPrevious, onPrevious, viewType = "scroll", layout = 'normal', showNavigation = true }) => {
    if (viewType === 'scroll') {
        return (<ScrollReader markdown={markdown}
            title={subTitle}
            layout={layout}
            showNavigation={showNavigation}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
            onNext={onNext}
            onPrevious={onPrevious}
        />)
    } else if (viewType === 'singlePage' || viewType === 'doublePage') {
        return (<FlipBookReader markdown={markdown}
            title={title}
            subTitle={subTitle}
            layout={layout}
            pagesToShow={viewType === 'doublePage' ? 2 : 1}
            showNavigation={showNavigation}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
            onNext={onNext}
            onPrevious={onPrevious}
        />)
    }

    return null;
}

MarkdownReader.propTypes = {
    title: PropTypes.string,
    subTitle: PropTypes.string,
    markdown: PropTypes.string,
    viewType: PropTypes.string,
    layout: PropTypes.string,
    height: PropTypes.any,
    showNavigation: PropTypes.bool,
    canGoNext: PropTypes.bool,
    onNext: PropTypes.func,
    canGoPrevious: PropTypes.bool,
    onPrevious: PropTypes.func
}

export default MarkdownReader;