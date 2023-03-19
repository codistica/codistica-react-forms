import {REG_EXPS} from '../../../defines/reg-exps';

function escape(str: string): string {
    return str.replace(REG_EXPS.REG_EXP_RESERVED, '\\$&');
}

export {escape};
