import { OS } from '../constants/constants';

export const detectOS = (): OS => {
    // https://stackoverflow.com/questions/77903642/unable-to-detect-underlying-os-using-js
    const userAgent = navigator.platform.toLowerCase();

    if (userAgent.includes('win')) {
        return 'win';
    } else if (userAgent.includes('android')) {
        return 'android';
    } else if (userAgent.includes('mac')) {
        return 'mac';
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
        return 'ios';
    } else if (userAgent.includes('linux')) {
        return 'linux';
    }
    return 'unknown';
};
