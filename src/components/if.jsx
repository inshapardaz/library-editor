import PropTypes from 'prop-types';

const If = ({ condition, elseChildren = null, children }) => {
    if (condition) {
        return children;
    }

    return elseChildren;
}

If.propTypes = {
    condition: PropTypes.any,
    elseChildren: PropTypes.any,
    children: PropTypes.any
}

export default If;