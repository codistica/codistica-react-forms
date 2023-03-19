import {isPositiveZero} from '../is-positive-zero/is-positive-zero';

function floorAt(num: number, lvl: number): number {
    const length = num.toString().length;

    let x = null;

    if (Math.abs(lvl) >= length) {
        return 0;
    } else if (lvl > 0 || isPositiveZero(lvl)) {
        x = 10 ** (length - lvl - 1);
        return Math.floor(num / x) * x;
    } else {
        x = 10 ** (lvl * -1);
        return Math.floor(num / x) * x;
    }
}

export {floorAt};
