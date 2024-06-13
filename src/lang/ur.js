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
    slogan: "آج کچھ نیا پڑھیں",
    header: {
        home: "صفحۂ اوّل",
        libraries: "کتب خانے",
        writings: "تصنیفات",
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
        resizeImage: "تصویر کی تدوین",
        zoonIn: "زوم ان",
        zoonOut: "زوم آؤٹ",
        next: "اگلا",
        previous: "پچھلا",
        done: "مکمل",
    },
    login: {
        title: "داخل ہوں",
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
    profile: {
        title: "پروفائل",
    },
    search: {
        header: "تلاش",
        title: "تلاش۔۔۔",
        placeholder: "تلاش برائے عنوان، مصنّف، زمرہ",
    },
    home: {
        welcome:
            "نوشتہ میں خوش آمدید۔ یہاں آپ لائیبریوں سے منتفیض ہو سکتے ہیں۔",
        gettingStarted: "ابتدا کیجیے",
    },
    libraries: {
        title: "کتب خانے",
        loadingError: "کتب خانوں کے حصول میں ناکامی ہوئی",
        search: {
            placeholder: "تلاش کتب خانے۔۔۔",
        },
    },
    library: {
        loadingError: "کتاب خانے کی تفصیل حاصل کرنے میں ناکامی ہوئی",
        noDescription: "تفصیل دستیاب نہیں۔۔۔",
        bookCount_one: "ایک کتاب",
        bookCount_other: "{{count}} کتاب",
        email: {
            label: "کتاب خانہ منتظم کا ای میل",
            placeholder: "منتظم کا ای میل داخل کریں",
            error: "ای میل درست نہیں",
            required: "منتظم کا ای میل ضروری ہے۔",
        },
        name: {
            label: "نام",
            placeholder: "کتاب خانہ کا نام",
            required: "کتاب خانہ کا نام ضروری ہے۔",
        },
        description: {
            label: "تفصیل",
            placeholder: "کتاب خانہ کی تفصیل",
            noDescription: "تفصیل دستیاب نہیں۔۔۔",
        },
        language: {
            label: "زبان",
            placeholder: "کتاب خانہ کہ زبان",
            required: "زبان ضروری ہے",
        },
        isPublic: {
            label: "عوامی کتاب خانہ",
        },
        supportPeriodicals: {
            label: "رسائل ",
        },
        fileStoreType: {
            label: "فائل سٹوریج ٹائپ",
            placeholder: "فائل سٹوریج ٹائپ چنیں",
            required: "فائل سٹوریج ٹائپ ضروری ہے",
            database: "ڈیٹابیس",
            azurebolbstorage: "ایثور بلاب سٹوریج",
            s3storage: "ایس تھری سٹوریج",
            filesystem: "فائل سسٹم",
        },
        fileStoreSource: {
            label: "فائل سٹوریج کا ماخذ",
            placeholder: "فائل سٹوریج کا ماخذ داخل کریں",
            required: "فائل سٹوریج کا ماخذ ضروری ہے",
        },
        databaseConnection: {
            label: "ڈیٹابیس کنکشن",
            placeholder: "ڈیٹابیس کنکشن داخل کریں",
        },
        actions: {
            add: {
                label: "نیا کتب خانہ بنائیں",
                title: "نیا کتب خانہ",
                success: "کتب خانہ کامیابی سے تخلیق کر دیا گیا ہے۔",
                error: "کتب خانہ تخلیق کرنے میں ناکامی ہوئی۔",
            },
            edit: {
                title: "'{{title}}' کی تدوین",
                success: "کتب خانہ میں تبدیلیاں محفوظ ہو گئی ہیں۔",
                error: "کتب خانہ میں تبدیلیاں محفوظ نہیں کی جا سکیں۔",
            },
            delete: {
                title: "کتب خانہ حذف کریں؟",
                message:
                    "کیا آپ کتب خانہ '{{title}}' کو حذف کرنا چاہیں گے؟ ایسا کرنے سے اس کتب خانہ سے متعلق تمام مواد بشمول کتب، مصنّفین، زمرہ جات، سلسلہ جات اور تمام رسائل حذف ہو جائیں گی۔",
                success: "کتب خانہ حذف کر دیا گیا ہے۔",
                error: "کتب خانہ حذف کرنے میں ناکامی ہوئی۔",
            },
        },
    },
    books: {
        latest: {
            title: "نئی کتب",
        },
        favorites: {
            title: "پسندیدہ کتب",
        },
        read: {
            title: "مطالعہ شدہ کتب",
        },
        BeingTyped: {
            title: "کتابیں جو آپ ٹائپ کر رہے ہیں۔",
        },
        ProofRead: {
            title: "کتابیں جن کی آپ پروف خوانی کر رہے ہیں۔",
        },
        title: "کتب",

        errors: {
            loading: {
                title: "کتابوں کی تفصیل حاصل کرنے میں ناکامی ہوئی",
                subTitle: "برائے مہربانی دوبارہ کوشش کریں۔",
            },
        },
        empty: {
            title: "کتب دستیاب نہیں",
        },
        search: {
            placeholder: "تلاش کتب۔۔۔",
        },
        sort: {
            title: "نام",
            dateCreated: "تاریخ اندراج",
        },
        actions: {
            upload: {
                label: "اپلوڈ",
                title: "کتب اپلوڈ",
                defaultProperties: "بنیادی خصوصیات",
                message: "کلک یا ڈریگ کر کے کتاب کی فائل چُنیں۔",
                empty: "کوئی کتاب موجود نہیں۔ اوپر کلک یا ڈریگ کر کے کتاب کی فائل چُنیں۔",
                success: "کتب کامیابی سے اپلوڈ کر دی گئی ہیں۔",
                error: "کتب اپلوڈ کرنے میں ناکامی ہوئی۔",
                details: {
                    error: {
                        title: "مسئلہ",
                    },
                    uploadMore: "مذید اپلوڈ کریں",
                    retryAllFailed: "تمام ناکام کتب کو دوبارہ اپلوڈ کریں",
                    status: {
                        pending: "نا مکمل",
                        inProgress: "زیرِ تکمیل",
                        completed: "مکمل",
                        failed: "ناکامی",
                    },
                },
            },
        },
    },
    book: {
        title: {
            label: "نام",
            placeholder: "کتاب کا نام",
            required: "کتاب کا نام ضروری ہے",
        },
        description: {
            label: "تفصیل",
            placeholder: "کتاب کے مترلق کچھ تفڈیل",
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
        chapterCount_one: "1 باب",
        chapterCount_other: "{{count}} ابواب",
        pageCount_one: "1 صفحہ",
        pageCount_other: "{{count}} صفحات",
        fileCount_one: "1 دستاویز",
        fileCount_other: "{{count}} دستاویزات",
        publishLabel: "{{year}} میں شائع ہوئی",
        noDescription: "تفصیل دستیاب نہیں۔۔۔",
        chapters: {
            title: "ابواب",
        },
        files: {
            title: "دستاویزات",
        },
        actions: {
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
        errors: {
            loading: {
                title: "Error",
                subTitle: "کتاب حاصل کرنے میں  ناکامی ہوئی۔",
            },
        },
        empty: {
            title: "کتب نہیں ملیں",
        },
    },
    chapters: {
        title: "ابواب",
        errors: {
            loading: {
                title: "ابواب حاصل نہیں ہو سکیں",
                subTitle: "برائے مہربانی دوبارہ کوشش کریں۔",
            },
        },
        empty: {
            title: "ابواب دستیاب نہیں",
        },
    },
    chapter: {
        title: {
            label: "عنوان",
            placeholder: "باب کا عنوان",
            required: "باب کا عنوان ضروری ہے",
        },
        status: {
            label: "کیفیت",
            placeholder: "باب کی کیفیت چنیں",
            required: "باب کی کیفیت ضروری ہے",
        },
        user: {
            label: "صارف",
            placeholder: "باب کا صارف چنیں",
            required: "باب کا صارف ضروری ہے",
        },
        actions: {
            add: {
                label: "نیا باب بنائیں",
                title: "نیا باب",
                success: "نیا باب محفوظ کر دیا گیا ہے۔",
                error: "نیا باب محفوظ نہیں کیا جا سکا۔",
            },
            edit: {
                title: "باب '{{title}}' کی ترمیم کریں",
                success: "باب محفوظ کر دیا گیا ہے",
                error: "باب محفوظ نہیں کیا جا سکا",
            },
            delete: {
                title: "باب حذف کریں",
                title_other: "{{count}} ابواب حذف کریں",
                message: "کیا آپ باب '{{titles}}' کو حذف کرنا چاہتے ہیں؟",
                message_other:
                    "کیا آپ ابواب '{{titles}}' کو حذف کرنا چاہتے ہیں؟",
                success: "باب حذف کر دیا گیا ہے۔",
                success_other: "{{count}} ابواب حذف کر دیا گیا ہے۔",
                error: "باب حذف نہیں کیا جا سکا۔",
                error_other: "{{count}} ابواب  حذف نہیں کیا جا سکا۔",
            },
            updateStatus: {
                title: "باب کی حیثیت",
                success: "ابواب کی حیثیت محفوظ کر دی گئی ہے۔",
                error: "ابواب کی حیثیت محفوظ نہیں کی جا سکی۔",
            },
            assign: {
                label: "تفویض کریں",
                title_one: "باب تفویض کریں",
                title_other: "{{count}}ابواب تفویض کریں",
                message: "ابواب '{{ chapterNumber }}' تفویض کریں۔",
                success_one: "باب تفویض کر دیا گیا ہے۔",
                success_other: "{{count}} ابواب تفویض کر دیے گئے۔",
                error_one: "باب نفویض نہیں کیا جا سکا۔",
                error_other: "{{count}} ابواب تفویض نہیں کیے جا سکے۔",
            },
            reorder: {
                success: "باب کی ترتیب کامیابی سے کر دی گئی ہے۔",
                error: "باب کی ترتیب کامیابی سے نہیں کی جا سکی۔",
            },
        },
        editor: {
            title: "مندرجات کی تدوین",
            newContents: "باب کے نئے مندرجات تخلیق کی جا رہی ہیں۔",
        },
    },
    pages: {
        title: "صفحات",
        label: "صفحہ {{sequenceNumber}}",
        errors: {
            loading: {
                title: "صفحات لوڈ نہیں ہو سکیں",
                subTitle: "برائے مہربانی دوبارہ کوشش کریں۔",
            },
        },
        empty: {
            title: "صفحات دستیاب نہیں",
        },
        assignment: {
            all: "تمام",
            mine: "مجھے تفویض شدہ",
            assigned: "تفویض شدہ",
            unassigned: "غیر تفویض شدہ",
        },
        filters: {
            all: "تمام",
            availableToType: "دستیاب",
            typing: "ٹایپنگ",
            typed: "ٹائپ ہو چکے",
            proofreading: "پروف خوانی",
            completed: "مکمل",
        },
        actions: {
            upload: {
                label: "اپلوڈ کریں",
                title: "{{book}} کے صفحات  اپلوڈ کریں",
                message:
                    "کلک یا ڈریگ کر کے کتاب کے صفحوں کے عکسس کی فائل چُنیں۔",
                success: "صفحات کامیابی سے تخیلق کر دیے گئے ہیں۔",
                detail: "آپ جے پی جی اور پی ڈی ایف فائل چُن سکتے ہیں۔ کتاب کے صفحات کو ترتیب سے چٗنیں تا کہ وہ اسی ترتیب سے اپلوڈ ہوں۔",
            },
            autoFillChapter: {
                title: "صفحات کے باب کو خود بخود بھریں",
                message:
                    "آپ ہر باب کے پہلے صفحے کو بھر دیں اور پھر خودکار طور پر باقی صفحات بھر دیے جائیں گے۔ ایسا کرنے سے صفحات کے ابواب تبدیل ہو جائیں گے۔ کیا آپ صفحات کے ابواب بھرنا چاہیں گے؟",
            },
        },
    },
    page: {
        sequenceNumber: {
            title: "ترتیب",
            required: "ترتیب ضروری ہے۔",
        },
        status: {
            title: "حیثیت",
            required: "حیثیت ضروری ہے۔",
            placeholder: "حیثیت چُنیں",
        },
        chapter: {
            label: "باب",
            required: "باب ضروری ہے",
            placeholder: "باب چُنیں",
        },
        user: {
            label: "صارف",
            placeholder: "صارف چنیں",
            required: "صارف ضروری ہے",
        },
        label: "صفحہ {{sequenceNumber}}",
        actions: {
            add: {
                label: "نیا صفحہ بنائیں",
                title: "نیا صفحہ",
                success: "صفحہ محفوظ کر دیا گیا ہے۔",
                error: "صفحہ محفوظ نہیں کیا جا سکا۔",
            },
            edit: {
                title: "صفحہ {{sequenceNumber}} کی تدوین",
            },
            assign: {
                title_one: "صفحہ تفویض کریں",
                title_other: "{{count}} صفحات تفویض کریں",
                message: "صفحہ '{{ sequenceNumber }}' تفویض کریں۔",
                success_one: "صفحہ تفویض کر دیا گیا ہے۔",
                success_other: "{{count}} صفحات تفویض کر دیے گئے۔",
                error_one: "صفحہ نفویض نہیں کیا جا سکا۔",
                error_other: "{{count}} صفحات تفویض نہیں کیے جا سکے۔",
            },
            uploadImage: {
                label: "عکس اپ لوڈ",
            },
            uploadPage: {
                label: "صفحہ اپ لوڈ",
                title: "صفحہ اپ لوڈ کریں",
                success: "صفحہ کامیابی سے اپ لوڈ ہو گیا ہے۔",
                error: "صفحہ اپ لوڈ نہیں ہو سکا۔",
            },
            uploadPdf: {
                label: "پی ڈی اید اپ لوڈ",
                title: "پی ڈی ایف اپ لوڈ کریں",
                success: "پی ڈی ایف کامیابی سے اپ لوڈ ہو گیا ہے۔",
                error: "پی ڈی ایف اپ لوڈ نہیں ہو سکا۔",
            },
            uploadZip: {
                label: "زِپ فایل اپ لوڈ",
                title: "زِپ فایل اپ لوڈ کریں",
                success: "زِپ فایل کامیابی سے اپ لوڈ ہو گئی ہے۔",
                error: "زِپ فایل اپ لوڈ نہیں ہو سکی۔",
            },
            updateStatus: {
                title: "صفحات کی حیثیت",
                success: "صفحات کی حیثیت محفوظ کر دی گئی ہے۔",
                error: "صفحات کی حیثیت محفوظ نہیں کی جا سکی۔",
            },
            setChapter: {
                title_one: "باب تبدیل کریں",
                title_other: "{{count}}صفحات کا باب تبدیل کریں۔",
                message:
                    "کیا آپ صفھات '{{ sequenceNumber }}' کا باب تبدیل کرنا چاہیں گے؟",
                success: "صفحات محفوظ کر دیے گئے ہیں۔",
                error: "صفحات میں تبدیلی محفوظ نہیں کہ جا سکی۔",
            },
            delete: {
                title_one: "صفحہ حذف کریں؟",
                title_other: "{{count}} صفحات حذف کریں؟?",
                message: "کیا آپ صفحہ {{ sequenceNumber }} حذف کرنا چاہتے ہیں؟",
                success: "صفحہ حذف کر دیا گیا ہے۔",
                error: "صفحہ حذف نہیں کیا جا سکا۔",
            },
            ocr: {
                title_one: "صفحے کا متن حاصل کریں",
                title_other: "{{count}} صفحات کا متن حاصل کریں",
                message:
                    "کیا آپ صفحات '{{ sequenceNumber }}' کا متن حاصل کرنا چاہیں گے؟ ایسا کرنے سے صفحات کا موجودہ متن حذف ہو جائے گا اور اسے دوبارہ حاصل نہیں کیا جا سکتا۔",
                success: "متن حاصل ہو گیا ہے۔",
                error: "متن حاصل نہیں کیا جا سکا۔",
                key: {
                    label: "او سی آر کی کلید",
                    description:
                        "اسے متن حاصل کرنے کے لیے استعمال کیا جائے گا۔",
                    required: "او سی آر کی کلید درکار ہے۔",
                },
                saveKey: {
                    label: "کلید محفوظ کیجیے",
                    description:
                        "یہ کلید آپ کے کمپیوٹر پر ہی محفوظ ہو گی اور اس کا کوئی حصّہ ہمارے سرور پر محفوظ نہیں کہا جا سکے گا۔ اگر آپ پبلک کمپیوٹر یا ایسا کمپیوٹر استعمال کر رہے ہیں جس تک دوسرے لوگ کی رسائی ہو تو ہم آپ کو اس کلید کو محفوظ کرنے سے اجتناب برتئے۔",
                },
            },
            sequence: {
                label: "ترتیب",
                title: "صفحہ کی ترتیب",
                message: "صفحہ '{{ sequenceNumber }}' کی نئی ترتیب کیا ہے؟",
                success: "صفحہ ترتیب دے دیا گیا ہے",
                error: "صفحے کی ترتیب میں ناکامی۔",
            },
        },
    },
    reader: {
        settings: "بصری ترجیحات",
        font: "خط",
        fontSize: "متن کا سائز",
        lineSpacing: "سطری فاصلہ",
        view: {
            title: "پیشکش",
            vertical: "عمودی",
            singlePage: "صفحہ",
            flipBook: "کتاب",
        },
    },
    authors: {
        title: "مصنّفین",
        errors: {
            loading: {
                title: "مصنّفین لوڈ نہیں ہو سکے",
                subTitle: "براہ کرم دوبارہ کوشش کریں۔",
            },
        },
        empty: {
            title: "کوئی مصنّف موجود نہیں",
        },
        search: {
            placeholder: "تلاش مصنّف۔۔۔",
        },
    },
    author: {
        writer: "لکھاری",
        poet: "شاعر",
        bookCount_one: "1 کتاب",
        bookCount_other: "{{count}} کتابیں",
        writingCount_one: "1 تصنیف",
        writingCount_other: "{{count}} تصنیفات",
        noDescription: "تفصیل دستیاب نہیں۔۔۔",
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
        actions: {
            add: {
                label: "نیا مصنّف بنائیں",
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
    articles: {
        title: "تصنیفات",
        errors: {
            loading: {
                title: "تصنیفات لوڈ نہیں ہو سکے",
                subTitle: "براہ کرم دوبارہ کوشش کریں۔",
            },
        },
        empty: {
            title: "کوئی تصنیف موجود نہیں",
        },
        search: {
            placeholder: "تلاش تصنیف۔۔۔",
        },
        sort: {
            title: "نام",
            lastModified: "تاریخ تدوین",
        },
        latest: {
            title: "نئے مضامین",
        },
        favorites: {
            title: "پسندیدہ مضامین",
        },
        read: {
            title: "مطالعہ شدہ مضامین",
        },
    },
    article: {
        title: {
            label: "نام",
            placeholder: "تصنیف کا نام",
            required: "تصنیف کے لیے نام ضروری ہے",
        },
        type: {
            label: "قسم",
            placeholder: "تصنیف کی قسم",
            required: "تصنیف کی قسم ضروری ہے",
            writing: "نثر",
            poetry: "شاعری",
        },
        public: {
            label: "عوامی",
        },
        authors: {
            label: "مصنّفین",
            placeholder: "تصنیف کے مصنّفین کا نام",
            required: "مصنّف کا نام ضروری ہے",
        },
        layout: {
            label: "متن کی ترتیب",
            placeholder: "متن کی ترتیب چنیں",
        },
        status: {
            label: "کیفیت",
            placeholder: "تصنیف کی کیفیت چنیں",
        },
        categories: {
            label: "زمرہ جات",
            placeholder: "تصنیف کے زمرہ جات چنیں",
        },
        information: {
            label: "تفصیلات",
        },
        contents: {
            label: "مندرجات",
        },
        messages: {
            newContent:
                "اس مضمون کے مندرجات اس زبان میں موجود نہیں۔ آپ نیا مواد تخلیق کر رہے ہیں۔",
        },
        actions: {
            add: {
                label: "نئی تصنیف بنائیں",
                title: "نئی تصنیف",
                success: "تصنیف کامیابی سے تخلیق کر دی گئی ہے۔",
                error: "تصنیف تخلیق کرنے میں ناکامی ہوئی۔",
            },
            edit: {
                title: "'{{name}}' کی تدوین",
                success: "تصنیف میں تبدیلیاں محفوظ ہو گئی ہیں۔",
                error: "تصنیف میں تبدیلیاں محفوظ نہیں کی جا سکیں۔",
            },
            delete: {
                title: "تصنیف حذف کریں؟",
                message:
                    "کیا آپ تصنیف '{{title}}' کو حذف کرنا چاہیں گے؟ ایسا کرنے سے اِس تصنیف سے متعلق تمام مواد حذف ہو جائے گا۔",
                success: "تصنیف حذف کر دی گئی ہے۔",
                error: "تصنیف حذف کرنے میں ناکامی ہوئی۔",
            },
        },
        errors: {
            contentNotFound: {
                title: "مضمون `{{language}}` زبان میں موجود نہیں۔",
                titleMissing: "مضمون موجود نہیں۔",
                subTitle:
                    "برائے مہربانی مندرجہ ذیل زبانوں میں سے کسی ایک کا انتخاب کریں۔",
                subTitleMissing: "برائے مہربانی دوبارہ کوشش کیجیے۔",
            },
        },
    },
    series: {
        title: "سلسلے",
        bookCount_one: "1 کتاب",
        bookCount_other: "{{count}} کتابیں",
        noDescription: "تفصیل دستیاب نہیں۔۔۔",
        name: {
            label: "نام",
            placeholder: "سلسلے کا نام",
            required: "سلسلے کے لیے نام ضروری ہے",
        },
        description: {
            label: "تفصیل",
        },
        save: {
            success: "سلسلے میں تبدیلیاں محفوظ ہو گئی ہیں۔",
            error: "سلسلے میں تبدیلیاں محفوظ نہیں ہوئں۔",
        },
        actions: {
            add: {
                label: "نیا سلسلہ بنائیں",
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
        errors: {
            loading: {
                title: "سلسلے لوڈ نہیں ہو سکے",
                subTitle: "براہ کرم دوبارہ کوشش کریں۔",
            },
        },
        empty: {
            title: "کوئی سلسلہ موجود نہیں",
        },
    },
    categories: {
        title: "زمرے",
        all: "تمام زمرے",
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
    category: {
        name: {
            label: "نام",
            placeholder: "زمرے کا نام",
            required: "زمرے کا نام ضروری ہے۔",
        },
        bookCount_one: "۱ کتاب",
        bookCount_other: "{{count}} کتابیں",
        actions: {
            add: {
                label: "نیا زمرہ بنائیں",
                title: "نیا زمرہ",
                success: "زمرہ کامیابی سے تخلیق کر دیا گیا ہے۔",
                error: "زمرہ تخلیق کرنے میں ناکامی ہوئی۔",
            },
            edit: {
                title: "'{{name}}' کی تدوین",
                success: "زمرے میں تبدیلیاں محفوظ ہو گئی ہیں۔",
                error: "زمرے میں تبدیلیاں محفوظ نہیں کی جا سکیں۔",
            },
            delete: {
                title: "زمرہ حذف کریں؟",
                message:
                    "کیا آپ زمرہ '{{name}}' کو حذف کرنا چاہیں گے؟ ایسا کرنے سے اِس زمرے سے متعلق تمام مواد حذف ہو جائے گا۔",
                success: "زمرہ حذف کر دیا گیا ہے۔",
                error: "زمرہ حذف کرنے میں ناکامی ہوئی۔",
            },
        },
    },
    periodicals: {
        title: "جرائد",
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
        actions: {
            add: {
                label: "جریدے کا اضافہ",
                title: "نیا جریدہ",
                success: "جریدہ کامیابی سے تخلیق کر دیا گیا ہے۔",
                error: "جریدہ تخلیق کرنے میں ناکامی ہوئی۔",
            },
            edit: {
                title: "'{{name}}' میں تدوین",
                success: "جریدے میں تبدیلیاں محفوظ ہو گئی ہیں۔",
                error: "جریدے میں تبدیلیاں محفوظ نہیں ہوئں۔",
            },
            delete: {
                title: "جریدہ حذف کریں؟",
                message:
                    "کیا آپ جریدہ '{{name}}' کو حذف کرنا چاہیں گے؟ ایسا کرنے سے اِس جریدے سے متعلق تمام مواد بشمول شمارے، مندرجات اور دستاویز حذف ہو جائے گا۔",
                success: "جریدہ حذف کر دیا گیا ہے۔",
                error: "جریدہ حذف کرنے میں ناکامی ہوئی۔",
            },
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
        volumeNumber: {
            label: "جلد نمبر",
            placeholder: "شمارے کا جلد نمبر",
            required:
                "سمارے کا جلد نمبر جاہیے۔ اگر جلد نمبر نہیں تو صفر استعمال کیجئے۔",
        },
        issueNumber: {
            label: "شمارہ  نمبر",
            placeholder: "شمارے کا جلد میں نمبر",
            required: "شمارے کا نمبر ضروری ہے۔",
        },
        issueDate: {
            label: "تریخ اشاعت",
            required: "تریخ اشاعت ضروری ہے",
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
        files: {
            title: "دستاویزات",
            empty: {
                title: "دستاویز دستیاب نہیں",
            },
        },
        actions: {
            add: {
                label: "شمارے کا اضافہ",
                title: "نیا شمارہ",
                success: "شمارہ کامیابی سے تخلیق کر دیا گیا ہے۔",
                error: "شمارہ تخلیق کرنے میں ناکامی ہوئی۔",
            },
            edit: {
                title: "'{{name}}' میں تدوین",
                success: "شمارے میں تبدیلیاں محفوظ ہو گئی ہیں",
                error: "شمارے میں تبدیلیاں محفوظ نہیں ہو سکیں۔",
            },
            delete: {
                title: "شمارہ حذف کریں؟",
                message:
                    "کیا آپ شمارہ '{{name}}' کو حذف کرنا چاہیں گے؟ ایسا کرنے سے اِس شمارے سے متعلق تمام مواد بشمول مندرجات اور دستاویز حذف ہو جائے گا۔",
                success: "شمادہ حذف کر دیا گیا ہے۔",
                error: "شمارہ حذف کرنے میں ناکامی ہوئی۔",
            },
            addFile: {
                title: "فائل اپلوڈ کریں",
                success: "فائل کامیابی سے اپلوڈ کر دی گئی ہے۔",
                error: "فائل اپلوڈ کرنے میں نامامی ہوئی۔",
            },
            deleteFile: {
                title: "فائل حذف کریں؟",
                message: "کیا آپ  '{{title}}' فائل کو حذف کرنا چاہیں گے؟",
                success: "فائل حذف کر دیی گئی ہے۔",
                error: "فائل حذف کرنے میں ناکامی ہوئی۔",
            },
            downloadFile: {
                title: "فائل ڈائنلوڈ",
            },
            setFirstPageAsImage: {
                title: "پہلا صفحہ شمارے کا سر ورق بنائیں",
                message:
                    "کیا آپ اس فائل کا پہلا صفحہ سمارے کا سر ورق بنانا چاہتے ہیں؟َ",
                success: "شمارے کا سر ورق محفوظ ہو گیا ہے۔",
                error: "شمارے کا سر ورق محفوظ کرنے میں ناکامی ہوئی۔",
            },
        },
    },
    users: {
        empty: {
            title: "صارف دستیاب نہیں ہیں",
        },
        me: {
            title: "مجھے",
        },
        none: {
            title: "غیر تفویض",
        },
        others: {
            title: "دوسرے صارف",
        },
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
    downloader: {
        title: "ریختہ کی کتاب حاصل کریں",
        description:
            "اس بات کو یقینی بنائیں کہ ربط سے آپ کتاب کے صفحات کا مطالعہ کر سکتے ہیں۔",
        loading:
            "کتاب ڈاؤنلوٖڈ کی جا رہی ہے۔۔۔ کتاب کے حصول میں کچھ وقت لگ سکتا ہے۔ برائے مہربانی براؤزر بند نہ کریں اور انتظار کیجئے۔",
        url: {
            title: "کتاب کا ربط",
            required: "کتاب کا ربط ضروری ہے",
            detailsLink:
                "ربط کتاب کے تعارفی صفحے کا ہے۔ برائے مہربانی کتاب کے صفحے کا ربط استعمال کریں جہاں آپ کتاب کے صفحات پڑھ سکیں۔",
        },
        convertToPdf: {
            pdf: "پی ڈی ایف",
            images: "صفحات",
        },
        error: "کتاب حاصل  نہیں کر سکے۔ کیا آپ نے کتاب کا درست ربط استعمال کیا ہے؟ برائے مہربانی دوبارہ کوشش کیجیے۔",
    },
    copyrights: {
        Copyright: "جملہ حقوق محفوظ",
        PublicDomain: "مفت عوامی کتاب",
        Open: "آزاد",
        CreativeCommons: "کریئیٹو کامن",
        Unknown: "حقوق نا معلوم",
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
    layouts: {
        normal: {
            label: "عام متن",
        },
        singleColumnPoetry: {
            label: "ایک کالم کے اشعار",
        },
        twoColumnPoetry: {
            label: "دو کالم کے اشعار",
        },
    },
    sort: {
        ascending: "ترتیب صعودی",
        descending: "ترتیب نزولی",
    },
    errors: {
        imageRequired:
            "صرف تصاویر قابلِ قبول ہیں۔ برائے مہربانی تصویر کا انتخاب کیجئے۔",
        pdfRequired:
            "صرف پی ڈی ایف قابلِ قبول ہیں۔ برائے مہربانی  پی ڈی ایف کا انتخاب کیجئے۔",
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
