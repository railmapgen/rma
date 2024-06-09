import { existsSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { resolve as resolvePath } from 'path';
// @ts-ignore
import { decoder, encoder, RenderingAudioContext as AudioContext } from 'web-audio-engine';
import { BasePhrase, PhraseType, PunctuationPhrase, PunctuationPhraseType } from './phrases.js';
import { PredefinedPhrase, PredefinedPhraseType, resolvePredefinedPhrasesPath } from './predefined-phrases.js';
import { stripLast } from './strip.js';
import { synthesizeSpeech } from './synthesize.js';
import { ReconciledPhrases, Stage, VoiceName } from './types.js';

const SAMPLE_RATE = 44.1 * 1000;
const STRIP_LAST_DURATION_IN_SECONDS = 0.5;

export const resolve = async (res: ReconciledPhrases) => {
    for (const stn in res) {
        for (const stage in res[stn]) {
            for (const voiceName in res[stn][stage as Stage]) {
                if (voiceName === VoiceName.ChineseWuSimplifiedYunzhe) continue;
                // @ts-expect-error This is a must have value.
                const phrases = res[stn][stage as Stage][voiceName as VoiceName]!;
                const audioSegments = await Promise.all(phrases.map(p => resolvePhrase(p)));
                // const audioData = concatenateAudioBuffer(
                //     audioSegments.map(s => stripLast(s, STRIP_LAST_DURATION_IN_SECONDS))
                // );
                const audioData = concatenateAudioBuffer(audioSegments);
                const stageBuffer = (await encoder.encode(audioData)) as ArrayBuffer;
                const path = resolvePath('..', 'output', `${stn}_${stage}_${voiceName}.wav`);
                // if (existsSync(path)) throw new Error(`Duplicate file ${path}`);
                await writeFile(path, Buffer.from(stageBuffer));
            }
        }
    }
};

// Actually its AudioData in web-audio-engine, but I can not find that type and AudioBuffer should be a close one.
const resolvePhrase = async (p: BasePhrase): Promise<AudioBuffer> => {
    if (p.type === PhraseType.Punctuation) {
        const sec = {
            [PunctuationPhraseType.BreakWeak]: 0,
            [PunctuationPhraseType.BreakMedium]: 0.1,
            [PunctuationPhraseType.BreakStrong]: 0.25,
        }[(p as PunctuationPhrase).subType];
        const audioCtx = new AudioContext();
        const buffer = audioCtx.createBuffer(1, sec * SAMPLE_RATE, SAMPLE_RATE);
        return buffer;
    }

    if (p.type === PhraseType.Predefined) {
        const predefinedPhraseType = (p as PredefinedPhrase).subType;
        const path = resolvePredefinedPhrasesPath(
            p.voiceName as VoiceName,
            predefinedPhraseType as PredefinedPhraseType
        );
        const audioData = await readFile(path);
        const buffer = await decoder.decode(audioData, { sampleRate: SAMPLE_RATE });
        return buffer;
    }

    if (p.type === PhraseType.Customized) {
        const folder = resolvePath('..', 'resources', 'phrases', 'customized', p.voiceName as VoiceName);
        await mkdir(folder, { recursive: true });
        const path = resolvePath('..', 'resources', 'phrases', 'customized', p.voiceName as VoiceName, `${p.text}.wav`);
        if (!existsSync(path)) {
            console.log(`Customized ${p.text} does not exist, generating.`);
            const data = await synthesizeSpeech(p.voiceName as VoiceName, p.text, p.rate, p.contour);
            await writeFile(path, Buffer.from(data));
        }
        const audioData = await readFile(path);
        const buffer = await decoder.decode(audioData, { sampleRate: SAMPLE_RATE });
        return buffer;
    }

    throw new Error(`Unknown type: ${p.type}`);
};

// Actually its AudioData in web-audio-engine, but I can not find that type and AudioBuffer should be a close one.
const concatenateAudioBuffer = (buffers: AudioBuffer[]): AudioBuffer => {
    const length = buffers.reduce((acc, cur) => (acc += cur.length), 0);

    const audioCtx = new AudioContext();
    const concatenatedBuffer = audioCtx.createBuffer(1, length, SAMPLE_RATE);

    let offset = 0;
    buffers.forEach(buf => {
        const sourceData = buf.getChannelData(0);
        const destinationData = concatenatedBuffer.getChannelData(0);

        destinationData.set(sourceData, offset);
        offset += buf.length;
    });

    return concatenatedBuffer;
};

// const d1 = await readFile('NoteLastTrain.wav');
// const d2 = await readFile('TerminalAllGetOffLeft.wav');
// const ctx = new AudioContext();
// const buf1 = await decoder.decode(d1, { sampleRate: SAMPLE_RATE });
// const bufGap = ctx.createBuffer(1, 2 * SAMPLE_RATE, SAMPLE_RATE);
// const buf2 = await decoder.decode(d2, { sampleRate: SAMPLE_RATE });
// const buf = concatenateAudioBuffer([buf1, bufGap, buf2]);
// const d = await encoder.encode(buf);
// await writeFile('test.wav', Buffer.from(d));
