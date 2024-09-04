import React from 'react';
import { Link, useNavigate } from "react-router-dom";

// 3rd party libraries
import { Button, Card, Tooltip, Typography } from 'antd';

// Internal Imports
import './styles.scss';
import { FaEdit, ImLibrary } from "/src/icons";
import { libraryPlaceholderImage, setDefaultLibraryImage } from "/src/util";
import IconText from "/src/components/common/iconText";
import LibraryDeleteButton from "./libraryDeleteButton";
// ------------------------------------------------------

const { Text, Paragraph } = Typography;
// ---------------------------------


const LibraryCard = ({ library, t }) => {
    const navigate = useNavigate();
    const cover = library?.links?.image ? (<img src={library.links.image}
        onError={setDefaultLibraryImage}
        className="library__image"
        onClick={() => navigate(`/libraries/${library.id}`)}
        alt={library.name} />) :
        <ImLibrary size={128} className='library__icon'
            onClick={() => navigate(`/libraries/${library.id}`)} />;

    const description = library.description ? (
        <Paragraph ellipsis type="secondary">
            {library.description}
        </Paragraph>
    ) : null;

    let actions = [];

    if (library?.links?.update) {
        actions.push(<Tooltip title={t('actions.edit')}>
            <Button icon={<FaEdit />}
                key="library-edit"
                type="ghost"
                size="small"
                onClick={() => navigate(`/libraries/${library.id}/edit`)} />
        </Tooltip>)
    }

    if (library?.links?.delete) {
        actions.push(<LibraryDeleteButton
            key="deleteButton"
            library={library}
            t={t}
            type="ghost"
            size="small"
        />)
    }

    const title = (<div className='library__link' onClick={() => navigate(`/libraries/${library.id}`)}>{library.name}</div>);

    return (
        <Card
            cover={cover}
            hoverable
            actions={actions}
        >
            <Card.Meta title={title} description={description} />
        </Card>
    );
}


export default LibraryCard;
