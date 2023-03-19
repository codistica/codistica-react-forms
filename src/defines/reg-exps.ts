const REG_EXPS = {
    get IS_EMAIL() {
        return /^(?:([^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(?:(\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|((?:[a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    },
    get REG_EXP_RESERVED() {
        return /[-/\\^$*+?.()|[\]{}]/g;
    },
    get SPECIALS() {
        return /[^a-zA-Z\u00C0-\u00FF\d\s]/g;
    },
    get LOW_LETTERS() {
        return /[a-z\u00DF-\u00FF]/g;
    },
    get NON_LETTERS() {
        return /[^a-zA-Z\u00C0-\u00FF\s]/g;
    },
    get UP_LETTERS() {
        return /[A-Z\u00C0-\u00DE]/g;
    },
    get FIRST_LETTERS() {
        return /(?:\s|^)[a-zA-Z\u00C0-\u00FF]/g;
    }
};

export {REG_EXPS};
