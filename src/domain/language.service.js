class LanguageService {
    LATENCY = 200;
    MIN_SEARCH_LENGTH = 2;

    constructor({ language, wordList = [], autoCorrectList = [], punctuationList = [] }) {
        this.language = language;
        this.wordList = wordList;
        this.autoCorrectList = autoCorrectList;
        this.punctuationList = punctuationList;
    }

    autoCorrect = (text) => {
        if (!this.autoCorrectList) {
            return text;
        }

        // Check if the autoCorrectList is an array of objects
        if (this.autoCorrectList && !Array.isArray(this.autoCorrectList)) {
            throw new Error("Invalid input: autoCorrectList must be an array of objects.");
        }

        // Check if each object in the autoCorrectList array has the correct properties
        this.autoCorrectList.forEach(({ incorrectText, correctText, completeWord }) => {
            if (typeof incorrectText !== "string" || typeof correctText !== "string" || typeof completeWord !== "boolean") {
                throw new Error("Each object in replacementsList must have 'incorrectText' (string), 'correctText' (string), and 'wholeWord' (boolean).");
            }
        });

        // Create a regex map
        this.regexMap = this.autoCorrectList.map(({ incorrectText, correctText, completeWord }) => {
            return { regex: new RegExp(completeWord ? `(\\s|^|[""“”،؟۔])${incorrectText}(\\s|[""“”،؟۔]|$)` : incorrectText, "giu"), replacement: completeWord ? `$1${correctText}$2` : correctText };
        });

        this.regexMap.forEach(({ regex, replacement }) => {
            text = text.replace(regex, replacement);
        });

        return text;
    }

    correctPunctuations = (text) => {
        if (this.punctuationList) {
            text = text.replace(/ {2,}/g, ' ');
            this.punctuationList.forEach((c) => {
                text = text.replaceAll(c.completeWord ? `${c.incorrectText}\\b` : c.incorrectText, c.correctText);
            });
        }

        return text;
    }

    checkSpell = (text) => {
        return text;
    }

    autoComplete = (searchText) => {
        let isDismissed = false;

        const dismiss = () => {
            isDismissed = true;
        };
        const promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                if (isDismissed) {
                    return reject('Dismissed');
                }
                const searchTextLength = searchText.length;
                if (searchText === '' || searchTextLength < this.MIN_SEARCH_LENGTH) {
                    return resolve(null);
                }
                const char0 = searchText.charCodeAt(0);
                const isCapitalized = char0 >= 65 && char0 <= 90;
                const caseInsensitiveSearchText = isCapitalized
                    ? String.fromCharCode(char0 + 32) + searchText.substring(1)
                    : searchText;
                const match = this.wordList.find(
                    (dictionaryWord) =>
                        dictionaryWord.startsWith(caseInsensitiveSearchText) ?? null,
                );
                if (match === undefined) {
                    return resolve(null);
                }
                const matchCapitalized = isCapitalized
                    ? String.fromCharCode(match.charCodeAt(0) - 32) + match.substring(1)
                    : match;
                const autocompleteChunk = matchCapitalized.substring(searchTextLength);
                if (autocompleteChunk === '') {
                    return resolve(null);
                }
                return resolve(autocompleteChunk);
            }, this.LATENCY);
        });

        return {
            dismiss,
            promise,
        };
    }
}


export default LanguageService;

