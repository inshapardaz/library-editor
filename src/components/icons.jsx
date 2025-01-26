import PropTypes from 'prop-types';
import { Icon as IconifyIcon } from '@iconify-icon/react';
import IconNames from './iconNames';

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
        pages: "file-text",
        page: "file-text",
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
        file: "file",
        assign: "user-bolt",
        upload: "file-upload",
        busy: "hourglass-empty",
        done: "check",
        failed: "circle-x",
        success: "circle-check",
        warning: "alert-triangle",
        info: "info-circle",
        loading: "loader-2",
        error: "exclamation-circle",
        writer: "user-edit",
        reviewer: "user-check",
        status: "status-change",
        image: "photo",
        noImage: "photo-off",
        user: "user",
        assignAll: "users-group",
        assignMe: "user-filled",
        assignAssigned: "users",
        assignUnassigned: "user-off",
        uplaodDocument: "file-upload",
        uploadAccept: "upload",
        uploadReject: "x",
        filePdf: "file-type-pdf",
        fileWord: "file-word",
        downloadDocument: "file-download",
        processDocument: "file-settings",
        save: "device-floppy",
        undo: "rotate",
        redo: "rotate-clockwise",
        h1: "h-1",
        h2: "h-2",
        h3: "h-3",
        h4: "h-4",
        h5: "h-5",
        h6: "h-6",
        listBullet: "list",
        listNumbers: "list-numbers",
        paragraph: "mist",
        quote: "quote",
        code: "code",
        alignLeft: "align-left",
        alignRight: "align-right",
        alignJustified: "align-justified",
        alignCenter: "align-center",
        bold: "bold",
        italic: "italic",
        underline: "underline",
        strikethrough: "strikethrough",
        subScript: "subscript",
        superScript: "superscript",
        fontSize: "text-size",
        link: "link",
        upperCase: "letter-case-upper",
        lowerCase: "letter-case-lower",
        capitalize: "letter-case",
        spellCheck: "text-spellcheck",
        autoCorrect: "file-text-ai",
        punctuation: "message-language",
        completeWord: "alphabet-latin",
        ocrDocument: "eye-cog",
        settingApplyDown: "settings-down",
        settingApplyAll: "settings-check",
        splitVertical: "minus-vertical",
        help: "help"
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
export const IconPage = (props) => getIcon(IconNames.Page, props)
export const IconImage = (props) => getIcon(IconNames.Image, props)
export const IconNoImage = (props) => getIcon(IconNames.NoImage, props)
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
export const IconSuccess = (props) => getIcon(IconNames.Success, props)
export const IconWarning = (props) => getIcon(IconNames.Warning, props)
export const IconInfo = (props) => getIcon(IconNames.Info, props)
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
export const IconDownloadDocument = (props) => getIcon(IconNames.DownloadDocument, props)
export const IconUplaodDocument = (props) => getIcon(IconNames.UplaodDocument, props)
export const IconUploadAccept = (props) => getIcon(IconNames.UploadAccept, props)
export const IconUploadReject = (props) => getIcon(IconNames.UploadReject, props)
export const IconProcessDocument = (props) => getIcon(IconNames.ProcessDocument, props)
export const IconOcrDocument = (props) => getIcon(IconNames.OcrDocument, props)

//Editor
export const IconSave = (props) => getIcon(IconNames.Save, props)
export const IconUndo = (props) => getIcon(IconNames.Undo, props)
export const IconRedo = (props) => getIcon(IconNames.Redo, props)
export const IconH1 = (props) => getIcon(IconNames.H1, props)
export const IconH2 = (props) => getIcon(IconNames.H2, props)
export const IconH3 = (props) => getIcon(IconNames.H3, props)
export const IconH4 = (props) => getIcon(IconNames.H4, props)
export const IconH5 = (props) => getIcon(IconNames.H5, props)
export const IconH6 = (props) => getIcon(IconNames.H6, props)
export const IconListBullet = (props) => getIcon(IconNames.ListBullet, props)
export const IconListNumber = (props) => getIcon(IconNames.ListNumbers, props)
export const IconParagraph = (props) => getIcon(IconNames.Paragraph, props)
export const IconQuote = (props) => getIcon(IconNames.Quote, props)
export const IconCode = (props) => getIcon(IconNames.Code, props)
export const IconAlignLeft = (props) => getIcon(IconNames.AlignLeft, props)
export const IconAlignRight = (props) => getIcon(IconNames.AlignRight, props)
export const IconAlignJustified = (props) => getIcon(IconNames.AlignJustified, props)
export const IconAlignCenter = (props) => getIcon(IconNames.AlignCenter, props)

export const IconBold = (props) => getIcon(IconNames.Bold, props)
export const IconItalic = (props) => getIcon(IconNames.Italic, props)
export const IconUnderline = (props) => getIcon(IconNames.Underline, props)
export const IconStrikethrough = (props) => getIcon(IconNames.Strikethrough, props)
export const IconSubScript = (props) => getIcon(IconNames.SubScript, props)
export const IconSuperScript = (props) => getIcon(IconNames.SuperScript, props)
export const IconFontSize = (props) => getIcon(IconNames.FontSize, props)
export const IconLink = (props) => getIcon(IconNames.Link, props)

export const IconUpperCase = (props) => getIcon(IconNames.LowerCase, props)
export const IconLowerCase = (props) => getIcon(IconNames.UpperCase, props)
export const IconCapitalize = (props) => getIcon(IconNames.Capitalize, props)
export const IconSpellCheck = (props) => getIcon(IconNames.SpellCheck, props)
export const IconAutoCorrect = (props) => getIcon(IconNames.AutoCorrect, props)
export const IconPunctuation = (props) => getIcon(IconNames.Punctuation, props)
export const IconCompleteWord = (props) => getIcon(IconNames.CompleteWord, props)

export const IconSettingApplyDown = (props) => getIcon(IconNames.SettingApplyDown, props)
export const IconSettingApplyAll = (props) => getIcon(IconNames.SettingApplyAll, props)
export const IconSplitVertical = (props) => getIcon(IconNames.SplitVertical, props)
export const IconHelp = (props) => getIcon(IconNames.Help, props)

export const Icon = ({ name, ...rest }) => <IconifyIcon icon={getIconName(name)} {...rest} />

Icon.propTypes = {
    name: PropTypes.string,
    props: PropTypes.string
};