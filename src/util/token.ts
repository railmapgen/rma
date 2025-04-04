import { logger } from '@railmapgen/rmg-runtime';
import { createStore } from '../redux';
import { setRmtToken, removeRmtToken } from '../redux/runtime/runtime-slice';
import { LocalStorageKey } from '../constants/constants';

/**
 * Account state managed and persisted to localStorage by RMT.
 * Read Only.
 */
interface AccountState {
    id: number;
    name: string;
    email: string;
    token: string;
    expires: string;
    refreshToken: string;
    refreshExpires: string;
}

/**
 * Watch the localStorage change and update the login state and token.
 */
export const onLocalStorageChangeRMT = (store: ReturnType<typeof createStore>) => {
    const handleAccountChange = (accountString?: string) => {
        if (!accountString) {
            logger.debug('Account string is empty, logging out');
            store.dispatch(removeRmtToken());
            return;
        }

        const accountState = JSON.parse(accountString) as AccountState;
        const { token } = accountState;
        logger.debug(`Updating token to: ${token}`);
        store.dispatch(setRmtToken(token));
    };

    // Record the previous account string and only handle the change.
    let previousAccountString = localStorage.getItem(LocalStorageKey.ACCOUNT);
    handleAccountChange(previousAccountString ?? undefined);

    window.onstorage = () => {
        const accountString = localStorage.getItem(LocalStorageKey.ACCOUNT);
        if (previousAccountString === accountString) {
            return;
        }
        previousAccountString = accountString;

        logger.debug(`Account string changed to: ${accountString}`);
        handleAccountChange(accountString ?? undefined);
    };
};

export const API_URL = 'https://railmapgen.org/v1';
// export const API_URL = 'http://localhost:3000/v1';
export enum API_ENDPOINT {
    AUDIOTASKS = '/audio',
    SUBSCRIPTION_REDEEM = '/subscription/redeem',
}

/**
 * A helper method to add json headers.
 */
export const apiFetch = async (apiEndpoint: API_ENDPOINT | string, init?: RequestInit, token?: string) => {
    const defaultHeaders = {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
    } as {
        accept: string;
        'Content-Type': string;
        'Cache-Control': string;
        Authorization?: string;
    };
    const headers = structuredClone(defaultHeaders);
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const rep = await fetch(`${API_URL}${apiEndpoint}`, {
        headers,
        ...init,
    });
    if (rep.status === 401) return undefined;
    return rep;
};
