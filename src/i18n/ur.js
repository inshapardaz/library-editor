export const symbolMap = {
    1: "۱",
    2: "۲",
    3: "۳",
    4: "۴",
    5: "۵",
    6: "۶",
    7: "۷",
    8: "۸",
    9: "۹",
    0: "۰",
};
export const numberMap = {
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",
    "۰": "0",
};
const ur = {
    app: "نوشتہ",
    slogan: "اردو کی کتابیں اور بہت کچھ ، بہترین انداز میں",
    header: {
        home: "صفحۂ اوّل",
        libraries: "کتب خانے",
        libraryEditor: "تدوین کتب",
        dictionaries: "لغّات",
        fonts: "فونٹ",
        tools: "اوزار",
        writings: "تصنیفات",
        poetry: "شاعری",
        books: "کتابیں",
        authors: "مصنّفین",
        categories: "زمرہ جات",
        series: "سلسلہ جات",
        periodicals: "جرائد",
    },
    footer: {
        copyrights: "نوشتہ۔ تمام حقوق محفوظ ہیں",
    },
    actions: {
        seeMore: "مزید دیکھیں۔۔۔",
        list: "فہرست",
        card: "تصاویر",
        yes: "جی ہاں",
        no: "نہیں",
        close: "بند کریں",
        retry: "دوبارہ کوشش کریں",
        save: "تبدیلی محفوظ کریں",
        edit: "تدوین",
        delete: "حذف کیجئے",
        cancel: "اخراج",
        ok: "ٹھیک ہے",
        resizeImage: "تصویر کی تدوین",
        zoonIn: "زوم ان",
        zoonOut: "زوم آؤٹ",
        next: "اگلا",
        previous: "پچھلا",
        done: "مکمل",
        viewAll: "تمام دیکھیں",
        showMore: "مزید دیکھیں",
        hide: "چھپائیں"
    },
    errors: {
        imageRequired:
            "صرف تصاویر قابلِ قبول ہیں۔ برائے مہربانی تصویر کا انتخاب کیجئے۔",
        pdfRequired:
            "صرف پی ڈی ایف قابلِ قبول ہیں۔ برائے مہربانی  پی ڈی ایف کا انتخاب کیجئے۔",
    },
    login: {
        title: "داخل ہوں",
        message: 'خوش آمدید!',
        registerMessage: 'کیا آپ کا اکاؤنٹ موجود نہیں؟',
        email: {
            title: "ای میل",
            error: "ای میل درست نہیں",
            required: "ای میل ضروری ہے",
        },
        password: {
            title: "پاس ورڈ",
            password: "پاس ورڈ",
            required: "پاس ورڈ ضروری ہے",
        },
        error: "لاگ ان نہیں کر سکے۔ برائے مہربانی یوزر نیم اور پاسورڈ درست کیجیے۔",
    },
    logout: {
        title: "اخراج",
        confirmation: "کیا آپ لاگ آؤٹ کرنا چاہیں گے؟",
    },
    forgotPassword: {
        title: "پاسورڈ بھول گئے ہیں",
        message: "پاسورڈ بذریعہ ای میل حاصل کرنے کے لیے اپنا ای میل ایڈریس فراہم کریں۔",
        submit: "پاسورڈ حاصل کریں",
        email: {
            title: "ای میل",
            error: "ای میل درست نہیں",
            required: "ای میل ضروری ہے",
        },
        success:
            "پاس ورڈ تبدیل کرنے کے لیے ای میل ارسال کر دی گئی ہے۔ اس کی ہدایات پر عمل کیجیے۔",
        error: "ہدایت کی تکمیل نہیں ہو سکی۔ برائے مہربانی دوبارہ کوشش کیجیے۔",
    },
    register: {
        title: "رکنیت اختیار کریں",
        loginMessage: "کیا آپ صارف ہیں؟",
        submit: "رکن بنیں",
        name: {
            label: "نام",
            required: "نام ضروری ہے",
        },
        email: {
            label: "ای میل",
            error: "ای میل درست نہیں",
            required: "ای میل ضروری ہے",
        },
        password: {
            label: "پاس ورڈ",
            required: "پاس ورڈ ضروری ہے",
            length: "پاس ورڈ کم از کم 6 حروف پر مشتمل ہو",
        },
        confirmPassword: {
            label: "تصدیق پاس ورڈ",
            match: "پاس ورڈ ایک جیسے ہوں",
            required: "پاس ورڈ کی تصدیق ضروری ہے",
        },
        success: "رکنیت کامیاب رہی۔ آپاپنے اکاؤنٹ میں داخل ہو سکتے ہیں۔",
        error: "رکنیت ناکام رہی۔ دوبارہ کوشش کریں۔",
        acceptTerms: {
            title: "تمام اصول اور ضوابط تسلیم",
            requires: "تمام اصول اور ضوابط تسلیم کرنا ضروری ہیں۔",
        },
        invitation: {
            expired:
                "دعوت نامہ اب قابلِ قبول نہیں۔ نئی دعوت کے لیے ہم سے رابطہ کیجیے",
            notFound: "دعوت نامہ درست نہیں",
        },
    },
    changePassword: {
        title: "پاس ورڈ کی تبدیلی",
        submit: "پاس ورڑ کی تبدیلی",
        oldPassword: {
            label: "پرانا پاس ورڈ",
            required: "پرانا پاس ورڈ ضروری ہے",
        },
        password: {
            label: "نیا پاس ورڈ",
            required: "نیا پاس ورڈ ضروری ہے",
            length: "پاس ورڈ کم از کم 6 حروف پر مشتمل ہو",
        },
        confirmPassword: {
            label: "تصدیق پاس ورڈ",
            match: "پاس ورڈ ایک جیسے ہوں",
            required: "پاس ورڈ کی تصدیق ضروری ہے",
        },
        success: "پاس ورڈ تبدیل کر دیا گیا ہے۔",
        error: "پاس ورڈ تبدیل کرنے میں ناکامی ہوئی۔",
    },
    resetPassword: {
        title: "پاس ورڈ کی تبدیلی",
        submit: "پاس ورڑ کی تبدیلی",
        password: {
            label: "پاس ورڈ",
            required: "پاس ورڈ ضروری ہے",
            length: "پاس ورڈ کم از کم 6 حروف پر مشتمل ہو",
        },
        confirmPassword: {
            label: "تصدیق پاس ورڈ",
            match: "پاس ورڈ ایک جیسے ہوں",
            required: "پاس ورڈ کی تصدیق ضروری ہے",
        },
        success: "پاس ورڈ تبدیل کر دیا گیا ہے۔",
        error: "پاس ورڈ تبدیل کرنے میں ناکامی ہوئی۔",
        noCode: "کوڈ موجود نہیں۔ برائے مہربانی اپنی ای میل میں موجود ہدایات پر عمل کریں۔",
    },
    403: {
        title: "رسائی میں مسئلہ",
        description: "ہم معذرت خواہ ہیں لیکن آپ یہ صفحہ نہیں دیکھ سکتے۔",
        action: "صفحۂ اوّل",
    },
    404: {
        title: "گمشدہ صفحہ",
        description: "ہم معذرت خواہ ہیں لیکن آپ کا مطلوبہ صفحہ میسر نہیں۔",
        action: "صفحۂ اوّل",
    },
    500: {
        title: "تکنکتی خرابی",
        description: "ہم اس غیر متوقع خرابی کے لیے معذرت خواہ ہیں۔",
        action: "صفحۂ اوّل",
    },
    languages: {
        en: "انگریزی",
        ur: "اردو",
    },
    fonts: {
        alviLahoriNastaleeq: "علوی لاہوری نستعلیق",
        fajerNooriNastalique: "فجر نوری نستعلیق",
        gulzarNastalique: "گلزار نستعلیق",
        emadNastaleeq: "عماد نستعلیق",
        nafeesWebNaskh: "نفیس ویب نقش",
        nafeesNastaleeq: "نفیس نستعلیق",
        mehrNastaleeq: "مہر نستعلیق",
        adobeArabic: "اڈوبی عریبک",
        dubai: "دوبئی",
        notoNaskhArabic: "نوٹو نسخ",
        notoNastaliqUrdu: "نوٹو نستعلیق",
        jameelNooriNastaleeq: "جمیل نوری نستعلیق",
        jameelKhushkhati: "جمیل خوشخطی",
        jameelNooriNastaleeqKasheeda: "جمیل نوری نستعلیق کشیدہ",
    },
    copyrights: {
        Copyright: "جملہ حقوق محفوظ",
        PublicDomain: "مفت عوامی کتاب",
        Open: "آزاد",
        CreativeCommons: "کریئیٹو کامن",
        Unknown: "حقوق نا معلوم",
    },
    profile: {
        title: "پروفائل",
    },
    search: {
        header: "تلاش",
        title: "تلاش۔۔۔",
        placeholder: "تلاش برائے عنوان، مصنّف، زمرہ",
        empty: "تلاش بے نتیجہ رہی۔"
    },
    libraries: {
        title: "کتب خانے",
        loadingError: "کتب خانوں کے حصول میں ناکامی ہوئی",
        search: {
            placeholder: "تلاش کتب خانے۔۔۔",
        },
        viewAll: "تمام دیکھیں"
    },
    library: {
        noDescription: "تفصیل موجود نہیں",
        isPublic: "عوامی کتب خانہ",
    },
    categories: {
        title: "زمرے",
        all: "تمام زمرے",
        bookCount_zero: "کوئی کتاب موجود نہیں",
        bookCount_one: "1 کتاب",
        bookCount_other: "{{count}} کتب",
        writingsCount_zero: "کوئی تصنیف موجود نہیں",
        writingsCount_one: "1 تصنیف",
        writingsCount_other: "{{count}} تصنیفات",
        periodicalCount_zero: "کوئی جریدہ موجود نہیں",
        periodicalCount_one: "1 جریدہ",
        periodicalCount_other: "{{count}} جرائد",
        errors: {
            loading: {
                title: "زمرہ جات لوڈ نہیں ہو سکے",
                subTitle: "زمرہ جات کے حصول میں ناکامی ہوئی",
            },
        },
        empty: {
            title: "کوئی زمرہ موجود نہیں",
        },
    },
    bookStatus: {
        Published: "شائع ہو چکی ہے",
        AvailableForTyping: "ٹائپ کے لیے دستیاب",
        BeingTyped: "ٹائپنگ",
        ReadyForProofRead: "ٹائپنگ مکمل",
        ProofRead: "پروف خوانی",
        Completed: "مکمل",
    },
    editingStatus: {
        Available: "دستیاب",
        Typing: "ٹائپنگ",
        Typed: "ٹائپنگ مکمل",
        InReview: "پروف خوانی",
        Completed: "مکمل",
        All: "تمام",
    },
    books: {
        empty: "کتب موجود نہیں",
        title: "کتابیں",
        description: "کتابوں کے ذخیرے سے انتخاب",
        allBooks: "تمام کتب",
        withStatus: {
            ProofRead: "پروف ریڈ کتابیں",
            BeingTyped: "زیرِ طبع کتابیں",
        },
        error: {
            loading: {
                title: "کتب حاصل نہیں ہو سکیں",
                detail: "کتب کے حصول میں غیر متوقع مسئلہ پیدا ہوا۔ برائے مہربانی دوبارہ کوشش کریں۔"
            }
        }
    },
    book: {
        title: {
            label: "نام",
            placeholder: "کتاب کا نام",
            required: "کتاب کا نام ضروری ہے",
        },
        description: {
            label: "تفصیل",
            placeholder: "کتاب کے مترلق کچھ تفصیل",
        },
        public: {
            label: "عوامی کتاب",
        },
        authors: {
            label: "مصنّفین",
            placeholder: "کتاب کے مصنّفین کا نام",
            required: "مصنّف کا نام ضروری ہے۔",
        },
        copyrights: {
            label: "حقوق",
        },
        status: {
            label: "کیفیت",
            placeholder: "کتاب کی کیفیت چنیں",
        },
        categories: {
            label: "زمرہ",
            placeholder: "زمرہ چنیں",
        },
        language: {
            label: "زبان",
            placeholder: "کتاب کی زبان چنیں",
            required: "کتاب کی زبان ضروری ہے۔",
        },
        yearPublished: {
            label: "سنِ اشاعت",
            placeholder: "کتاب کا سن اشاعت",
        },
        series: {
            label: "سلسلہ",
            placeholder: "کتاب  کس سلسے سے ہے",
            indexLabel: "{{name}} سلسلے کی کتاب",
            seriesAndIndexLabel: "{{name}} سلسلے کی کتاب {{index}}",
        },
        seriesIndex: {
            label: "سلسلے میں ترتیب",
        },
        publisher: {
            label: "ناشر",
            placeholder: "کتاب کا ناشر",
        },
        source: {
            label: "ماخذ",
            placeholder: "کتاب کا ماخذ",
        },
        dateCreated: "تاریخ اندراج",
        latestBooks: "نئی کتب",
        lastRead: "زیر مطالعہ کتب",
        favorites: "پسندیدہ",
        noDescription: "تفصیل دستیاب نہیں۔۔۔",
        chapters: "ابواب",
        chapterCount_zero: "باب موجود نہیں",
        chapterCount_one: "1 باب",
        chapterCount_other: "{{count}} ابواب",
        pageCount_zero: "صفحہ موجود نہیں",
        pageCount_one: "1 صفحہ",
        pageCount_other: "{{count}} صفحات",
        fileCount_one: "1 دستاویز",
        fileCount_other: "{{count}} دستاویزات",
        publishLabel: "{{year}} میں شائع ہوئی",
        isPublic: "عوامی کتاب",
        actions: {
            addFavorite: {
                success: 'کتاب پسندیدہ کتب میں داخل کر دی  گئی ہے۔',
                error: 'کتاب پسندیدہ کتب میں داخل نہیں کی جا سکی۔'
            },
            removeFavorite: {
                success: 'کتاب پسندیدہ کتب سے خارج کر دی گئی ہے۔',
                error: 'کتاب پسندیدہ کتب سے نکالی نہیں جا سکی۔'
            },
            read: {
                title: "مطالعہ کیجئے"
            },
            download: {
                title: "ڈائنلوڈ کیجئے"
            },
            add: {
                label: "نئی کتاب بنائیں",
                title: "نئی کتاب",
                success: "کتاب کامیابی سے تخلیق کر دی گئی ہے۔",
                error: "کتاب تخلیق کرنے میں ناکامی ہوئی۔",
            },
            edit: {
                title: "'{{title}}' کی تدوین",
                success: "کتاب میں تبدیلیاں محفوظ ہو گئی ہیں۔",
                error: "کتاب میں تبدیلیاں محفوظ نہیں کی جا سکیں۔",
            },
            delete: {
                title: "کتاب حذف کریں؟",
                message:
                    "کیا آپ کتاب '{{title}}' کو حذف کرنا چاہیں گے؟ ایسا کرنے سے اس کتاب سے متعلق تمام مواد بشمول ابواب، صفحات اور تمام دستاویزات حذف ہو جائیں گی۔",
                success: "کتاب حذف کر دی گئی ہے۔",
                error: "کتاب حذف کرنے میں ناکامی ہوئی۔",
            },
            addFile: {
                title: "فائل اپلوڈ کریں",
                success: "فائل کامیابی سے اپلوڈ کر دی گئی ہے۔",
                error: "فائل اپلوڈ کرنے میں نامامی ہوئی۔",
            },
            deleteFile: {
                title: "فایئل حذف کریں؟",
                message: "کیا آپ  '{{title}}' فائل کو حذف کرنا چاہیں گے؟",
            },
            downloadFile: {
                title: "فائل ڈائنلوڈ",
            },
            loadFileImages: {
                title: "فائل کے صفحات لوڈ کریں",
                progress: "{{total}} سے {{completed}} صفحات لوڈ ہو گئے ہیں۔",
                selectOtherFile: "دوسری فائل چنیں",
                page: "{{current}} / {{total}}",
                loadSavedSetting: "پہلے سے محفوظ شدہ ترتیبات استعمال کریں",
                messages: {
                    downloadingFile: "فائل ڈاؤنلوڈ ہو رہی ہے۔۔۔",
                    loadingPages:
                        "پی ڈی ایف کے صفحات لوڈ ہو رہے ہیں۔ اس میں کچھ وقت لگ سکتا ہے۔ برائے مہربانی براؤزر کو کھلا اور فوکس میں رکھیں۔",
                    savingPages:
                        "صفحات محفوظ ہو رہے ہیں۔ اس میں کچھ وقت لگ سکتا ہے۔ برائے مہربانی براؤزر کو کھلا اور فوکس میں رکھیں۔",
                    loading:
                        "پی ڈی ایف کے صفحات لوڈ ہو رہے ہیں۔ اس میں کچھ وقت لگ سکتا ہے۔",
                    loaded: "تمام صفحات لوڈ ہو چکے ہیں۔",
                    failedLoading:
                        "صفحات لوڈ کرنے میں ناکامی ہوئی۔ برائے مہربانی دوبارہ کوشش کیجیے",
                    selectImage: "برائے مہربانی تصویر چنیں",
                    errorFileType: "صرف پی ڈی ایف فائل استعمال کر سکتے ہیں۔",
                    errorLoadingSavedSettings:
                        "محفوظ شدہ ترجیحات ناقابلِ استعمال ہیں اور انہیں حذف کر دیا گیا ہے۔",
                },
            },
            split: {
                title: "تقسیم کریں",
            },
            applySplitToAll: {
                title: "تمام صفحات پر ترجیحات نافذ کریں",
            },
            applySplitToAllBelow: {
                title: "تمام اگلے صفحات پر ترجیحات نافذ کریں",
            },
            processAndSave: {
                title: "صفحات کو محفوظ کریں",
            },
            setFirstPageAsImage: {
                title: "پہلا صفحہ کتاب کا سر ورق بنائیں",
                message:
                    "کیا آپ اس فائل کا پہلا صفحہ کتاب کا سر ورق بنانا چاہتے ہیں؟َ",
                success: "کتاب کا سر ورق محفوظ ہو گیا ہے۔",
                error: "کتاب کا سر ورق محفوظ کرنے میں ناکامی ہوئی۔",
            },
            publish: {
                title: "کتاب شائع",
                message:
                    "کیا آپ کتاب '{{title}}'کو شائع کرنا چاہیں گے؟ تمام صفحات کا متن جمع کر کے ابواب میں لکھ دیا جائے گا اور اس سے ابواب کا موجودہ متن  ضائع ہو جائے گا۔",
                success: "کتاب شائع ہو گئی ہے",
                error: "کتاب شائع کرنے میں ناکامی",
            },
        },
        error: {
            loading: {
                title: "کتاب حاصل نہیں ہو سکیں",
                detail: "کتاب کے حصول میں غیر متوقع مسئلہ پیدا ہوا۔ برائے مہربانی دوبارہ کوشش کریں۔"
            },
            loadingChapters: {
                title: "ابواب حاصل نہیں ہو سکیں",
                detail: "ابواب کے حصول میں غیر متوقع مسئلہ پیدا ہوا۔ برائے مہربانی دوبارہ کوشش کریں۔"
            },
            loadingChapter: {
                title: "باب حاصل نہیں ہو سکیں",
                detail: "باب کے حصول میں غیر متوقع مسئلہ پیدا ہوا۔ برائے مہربانی دوبارہ کوشش کریں۔"
            },
            loadingPage: {
                title: "صفحہ حاصل نہیں ہو سکیں",
                detail: "صفحہ کے حصول میں غیر متوقع مسئلہ پیدا ہوا۔ برائے مہربانی دوبارہ کوشش کریں۔"
            },
        },
        statuses: {
            Published: "شائع ہو چکی ہے",
            AvailableForTyping: "ٹائپ کے لیے دستیاب",
            BeingTyped: "ٹائپنگ",
            ReadyForProofRead: "ٹائپنگ مکمل",
            ProofRead: "پروف خوانی",
            Completed: "مکمل",
            All: "تمام",
        },
    },
    writings: {
        title: "تصنیفات",
        description: "تصنیفات کی دنیا سے انتخاب",
        empty: "نصنیف موجود نہیں",
        all: "تمام تصنیفات",
        latest: "نئی تصنیفات",
        lastRead: "زیر مطالعہ تصنیفات",
        favorites: "پسندیدہ",
        error: {
            loading: {
                title: "تصنیفات حاصل نہیں ہو سکیں",
                detail: "تصنیفات کے حصول میں غیر متوقع مسئلہ پیدا ہوا۔ برائے مہربانی دوبارہ کوشش کریں۔"
            }
        }
    },
    writing: {
        title: "عنوان",
        lastModified: "تاریخ تدوین",
        noDescription: "تفصیل دستیاب نہیں۔۔۔",
        actions: {
            addFavorite: {
                success: 'نصنیف پسندیدہ تصنیفات میں داخل کر دی  گئی ہے۔',
                error: 'نصنیف پسندیدہ تصنیفات میں داخل نہیں کی جا سکی۔'
            },
            removeFavorite: {
                success: 'نصنیف پسندیدہ تصنیفات سے خارج کر دی گئی ہے۔',
                error: 'نصنیف پسندیدہ تصنیفات سے نکالی نہیں جا سکی۔'
            },
        },
        error: {
            loading: {
                title: "نصنیف حاصل نہیں ہو سکیں",
                detail: "نصنیف کے حصول میں غیر متوقع مسئلہ پیدا ہوا۔ برائے مہربانی دوبارہ کوشش کریں۔"
            }
        }
    },
    poetries: {
        title: "شاعری",
        description: "شاعری کی دنیا سے انتخاب",
        empty: "شاعری موجود نہیں",
        all: "تمام شاعری",
        latest: "نئی شاعری",
        lastRead: "زیر مطالعہ شاعری",
        favorites: "پسندیدہ",
        error: {
            loading: {
                title: "شاعری حاصل نہیں ہو سکیں",
                detail: "شاعری کے حصول میں غیر متوقع مسئلہ پیدا ہوا۔ برائے مہربانی دوبارہ کوشش کریں۔"
            }
        }
    },
    poetry: {
        title: "عنوان",
        lastModified: "تاریخ تدوین",
        noDescription: "تفصیل دستیاب نہیں۔۔۔",
        actions: {
            addFavorite: {
                success: 'شاعری پسندیدہ شاعری میں داخل کر دی  گئی ہے۔',
                error: 'شاعری پسندیدہ شاعری میں داخل نہیں کی جا سکی۔'
            },
            removeFavorite: {
                success: 'شاعری پسندیدہ شاعری سے خارج کر دی گئی ہے۔',
                error: 'شاعری پسندیدہ شاعری سے نکالی نہیں جا سکی۔'
            },
        },
        error: {
            loading: {
                title: "شاعری حاصل نہیں ہو سکیں",
                detail: "شاعری کے حصول میں غیر متوقع مسئلہ پیدا ہوا۔ برائے مہربانی دوبارہ کوشش کریں۔"
            }
        }
    },
    author: {
        name: {
            label: "نام",
            placeholder: "مصنّف کا نام",
            required: "مصنف کے لیے نام ضروری ہے",
        },
        description: {
            label: "تفصیل",
        },
        type: {
            label: "قسم",
            placeholder: "مصنف کی قسم",
            required: "مصنّف کی قسم ضروری ہے",
            writer: "لکھاری",
            poet: "شاعر",
        },
        bookCount_zero: "کوئی کتاب موجود نہیں",
        bookCount_one: "1 کتاب",
        bookCount_other: "{{count}} کتب",
        articleCount_zero: "کوئی مضمون نہیں",
        articleCount_one: "1 مضمون",
        articleCount_other: "{{count}} مضامین",
        poetryCount_zero: "اشعار موجود نہیں",
        poetryCount_one: "1 اشعار",
        poetryCount_other: "{{count}} اشعار",
        booksTabLabel: "کتب ({{count}})",
        writingsTabLabel: "مضامین ({{count}})",
        poetryTabLabel: "اشعار ({{count}})",
        error: {
            loading: {
                title: "مصنّف حاصل نہیں ہو سکیں",
                detail: "مصنّف کے حصول میں غیر متوقع مسئلہ پیدا ہوا۔ برائے مہربانی دوبارہ کوشش کریں۔"
            }
        },
        actions: {
            add: {
                label: "نیا مصنّف تخلیق کریں",
                labelWithName: "'{{name}}' تخلیق کریں",
                title: "نیا مصنّف",
                success: "مصنّف کامیابی سے تخلیق کر دی گئی ہے۔",
                error: "مصنّف تخلیق کرنے میں ناکامی ہوئی۔",
            },
            edit: {
                title: "'{{name}}' کی تدوین",
                success: "مصنّف میں تبدیلیاں محفوظ ہو گئی ہیں۔",
                error: "مصنّف میں تبدیلیاں محفوظ نہیں کی جا سکیں۔",
            },
            delete: {
                title: "مصنّف حذف کریں؟",
                message:
                    "کیا آپ مصنّف '{{name}}' کو حذف کرنا چاہیں گے؟ ایسا کرنے سے اس مصنّف سے متعلق تمام مواد بشمول کتب، تصنیفات اور تمام دستاویزات حذف ہو جائیں گی۔",
                success: "مصنّف حذف کر دی گئی ہے۔",
                error: "مصنّف حذف کرنے میں ناکامی ہوئی۔",
            },
        },
    },
    authors: {
        empty: "کوئی مصنّف نہیں",
        title: "مصنّفین",
        description: "بہتریں مصنفین میں سے انتخاب",
        error: {
            loading: {
                title: "مصنّفین حاصل نہیں ہو سکیں",
                detail: "مصنّفین کے حصول میں غیر متوقع مسئلہ پیدا ہوا۔ برائے مہربانی دوبارہ کوشش کریں۔"
            }
        }
    },
    series: {
        label: "سلسلہ جات",
        title: "عنوان",
        description: "کتابوں کے سلسلے",
        empty: "سلسلہ جات دستیاب نہیں۔",
        noOfBooks: "کتب کی تعداد",
        noDescription: "تفصیل دستیاب نہیں۔۔۔",
        bookCount_zero: "کوئی کتاب موجود نہیں",
        bookCount_one: "1 کتاب",
        bookCount_other: "{{count}} کتب",
        error: {
            loading: {
                title: "سلسلہ حاصل نہیں ہو سکیں",
                detail: "سلسلہ کے حصول میں غیر متوقع مسئلہ پیدا ہوا۔ برائے مہربانی دوبارہ کوشش کریں۔"
            }
        },
        actions: {
            add: {
                label: "نیا سلسلہ بنائیں",
                labelWithName: "'{{name}}' تخلیق کریں",
                title: "نیا سلسلہ",
                success: "سلسلہ کامیابی سے تخلیق کر دیا گیا ہے۔",
                error: "سلسلہ تخلیق کرنے میں ناکامی ہوئی۔",
            },
            edit: {
                title: "'{{name}}' کی تدوین",
                success: "سلسلے میں تبدیلیاں محفوظ ہو گئی ہیں۔",
                error: "سلسلے میں تبدیلیاں محفوظ نہیں کی جا سکیں۔",
            },
            delete: {
                title: "سلسلہ حذف کریں؟",
                message:
                    "کیا آپ سلسلہ '{{name}}' کو حذف کرنا چاہیں گے؟ ایسا کرنے سے اِس سلسلے سے متعلق تمام مواد حذف ہو جائے گا۔",
                success: "سلسلہ حذف کر دی گئی ہے۔",
                error: "سلسلہ حذف کرنے میں ناکامی ہوئی۔",
            },
        },
    },
    reader: {
        themes: {
            white: "سفید",
            dark: "تاریک",
            sepia: "خاکی",
            grey: "گرے",
        },
        view: "پیشکش",
        theme: "رنگ",
        font: "فانٹ",
        fontSize: "متن کا سائز",
        lineHeight: "سطری فاصلہ",
    },
    periodicals: {
        title: "جرائد",
        all: "تمام جرائد",
        errors: {
            loading: {
                title: "جرائد حاصل نہیں ہو سکے",
                subTitle: "براہ کرم دوبارہ کوشش کریں۔",
            },
        },
        empty: {
            title: "جرائد موجود نہیں",
        },
        search: {
            placeholder: "تلاش جرائد۔۔۔",
        },
    },
    periodical: {
        issueCount_one: "1 شمارہ",
        issueCount_other: "{{count}} شمارے",
        noDescription: "تفصیل دستیاب نہیں۔۔۔",
        frequency: {
            label: "اشاعت",
            placeholder: "اشاعت کی تعداد",
            required: "جریدے کے لیے اشاعت ضروری ہے",
            annually: "سالانہ",
            quarterly: "سہ ماہی",
            monthly: "ماہانہ",
            fortnightly: "پندرواڑہ",
            weekly: "ہفتہ وار",
            daily: "روز نامہ",
            unknown: "نا معلوم",
        },
        title: {
            label: "نام",
            placeholder: "جریدے کا نام",
            required: "جریدے کے لیے نام ضروری ہے",
        },
        description: {
            label: "تفصیل",
        },
        language: {
            label: "زبان",
            placeholder: "جریدے کی زبان چنیں",
            required: "جریدے کی زبان ضروری ہے۔",
        },
        categories: {
            label: "زمرے",
            placeholder: "جریدے کے زمرے چنیں",
        },
    },
    issues: {
        title: "شمارے",
        errors: {
            loading: {
                title: "شمارے حاصل نہیں ہو سکے",
                subTitle: "براہ کرم دوبارہ کوشش کریں۔",
            },
        },
        empty: {
            title: "شمارے دستیاب نہیں ہیں",
        },
    },
    issue: {
        articleCount_zero: "مضمون موجود نہیں",
        articleCount_one: "1 مضمون",
        articleCount_other: "{{count}} مضامین",
        pageCount_zero: "صفحہ موجود نہیں",
        pageCount_one: "1 صفحہ",
        pageCount_other: "{{count}} صفحات",
        volumeNumber: {
            title: "جلد نمبر {{volumeNumber}}",
            label: "جلد نمبر",
            placeholder: "شمارے کا جلد نمبر",
            required:
                "سمارے کا جلد نمبر جاہیے۔ اگر جلد نمبر نہیں تو صفر استعمال کیجئے۔",
        },
        issueNumber: {
            title: "شمارہ نمبر {{issueNumber}}",
            label: "شمارہ  نمبر",
            placeholder: "شمارے کا جلد میں نمبر",
            required: "شمارے کا نمبر ضروری ہے۔",
        },
        issueDate: {
            label: "تریخ اشاعت",
            required: "تریخ اشاعت ضروری ہے",
        },
        status: {
            label: "کیفیت",
            placeholder: "کتاب کی کیفیت چنیں",
        },
        articles: {
            title: "مضامین",
            errors: {
                loading: {
                    title: "مضامین حاصل نہیں ہو سکے",
                    subTitle: "براہ کرم دوبارہ کوشش کریں۔",
                },
            },
            empty: {
                title: "مضامین دستیاب نہیں ہیں",
            },
        },
        article: {
            title: "مضمون",
            errors: {
                loading: {
                    title: "مضمون حاصل نہیں ہو سکا",
                    subTitle: "براہ کرم دوبارہ کوشش کریں۔",
                },
            },
            empty: {
                title: "مضمون دستیاب نہیں ہیں",
            },
        },
        files: {
            title: "دستاویزات",
            empty: {
                title: "دستاویز دستیاب نہیں",
            },
        },
        pages: {
            title: "صفحات",
            editor: {
                unsavedContents:
                    "غیر محفوظ شدہ مندرجات موجود ہیں۔ وہیں سے تدوین جاری رکھیں؟",
            },
            empty: {
                title: "صفحات موجود نہیں",
            },
        },
    },
    moment: {
        months: [
            "جنوری",
            "فروری",
            "مارچ",
            "اپریل",
            "مئی",
            "جون",
            "جولائی",
            "اگست",
            "ستمبر",
            "اکتوبر",
            "نومبر",
            "دسمبر",
        ],
        weekdays: ["اتوار", "سوموار", "منگل", "بدھ", "جمعرات", "جمعہ", "ہفتہ"],
        calendar: {
            sameDay: "[آج بوقت] LT",
            nextDay: "[کل بوقت] LT",
            nextWeek: "dddd [بوقت] LT",
            lastDay: "[گذشتہ روز بوقت] LT",
            lastWeek: "[گذشتہ] dddd [بوقت] LT",
            sameElse: "L",
        },
        relativeTime: {
            future: "%s بعد",
            past: "%s قبل",
            s: "چند سیکنڈ",
            ss: "%d سیکنڈ",
            m: "ایک منٹ",
            mm: "%d منٹ",
            h: "ایک گھنٹہ",
            hh: "%d گھنٹے",
            d: "ایک دن",
            dd: "%d دن",
            M: "ایک ماہ",
            MM: "%d ماہ",
            y: "ایک سال",
            yy: "%d سال",
        },
        ordinal: function (number) {
            switch (number) {
                case "1":
                    return "یکم";
                case "2":
                    return "یکم";
                default:
                    return number;
            }
        },
        meridiem: function (hour) {
            if (hour > 20 && hour < 4) {
                return "رات";
            }
            if (hour < 6) {
                return "صبح صادق";
            } else if (hour > 6) {
                return "صبح";
            } else if (hour > 12) {
                return "دوپہر";
            } else if (hour > 5) {
                return "سہ پہر";
            } else if (hour > 8) {
                return "شام";
            } else {
                return "رات";
            }
        },
    },
};

export default ur;