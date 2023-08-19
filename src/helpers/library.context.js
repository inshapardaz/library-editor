import { useParams } from "react-router-dom";

// Local Imports
import { useGetLibrariesQuery } from '../features/api/librariesSlice'
import { useGetCategoriesQuery } from '../features/api/categoriesSlice'

// ----------------------------------------------

const LibraryProvider = ({children}) => {
    const { libraryId } = useParams()
    useGetLibrariesQuery({})
    useGetCategoriesQuery({libraryId}, { skip: !libraryId})

    return children;
}

export default LibraryProvider;
