const en = {
    "app" : "Nawishta",
    "slogan": "Read something new today",
	"header" : {
		"home": "Home",
		"libraries" : "Libraries",
		"writings": "Writings",
		"books": "Books",
		"authors": "Authors",
		"categories": "Categories",
		"series": "Series",
		"periodicals" : "Periodicals"
	},
	"footer" : {
		"copyrights" : "Copyrights Nawishta. All rights reserved."
	},
	"actions" : {
		"seeMore": "See More...",
		"list" : "List",
		"card" : "Cards",
		"yes" : "Yes",
		"no" : "No",
		"close": "Close",
		"retry": "Retry",
        "save": "Save",
        "edit": "Edit",
        "delete": "Delete",
        "cancel": "Cancel",
        "resizeImage": "Resize Image"
	},
	"login" : {
		"title" : "Login",
		"email" : {
			"title" : "Email",
			"error" : "Email is invalid",
			"required" : "Email is required"
		},
		"password" : {
			"title" : "Password",
			"required" : "Password is required"
		},
		"error" : "Unable to login. Please check your username and password."
	},
	"logout": {
		"title": "Logout",
		"confirmation" : "Are you sure you want to log out?"
	},
	"forgotPassword" : {
		"title" : "Forgot Password",
		"submit" : "Get Password",
		"email" : {
			"title" : "Email",
			"error" : "Email is invalid",
			"required" : "Email is required"
		},
		"success" : "Please check your email for password reset instructions.",
		"error" : "Unable to complete request. Please try again."
	},
	"register" : {
		"title" : "Register",
		"submit" : "Register",
		"name" : {
			"label" : "Name",
			"required" : "Name is required"
		},
		"email" : {
			"label" : "Email",
			"error" : "Email is invalid",
			"required" : "Email is required"
		},
		"password" : {
			"label" : "Password",
			"required" : "Password is required",
			"length": "Password must be at least 6 characters."
		},
		"confirmPassword" : {
			"label" : "Confirm Password",
			"match": "Passwords must match",
			"required": "Confirm Password is required"
		},
		"success":"Registration successful, please login with your credentials.",
		"error":"Unable to register. Please try again.",
		"acceptTerms" : {
			"title" : "Accept Terms & Conditions",
			"requires" : "Accepting Terms & Conditions is required."
		},
		"invitation" : {
			"expired": "Invitation link has expired. Please contact us to resend a new invitation code.",
			"notFound": "Invitation link is not valid."
		}
	},
    "changePassword": {
		"title" : "Change Password",
		"submit" : "Change Password",
		"oldPassword": {
			"label" : "Old Password",
			"required" : "Old Password is required"
		},
		"password": {
			"label" : "New Password",
			"required" : "Password is required",
			"length": "Password must be at least 6 characters."
		},
		"confirmPassword": {
			"label" : "Confirm Password",
			"match": "Passwords must match",
			"required": "Confirm Password is required"
		},
		"success" :"Password updated successfully",
		"error" :"Unable to change password. Please try again."
	},
	"resetPassword": {
		"title" : "Reset Password",
		"submit" : "Reset Password",
		"password": {
			"label" : "Password",
			"required" : "Password is required",
			"length": "Password must be at least 6 characters."
		},
		"confirmPassword": {
			"label" : "Confirm Password",
			"match": "Passwords must match",
			"required": "Confirm Password is required"
		},
		"success" :"Password updated successfully",
		"error" :"Unable to reset password. Please try again.",
		"noCode": "No reset code is present. Please follow instructions in email sent to you."
	},
	"403" : {
		"title" : "Unauthorised",
		"description": "Sorry, you are not authorized to access this page.",
		"action" : "Back Home"
	},
	"404" : {
		"title" : "Not Found",
		"description": "Sorry, the page you visited does not exist.",
		"action" : "Back Home"
	},
	"500" : {
		"title" : "Server Error",
		"description": "Sorry, something went wrong.",
		"action" : "Back Home"
	},
	"languages": {
		"en" : "English",
		"ur" : "Urdu"
	},
	"profile": {
		"title" : "Profile"
	},
	"search": {
		"title" : "Search...",
		"placeholder" : "Search by title, author, keyword"
	},
	"home" : {
		"welcome": "Welcome to Nawishta. A collection of libraries.",
		"gettingStarted" : "Start Exploring"
	},
	"libraries" : {
		"title" : "Libraries",
		"loadingError": "Unable to load libraries"
	},
	"library" : {
		"loadingError": "Unable to load library"
	},
	"books": {
		"latest" : {
			"title"  : "Latest books"
		},
		"favorites" : {
			"title" : "Favorites"
		},
		"read" : {
			"title" : "Read books"
		},
        "BeingTyped": {
            "title" : "Books you are typing"
		},
        "ProofRead": {
            "title" : "Books you are proof reading"
        },
		"title"  : "Books",
		"empty" : "No latest book found",
		"loadingError": "Unable to load books",
        "actions" : {
            "add": "Add new book"
        }
	},
	"book" : {
        "title" : {
            "label": "Title",
		    "placeholder" : "Title of book",
            "required" : "Book title is required"
        },
        "description" : {
            "label": "Description",
            "placeholder" : "Some description of book"
        },
        "public": {
            "label": "Public"
        },
        "copyrights": {
            "label": "Copyrights"
        },
        "authors": {
            "label" : "Authors",
            "placeholder" : "Select authors of the book",
            "required" : "Author is required"
        },
        "status": {
            "label": "Status",
            "placeholder" : "Select Book Status"
        },
        "categories": {
            "label" : "Categories",
            "placeholder" : "Select categories"
        },
        "series": {
            "label" : "Series",
            "placeholder" : "Select series",
            "indexLabel": "Book of {{name}} series",
            "seriesAndIndexLabel": "Book {{index}} of {{name}} series"
        },
        "seriesIndex": {
            "label" : "Sequence in series"
        },
        "language": {
            "label" : "Language",
            "placeholder" : "Select language for book",
            "required" : "Language is required"
        },
        "yearPublished": {
            "label" : "Publish Year"
        },
		"chapterCount_one" : "1 chapter",
		"chapterCount_other": "{{count}} chapters",
		"pageCount_one" : "1 page",
		"pageCount_other" : "{{count}} pages",
		"publishLabel" : "Published in {{year}}",
		"noDescription" : "No details...",
		"chapters" : {
			"title" : "Chapters"
		},
        "save": {
            "success" :"Book saved",
		    "error" :"Error saving book"
        }
	},
	"chapters" : {
		"title": "Chapters"
	},

	"reader" : {
		"settings": "Theme & Settings",
		"font" : "Font",
		"fontSize": "Font Size",
		"lineSpacing": "Line Spacing",
		"view" : {
			"title" : "View",
			"vertical": "Vertical",
			"singlePage": "Single Page",
			"flipBook": "Flip Book"
		}
	},
	"authors" : {
		"title" : "Authors",
        "actions" : {
            "add": "Add new author"
        }
	},
	"author" : {
		"writer" : "Writer",
		"poet" : "poet",
		"bookCount_one" : "1 book",
		"bookCount_other" : "{{count}} books",
		"writingCount_one" : "1 writing",
		"writingCount_other" : "{{count}} writings",
		"noDescription" : "No details...",
        "name": {
            "label": "Name",
            "placeholder": "Name of the author",
            "required": "Name is required for author"
        },
        "description": {
            "label": "Description"
        },
        "type": {
            "label": "Type",
            "placeholder": "Type of the author",
            "required": "Type is required for author",
            "writer": "Writer",
            "poet": "Poet"
        },
        "save": {
            "success":"Author saved successfully.",
            "error":"Unable to save author."
        }
	},
	"series" : {
		"title" : "Series",
		"bookCount_one" : "1 book",
		"bookCount_other" : "{{count}} books",
        "noDescription": "No details...",
        "name": {
            "label": "Name",
            "placeholder": "Name of the series",
            "required": "Name is required for series"
        },
        "description": {
            "label": "Description"
        },
        "save": {
            "success":"Series saved successfully.",
            "error":"Unable to save series."
        },
        "actions" : {
            "add": "Create new series"
        }
	},
	"categories" : {
		"title": "Categories",
		"all" : "All Categories",
		"loadingError": "Unable to load categories"
	},
	"periodicals" : {
		"title" : "Periodical",
        "actions" : {
            "add": "Create new periodical"
        }
	},
	"periodical" : {
		"issueCount_one" : "1 issue",
		"issueCount_other" : "{{count}} issues",
		"noDescription" : "No details...",
		"frequency": {
            "label": "Frequency",
            "placeholder": "Select frequency of the periodical",
            "required": "Frequency is required for periodical",
			"annually": "Annually",
			"quarterly": "Quarterly",
			"monthly": "Monthly",
			"fortnightly" : "Fortnightly",
			"weekly": "Weekly",
            "daily": "Daily",
			"unknown": "Unknown"
        },
        "title": {
            "label": "Name",
            "placeholder": "Name of the periodical",
            "required": "Name is required for periodical"
        },
        "description": {
            "label": "Description"
        },
        "language": {
            "label" : "Language",
            "placeholder" : "Select language for periodical",
            "required" : "Language is required"
        },
        "save": {
            "success":"Periodical saved successfully.",
            "error":"Periodical to save series."
        }
	},
	"fonts" : {
		"alviLahoriNastaleeq": "Alvi Lahori Nastaleeq",
        "fajerNooriNastalique": "Fajer Noori Nastaleeq",
        "gulzarNastalique": "Gulzar Nastaleeq",
        "emadNastaleeq": "Emad Nastaleeq",
        "nNafeesWebNaskh": "Nafees Web Naskh",
        "nafeesNastaleeq": "Nafees Nastaleeq",
        "mehrNastaleeq": "Mehr Nastaleeq",
        "adobeArabic": "Adobe Arabic",
        "dubai": "Dubai",
        "notoNaskhArabic": "Noto Naskh",
        "notoNastaliqUrdu": "Noto Nastaleeq",
        "jameelNooriNastaleeq": "Jameel Noori Nastaleeq",
		"jameelKhushkhati": "Jameel Khushkhati",
		"jameelNooriNastaleeqKasheeda": "Jameel Noori Nastaleeq Kasheeda"
	},
	"downloader" : {
		"title" : "Download Rekhta Book",
		"description": "Please provide the book link where you can see the book contents.",
		"loading": "Downloading Book... It can take a while to download book. Please do not close the browser while waiting for book to download.",
		"url" : {
			"title" : "Book Link",
			"required" : "Book link is required.",
			"detailsLink" : "This is a link to book details page. Please provide link to page where you can read book pages."
		},
		"convertToPdf" : {
			"pdf" : "Pdf",
			"images" : "Images"
		},
		"error" : "Unable to download book. Please make sure you have provided link where you can read the book pages."
	},
    "copyrights": {
        "Copyright": "Rights Reserved",
        "PublicDomain": "Public Domain",
        "Open": "Open",
        "CreativeCommons": "Creative Commons",
        "Unknown": "Unknown Copyrights"
    },
    "bookStatus": {
        "Published" : "Published",
        "AvailableForTyping": "Ready for typing",
        "BeingTyped": "Being Typed",
        "ReadyForProofRead" : "Ready for proof reading",
        "ProofRead" : "Proof Read"
    },
    "errors" : {
        "imageRequired": "Only image files are expected. Please select an image file."
    }
}

export default en;
