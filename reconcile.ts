import { BasePhrase, makePunctuationPhrase, phrasesToString, PhraseType, PunctuationPhraseType } from './phrases.js';
import { getPredefinedPhrases, PredefinedPhraseType } from './predefined-phrases.js';
import { ReconciledPhrases, Stage, Project, StyleType, Variants, VoiceName } from './types.js';

export const reconcile = (s: Project) => {
    const res: ReconciledPhrases = {};

    for (const stn in s.stations) {
        res[stn] = {};
        for (const stage in s.stations[stn]) {
            res[stn][stage as Stage] = {};
            for (const voiceName in s.stations[stn][stage as Stage]) {
                // @ts-expect-error This is must have value.
                const sentence = s.stations[stn][stage as Stage][voiceName as VoiceName];
                if (!sentence) throw new Error('Should never happen!');
                if (sentence.mode !== 'auto') continue;
                const phrases = styleMap[s.style].reconcile(
                    stage as Stage,
                    voiceName as VoiceName,
                    sentence.variants,
                    s.baseVariants
                );
                // @ts-expect-error This is must have value.
                res[stn][stage as Stage][voiceName as VoiceName] = phrases;
                // @ts-expect-error This is must have value.
                s.stations[stn][stage as Stage][voiceName as VoiceName].text = phrasesToString(phrases);
            }
        }
    }

    return res;
};

const checkShanghaiMetroVariants = (stage: Stage, voiceName: VoiceName, baseVariants: Variants) => {
    if (stage === Stage.Arrival) {
        if (!baseVariants[Stage.Arrival][voiceName].terminal)
            throw new Error(`Terminal must exist in baseVariants, stage: ${Stage.Arrival}, voiceName: ${voiceName}.`);
        if (!baseVariants[Stage.Arrival][voiceName].doorDirection)
            throw new Error(
                `Door direction must exist in baseVariants, stage: ${Stage.Arrival}, voiceName: ${voiceName}.`
            );
    }
    if (stage === Stage.Departure) {
        if (!baseVariants[Stage.Departure][voiceName].terminal)
            throw new Error(`Terminal must exist in baseVariants, stage: ${Stage.Arrival}, voiceName: ${voiceName}.`);
        if (!baseVariants[Stage.Departure][voiceName].nextDoorDirection)
            throw new Error(
                `Next door direction must exist in baseVariants, stage: ${Stage.Arrival}, voiceName: ${voiceName}.`
            );
    }
};

const reconcileShanghaiMetro = (stage: Stage, voiceName: VoiceName, variants: Variants, baseVariants: Variants) => {
    checkShanghaiMetroVariants(stage, voiceName, baseVariants);

    const customizedRate = voiceName === VoiceName.ChineseWuSimplifiedYunzhe ? undefined : '+18.00%';

    const res: BasePhrase[] = [];
    if (stage === Stage.Arrival) {
        if (voiceName === VoiceName.ChineseWuSimplifiedYunzhe) {
            res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.Arrive));
            res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakWeak));
        }
        const terminal = (variants.terminal ?? baseVariants[Stage.Arrival][voiceName].terminal) === variants.name;
        if (terminal) {
            res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.NextStopTerminal));
            res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakWeak));
        }
        res.push({ type: PhraseType.Customized, voiceName, text: variants.name, rate: customizedRate });
        res.push(
            makePunctuationPhrase(
                voiceName,
                voiceName === VoiceName.ChineseWuSimplifiedYunzhe
                    ? PunctuationPhraseType.BreakStrong
                    : PunctuationPhraseType.BreakWeak
            )
        );
        if ([VoiceName.ChineseMandarinSimplified, VoiceName.ChineseWuSimplifiedXiaotong].includes(voiceName)) {
            res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.Arrive));
            res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakStrong));
        }
        const doorOpen = variants.doorDirection ?? baseVariants[Stage.Arrival][voiceName].doorDirection ?? 'left';
        if (terminal) {
            const terminalDoorOpenType =
                doorOpen === 'left'
                    ? PredefinedPhraseType.TerminalAllGetOffLeft
                    : PredefinedPhraseType.TerminalAllGetOffRight;
            res.push(getPredefinedPhrases(stage, voiceName, terminalDoorOpenType));
            if (baseVariants[Stage.Arrival][voiceName].thanksForTaking) {
                const thanksForTaking = {
                    [VoiceName.ChineseMandarinSimplified]: `感谢您乘坐${
                        baseVariants[Stage.Arrival][voiceName].thanksForTaking
                    }，祝您旅途愉快。`,
                    [VoiceName.ChineseWuSimplifiedXiaotong]: `谢谢侬搭乘${
                        baseVariants[Stage.Arrival][voiceName].thanksForTaking
                    }，阿拉下趟再会。`,
                    [VoiceName.ChineseWuSimplifiedYunzhe]: `Thanks for taking ${
                        baseVariants[Stage.Arrival][voiceName].thanksForTaking
                    }, see you next time.`,
                }[
                    voiceName as
                        | VoiceName.ChineseMandarinSimplified
                        | VoiceName.ChineseWuSimplifiedXiaotong
                        | VoiceName.ChineseWuSimplifiedYunzhe
                ];
                res.push({
                    type: PhraseType.Customized,
                    voiceName,
                    text: thanksForTaking,
                    rate: customizedRate,
                });
            }
        } else {
            const doorOpenType =
                doorOpen === 'left' ? PredefinedPhraseType.DoorOpenLeft : PredefinedPhraseType.DoorOpenRight;
            res.push(getPredefinedPhrases(stage, voiceName, doorOpenType));
            res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakStrong));
        }
    } else if (stage === Stage.Departure) {
        const welcomeAbroad: string = variants.welcomeAbroad ?? baseVariants[Stage.Departure][voiceName].welcomeAbroad;
        const lineName: string = variants.lineName ?? baseVariants[Stage.Departure][voiceName].lineName;
        if (welcomeAbroad && lineName) {
            const welcomeAbroadFull = {
                [VoiceName.ChineseMandarinSimplified]: `欢迎乘坐${welcomeAbroad}${lineName}`,
                [VoiceName.ChineseWuSimplifiedXiaotong]: `欢迎搭乘${welcomeAbroad}${lineName}`,
                [VoiceName.ChineseWuSimplifiedYunzhe]: `Welcome aboard ${welcomeAbroad} ${lineName}`,
            }[
                voiceName as
                    | VoiceName.ChineseMandarinSimplified
                    | VoiceName.ChineseWuSimplifiedXiaotong
                    | VoiceName.ChineseWuSimplifiedYunzhe
            ];
            // res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.WelcomeAbroad));
            // res.push(getPredefinedPhrases(stage, voiceName, variants.welcomeAbroad));
            // res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakWeak));
            res.push({
                type: PhraseType.Customized,
                voiceName,
                text: welcomeAbroadFull,
                rate: customizedRate,
            });
            res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakStrong));
        }
        res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.TheTerminalOfThisTrain));
        res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakWeak));
        const terminal = variants.terminal ?? baseVariants[Stage.Arrival][voiceName].terminal;
        res.push({ type: PhraseType.Customized, voiceName, text: terminal, rate: customizedRate });
        res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakStrong));
        res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.NextStop));
        res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakWeak));
        if (variants.next === terminal) {
            res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.NextStopTerminal));
            res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakWeak));
        }
        res.push({ type: PhraseType.Customized, voiceName, text: variants.next, rate: customizedRate });
        res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakStrong));
        const doorOpen =
            variants.nextDoorDirection ?? baseVariants[Stage.Departure][voiceName].nextDoorDirection ?? 'left';
        const doorOpenType =
            doorOpen === 'left' ? PredefinedPhraseType.DoorOpenLeft : PredefinedPhraseType.DoorOpenRight;
        res.push(getPredefinedPhrases(stage, voiceName, doorOpenType));
        res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakStrong));

        if (variants.int?.flat().filter((i: [string, string][] | undefined) => i).length) {
            if (variants.int.at(0)?.length > 0) {
                res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.InterchangeAvailable));
                res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakWeak));
                res.push(
                    ...(variants.int.at(0)! as string[])
                        .map(int => [
                            {
                                type: PhraseType.Customized,
                                voiceName,
                                text: int,
                                rate: customizedRate,
                            },
                            makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakWeak),
                        ])
                        .flat()
                );
                res.pop(); // remove the trailing punctuation phrase
                res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakStrong));
            }
            if (variants.int.at(1)?.length > 0) {
                res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.OutOfStationInterchangeAvailable));
                res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakWeak));
                res.push(
                    ...(variants.int.at(1)! as string[])
                        .map(int => [
                            {
                                type: PhraseType.Customized,
                                voiceName,
                                text: int,
                                rate: customizedRate,
                            },
                            makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakWeak),
                        ])
                        .flat()
                );
                res.pop(); // remove the trailing punctuation phrase
                if (voiceName === VoiceName.ChineseWuSimplifiedYunzhe) {
                    res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakWeak));
                    res.push(
                        getPredefinedPhrases(
                            stage,
                            voiceName,
                            PredefinedPhraseType.OutOfStationInterchangeAvailableEnglish2
                        )
                    );
                } else {
                    res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakStrong));
                }
            }
            if (variants.int.at(2)?.length > 0) {
                res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.OutOfSystemInterchangeAvailable));
                res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakWeak));
                res.push(
                    ...(variants.int.at(2)! as string[])
                        .map(int => [
                            {
                                type: PhraseType.Customized,
                                voiceName,
                                text: int,
                                rate: customizedRate,
                            },
                            makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakWeak),
                        ])
                        .flat()
                );
                res.pop(); // remove the trailing punctuation phrase
                res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakStrong));
            }

            const noteLastTrain = variants.noteLastTrain ?? baseVariants[Stage.Departure][voiceName].noteLastTrain;
            if (noteLastTrain) {
                res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.NoteLastTrain));
            }
        }
    } else if (stage === Stage.Midway) {
        const leaveLoveSeat = variants.leaveLoveSeat ?? baseVariants[Stage.Midway][voiceName].leaveLoveSeat;
        if (leaveLoveSeat) {
            res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.LeaveLoveSeat));
        }
    }

    return res;
};

const styleMap = {
    [StyleType.ShanghaiMetro]: {
        reconcile: reconcileShanghaiMetro,
    },
};

// const output = reconcile(style);
// console.log(JSON.stringify(style, null, 4));
// console.log(JSON.stringify(output, null, 4));
