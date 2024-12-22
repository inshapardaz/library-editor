import PropTypes from 'prop-types';
import { Icon as IconifyIcon } from '@iconify-icon/react';
import IconNames from './IconNames';

//-------------------------------------

const iconTheme = {
    "tabler": {
        home: "home",
        library: "building-arch",
        libraryEdit: "home-edit",
        dictionary: "notebook",
        font: "typography",
        tools: "tools",
        moon: "moon",
        sun: "sun",
        settings: "settings",
        changePassword: "password",
        logout: "logout",
        search: "search",
        book: "book",
        books: "books",
        author: "user",
        authors: "users",
        writing: "blockquote",
        writings: "blockquote",
        poetry: "feather-filled",
        poetries: "feather-filled",
        category: "tag",
        categories: "tags",
        series: "stack-2",
        periodical: "news",
        periodicals: "news",
        layoutList: "layout-list",
        layoutGrid: "layout-grid",
        infoCircle: "info-circle",
        chevronUp: "chevron-up",
        chevronDown: "chevron-down",
        chevronLeft: "chevron-left",
        chevronRight: "chevron-right",
        world: "world",
        language: "language",
        copyright: "copyright",
        pages: "notes",
        publisher: "book-upload",
        chapters: "versions",
        arrowLeft: "arrow-left",
        calendar: "calendar",
        reloadAlert: "refresh-alert",
        x: "x",
        heart: "heart",
        heartFill: "heart-filled",
        alert: "alert-triangle",
        imageReader: "photo",
        textReader: "file-text",
        readerScrollView: "invoice",
        readerSinglePage: "file-text",
        readerDoublePage: "book",
        fullScreen: "arrows-maximize",
        exitFullScreen: "arrows-minimize",
        zoomIn: "zoom-in",
        zoomOut: "zoom-out",
        annually: 'calendar-due',
        quarterly: "calendar-month",
        monthly: "calendar-month",
        fornightly: "calendar-month-filled",
        weekly: "calendar-week",
        daily: "calendar",
        issues: "box-multiple",
        issue: "box-multiple",
        issueArticle: "align-box-left-middle",
        volumeNumber: "archive",
        issueNumber: "mist",
        sort: "arrows-sort",
        sortAscending: "sort-ascending",
        sortDescending: "sort-descending",
        name: "list-letters",
        type: "list-details",
        title: "list-letters",
        dateCreated: "list-letters",
        seriesIndex: "list-letters",
        filter: "filter",
        availableForTyping: "file",
        beingTyping: "keyboard",
        readyForProofRead: "circle-dashed-check",
        proofRead: "eyeglass-2",
        published: "circle-check",
        all: "filter-off",
        add: "circle-plus",
        editBook: "edit",
        deleteBook: "trash",
        tick: "check",
        edit: "edit",
        delete: "trash",
    }
};
//-------------------------------------

const currentIconTheme = "tabler";
const getIconName = (iconName) => `${currentIconTheme}:${iconTheme[currentIconTheme][iconName]}`
const getIcon = (name, props) => (<IconifyIcon icon={getIconName(name)}  {...props} />)
//-------------------------------------

export const IconHome = (props) => getIcon(IconNames.Home, props)
export const IconLibrary = (props) => getIcon(IconNames.Library, props)
export const IconLibraryEditor = (props) => getIcon(IconNames.LibraryEdit, props)
export const IconDictionary = (props) => getIcon(IconNames.Dictionary, props)
export const IconFont = (props) => getIcon(IconNames.Font, props)
export const IconTools = (props) => getIcon(IconNames.Tools, props)
export const IconMoon = (props) => getIcon(IconNames.Moon, props)
export const IconSun = (props) => getIcon(IconNames.Sun, props)
export const IconSettings = (props) => getIcon(IconNames.Settings, props)
export const IconChangePassword = (props) => getIcon(IconNames.ChangePassword, props)
export const IconLogout = (props) => getIcon(IconNames.Logout, props)
export const IconSearch = (props) => getIcon(IconNames.Search, props)
export const IconBook = (props) => getIcon(IconNames.Book, props)
export const IconBooks = (props) => getIcon(IconNames.Books, props)
export const IconAuthor = (props) => getIcon(IconNames.Author, props)
export const IconAuthors = (props) => getIcon(IconNames.Authors, props)
export const IconWriting = (props) => getIcon(IconNames.Writing, props)
export const IconWritings = (props) => getIcon(IconNames.Writings, props)
export const IconPoetry = (props) => getIcon(IconNames.Poetry, props)
export const IconPoetries = (props) => getIcon(IconNames.Poetries, props)
export const IconCategory = (props) => getIcon(IconNames.Category, props)
export const IconCategories = (props) => getIcon(IconNames.Categories, props)
export const IconSeries = (props) => getIcon(IconNames.Series, props)
export const IconPeriodical = (props) => getIcon(IconNames.Periodical, props)
export const IconPeriodicals = (props) => getIcon(IconNames.Periodical, props)
export const IconLayoutList = (props) => getIcon(IconNames.LayoutList, props)
export const IconLayoutGrid = (props) => getIcon(IconNames.LayoutGrid, props)
export const IconInfoCircle = (props) => getIcon(IconNames.InfoCircle, props)
export const IconChevronDown = (props) => getIcon(IconNames.ChevronDown, props)
export const IconChevronUp = (props) => getIcon(IconNames.ChevronUp, props)
export const IconWorld = (props) => getIcon(IconNames.World, props)
export const IconLanguage = (props) => getIcon(IconNames.Language, props)
export const IconCopyright = (props) => getIcon(IconNames.Copyright, props)
export const IconPages = (props) => getIcon(IconNames.Pages, props)
export const IconPublisher = (props) => getIcon(IconNames.Publisher, props)
export const IconChapters = (props) => getIcon(IconNames.Chapters, props)
export const IconArrowLeft = (props) => getIcon(IconNames.ArrowLeft, props)
export const IconCalendar = (props) => getIcon(IconNames.Calendar, props)
export const IconRefreshAlert = (props) => getIcon(IconNames.ReloadAlert, props)
export const IconArticle = (props) => getIcon(IconNames.Article, props)
export const IconX = (props) => getIcon(IconNames.X, props)
export const IconAlert = (props) => getIcon(IconNames.Alert, props)
export const IconFavorite = (props) => getIcon(IconNames.Heart, props)
export const IconFavoriteFill = (props) => getIcon(IconNames.HeartFill, props)
export const IconReaderImage = (props) => getIcon(IconNames.ImageReader, props)
export const IconReaderText = (props) => getIcon(IconNames.TextReader, props)
export const IconLeft = (props) => getIcon(IconNames.ChevronLeft, props)
export const IconRight = (props) => getIcon(IconNames.ChevronRight, props)
export const IconReaderViewScroll = (props) => getIcon(IconNames.ReaderScrollView, props)
export const IconReaderViewSinglePage = (props) => getIcon(IconNames.ReaderSinglePage, props)
export const IconReaderViewDoublePage = (props) => getIcon(IconNames.ReaderDoublePage, props)
export const IconFullScreen = (props) => getIcon(IconNames.FullScreen, props)
export const IconFullScreenExit = (props) => getIcon(IconNames.ExitFullScreen, props)
export const IconZoomIn = (props) => getIcon(IconNames.ZoomIn, props)
export const IconZoomOut = (props) => getIcon(IconNames.ZoomOut, props)
export const IconAnnually = (props) => getIcon(IconNames.Annually, props)
export const IconQuarterly = (props) => getIcon(IconNames.Quarterly, props)
export const IconMonthly = (props) => getIcon(IconNames.Monthly, props)
export const IconFornightly = (props) => getIcon(IconNames.Fornightly, props)
export const IconWeekly = (props) => getIcon(IconNames.Weekly, props)
export const IconDaily = (props) => getIcon(IconNames.Daily, props)
export const IconIssues = (props) => getIcon(IconNames.Issues, props)
export const IconIssue = (props) => getIcon(IconNames.Issue, props)
export const IconIssueArticle = (props) => getIcon(IconNames.IssueArticle, props)
export const IconVolumeNumber = (props) => getIcon(IconNames.VolumeNumber, props)
export const IconIssueNumber = (props) => getIcon(IconNames.IssueNumber, props)
export const IconSort = (props) => getIcon(IconNames.Sort, props)
export const IconSortAscending = (props) => getIcon(IconNames.SortAscending, props)
export const IconSortDescending = (props) => getIcon(IconNames.SortDescending, props)
export const IconName = (props) => getIcon(IconNames.Name, props)
export const IconType = (props) => getIcon(IconNames.Type, props)
export const IconTitle = (props) => getIcon(IconNames.Title, props)
export const IconDateCreated = (props) => getIcon(IconNames.DateCreated, props)
export const IconSeriesIndex = (props) => getIcon(IconNames.SeriesIndex, props)
export const IconFilter = (props) => getIcon(IconNames.Filter, props)
export const IconPublished = (props) => getIcon(IconNames.Published, props)
export const IconAvailableForTyping = (props) => getIcon(IconNames.AvailableForTyping, props)
export const IconBeingTyped = (props) => getIcon(IconNames.BeingTyped, props)
export const IconReadyForProofRead = (props) => getIcon(IconNames.ReadyForProofRead, props)
export const IconProofRead = (props) => getIcon(IconNames.ProofRead, props)
export const IconAll = (props) => getIcon(IconNames.All, props)
export const IconEditBook = (props) => getIcon(IconNames.EditBook, props)
export const IconDeleteBook = (props) => getIcon(IconNames.DeleteBook, props)
export const IconAdd = (props) => getIcon(IconNames.Add, props)
export const IconTick = (props) => getIcon(IconNames.Tick, props)
export const IconEdit = (props) => getIcon(IconNames.Edit, props)
export const IconDelete = (props) => getIcon(IconNames.Delete, props)

export const Icon = ({ name, ...rest }) => <IconifyIcon icon={getIconName(name)} {...rest} />

Icon.propTypes = {
    name: PropTypes.string,
    props: PropTypes.string
};
//-----------------------------------------------------
// Old Icons
export const IllustrationError = <svg width="184" height="152" viewBox="0 0 184 152" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><g transform="translate(24 31.67)"><ellipse fillOpacity=".8" fill="#F5F5F7" cx="67.797" cy="106.89" rx="67.797" ry="12.668"></ellipse><path d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z" fill="#AEB8C2"></path><path d="M101.537 86.214L80.63 61.102c-1.001-1.207-2.507-1.867-4.048-1.867H31.724c-1.54 0-3.047.66-4.048 1.867L6.769 86.214v13.792h94.768V86.214z" fill="url(#linearGradient-1)" transform="translate(13.56)"></path><path d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z" fill="#F5F5F7"></path><path d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z" fill="#DCE0E6"></path></g><path d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z" fill="#DCE0E6"></path><g transform="translate(149.65 15.383)" fill="#FFF"><ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815"></ellipse><path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z"></path></g></g></svg>