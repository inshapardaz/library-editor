import React from 'react';
import { Link, useNavigate } from "react-router-dom";

// 3rd party libraries
import { Card, Typography } from 'antd';

// Internal Imports
import './styles.scss';
import { FaEdit } from "/src/icons";
import { libraryPlaceholderImage, setDefaultLibraryImage } from "/src/util";
import IconText from "/src/components/common/iconText";
import LibraryDeleteButton from "./libraryDeleteButton";
// ------------------------------------------------------

const { Text, Paragraph } = Typography;
// ---------------------------------


const LibraryCard = ({ library, t }) => {
    const navigate = useNavigate();
    const cover = <img src={library.links.image || libraryPlaceholderImage} onError={setDefaultLibraryImage} className="library__image" alt={library.name} />;
    const description = library.description ? (
        <Paragraph ellipsis type="secondary">
            {library.description}
        </Paragraph>
    ) : (
        <Text type="secondary">{t("library.noDescription")}</Text>
    );

    const editLink = (<IconText icon={FaEdit} key="library-edit"
        href={`/libraries/${library.id}/edit`} />
    );


    return (
        <Card
            cover={cover}
            hoverable
            actions={[
                editLink,
                <LibraryDeleteButton
                    key="deleteButton"
                    library={library}
                    t={t}
                    type="ghost"
                    size="small"
                    onClick={() => navigate(`/libraries/${library.id}`)}
                />,
            ]}
        >
            <Link to={`/libraries/${library.id}`} key="link">
                <Card.Meta title={library.name} description={description} />
            </Link>
        </Card>
    );
}


export default LibraryCard;
