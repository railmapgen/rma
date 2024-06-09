import { DOMImplementation, XMLSerializer } from '@xmldom/xmldom';
import { writeFile } from 'fs/promises';
import {
    AudioConfig,
    SpeechConfig,
    SpeechSynthesisOutputFormat,
    SpeechSynthesizer,
} from 'microsoft-cognitiveservices-speech-sdk';
import { VoiceName } from './types.js';

const SUBSCRIPTION_KEY = 'xxx';

export const synthesizeSpeech = (
    voiceName: VoiceName,
    text: string,
    rate?: string,
    contour?: string
): Promise<ArrayBuffer> => {
    console.log(`Generating text: ${text} with rate: ${rate}, contour: ${contour}`);

    const speechConfig = SpeechConfig.fromSubscription(SUBSCRIPTION_KEY, 'eastus');
    speechConfig.speechSynthesisVoiceName = voiceName;
    speechConfig.speechSynthesisOutputFormat = SpeechSynthesisOutputFormat.Riff44100Hz16BitMonoPcm;

    const speechSynthesizer = new SpeechSynthesizer(speechConfig);

    const xml = makeSSML(voiceName, text, rate, contour);
    console.log(xml);

    return new Promise((resolve, reject) => {
        speechSynthesizer.speakSsmlAsync(
            xml,
            result => {
                speechSynthesizer.close();
                if (result.errorDetails) {
                    reject(result.errorDetails);
                    return;
                }
                resolve(result.audioData);
            },
            error => {
                speechSynthesizer.close();
                reject(error);
            }
        );
    });
};

const getLang = (voiceName: VoiceName) => voiceName.split('-', 2).join('-');

const makeSSML = (voiceName: VoiceName, text: string, rate?: string, contour?: string) => {
    const namespaceURI = 'https://www.w3.org/2001/10/synthesis';
    const document = new DOMImplementation().createDocument(namespaceURI, '');
    const root = document.createElementNS(namespaceURI, 'speak');
    root.setAttribute('version', '1.0');
    root.setAttribute('xml:lang', getLang(voiceName));
    // root.setAttribute('xmlns:mstts', 'http://www.w3.org/2001/mstts');
    // root.setAttribute('xmlns:emo', 'http://www.w3.org/2009/10/emotionml');
    const voice = document.createElementNS(namespaceURI, 'voice');
    voice.setAttribute('name', voiceName);
    // if (lang) {
    //     const langElem = document.createElementNS(namespaceURI, 'lang');
    //     langElem.setAttribute('xml:lang', lang);
    //     const textElem = document.createTextNode(text);
    //     langElem.appendChild(textElem);
    //     voice.appendChild(langElem);
    // } else {
    const prosody = document.createElementNS(namespaceURI, 'prosody');
    if (rate) prosody.setAttribute('rate', rate);
    if (contour) prosody.setAttribute('contour', contour);
    const textElem = document.createTextNode(text);
    if (rate || contour) {
        prosody.appendChild(textElem);
        voice.appendChild(prosody);
    } else {
        voice.appendChild(textElem);
    }
    // }
    root.appendChild(voice);
    return new XMLSerializer().serializeToString(root);
};

// const text = '可换乘1号线';
// const data = await synthesizeSpeech(voiceName.ChineseMandarinSimplified, text);
// await writeFile(`${text}.wav`, Buffer.from(data));

// console.log(makeSSML(voiceName.ChineseMandarinSimplified, text));
