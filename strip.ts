import { mkdir, readFile, writeFile, readdir } from 'fs/promises';
import { resolve } from 'path';
// @ts-ignore
import { decoder, encoder, RenderingAudioContext as AudioContext } from 'web-audio-engine';
import { VoiceName } from './types.js';

const SAMPLE_RATE = 44.1 * 1000;

// Actually its AudioData in web-audio-engine, but I can not find that type and AudioBuffer should be a close one.
// stripDuration in seconds.
export const stripLast = (buf: AudioBuffer, stripDuration: number): AudioBuffer => {
    const ctx = new AudioContext();
    const newLength = Math.floor((buf.duration - stripDuration) * SAMPLE_RATE);

    const newBuf = ctx.createBuffer(1, newLength, SAMPLE_RATE);

    const sourceData = buf.getChannelData(0);
    const destinationData = newBuf.getChannelData(0);

    for (let i = 0; i < newLength; i++) {
        destinationData[i] = sourceData[i];
    }

    return newBuf;
};

const manualStripLast = async () => {
    const ctx = new AudioContext();

    const path = resolve('..', 'resources', 'phrases', 'customized', VoiceName.ChineseMandarinSimplified);
    // const files = await readdir(path);
    for (const file of await readdir(path)) {
        const data = await readFile(resolve(path, file));
        const buf = await decoder.decode(data, { sampleRate: SAMPLE_RATE });
        const newLength = Math.floor((buf.duration - 0.5) * SAMPLE_RATE);
        const newBuf = ctx.createBuffer(1, newLength, SAMPLE_RATE);

        const sourceData = buf.getChannelData(0);
        const destinationData = newBuf.getChannelData(0);

        for (let i = 0; i < newLength; i++) {
            destinationData[i] = sourceData[i];
        }

        const newData = await encoder.encode(newBuf);
        // await writeFile(resolve(path, file), Buffer.from(newData));
    }
};
