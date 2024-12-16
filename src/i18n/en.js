const en = {
    app: "Nawishta",
    slogan: "A comprehensive collection of urdu text and tools, presented brilliantly.",
    header: {
        home: "Home",
        libraries: "Libraries",
        libraryEditor: "Library Editor",
        fonts: "Fonts",
        dictionaries: "Dictionaries",
        tools: "Tools",
        writings: "Writings",
        poetry: "Poetry",
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
        viewAll: "View All",
        showMore: "Show more",
        hide: "Hide",
        sortAscending: "Ascending",
        sortDescending: "Descending",
    },
    login: {
        title: "Login",
        message: 'Welcome back!',
        registerMessage: 'Do not have an account yet?',
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
        message: "Enter your email to get a reset link",
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
        loginMessage: "Already registered with us?",
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
    copyrights: {
        Copyright: "Rights Reserved",
        PublicDomain: "Public Domain",
        Open: "Open",
        CreativeCommons: "Creative Commons",
        Unknown: "Unknown Copyrights",
    },
    profile: {
        title: "Profile",
    },
    search: {
        header: "Search",
        title: "Search...",
        placeholder: "Search by title, author, keyword",
        empty: "No result found.",
    },
    libraries: {
        title: "Libraries",
        loadingError: "Unable to load libraries",
        search: {
            placeholder: "Search libraries...",
        },
        viewAll: "View All"
    },
    library: {
        noDescription: "No Description",
        isPublic: "Public Library"
    },
    categories: {
        title: "Categories",
        all: "All Categories",
        bookCount_zero: "No books",
        bookCount_one: "1 book",
        bookCount_other: "{{count}} writing",
        writingCount_zero: "No writing",
        writingCount_one: "1 writing",
        writingCount_other: "{{count}} writing",
        periodicalCount_zero: "No Periodical",
        periodicalCount_one: "1 Periodical",
        periodicalCount_other: "{{count}} Periodicals",
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
    books: {
        empty: "No books found.",
        title: "Books",
        description: "Explore exquisite collection of books",
        allBooks: "All Books",
        error: {
            loading: {
                title: "Error loading books",
                detail: "Unexpected error occured loading books. Please retry again."
            }
        }
    },
    book: {
        title: "Title",
        dateCreated: "Date Created",
        seriesIndex: "Series Index",
        latestBooks: "Latest Additions",
        lastRead: "Recent Reads",
        favorites: "Favorites",
        noDescription: "No details...",
        series: {
            label: "Series",
            placeholder: "Select series",
            indexLabel: "Book of {{name}} series",
            seriesAndIndexLabel: "Book {{index}} of {{name}} series",
        },
        chapters: "Chapters",
        chapterCount_zero: "No chapter",
        chapterCount_one: "1 chapter",
        chapterCount_other: "{{count}} chapters",
        pageCount_zero: "No pages",
        pageCount_one: "1 page",
        pageCount_other: "{{count}} pages",
        fileCount_one: "1 file",
        fileCount_other: "{{count}} files",
        publishLabel: "Published in {{year}}",
        isPublic: "Public Book",
        actions: {
            addFavorite: {
                success: 'Book added to favorites.',
                error: 'Error adding book to favorites.'
            },
            removeFavorite: {
                success: 'Book removed from favorites.',
                error: 'Error removing book from favorites.'
            },
            read: {
                title: "Read book"
            },
            download: {
                title: "Download book"
            }
        },
        error: {
            loading: {
                title: "Error loading book",
                detail: "Unexpected error occured loading book. Please retry again."
            },
            loadingChapters: {
                title: "Error loading chapters",
                detail: "Unexpected error occured loading chapters. Please retry again."
            },
            loadingChapter: {
                title: "Error loading chapter",
                detail: "Unexpected error occured loading chapter. Please retry again."
            },
            loadingPage: {
                title: "Error loading page",
                detail: "Unexpected error occured loading page. Please retry again."
            },
        }
    },
    author: {
        name: "Name",
        type: "Author Type",
        bookCount_zero: "No books",
        bookCount_one: "1 book",
        bookCount_other: "{{count}} books",
        articleCount_zero: "No article",
        articleCount_one: "1 article",
        articleCount_other: "{{count}} articles",
        poetryCount_zero: "No Poetry",
        poetryCount_one: "1 poetry",
        poetryCount_other: "{{count}} poetries",
        booksTabLabel: "Books ({{count}})",
        writingsTabLabel: "Writings ({{count}})",
        poetryTabLabel: "Poetry ({{count}})",
        error: {
            loading: {
                title: "Error loading author",
                detail: "Unexpected error occured loading auhtor. Please retry again."
            }
        }
    },
    authors: {
        empty: "No author",
        description: "Authors of litrature",
        error: {
            loading: {
                title: "Error loading authors",
                detail: "Unexpected error occured loading authors. Please retry again."
            }
        }
    },
    writings: {
        empty: "No writings found.",
        title: "Writings",
        description: "Explore exquisite collection of prose",
        all: "All Writings",
        latest: "Latest Additions",
        lastRead: "Recent Reads",
        favorites: "Favorites",
        error: {
            loading: {
                title: "Error loading writings",
                detail: "Unexpected error occured loading writings. Please retry again."
            }
        },
    },
    writing: {
        title: "Title",
        lastModified: "Modified",
        noDescription: "No details...",
        actions: {
            addFavorite: {
                success: 'Writing added to favorites.',
                error: 'Error adding writing to favorites.'
            },
            removeFavorite: {
                success: 'Writing removed from favorites.',
                error: 'Error removing writing from favorites.'
            },
        },
        error: {
            loading: {
                title: "Error loading writing",
                detail: "Unexpected error occured loading writing. Please retry again."
            }
        },
    },
    poetries: {
        empty: "No poetry found.",
        title: "Poetry",
        description: "Explore exquisite collection of poetry",
        all: "All Poetry",
        latest: "Latest Additions",
        lastRead: "Recent Reads",
        favorites: "Favorites",
        error: {
            loading: {
                title: "Error loading poetry",
                detail: "Unexpected error occured loading poetry. Please retry again."
            }
        },
    },
    poetry: {
        title: "Title",
        lastModified: "Modified",
        noDescription: "No details...",
        actions: {
            addFavorite: {
                success: 'Poetry added to favorites.',
                error: 'Error adding poetry to favorites.'
            },
            removeFavorite: {
                success: 'Poetry removed from favorites.',
                error: 'Error removing poetry from favorites.'
            },
        },
        error: {
            loading: {
                title: "Error loading poetry",
                detail: "Unexpected error occured loading poetry. Please retry again."
            }
        },
    },
    series: {
        label: "Series",
        title: "Title",
        description: "Collection of series of books",
        empty: "No series",
        noDescription: "No details...",
        noOfBooks: "No. of books",
        bookCount_zero: "No books",
        bookCount_one: "1 book",
        bookCount_other: "{{count}} books",
        error: {
            loading: {
                title: "Error loading series",
                detail: "Unexpected error occured loading series. Please retry again."
            }
        }
    },
    reader: {
        themes: {
            white: "White",
            dark: "Dark",
            sepia: "Sepia",
            grey: "Grey",
        },
        view: "View",
        theme: "Theme",
        font: "Font",
        fontSize: "Font Size",
        lineHeight: "Line Height",
    },
    periodicals: {
        title: "Periodical",
        all: "All Periodicals",
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
        articleCount_zero: "No article",
        articleCount_one: "1 article",
        articleCount_other: "{{count}} articles",
        pageCount_zero: "No pages",
        pageCount_one: "1 page",
        pageCount_other: "{{count}} pages",
        volumeNumber: {
            title: "Volume Number {{volumeNumber}}",
            label: "Volume Number",
            placeholder: "Volume number for issue",
            required: "Volume number is required for issue. If there is no volume number, enter 0.",
        },
        issueNumber: {
            title: "Issue Number {{issueNumber}}",
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
        article: {
            title: "Article",
            errors: {
                loading: {
                    title: "Error",
                    subTitle: "Unable to load article.",
                },
            },
            empty: {
                title: "Article not found",
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
            }
        },
    },
};

export default en;
