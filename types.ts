import { BasePhrase, phrasesToString } from './phrases.js';

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

export type Variants = Record<string, any>;

export interface Sentence {
    mode: 'manual' | 'auto';
    /**
     * This value should be auto maintained in auto mode.
     * User may only change this when mode is manual.
     */
    text: string;
    variants: Variants;
    // phrases: BasePhrase[];
}

/**
 * Style should contain the minimal information to generate the phrases.
 */
export interface Project {
    style: StyleType;
    baseVariants: { [k in Stage]?: { [k in VoiceName]?: Variants } };
    stations: { [k: string]: { [k in Stage]?: { [k in VoiceName]?: Sentence } } };
}

/**
 * ReconciledPhrases contains only phrases to be resolved to final wav audio files.
 */
export interface ReconciledPhrases {
    [k: string]: { [k in Stage]?: { [k in VoiceName]?: BasePhrase[] } };
}

export const reconciledPhrasesToString = (r: ReconciledPhrases) => {
    const res: string[] = [];
    for (const stn in r) {
        for (const stage in r[stn]) {
            for (const voiceName in r[stn][stage as Stage]) {
                res.push(
                    // @ts-expect-error This is must have value.
                    `${stn}_${stage}_${voiceName}: ${phrasesToString(r[stn][stage as Stage][voiceName as VoiceName]!)}`
                );
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
