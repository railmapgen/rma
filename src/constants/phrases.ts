import { VoiceName } from './constants';

export enum PhraseType {
    Predefined = 'predefined',
    Customized = 'customized',
    Punctuation = 'punctuation',
}

export interface BasePhrase {
    type: PhraseType;
    // TODO: why this?
    voiceName: VoiceName;
    /**
     * Text is used in displaying the words.
     */
    text: string;
    /**
     * PinYin is used in generating the audio.
     */
    pinyin: string;
    /**
     * lang is used in MultilingualNeural which is incompatible with the prosody elements.
     * You can't adjust pause and prosody like pitch, contour, rate, or volume in this element.
     * https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-voice?source=recommendations#adjust-speaking-languages
     */
    // lang?: string;
    rate?: string;
    contour?: string;
}

export const phrasesToText = (phrases: BasePhrase[]) => phrases.map(p => p.text).join('');
export const phrasesToPinyin = (phrases: BasePhrase[]) => phrases.map(p => p.pinyin).join('');

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
    if ([VoiceName.ChineseWuSimplifiedXiaotong, VoiceName.ChineseMandarinSimplified].includes(voiceName)) {
        text = {
            [PunctuationPhraseType.BreakWeak]: ' ',
            [PunctuationPhraseType.BreakMedium]: '，',
            [PunctuationPhraseType.BreakStrong]: '。',
        }[punctuation];
    } else if ([VoiceName.ChineseWuSimplifiedYunzhe].includes(voiceName)) {
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
        pinyin: text,
        subType: punctuation,
    };
};
