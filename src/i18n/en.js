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
		"header" : "Search",
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
        "errors": {
            "loading": {
                "title": "Error",
                "subTitle": "Unable to load books.",
            }
        },
        "empty" : {
            "title" : "No latest book found",
        },
        "search": {
            "placeholder" : "Search books..."
        },
        "sort": {
            "title" : "Title",
            "dateCreated" : "Date Added",
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
        "pages": {
            "title" : "Pages"
        },
        "files": {
            "title" : "Files",
        },
        "actions": {
            "add": {
                "label": "Add new book",
                "title": "New Book",
                "success" :"Book created successfully.",
		        "error" :"Error creating book."
            },
            "edit": {
                "title": "Editing '{{title}}'",
                "success" :"Book saved successfully.",
                "error" :"Error saving book"
            },
            "delete": {
                "title" : "Delete book?",
                "message": "Are you sure you want to delete book '{{title}}'? It will remove all of its contents including chapters, pages and files.",
                "success" :"Book deleted successfully.",
                "error" :"Error deleting book."
            }
        }
	},
	"chapters" : {
		"title": "Chapters",
        "errors": {
            "loading": {
                "title": "Error",
                "subTitle": "Unable to load chapters.",
            }
        },
        "empty" : {
            "title" : "No chapter found",
        }
	},
    "chapter" : {
        "title" : {
            "label": "Title",
            "placeholder" : "Title of chapter",
            "required" : "Chapter title is required"
        },
        "status": {
            "label": "Status",
            "placeholder" : "Select Chapter Status",
            "required" : "Chapter status is required"
        },
        "user" : {
            "label": "User",
            "placeholder" : "Select user",
            "required" : "User is required"

        },
        "actions": {
            "add": {
                "label": "Add new chapter",
                "title": "New Chapter",
                "success" :"Chapter created successfully.",
                "error" :"Error creating chapter"
            },
            "edit": {
                "title": "Editing '{{title}}'",
                "success" :"Chapter saved successfully.",
                "error" :"Error saving chapter."
            },
            "delete": {
                "title" : "Delete Chapter?",
                "title_other" : "Delete {{count}} chapters",
                "message": "Are you sure you want to delete chapter '{{titles}}'?",
                "message_other": "Are you sure you want to delete chapters '{{titles}}'?",
                "success" :"Chapter deleted successfully.",
                "success_other" :"{{count}} Chapters deleted successfully.",
                "error" :"Error deleting chapter.",
                "error_other" :"Error deleting {{ count }}} chapters."
            },
            "updateStatus": {
                "title": "Updating Status",
                "success" :"Chapter status updated successfully.",
                "error" :"Error saving chapter statuses."
            },
            "assign": {
                "title_one" : "Assign Chapter {{count}}",
                "title_other" : "Assign Chapters {{count}}",
                "message": "Assigning Chapter(s) '{{ chapterNumber }}'?",
                "success_one" :"Chapter assigned successfully.",
                "success_other" :"{{count}} chapters assigned successfully.",
                "error_one" :"Error assigning chapter.",
                "error_other" :"Error assigning {{count}} chapters."
            },
            "reorder": {
                "success" :"Chapter ordered successfully.",
                "error" :"Error ordering chapter."
            }
        },
        "errors": {
            "loading": {
                "title": "Error",
                "subTitle": "Unable to load books.",
            }
        }
    },
    "pages" : {
        "errors": {
            "loading": {
                "title": "Error",
                "subTitle": "Unable to load pages.",
            }
        },
        "empty" : {
            "title" : "No page found",
        },
        "assignment": {
            "all": "All",
            "mine": "Assigned to me",
            "assigned": "Assigned",
            "unassigned": "Unassigned",
            "allStatuses": "All Statuses",
        },
        "filters": {
            "all": "All",
            "availableToType": "Available",
            "typing": "Typing",
            "typed": "Typed",
            "proofreading": "Proofreading",
            "completed": "Completed",
        }
    },
    "page": {
        "sequenceNumber": {
          "title": "Sequence Number",
          "required" : "Sequence Number is required."
        },
        "status": {
          "title": "Status",
          "required" : "Status is required.",
          "placeholder" : "Select status"
        },
        "chapter": {
          "label": "Chapter",
          "required" : "Chapter is required.",
          "placeholder" : "Select chapter",
        },
        "user" : {
            "label": "User",
            "placeholder" : "Select user",
            "required" : "User is required"
        },
        "actions": {
            "add": {
                "label": "Add new page",
                "title": "New page",
                "success" :"Page created successfully.",
		        "error" :"Error creating page."
            },
            "edit": {
                "title": "Editing page {{sequenceNumber}}",
            },
            "assign": {
                "title_one" : "Assign page {{count}}",
                "title_other" : "Assign pages {{count}}",
                "message": "Assigning page(s) '{{ sequenceNumber }}'?",
                "success_one" :"Page assigned successfully.",
                "success_other" :"{{count}} pages assigned successfully.",
                "error_one" :"Error assigning page.",
                "error_other" :"Error assigning {{count}} pages."
            },
            "uploadPage" : {
                "label": "Upload new page",
                "title": "Upload page",
                "success" :"Page created successfully.",
		        "error" :"Error creating page."
            },
            "uploadPdf" : {
                "label": "Upload PDF",
                "title": "Upload PDF File",
                "success" :"PDF uploaded successfully.",
		        "error" :"Error uploading pdf."
            },
            "uploadZip" : {
                "label": "Upload Zip",
                "title": "Upload Zip File",
                "success" :"Zip file uploaded successfully.",
		        "error" :"Error uploading zip file."
            },
            "updateStatus": {
                "title": "Updating Status",
                "success" :"Page status updated successfully.",
                "error" :"Error saving page statuses."
            },
            "delete": {
                "title_one" : "Delete page",
                "title_other" : "Delete {{count}} pages",
                "message": "Are you sure you want to delete page '{{ sequenceNumber }}'?",
                "success" :"Page deleted successfully.",
                "error" :"Error deleting page."
            },
            "setChapter": {
                "title_one" : "Setting Chapter",
                "title_other" : "Setting Chapter for {{count}} pages",
                "message": "Are you sure you want to change chapter for page(s) '{{ sequenceNumber }}'?",
                "success" :"Pages updated successfully.",
                "error" :"Error updating pages."
            },
            "sequence": {
                "label" : "Move page",
                "title" : "Move page?",
                "message": "Please provide new sequence number for page '{{ sequenceNumber }}'?",
                "success" :"Page moved successfully.",
                "error" :"Error moving page."
            }
        }
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
        "errors": {
            "loading": {
                "title": "Error",
                "subTitle": "Unable to load authors.",
            }
        },
        "empty" : {
            "title" : "No Authors"
        },
        "search": {
            "placeholder" : "Search authors..."
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
        "actions": {
            "add": {
                "label": "Add new author",
                "title": "New Author",
                "success" :"Author created successfully.",
		        "error" :"Error creating author."
            },
            "edit": {
                "title": "Editing '{{name}}'",
                "success" :"Author saved successfully.",
                "error" :"Error saving author"
            },
            "delete": {
                "title" : "Delete author?",
                "message": "Are you sure you want to delete author '{{name}}'? It will remove all of its contents including books, writing and files.",
                "success" :"Author deleted successfully.",
                "error" :"Error deleting author."
            }
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
        "actions": {
            "add": {
                "label": "Add new series",
                "title": "New Series",
                "success" :"Series created successfully.",
                "error" :"Error creating series"
            },
            "edit": {
                "title": "Editing '{{name}}'",
                "success" :"Series saved successfully.",
                "error" :"Error saving series."
            },
            "delete": {
                "title" : "Delete Series?",
                "message": "Are you sure you want to delete series '{{name}}'?",
                "success" :"Series deleted successfully.",
                "error" :"Error deleting series."
            }
        },
        "errors": {
            "loading": {
                "title": "Error",
                "subTitle": "Unable to load series.",
            }
        },
        "empty" : {
            "title" : "No Series"
        }
	},
	"categories" : {
		"title": "Categories",
		"all" : "All Categories",
        "errors": {
            "loading": {
                "title": "Error",
                "subTitle": "Unable to load categories",
            }
        },
        "empty" : {
            "title" : "No Categories"
        }
	},
    "category" : {
        "name": {
            "label": "Name",
            "placeholder": "Name of the category",
            "required": "Name is required for category"
        },
        "bookCount_one" : "1 book",
		"bookCount_other" : "{{count}} books",
        "actions": {
            "add": {
                "label": "Add new category",
                "title": "New Category",
                "success" :"Category created successfully.",
		        "error" :"Error creating category."
            },
            "edit": {
                "title": "Editing '{{name}}'",
                "success" :"Category saved successfully.",
                "error" :"Error saving category"
            },
            "delete": {
                "title" : "Delete category?",
                "message": "Are you sure you want to delete category '{{name}}'?",
                "success" :"Category deleted successfully.",
                "error" :"Error deleting category."
            }
        }
    },
	"periodicals" : {
		"title" : "Periodical",
        "errors": {
            "loading": {
                "title": "Error",
                "subTitle": "Unable to load periodical",
            }
        },
        "empty" : {
            "title" : "No Periodicals"
        },
        "search": {
            "placeholder" : "Search periodicals..."
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
        "categories": {
            "label" : "Categories",
            "placeholder" : "Select categories for periodical"
        },
        "actions": {
            "add": {
                "label": "Add new periodical",
                "title": "New Periodical",
                "success" :"Periodical created successfully.",
		        "error" :"Error creating periodical."
            },
            "edit": {
                "title": "Editing '{{name}}'",
                "success" :"Periodical saved successfully.",
                "error" :"Error saving periodical"
            },
            "delete": {
                "title" : "Delete periodical?",
                "message": "Are you sure you want to delete periodical '{{name}}'? It will remove all of its contents including issue, articles and files.",
                "success" :"Periodical deleted successfully.",
                "error" :"Error deleting periodical."
            }
        }
    },
    "issues": {
        "title" : "Issues",
        "errors": {
            "loading": {
                "title": "Error",
                "subTitle": "Unable to load issues.",
            }
        },
        "empty" : {
            "title" : "No issues"
        }
    },
    "issue": {
        "volumeNumber": {
            "label": "Volume Number",
            "placeholder": "Volume number for issue",
            "required": "Volume number is required for issue. If there is no volume number, enter 0.",
        },
        "issueNumber": {
            "label": "Issue Number",
            "placeholder": "Issue number for issue",
            "required": "Issue number is required for issue.",
        },
        "issueDate": {
            "label": "Issue Date",
            "required": "Issue date is required for issue",
        },
        "actions": {
            "add": {
                "label": "Add new issue",
                "title": "New issue",
                "success" :"Issue created successfully.",
		        "error" :"Error creating issue."
            },
            "edit": {
                "title": "Editing '{{name}}'",
                "success" :"Issue saved successfully.",
                "error" :"Error saving issue"
            },
            "delete": {
                "title" : "Delete issue?",
                "message": "Are you sure you want to delete issue '{{name}}'? It will remove all of its contents.",
                "success" :"Issue deleted successfully.",
                "error" :"Error deleting issue."
            }
        }
    },
    "users" : {
        "empty" : {
            "title" : "No Series"
        },
        "me": {
            "title": "Me",
        },
        "none": {
            "title": "Unassign",
        },
        "others": {
            "title": "Other users",
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
    "editingStatus": {
        "Available" : "Available",
        "Typing": "Being Typed",
        "Typed": "Typed",
        "InReview" : "In Review",
        "Completed" : "Completed"
    },
    "sort": {
        "ascending": "Ascending",
        "descending": "Descending",
    },
    "errors" : {
        "imageRequired": "Only image files are expected. Please select an image file."
    }

}

export default en;
