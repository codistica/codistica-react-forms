import {floorAt} from '../../number-utils';

function toFullYear(shortYear: number): number {
    const fullYear = new Date().getFullYear();

    const base = floorAt(fullYear, -2);

    const prevBase = floorAt(base - 1, -2);

    const min = fullYear - base;
    const max = 99;

    if (shortYear <= min) {
        return base + shortYear;
    } else if (shortYear <= max) {
        return prevBase + shortYear;
    } else {
        return shortYear;
    }
}

export {toFullYear};
