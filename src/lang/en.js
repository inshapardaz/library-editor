const en = {
    app: "Nawishta",
    slogan: "Read something new today",
    header: {
        home: "Home",
        libraries: "Libraries",
        writings: "Writings",
        books: "Books",
        authors: "Authors",
        categories: "Categories",
        series: "Series",
        periodicals: "Periodicals",
    },
    footer: {
        copyrights: "Copyrights Nawishta. All rights reserved.",
    },
    actions: {
        seeMore: "See More...",
        list: "List",
        card: "Cards",
        yes: "Yes",
        no: "No",
        close: "Close",
        retry: "Retry",
        save: "Save",
        edit: "Edit",
        delete: "Delete",
        cancel: "Cancel",
        ok: "OK",
        resizeImage: "Resize Image",
        zoonIn: "Zoom In",
        zoonOut: "Zoom Out",
        next: "Next",
        previous: "Previous",
        done: "Done",
    },
    login: {
        title: "Login",
        email: {
            title: "Email",
            error: "Email is invalid",
            required: "Email is required",
        },
        password: {
            title: "Password",
            required: "Password is required",
        },
        error: "Unable to login. Please check your username and password.",
    },
    logout: {
        title: "Logout",
        confirmation: "Are you sure you want to log out?",
    },
    forgotPassword: {
        title: "Forgot Password",
        submit: "Get Password",
        email: {
            title: "Email",
            error: "Email is invalid",
            required: "Email is required",
        },
        success: "Please check your email for password reset instructions.",
        error: "Unable to complete request. Please try again.",
    },
    register: {
        title: "Register",
        submit: "Register",
        name: {
            label: "Name",
            required: "Name is required",
        },
        email: {
            label: "Email",
            error: "Email is invalid",
            required: "Email is required",
        },
        password: {
            label: "Password",
            required: "Password is required",
            length: "Password must be at least 6 characters.",
        },
        confirmPassword: {
            label: "Confirm Password",
            match: "Passwords must match",
            required: "Confirm Password is required",
        },
        success: "Registration successful, please login with your credentials.",
        error: "Unable to register. Please try again.",
        acceptTerms: {
            title: "Accept Terms & Conditions",
            requires: "Accepting Terms & Conditions is required.",
        },
        invitation: {
            expired:
                "Invitation link has expired. Please contact us to resend a new invitation code.",
            notFound: "Invitation link is not valid.",
        },
    },
    changePassword: {
        title: "Change Password",
        submit: "Change Password",
        oldPassword: {
            label: "Old Password",
            required: "Old Password is required",
        },
        password: {
            label: "New Password",
            required: "Password is required",
            length: "Password must be at least 6 characters.",
        },
        confirmPassword: {
            label: "Confirm Password",
            match: "Passwords must match",
            required: "Confirm Password is required",
        },
        success: "Password updated successfully",
        error: "Unable to change password. Please try again.",
    },
    resetPassword: {
        title: "Reset Password",
        submit: "Reset Password",
        password: {
            label: "Password",
            required: "Password is required",
            length: "Password must be at least 6 characters.",
        },
        confirmPassword: {
            label: "Confirm Password",
            match: "Passwords must match",
            required: "Confirm Password is required",
        },
        success: "Password updated successfully",
        error: "Unable to reset password. Please try again.",
        noCode: "No reset code is present. Please follow instructions in email sent to you.",
    },
    403: {
        title: "Unauthorised",
        description: "Sorry, you are not authorized to access this page.",
        action: "Back Home",
    },
    404: {
        title: "Not Found",
        description: "Sorry, the page you visited does not exist.",
        action: "Back Home",
    },
    500: {
        title: "Server Error",
        description: "Sorry, something went wrong.",
        action: "Back Home",
    },
    languages: {
        en: "English",
        ur: "Urdu",
    },
    profile: {
        title: "Profile",
    },
    search: {
        header: "Search",
        title: "Search...",
        placeholder: "Search by title, author, keyword",
    },
    home: {
        welcome: "Welcome to Nawishta. A collection of libraries.",
        gettingStarted: "Start Exploring",
    },
    libraries: {
        title: "Libraries",
        loadingError: "Unable to load libraries",
        search: {
            placeholder: "Search libraries...",
        },
    },
    library: {
        loadingError: "Unable to load library",
        noDescription: "No details...",
        bookCount_one: "1 book",
        bookCount_other: "{{count}} books",
        email: {
            label: "Owner Email",
            placeholder: "Email of owner",
            error: "Email is invalid",
            required: "Owner email is required",
        },
        name: {
            label: "Name",
            placeholder: "Name of library",
            required: "Library name is required",
        },
        description: {
            label: "Description",
            placeholder: "Short description of library",
            required: "Library name is required",
            noDescription: "No details...",
        },
        language: {
            label: "Language",
            placeholder: "Select language for library",
            required: "Language is required",
        },
        isPublic: {
            label: "Is Public",
        },
        supportPeriodicals: {
            label: "Support Periodicals",
        },
        fileStoreType: {
            label: "File Store Type",
            placeholder: "Select type of file store to use for this library",
            required: "File store type is required",
            database: "Database",
            azurebolbstorage: "Azure Blob Storage",
            s3storage: "S3 Storage",
            filesystem: "File System",
        },
        fileStoreSource: {
            label: "file Store Source",
            placeholder: "Select File store source",
            required: "File Store Source is required",
        },
        databaseConnection: {
            label: "Database Connection",
            placeholder: "Database connection string",
        },
        actions: {
            add: {
                label: "Add new library",
                title: "New Library",
                success: "Library created successfully.",
                error: "Error creating library.",
            },
            edit: {
                title: "Editing '{{title}}'",
                success: "Library saved successfully.",
                error: "Error saving library",
            },
            delete: {
                title: "Delete library?",
                message:
                    "Are you sure you want to delete library '{{title}}'? It will remove all of its contents including books, authors, periodicals, issues, articles and files.",
                success: "Library deleted successfully.",
                error: "Error deleting library.",
            },
        },
    },
    books: {
        latest: {
            title: "Latest books",
        },
        favorites: {
            title: "Favorites",
        },
        read: {
            title: "Read books",
        },
        BeingTyped: {
            title: "Books you are typing",
        },
        ProofRead: {
            title: "Books you are proof reading",
        },
        title: "Books",
        errors: {
            loading: {
                title: "Error",
                subTitle: "Unable to load books.",
            },
        },
        empty: {
            title: "No latest book found",
        },
        search: {
            placeholder: "Search books...",
        },
        sort: {
            title: "Title",
            dateCreated: "Date Added",
        },
        actions: {
            upload: {
                label: "Upload",
                title: "Upload Books",
                defaultProperties: "Default Properties",
                message: "Click or drag file to this area to upload",
                empty: "No books selected for upload. Please Click or drag file to above area to upload",
                success: "Books uploaded successfully.",
                error: "Error uploading books.",
                details: {
                    error: {
                        title: "Error",
                    },
                    uploadMore: "Upload More",
                    retryAllFailed: "Retry all failed uploads",
                    status: {
                        pending: "Pending",
                        inProgress: "In Progress",
                        completed: "Completed",
                        failed: "Failed",
                    },
                },
            },
        },
    },
    book: {
        title: {
            label: "Title",
            placeholder: "Title of book",
            required: "Book title is required",
        },
        description: {
            label: "Description",
            placeholder: "Some description of book",
        },
        public: {
            label: "Public",
        },
        copyrights: {
            label: "Copyrights",
        },
        authors: {
            label: "Authors",
            placeholder: "Select authors of the book",
            required: "Author is required",
        },
        status: {
            label: "Status",
            placeholder: "Select Book Status",
        },
        categories: {
            label: "Categories",
            placeholder: "Select categories",
        },
        series: {
            label: "Series",
            placeholder: "Select series",
            indexLabel: "Book of {{name}} series",
            seriesAndIndexLabel: "Book {{index}} of {{name}} series",
        },
        seriesIndex: {
            label: "Sequence in series",
        },
        publisher: {
            label: "Publisher",
            placeholder: "Publisher of the book",
        },
        source: {
            label: "Source",
            placeholder: "Source of the book",
        },
        language: {
            label: "Language",
            placeholder: "Select language for book",
            required: "Language is required",
        },
        yearPublished: {
            label: "Publish Year",
        },
        chapterCount_one: "1 chapter",
        chapterCount_other: "{{count}} chapters",
        pageCount_one: "1 page",
        pageCount_other: "{{count}} pages",
        fileCount_one: "1 file",
        fileCount_other: "{{count}} files",
        publishLabel: "Published in {{year}}",
        noDescription: "No details...",
        chapters: {
            title: "Chapters",
        },
        files: {
            title: "Files",
        },
        actions: {
            add: {
                label: "Add new book",
                title: "New Book",
                success: "Book created successfully.",
                error: "Error creating book.",
            },
            edit: {
                title: "Editing '{{title}}'",
                success: "Book saved successfully.",
                error: "Error saving book",
            },
            delete: {
                title: "Delete book?",
                message:
                    "Are you sure you want to delete book '{{title}}'? It will remove all of its contents including chapters, pages and files.",
                success: "Book deleted successfully.",
                error: "Error deleting book.",
            },
            addFile: {
                title: "Upload file",
                success: "File uploadedsuccessfully.",
                error: "Error uploading file.",
            },
            deleteFile: {
                title: "Delete file?",
                message: "Are you sure you want to delete book '{{title}}'?.",
            },
            downloadFile: {
                title: "Download file",
            },
            loadFileImages: {
                title: "Load File Images",
                progress: "Loading pages {{completed}} of {{total}}",
                selectOtherFile: "Select other file",
                page: "Page {{current}} of {{total}}",
                loadSavedSetting: "Load previously saved settings",
                messages: {
                    downloadingFile: "Downloading file...",
                    loadingPages:
                        "Parsing pages from pdf. It might take some time. Please keep this window open and in focus.",
                    savingPages:
                        "Saving pages. It might take some time. Please keep this window open and in focus.",
                    loaded: "All pages loaded successfully.",
                    failedLoading: "Failed to load all pages.",
                    selectImage: "Please select an image",
                    errorFileType:
                        "Only PDF cannot be processed. Other file types are not supported",
                    errorLoadingSavedSettings:
                        "Error loading saved settings. Saved settings are removed.",
                },
            },
            split: {
                title: "Split",
            },
            applySplitToAll: {
                title: "Apply split to all pages.",
            },
            applySplitToAllBelow: {
                title: "Apply split to all pages after the current one.",
            },
            processAndSave: {
                title: "Process split and save pages",
            },
            setFirstPageAsImage: {
                title: "Set first page of file as book image.",
                message:
                    "Do you want to make the first page of this file to be the book image?",
                success: "Book image set successfully",
                error: "Unable to set book image",
            },
            publish: {
                title: "Publish Book",
                message:
                    "Are you sure you want to publish book '{{title}}'? It will merge text in all pages and save into chapters. It will overwrite all chapter contents.",
                success: "Book published successfully.",
                error: "Error publishing book.",
            },
        },
        errors: {
            loading: {
                title: "Error",
                subTitle: "Unable to load book.",
            },
        },
        empty: {
            title: "No latest book found",
        },
    },
    chapters: {
        title: "Chapters",
        errors: {
            loading: {
                title: "Error",
                subTitle: "Unable to load chapters.",
            },
        },
        empty: {
            title: "No chapter found",
        },
    },
    chapter: {
        title: {
            label: "Title",
            placeholder: "Title of chapter",
            required: "Chapter title is required",
        },
        status: {
            label: "Status",
            placeholder: "Select Chapter Status",
            required: "Chapter status is required",
            unsavedChanges: "Unsaved Changes",
        },
        user: {
            label: "User",
            placeholder: "Select user",
            required: "User is required",
        },
        actions: {
            add: {
                label: "Add new chapter",
                title: "New Chapter",
                success: "Chapter created successfully.",
                error: "Error creating chapter",
            },
            edit: {
                title: "Editing '{{title}}'",
                success: "Chapter saved successfully.",
                error: "Error saving chapter.",
            },
            delete: {
                title: "Delete Chapter?",
                title_other: "Delete {{count}} chapters",
                message: "Are you sure you want to delete chapters?",
                success: "Chapter deleted successfully.",
                success_other: "{{count}} Chapters deleted successfully.",
                error: "Error deleting chapter.",
                error_other: "Error deleting {{ count }}} chapters.",
            },
            updateStatus: {
                title: "Updating Status",
                success: "Chapter status updated successfully.",
                error: "Error saving chapter statuses.",
            },
            assign: {
                label: "Assign Chapter",
                title_one: "Assign Chapter {{count}}",
                title_other: "Assign Chapters {{count}}",
                message: "Assigning Chapter(s) '{{ chapterNumber }}'?",
                success_one: "Chapter assigned successfully.",
                success_other: "{{count}} chapters assigned successfully.",
                error_one: "Error assigning chapter.",
                error_other: "Error assigning {{count}} chapters.",
            },
            reorder: {
                success: "Chapter ordered successfully.",
                error: "Error ordering chapter.",
            },
            read: {
                title: "Read",
            },
        },
        errors: {
            loading: {
                title: "Error",
                subTitle: "Unable to load books.",
            },
        },
        editor: {
            title: "Edit chapter contents",
            newContents: "New chapter contents being created.",
            unsavedContents:
                "Unsaved changed found for this chapter. Would you like to continue editing it?",
        },
    },
    pages: {
        title: "Pages",
        label: "Page {{sequenceNumber}}",
        errors: {
            loading: {
                title: "Error",
                subTitle: "Unable to load pages.",
            },
        },
        empty: {
            title: "No page found",
        },
        assignment: {
            all: "All",
            mine: "Assigned to me",
            assigned: "Assigned",
            unassigned: "Unassigned",
            allStatuses: "All Statuses",
        },
        filters: {
            all: "All",
            availableToType: "Available",
            typing: "Typing",
            typed: "Typed",
            proofreading: "Proofreading",
            completed: "Completed",
        },
        actions: {
            upload: {
                label: "Upload",
                title: "Upload pages for {{book}}",
                message:
                    "Click or drag book page images  to this area to upload",
                detail: "You can upload JPG, PNG files. Any file added here will be uploaded in to book in the sequence so please select pages in book sequence.",
                success: "Pages created successfully.",
                error: "Error creating pagers.",
            },
            autoFillChapter: {
                title: "Auto fill page chapters",
                message:
                    "Set Chapter of first page of every chapter. Using this option will automatically set the chapters for remaining pages. This will overwrite any page chapter already set. Would you like to continue?",
            },
        },
    },
    page: {
        sequenceNumber: {
            title: "Sequence Number",
            required: "Sequence Number is required.",
        },
        status: {
            title: "Status",
            required: "Status is required.",
            placeholder: "Select status",
        },
        chapter: {
            label: "Chapter",
            required: "Chapter is required.",
            placeholder: "Select chapter",
        },
        user: {
            label: "User",
            placeholder: "Select user",
            required: "User is required",
        },
        label: "Page {{sequenceNumber}}",
        actions: {
            add: {
                label: "Add new page",
                title: "New page",
                success: "Page created successfully.",
                error: "Error creating page.",
            },
            edit: {
                title: "Editing page {{sequenceNumber}}",
                success: "Page saved successfully.",
                error: "Error saving page.",
            },
            assign: {
                title: "Assign pages?",
                message: "Assign page(s)?",
                success_one: "Page assigned successfully.",
                success_other: "{{count}} pages assigned successfully.",
                error_one: "Error assigning page.",
                error_other: "Error assigning {{count}} pages.",
            },
            uploadImage: {
                label: "Upload image",
            },
            uploadPage: {
                label: "Upload new page",
                title: "Upload page",
                success: "Page created successfully.",
                error: "Error creating page.",
            },
            uploadPdf: {
                label: "Upload PDF",
                title: "Upload PDF File",
                success: "PDF uploaded successfully.",
                error: "Error uploading pdf.",
            },
            uploadZip: {
                label: "Upload Zip",
                title: "Upload Zip File",
                success: "Zip file uploaded successfully.",
                error: "Error uploading zip file.",
            },
            updateStatus: {
                title: "Updating Status",
                success: "Page status updated successfully.",
                error: "Error saving page statuses.",
            },
            delete: {
                title: "Delete pages",
                message: "Are you sure you want to delete pages?",
                success: "Page deleted successfully.",
                error: "Error deleting page.",
            },
            setChapter: {
                title_one: "Setting Chapter",
                title_other: "Setting Chapter for {{count}} pages",
                message: "Are you sure you want to change chapter for page(s)?",
                success: "Pages updated successfully.",
                error: "Error updating pages.",
            },
            ocr: {
                title_one: "Extract text for page",
                title_other: "Extract text for {{count}} pages",
                message:
                    "Are you sure you want to extract text for page(s)? This will overwrite existing text for pages and cannot be recovered.",
                success: "Text extraction successfully.",
                error: "Error extracting text.",
                key: {
                    label: "OCR Key",
                    description:
                        "This key will be used to extract text from images.",
                    required: "OCR Key is required.",
                },
                saveKey: {
                    label: "Save OCR Key",
                    description:
                        "It will save this key locally on your computer for future use. No part of key information is stored on our servers. If you are using a public or shared computer, please do not save key.",
                },
            },
            sequence: {
                label: "Move page",
                title: "Move page?",
                message:
                    "Please provide new sequence number for page '{{ sequenceNumber }}'?",
                success: "Page moved successfully.",
                error: "Error moving page.",
            },
        },
    },
    reader: {
        settings: "Theme & Settings",
        font: "Font",
        fontSize: "Font Size",
        lineSpacing: "Line Spacing",
        view: {
            title: "View",
            vertical: "Vertical",
            singlePage: "Single Page",
            flipBook: "Flip Book",
        },
    },
    authors: {
        title: "Authors",
        errors: {
            loading: {
                title: "Error",
                subTitle: "Unable to load authors.",
            },
        },
        empty: {
            title: "No Authors",
        },
        search: {
            placeholder: "Search authors...",
        },
    },
    author: {
        writer: "Writer",
        poet: "poet",
        bookCount_one: "1 book",
        bookCount_other: "{{count}} books",
        writingCount_one: "1 writing",
        writingCount_other: "{{count}} writings",
        noDescription: "No details...",
        name: {
            label: "Name",
            placeholder: "Name of the author",
            required: "Name is required for author",
        },
        description: {
            label: "Description",
        },
        type: {
            label: "Type",
            placeholder: "Type of the author",
            required: "Type is required for author",
            writer: "Writer",
            poet: "Poet",
        },
        actions: {
            add: {
                label: "Add new author",
                title: "New Author",
                success: "Author created successfully.",
                error: "Error creating author.",
            },
            edit: {
                title: "Editing '{{name}}'",
                success: "Author saved successfully.",
                error: "Error saving author",
            },
            delete: {
                title: "Delete author?",
                message:
                    "Are you sure you want to delete author '{{name}}'? It will remove all of its contents including books, writing and files.",
                success: "Author deleted successfully.",
                error: "Error deleting author.",
            },
        },
    },
    articles: {
        title: "Writings",
        errors: {
            loading: {
                title: "Error",
                subTitle: "Unable to load writings.",
            },
        },
        empty: {
            title: "No writing found",
        },
        search: {
            placeholder: "Search writings...",
        },
        sort: {
            title: "Title",
            lastModified: "Last Modified",
        },
        favorites: {
            title: "Favorites",
        },
        read: {
            title: "Read books",
        },
        latest: {
            title: "Latest books",
        },
    },
    article: {
        title: {
            label: "Title",
            placeholder: "Title of writing",
            required: "Title is required for writing",
        },
        type: {
            label: "Type",
            placeholder: "Type of writing",
            required: "Type is required for writing",
            writing: "Prose",
            poetry: "Poetry",
        },
        public: {
            label: "Public",
        },
        authors: {
            label: "Authors",
            placeholder: "Select authors of the writing",
            required: "Author is required",
        },
        layout: {
            label: "Layout",
            placeholder: "Select layout",
        },
        status: {
            label: "Status",
            placeholder: "Select writing status",
        },
        categories: {
            label: "Categories",
            placeholder: "Select categories",
        },
        information: {
            label: "Information",
        },
        contents: {
            label: "Contents",
        },
        messages: {
            newContent:
                "There are no contents available in chosen language. You are creating new content for this article۔",
        },
        actions: {
            add: {
                label: "Add new writing",
                title: "New writing",
                success: "Writing created successfully.",
                error: "Error creating writing.",
            },
            edit: {
                title: "Editing '{{title}}'",
                success: "Writing saved successfully.",
                error: "Error saving writing",
            },
            delete: {
                title: "Delete writing?",
                message: "Are you sure you want to delete writing '{{name}}'?",
                success: "Writing deleted successfully.",
                error: "Error deleting writing.",
            },
        },
        errors: {
            contentNotFound: {
                title: "Content Not Available in `{{language}}`.",
                titleMissing: "Content Not Available.",
                subTitle: "Please try a different language below.",
                subTitleMissing: "Please visit us later.",
            },
        },
    },
    series: {
        title: "Series",
        bookCount_one: "1 book",
        bookCount_other: "{{count}} books",
        noDescription: "No details...",
        name: {
            label: "Name",
            placeholder: "Name of the series",
            required: "Name is required for series",
        },
        description: {
            label: "Description",
        },
        save: {
            success: "Series saved successfully.",
            error: "Unable to save series.",
        },
        actions: {
            add: {
                label: "Add new series",
                title: "New Series",
                success: "Series created successfully.",
                error: "Error creating series",
            },
            edit: {
                title: "Editing '{{name}}'",
                success: "Series saved successfully.",
                error: "Error saving series.",
            },
            delete: {
                title: "Delete Series?",
                message: "Are you sure you want to delete series '{{name}}'?",
                success: "Series deleted successfully.",
                error: "Error deleting series.",
            },
        },
        errors: {
            loading: {
                title: "Error",
                subTitle: "Unable to load series.",
            },
        },
        empty: {
            title: "No Series",
        },
    },
    categories: {
        title: "Categories",
        all: "All Categories",
        errors: {
            loading: {
                title: "Error",
                subTitle: "Unable to load categories",
            },
        },
        empty: {
            title: "No Categories",
        },
    },
    category: {
        name: {
            label: "Name",
            placeholder: "Name of the category",
            required: "Name is required for category",
        },
        bookCount_one: "1 book",
        bookCount_other: "{{count}} books",
        actions: {
            add: {
                label: "Add new category",
                title: "New Category",
                success: "Category created successfully.",
                error: "Error creating category.",
            },
            edit: {
                title: "Editing '{{name}}'",
                success: "Category saved successfully.",
                error: "Error saving category",
            },
            delete: {
                title: "Delete category?",
                message: "Are you sure you want to delete category '{{name}}'?",
                success: "Category deleted successfully.",
                error: "Error deleting category.",
            },
        },
    },
    periodicals: {
        title: "Periodical",
        errors: {
            loading: {
                title: "Error",
                subTitle: "Unable to load periodical",
            },
        },
        empty: {
            title: "No Periodicals",
        },
        search: {
            placeholder: "Search periodicals...",
        },
    },
    periodical: {
        issueCount_one: "1 issue",
        issueCount_other: "{{count}} issues",
        noDescription: "No details...",
        frequency: {
            label: "Frequency",
            placeholder: "Select frequency of the periodical",
            required: "Frequency is required for periodical",
            annually: "Annually",
            quarterly: "Quarterly",
            monthly: "Monthly",
            fortnightly: "Fortnightly",
            weekly: "Weekly",
            daily: "Daily",
            unknown: "Unknown",
        },
        title: {
            label: "Name",
            placeholder: "Name of the periodical",
            required: "Name is required for periodical",
        },
        description: {
            label: "Description",
        },
        language: {
            label: "Language",
            placeholder: "Select language for periodical",
            required: "Language is required",
        },
        categories: {
            label: "Categories",
            placeholder: "Select categories for periodical",
        },
        actions: {
            add: {
                label: "Add new periodical",
                title: "New Periodical",
                success: "Periodical created successfully.",
                error: "Error creating periodical.",
            },
            edit: {
                title: "Editing '{{name}}'",
                success: "Periodical saved successfully.",
                error: "Error saving periodical",
            },
            delete: {
                title: "Delete periodical?",
                message:
                    "Are you sure you want to delete periodical '{{name}}'? It will remove all of its contents including issue, articles and files.",
                success: "Periodical deleted successfully.",
                error: "Error deleting periodical.",
            },
        },
    },
    issues: {
        title: "Issues",
        errors: {
            loading: {
                title: "Error",
                subTitle: "Unable to load issues.",
            },
        },
        empty: {
            title: "No issues",
        },
    },
    issue: {
        volumeNumber: {
            label: "Volume Number",
            placeholder: "Volume number for issue",
            required:
                "Volume number is required for issue. If there is no volume number, enter 0.",
        },
        issueNumber: {
            label: "Issue Number",
            placeholder: "Issue number for issue",
            required: "Issue number is required for issue.",
        },
        issueDate: {
            label: "Issue Date",
            required: "Issue date is required for issue",
        },
        status: {
            label: "Status",
            placeholder: "Select Book Status",
        },
        articles: {
            title: "Articles",
            errors: {
                loading: {
                    title: "Error",
                    subTitle: "Unable to load articles.",
                },
            },
            empty: {
                title: "No articles found",
            },
        },
        files: {
            title: "Files",
            empty: {
                title: "No file found",
            },
        },
        pages: {
            title: "Pages",
            editor: {
                unsavedContents:
                    "Unsaved changed found for this page. Would you like to continue editing it?",
            },
            empty: {
                title: "No Pages found",
            },
            actions: {
                add: {
                    label: "Add new page",
                    success: "Page created successfully.",
                    error: "Error creating page.",
                },
                edit: {
                    title: "Editing page {{sequenceNumber}}",
                    success: "Page saved successfully.",
                    error: "Error saving page.",
                },
                uploadPage: {
                    label: "Upload new page",
                },
                uploadPdf: {
                    label: "Upload PDF",
                },
                uploadZip: {
                    label: "Upload Zip",
                },
                reorder: {
                    success: "Pages order saved successfully",
                    error: "Error saving page order.",
                },
            },
        },
        actions: {
            add: {
                label: "Add new issue",
                title: "New issue",
                success: "Issue created successfully.",
                error: "Error creating issue.",
            },
            edit: {
                title: "Editing '{{name}}'",
                success: "Issue saved successfully.",
                error: "Error saving issue",
            },
            delete: {
                title: "Delete issue?",
                message:
                    "Are you sure you want to delete issue '{{name}}'? It will remove all of its contents.",
                success: "Issue deleted successfully.",
                error: "Error deleting issue.",
            },
            addFile: {
                title: "Upload file",
                success: "File uploaded successfully.",
                error: "Error uploading file.",
            },
            deleteFile: {
                title: "Delete file?",
                message: "Are you sure you want to delete issue file?",
                success: "File deleted successfully.",
                error: "Error deleting file",
            },
            downloadFile: {
                title: "Download file",
            },
            setFirstPageAsImage: {
                title: "Set first page of file as issue image.",
                message:
                    "Do you want to make the first page of this file to be the issue image?",
                success: "Issue image set successfully",
                error: "Unable to set issue image",
            },
        },
    },
    issueArticles: {
        title: "Writings",
        errors: {
            loading: {
                title: "Error",
                subTitle: "Unable to load writings.",
            },
        },
        empty: {
            title: "No writing found",
        },
        search: {
            placeholder: "Search writings...",
        },
        sort: {
            title: "Title",
            lastModified: "Last Modified",
        },
        favorites: {
            title: "Favorites",
        },
        read: {
            title: "Read books",
        },
        latest: {
            title: "Latest books",
        },
        actions: {
            reorder: {
                success: "Sequence of articles has been updated.",
                error: "Error updating sequence of articles.",
            },
        },
    },
    issueArticle: {
        title: {
            label: "Title",
            placeholder: "Title of writing",
            required: "Title is required for writing",
        },
        type: {
            label: "Type",
            placeholder: "Type of writing",
            required: "Type is required for writing",
            writing: "Prose",
            poetry: "Poetry",
        },
        public: {
            label: "Public",
        },
        authors: {
            label: "Authors",
            placeholder: "Select authors of the writing",
            required: "Author is required",
        },
        layout: {
            label: "Layout",
            placeholder: "Select layout",
        },
        status: {
            label: "Status",
            placeholder: "Select writing status",
        },
        categories: {
            label: "Categories",
            placeholder: "Select categories",
        },
        information: {
            label: "Information",
        },
        contents: {
            label: "Contents",
        },
        messages: {
            newContent:
                "There are no contents available in chosen language. You are creating new content for this article۔",
        },
        user: {
            label: "User",
            required: "User is required.",
        },
        actions: {
            add: {
                label: "Add new writing",
                title: "New writing",
                success: "Writing created successfully.",
                error: "Error creating writing.",
            },
            edit: {
                title: "Editing '{{title}}'",
                success: "Writing saved successfully.",
                error: "Error saving writing",
            },
            delete: {
                title: "Delete writing?",
                message: "Are you sure you want to delete writing '{{name}}'?",
                success: "Writing deleted successfully.",
                error: "Error deleting writing.",
            },
            updateStatus: {
                title: "Article Status",
                success: "Article status updated successfully.",
                error: "Error saving article statuses.",
            },
            assign: {
                label: "Assign Article",
                success: "Article assigned successfully.",
                error: "Error assigning article statuses.",
            },
        },
        errors: {
            contentNotFound: {
                title: "Content Not Available in `{{language}}`.",
                titleMissing: "Content Not Available.",
                subTitle: "Please try a different language below.",
                subTitleMissing: "Please visit us later.",
            },
        },
    },
    users: {
        empty: {
            title: "No Series",
        },
        me: {
            title: "Me",
        },
        none: {
            title: "Unassign",
        },
        others: {
            title: "Other users",
        },
    },
    fonts: {
        alviLahoriNastaleeq: "Alvi Lahori Nastaleeq",
        fajerNooriNastalique: "Fajer Noori Nastaleeq",
        gulzarNastalique: "Gulzar Nastaleeq",
        emadNastaleeq: "Emad Nastaleeq",
        nafeesWebNaskh: "Nafees Web Naskh",
        nafeesNastaleeq: "Nafees Nastaleeq",
        mehrNastaleeq: "Mehr Nastaleeq",
        adobeArabic: "Adobe Arabic",
        dubai: "Dubai",
        notoNaskhArabic: "Noto Naskh",
        notoNastaliqUrdu: "Noto Nastaleeq",
        jameelNooriNastaleeq: "Jameel Noori Nastaleeq",
        jameelKhushkhati: "Jameel Khushkhati",
        jameelNooriNastaleeqKasheeda: "Jameel Noori Nastaleeq Kasheeda",
    },
    downloader: {
        title: "Download Rekhta Book",
        description:
            "Please provide the book link where you can see the book contents.",
        loading:
            "Downloading Book... It can take a while to download book. Please do not close the browser while waiting for book to download.",
        url: {
            title: "Book Link",
            required: "Book link is required.",
            detailsLink:
                "This is a link to book details page. Please provide link to page where you can read book pages.",
        },
        convertToPdf: {
            pdf: "Pdf",
            images: "Images",
        },
        error: "Unable to download book. Please make sure you have provided link where you can read the book pages.",
    },
    copyrights: {
        Copyright: "Rights Reserved",
        PublicDomain: "Public Domain",
        Open: "Open",
        CreativeCommons: "Creative Commons",
        Unknown: "Unknown Copyrights",
    },
    bookStatus: {
        Published: "Published",
        AvailableForTyping: "Ready for typing",
        BeingTyped: "Being Typed",
        ReadyForProofRead: "Ready for proof reading",
        ProofRead: "Proof Read",
    },
    editingStatus: {
        Available: "Available",
        Typing: "Being Typed",
        Typed: "Typed",
        InReview: "In Review",
        Completed: "Completed",
        All: "All",
    },
    sort: {
        ascending: "Ascending",
        descending: "Descending",
    },
    layouts: {
        normal: {
            label: "Normal",
        },
        singleColumnPoetry: {
            label: "Single Column Poetry",
        },
        twoColumnPoetry: {
            label: "Two Column Poetry",
        },
    },
    errors: {
        imageRequired:
            "Only image files are expected. Please select an image file.",
        pdfRequired: "Only PDF files are expected. Please select a PDF file.",
    },
    editor: {
        toolbar: {
            punctuation: "Punctuation",
            autoCorrect: "Auto Correct",
        },
    },
};

export default en;
