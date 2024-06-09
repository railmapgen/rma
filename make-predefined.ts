import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import {
    PredefinedPhrase,
    predefinedPhrases,
    PredefinedPhraseType,
    resolvePredefinedPhrasesFolder,
    resolvePredefinedPhrasesPath,
} from './predefined-phrases.js';
import { synthesizeSpeech } from './synthesize.js';
import { Stage, VoiceName } from './types.js';

const makePredefinedPhrases = async () => {
    for (const stage in predefinedPhrases) {
        console.log(`===== Stage: ${stage} =====`);
        for (const voiceLocale in predefinedPhrases[stage as Stage]) {
            console.log(`===== voiceName: ${voiceLocale} =====`);
            // @ts-expect-error This is a must have value.
            for (const predefinedPhraseType in predefinedPhrases[stage as Stage][voiceLocale as VoiceName]) {
                console.log(`===== PredefinedPhraseType: ${predefinedPhraseType} =====`);
                const { text, voiceName, rate, contour } =
                    // @ts-expect-error This is a must have value.
                    predefinedPhrases[stage as Stage][voiceLocale as VoiceName][
                        predefinedPhraseType as PredefinedPhraseType
                    ] as PredefinedPhrase;
                const path = resolvePredefinedPhrasesPath(
                    voiceName as VoiceName,
                    predefinedPhraseType as PredefinedPhraseType
                );
                console.log(`Path is ${path}, text is ${text}.`);
                if (existsSync(path)) {
                    console.log(`${predefinedPhraseType} exists under ${path}, SKIP.`);
                    continue;
                }
                console.log(`${path} DOES NOT exist, trying to generate.`);

                const folder = resolvePredefinedPhrasesFolder(voiceName as VoiceName);
                await mkdir(folder, { recursive: true });

                const data = await synthesizeSpeech(
                    voiceName as VoiceName,
                    text as string,
                    rate as string,
                    contour as string | undefined
                );
                await writeFile(path, Buffer.from(data));
                console.log(`SUCCESSFULLY generate ${predefinedPhraseType} with text ${text} under ${path}.`);
                // break;
            }
            // break;
        }
        // break;
    }
};

await makePredefinedPhrases();
