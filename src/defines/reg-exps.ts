const REG_EXPS = {
    get IS_EMAIL() {
        return /^(?:([^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(?:(\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|((?:[a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    },
    get REG_EXP_RESERVED() {
        return /[-/\\^$*+?.()|[\]{}]/g;
    },
    get SPECIALS() {
        return /[^a-zA-Z\u00C0-\u00FF\d\s]/g;
    }
};

export {REG_EXPS};
