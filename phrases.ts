import { VoiceName } from './types.js';

export enum PhraseType {
    Predefined = 'predefined',
    Customized = 'customized',
    Punctuation = 'punctuation',
}

export interface BasePhrase {
    type: PhraseType;
    voiceName: VoiceName;
    text: string;
    /**
     * lang is used in MultilingualNeural which is incompatible with the prosody elements.
     * You can't adjust pause and prosody like pitch, contour, rate, or volume in this element.
     * https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-voice?source=recommendations#adjust-speaking-languages
     */
    // lang?: string;
    rate?: string;
    contour?: string;
}

export const phrasesToString = (phrases: BasePhrase[]) => phrases.map(p => p.text).join('');

export enum PunctuationPhraseType {
    BreakWeak = ' ',
    BreakMedium = ',',
    BreakStrong = '.',
}

export interface PunctuationPhrase extends BasePhrase {
    subType: PunctuationPhraseType;
}

export const makePunctuationPhrase = (voiceName: VoiceName, punctuation: PunctuationPhraseType): PunctuationPhrase => {
    let text = '';
    if (
        [
            VoiceName.ChineseWuSimplifiedXiaotong,
            VoiceName.ChineseMandarinSimplified,
            VoiceName.ChineseCantoneseSimplified,
            VoiceName.ChineseCantoneseTraditional,
        ].includes(voiceName)
    ) {
        text = {
            [PunctuationPhraseType.BreakWeak]: ' ',
            [PunctuationPhraseType.BreakMedium]: '，',
            [PunctuationPhraseType.BreakStrong]: '。',
        }[punctuation];
    } else if (
        [VoiceName.ChineseWuSimplifiedYunzhe, VoiceName.EnglishUnitedKingdom, VoiceName.EnglishUnitedStates].includes(
            voiceName
        )
    ) {
        text = {
            [PunctuationPhraseType.BreakWeak]: ' ',
            [PunctuationPhraseType.BreakMedium]: ', ',
            [PunctuationPhraseType.BreakStrong]: '. ',
        }[punctuation];
    }
    return {
        type: PhraseType.Punctuation,
        voiceName,
        text,
        subType: punctuation,
    };
};