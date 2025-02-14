import { BasePhrase, phrasesToPinyin } from './phrases';
import { StnID } from './rmg';

export enum VoiceName {
    ChineseWuSimplifiedXiaotong = 'wuu-CN-XiaotongNeural',
    ChineseWuSimplifiedYunzhe = 'wuu-CN-YunzheNeural',
    ChineseCantoneseSimplified = 'yue-CN-XiaoMinNeural',
    ChineseCantoneseTraditional = 'zh-HK-HiuMaanNeural',
    ChineseMandarinSimplified = 'zh-CN-XiaoqiuNeural',
    EnglishUnitedStates = 'en-US-RyanMultilingualNeural',
    EnglishUnitedKingdom = 'en-GB-RyanNeural',
}

export enum StyleType {
    ShanghaiMetro = 'shmetro',
}

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
    /**
     * Style should contain the minimal information to generate the phrases.
     */
    readonly style: StyleType;
    baseVariants: { [k in Stage]?: { [k in VoiceName]?: Variants } };
    stations: { [k: StnID]: { [k in Stage]?: { [k in VoiceName]?: Variants } } };
    readonly metadata: { [k: StnID]: StationMetadata };
}

export const emptyProject: Project = { style: StyleType.ShanghaiMetro, baseVariants: {}, stations: {}, metadata: {} };

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
    PARAM = 'param',
}

export enum Events {
    APP_LOAD = 'APP_LOAD',
    IMPORT_RMG_PARAM = 'IMPORT_RMG_PARAM',
    DOWNLOAD_PARAM = 'DOWNLOAD_PARAM',
    DOWNLOAD_TEXT = 'DOWNLOAD_TEXT',
}
