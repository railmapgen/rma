import { BasePhrase, phrasesToPinyin } from './phrases';
import { StnID } from './rmg';

export const R = 16;
export const D = R * 2;
export const FONT_HEIGHT = 20;

export enum VoiceName {
    ChineseWuSimplifiedXiaotong = 'shmetro-wuu',
    ChineseWuSimplifiedYunzhe = 'shmetro-en',
    ChineseMandarinSimplified = 'shmetro-zh',
}

export enum StyleType {
    ShanghaiMetro = 'shmetro',
}

export type OS = 'win' | 'mac' | 'linux' | 'ios' | 'android' | 'unknown';

type VoiceToPreview = {
    [k in StyleType]: {
        /**
         * Each voice in a style should have a compatible language code for speech synthesis API to fallback
         * when preferredPreviewVoiceName specified is not available.
         * Note: This might be overwritten by the user in settings.
         */
        defaultLang: { [k in VoiceName]?: string };
        /**
         * Preferred voice name for speech synthesis API in different platforms.
         * [Optional] If not specified, the defaultLang will be used.
         */
        preferredPreviewVoiceName: {
            [k in VoiceName]?: { [k in OS]?: string };
        };
    };
};

export const voiceToPreview: VoiceToPreview = {
    [StyleType.ShanghaiMetro]: {
        defaultLang: {
            [VoiceName.ChineseMandarinSimplified]: 'zh-CN',
            [VoiceName.ChineseWuSimplifiedXiaotong]: 'wuu-CN',
            [VoiceName.ChineseWuSimplifiedYunzhe]: 'en-GB',
        },
        preferredPreviewVoiceName: {
            [VoiceName.ChineseMandarinSimplified]: {
                win: 'Microsoft Huihui Desktop - Chinese (Simplified)',
                mac: 'Tingting',
                linux: undefined,
                ios: 'Ting-Ting',
                android: undefined,
            },
            [VoiceName.ChineseWuSimplifiedXiaotong]: undefined,
            [VoiceName.ChineseWuSimplifiedYunzhe]: {
                win: 'Microsoft George - English (United Kingdom)',
                mac: 'Daniel',
                linux: undefined,
                ios: 'Daniel',
                android: undefined,
            },
        },
    },
};

export enum Stage {
    Arrival = 'arr',
    Stop = 'stp',
    Departure = 'dep',
    Midway = 'mdw',
}

export const styleType = {
    [StyleType.ShanghaiMetro]: {
        stages: [Stage.Arrival, Stage.Departure, Stage.Midway],
    },
};

type JSONPrimitive = string | number | boolean | undefined;
interface JSONObject {
    [key: string]: JSONValue;
}
interface JSONArray extends Array<JSONValue> {}
type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export type Serializable = JSONValue;

export type Variants = Record<string, JSONValue>;

export interface StationMetadata {
    name: string;
}

export interface Project {
    readonly version: number;
    /**
     * Style should contain the minimal information to generate the phrases.
     */
    readonly style: StyleType;
    baseVariants: { [k in Stage]?: { [k in VoiceName]?: Variants } };
    stations: { [k: StnID]: { [k in Stage]?: { [k in VoiceName]?: Variants } } };
    readonly metadata: { [k: StnID]: StationMetadata };
}

export const emptyProject: Project = {
    version: 1,
    style: StyleType.ShanghaiMetro,
    baseVariants: {},
    stations: {},
    metadata: {},
};

/**
 * ReconciledPhrases contains only phrases to be resolved to final wav audio files.
 */
export interface ReconciledPhrases {
    [k: StnID]: { [k in Stage]?: { [k in VoiceName]?: BasePhrase[] } };
}

export const reconciledPhrasesToText = (r: ReconciledPhrases) => {
    const res: string[] = [];
    for (const stn in r) {
        for (const stage in r[stn]) {
            for (const voiceName in r[stn][stage as Stage]) {
                const phrases = r[stn]![stage as Stage]![voiceName as VoiceName]!;
                if (phrases.length === 0) continue;
                res.push(`${stn}_${stage}_${voiceName}: ${phrasesToPinyin(phrases)}`);
            }
        }
    }
    return res;
};

/**
 * Simplified phrases for cloud audio generation.
 */
export const simplifyReconciledPhrases = (r: ReconciledPhrases) => {
    const res = structuredClone(r) as {
        [k: StnID]: {
            [k in Stage]?: { [k in VoiceName]?: Exclude<BasePhrase, 'text'>[] };
        };
    };
    for (const stn in r) {
        for (const stage in r[stn]) {
            for (const voiceName in r[stn][stage as Stage]) {
                const phrases = r[stn]![stage as Stage]![voiceName as VoiceName]!;
                const simplifiedPhrases = phrases.map(p => {
                    const p_ = structuredClone(p);
                    delete (p_ as any).text;
                    delete (p_ as any).voiceName;
                    return p_;
                });
                res[stn]![stage as Stage]![voiceName as VoiceName] = simplifiedPhrases;
            }
        }
    }
    return res;
};

/**
 * Contains the possible variants in each stage of each style.
 */
export interface StyleVariants {
    [StyleType.ShanghaiMetro]: {
        [Stage.Arrival]: {
            terminal?: string;
            name: string;
            doorDirection: 'left' | 'right';
            thanksForTaking?: string;
        };
        [Stage.Departure]: {
            welcomeAbroad?: string;
            lineName?: string;
            terminal?: string;
            next: string;
            nextDoorDirection: string;
            int?: string[][];
            noteLastTrain?: boolean;
        };
        [Stage.Midway]: {
            leaveLoveSeat?: boolean;
        };
    };
}

export enum LocalStorageKey {
    APP = 'app',
    PARAM = 'param',
    ACCOUNT = 'rmg-home__account',
}

export enum Events {
    APP_LOAD = 'APP_LOAD',
    IMPORT_RMG_PARAM = 'IMPORT_RMG_PARAM',
    DOWNLOAD_PARAM = 'DOWNLOAD_PARAM',
    DOWNLOAD_TEXT = 'DOWNLOAD_TEXT',
}
