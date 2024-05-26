import React from 'react';
import { useTranslation } from 'react-i18next';

// Local import
import Logo from "/src/components/layout/logo";
import './styles.scss';
// ----------------------------------------------

const FullPageFormContainer = ({ title, children }) => {
    const { t } = useTranslation()

    return (<div className="fullPage_layout">
        <div className="fullPage_layout__image"></div>
        <div className="fullPage_layout__form">
            <div className="fullPage_layout__logo">
                <Logo height={40} width={40} />
            </div>
            <span className="fullPage_layout__title">{title}</span>
            {children}
        </div>
    </div>)
};

export default FullPageFormContainer;
