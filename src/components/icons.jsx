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
        gripVertical: "grip-vertical",
        files: "files",
        assign: "user-bolt",
        upload: "file-upload",
        busy: "hourglass-empty",
        done: "circle-check",
        failed: "circle-x",
        loading: "loader-2",
        error: "exclamation-circle",
        writer: "user-edit",
        reviewer: "user-check",
        status: "status-change",
        image: "photo",
        user: "user",
        assignAll: "users-group",
        assignMe: "user-filled",
        assignAssigned: "users",
        assignUnassigned: "user-off",
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
export const IconImage = (props) => getIcon(IconNames.Image, props)
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
export const IconGripVertical = (props) => getIcon(IconNames.GripVertical, props)
export const IconFiles = (props) => getIcon(IconNames.Files, props)
export const IconAssign = (props) => getIcon(IconNames.Assign, props)
export const IconUpload = (props) => getIcon(IconNames.Upload, props)
export const IconBusy = (props) => getIcon(IconNames.Busy, props)
export const IconDone = (props) => getIcon(IconNames.Done, props)
export const IconFailed = (props) => getIcon(IconNames.Failed, props)
export const IconLoading = (props) => getIcon(IconNames.Loading, props)
export const IconError = (props) => getIcon(IconNames.Error, props)
export const IconWriter = (props) => getIcon(IconNames.Writer, props)
export const IconReviewer = (props) => getIcon(IconNames.Reviewer, props)
export const IconStatus = (props) => getIcon(IconNames.Status, props)
export const IconUser = (props) => getIcon(IconNames.User, props)
export const IconAssignAll = (props) => getIcon(IconNames.AssignAll, props)
export const IconAssignMe = (props) => getIcon(IconNames.AssignMe, props)
export const IconAssignAssigned = (props) => getIcon(IconNames.AssignAssigned, props)
export const IconAssignUnassigned = (props) => getIcon(IconNames.AssignUnassigned, props)

export const Icon = ({ name, ...rest }) => <IconifyIcon icon={getIconName(name)} {...rest} />

Icon.propTypes = {
    name: PropTypes.string,
    props: PropTypes.string
};