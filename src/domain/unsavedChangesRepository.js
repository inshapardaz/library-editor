class unsavedChangedRepository {
    constructor(key) {
        this.key = key;
    }

    save(value) {
        if (value == null) {
            window.localStorage.removeItem(this.key);
        } else {
            window.localStorage.setItem(this.key, value);
        }
    }

    get() {
        return window.localStorage.getItem(this.key);
    }

    clear() {
        window.localStorage.removeItem(this.key);
    }

    hasChanges() {
        const value = this.get();
        return value && value !== "" ? true : false;
    }
}

export default unsavedChangedRepository;
