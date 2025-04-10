import { BasePhrase, makePunctuationPhrase, PhraseType, PunctuationPhraseType } from '../constants/phrases';
import { getPredefinedPhrases, PredefinedPhraseType } from '../constants/predefined-phrases';
import { ReconciledPhrases, Stage, Project, StyleType, Variants, VoiceName } from '../constants/constants';

export const reconcile = (s: Project) => {
    const res: ReconciledPhrases = {};

    for (const stn in s.stations) {
        res[stn] = {};
        for (const stage in s.stations[stn]) {
            res[stn][stage as Stage] = {};
            for (const voiceName in s.stations[stn][stage as Stage]) {
                // @ts-expect-error This is a must have value.
                const variants = s.stations[stn][stage as Stage][voiceName as VoiceName];
                if (!variants) throw new Error('Should never happen!');
                const phrases = styleMap[s.style].reconcile(
                    stage as Stage,
                    voiceName as VoiceName,
                    variants,
                    s.baseVariants
                );
                // @ts-expect-error This is a must have value.
                res[stn][stage as Stage][voiceName as VoiceName] = phrases;
            }
        }
    }

    return res;
};

const checkShanghaiMetroVariants = (stage: Stage, voiceName: VoiceName, baseVariants: Project['baseVariants']) => {
    if (stage === Stage.Arrival) {
        if (baseVariants[Stage.Arrival]?.[voiceName]?.terminal === undefined)
            throw new Error(`Terminal must exist in baseVariants, stage: ${Stage.Arrival}, voiceName: ${voiceName}.`);
        if (baseVariants[Stage.Arrival]?.[voiceName]?.doorDirection === undefined)
            throw new Error(
                `Door direction must exist in baseVariants, stage: ${Stage.Arrival}, voiceName: ${voiceName}.`
            );
    }
    if (stage === Stage.Departure) {
        if (baseVariants[Stage.Departure]?.[voiceName]?.terminal === undefined)
            throw new Error(`Terminal must exist in baseVariants, stage: ${Stage.Departure}, voiceName: ${voiceName}.`);
        if (baseVariants[Stage.Departure]?.[voiceName]?.nextDoorDirection === undefined)
            throw new Error(
                `Next door direction must exist in baseVariants, stage: ${Stage.Departure}, voiceName: ${voiceName}.`
            );
    }
};

const reconcileShanghaiMetro = (
    stage: Stage,
    voiceName: VoiceName,
    variants: Variants,
    baseVariants: Project['baseVariants']
) => {
    checkShanghaiMetroVariants(stage, voiceName, baseVariants);

    const customizedRate = voiceName === VoiceName.ChineseWuSimplifiedYunzhe ? undefined : '+18.00%';

    const res: BasePhrase[] = [];
    if (stage === Stage.Arrival) {
        if (voiceName === VoiceName.ChineseWuSimplifiedYunzhe) {
            res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.Arrive));
            res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakWeak));
        }
        const terminal = (variants.terminal ?? baseVariants[Stage.Arrival]![voiceName]!.terminal) === variants.name;
        if (terminal) {
            res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.NextStopTerminal));
            res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakWeak));
        }
        res.push({
            type: PhraseType.Customized,
            voiceName,
            text: variants.name as string,
            pinyin: variants.namePinyin as string,
            rate: customizedRate,
        });
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
        const doorOpen = variants.doorDirection ?? baseVariants[Stage.Arrival]![voiceName]!.doorDirection ?? 'left';
        if (terminal) {
            const terminalDoorOpenType =
                doorOpen === 'left'
                    ? PredefinedPhraseType.TerminalAllGetOffLeft
                    : PredefinedPhraseType.TerminalAllGetOffRight;
            res.push(getPredefinedPhrases(stage, voiceName, terminalDoorOpenType));
            if (baseVariants[Stage.Arrival]![voiceName]!.thanksForTaking) {
                const thanksForTaking = {
                    [VoiceName.ChineseMandarinSimplified]: `感谢您乘坐${
                        baseVariants[Stage.Arrival]![voiceName]!.thanksForTaking
                    }，祝您旅途愉快。`,
                    [VoiceName.ChineseWuSimplifiedXiaotong]: `谢谢侬搭乘${
                        baseVariants[Stage.Arrival]![voiceName]!.thanksForTaking
                    }，阿拉下趟再会。`,
                    [VoiceName.ChineseWuSimplifiedYunzhe]: `Thanks for taking ${
                        baseVariants[Stage.Arrival]![voiceName]!.thanksForTaking
                    }, see you next time.`,
                }[
                    voiceName as
                        | VoiceName.ChineseMandarinSimplified
                        | VoiceName.ChineseWuSimplifiedXiaotong
                        | VoiceName.ChineseWuSimplifiedYunzhe
                ];
                const thanksForTakingPinyin = {
                    [VoiceName.ChineseMandarinSimplified]: `感谢您乘坐${
                        baseVariants[Stage.Arrival]![voiceName]!.thanksForTakingPinyin
                    }，祝您旅途愉快。`,
                    [VoiceName.ChineseWuSimplifiedXiaotong]: `谢谢侬搭乘${
                        baseVariants[Stage.Arrival]![voiceName]!.thanksForTakingPinyin
                    }，阿拉下趟再会。`,
                    [VoiceName.ChineseWuSimplifiedYunzhe]: `Thanks for taking ${
                        baseVariants[Stage.Arrival]![voiceName]!.thanksForTakingPinyin
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
                    pinyin: thanksForTakingPinyin,
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
        const welcomeAbroad = (variants.welcomeAbroad ??
            baseVariants[Stage.Departure]![voiceName]!.welcomeAbroad) as string;
        const lineName = (variants.lineName ?? baseVariants[Stage.Departure]![voiceName]!.lineName) as string;
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
            const welcomeAbroadPinyin = (variants.welcomeAbroadPinyin ??
                baseVariants[Stage.Departure]![voiceName]!.welcomeAbroadPinyin) as string;
            const lineNamePinyin = (variants.lineNamePinyin ??
                baseVariants[Stage.Departure]![voiceName]!.lineNamePinyin) as string;
            const welcomeAbroadFullPinyin = {
                [VoiceName.ChineseMandarinSimplified]: `欢迎乘坐${welcomeAbroadPinyin}${lineNamePinyin}`,
                [VoiceName.ChineseWuSimplifiedXiaotong]: `欢迎搭乘${welcomeAbroadPinyin}${lineNamePinyin}`,
                [VoiceName.ChineseWuSimplifiedYunzhe]: `Welcome aboard ${welcomeAbroadPinyin} ${lineNamePinyin}`,
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
                pinyin: welcomeAbroadFullPinyin,
                rate: customizedRate,
            });
            res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakStrong));
        }

        const service = variants.service ?? baseVariants[Stage.Departure]![voiceName]!.service;
        if (
            service !== 'local' &&
            (voiceName === VoiceName.ChineseMandarinSimplified || voiceName === VoiceName.ChineseWuSimplifiedXiaotong)
        ) {
            // 本次列车是大站车
            if (service === 'express') {
                res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.ServiceExpress));
            } else if (service === 'direct') {
                res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.ServiceDirect));
            }
        }

        const loop = variants.loop ?? baseVariants[Stage.Departure]![voiceName]!.loop;
        const terminal = (variants.terminal ?? baseVariants[Stage.Departure]![voiceName]!.terminal) as string;
        const terminalPinyin = (variants.terminal ??
            baseVariants[Stage.Departure]![voiceName]!.terminalPinyin) as string;
        if (loop === 'none') {
            if (service === 'local' || voiceName === VoiceName.ChineseWuSimplifiedYunzhe) {
                res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.TheTerminalOfThisTrain));
            } else {
                res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.NextStopTerminal));
            }
            res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakWeak));
            res.push({
                type: PhraseType.Customized,
                voiceName,
                text: terminal,
                pinyin: terminalPinyin,
                rate: customizedRate,
            });
            res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakStrong));
        } else if (
            (loop === 'inner' || loop === 'outer') &&
            (voiceName === VoiceName.ChineseMandarinSimplified || voiceName === VoiceName.ChineseWuSimplifiedXiaotong)
        ) {
            const type =
                // @ts-expect-error loop : false | 'inner' | 'outer'
                loop === false
                    ? PredefinedPhraseType.Loop
                    : loop === 'inner'
                      ? PredefinedPhraseType.InnerLoop
                      : PredefinedPhraseType.OuterLoop;
            res.push(getPredefinedPhrases(stage, voiceName, type));
            res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakStrong));
            const loopTerminal = variants.loopTerminal ?? baseVariants[Stage.Departure]![voiceName]!.loopTerminal;
            if (loopTerminal) {
                res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.NextStopTerminal));
                res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakWeak));
                res.push({
                    type: PhraseType.Customized,
                    voiceName,
                    text: terminal,
                    pinyin: terminalPinyin,
                    rate: customizedRate,
                });
                res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakStrong));
            }
        }

        const stopovers = variants.stopovers as string[] | undefined;
        if (
            service !== 'local' &&
            stopovers &&
            stopovers.length > 0 &&
            (voiceName === VoiceName.ChineseMandarinSimplified || voiceName === VoiceName.ChineseWuSimplifiedXiaotong)
        ) {
            // 中途停靠 罗山路、新场、惠南、临港大道，到其他车站的乘客，请在 罗山路、新场、惠南 换乘
            // 中途停靠 临港大道
            res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.Stopovers1));
            res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakWeak));
            for (const stopover of stopovers) {
                res.push({
                    type: PhraseType.Customized,
                    voiceName,
                    text: stopover,
                    pinyin: stopover,
                    rate: customizedRate,
                });
                res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakMedium));
            }
            res.pop();
            res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakStrong));
            res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.Stopovers2));
            res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakWeak));
            for (const stopover of stopovers) {
                res.push({
                    type: PhraseType.Customized,
                    voiceName,
                    text: stopover,
                    pinyin: stopover,
                    rate: customizedRate,
                });
                res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakMedium));
            }
            res.pop();
            res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakWeak));
            res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.Stopovers3));
            res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakStrong));
        }

        res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.NextStop));
        res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakWeak));
        if (variants.next === terminal) {
            res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.NextStopTerminal));
            res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakWeak));
        }
        res.push({
            type: PhraseType.Customized,
            voiceName,
            text: variants.next as string,
            pinyin: variants.nextPinyin as string,
            rate: customizedRate,
        });
        res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakStrong));
        const doorOpen =
            variants.nextDoorDirection ?? baseVariants[Stage.Departure]![voiceName]!.nextDoorDirection ?? 'left';
        const doorOpenType =
            doorOpen === 'left' ? PredefinedPhraseType.DoorOpenLeft : PredefinedPhraseType.DoorOpenRight;
        res.push(getPredefinedPhrases(stage, voiceName, doorOpenType));
        res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakStrong));

        const int = variants.int as string[][] | undefined;
        if (int?.flat().length) {
            if ((int.at(0)?.length ?? 0) > 0) {
                res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.InterchangeAvailable));
                res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakWeak));
                res.push(
                    ...(int.at(0)! as string[])
                        .map(int => [
                            {
                                type: PhraseType.Customized,
                                voiceName,
                                text: int,
                                pinyin: int,
                                rate: customizedRate,
                            },
                            makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakWeak),
                        ])
                        .flat()
                );
                res.pop(); // remove the trailing punctuation phrase
                res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakStrong));
            }
            if ((int.at(1)?.length ?? 0) > 0) {
                res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.OutOfStationInterchangeAvailable));
                res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakWeak));
                res.push(
                    ...(int.at(1)! as string[])
                        .map(int => [
                            {
                                type: PhraseType.Customized,
                                voiceName,
                                text: int,
                                pinyin: int,
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
            if ((int.at(2)?.length ?? 0) > 0) {
                res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.OutOfSystemInterchangeAvailable));
                res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakWeak));
                res.push(
                    ...(int.at(2)! as string[])
                        .map(int => [
                            {
                                type: PhraseType.Customized,
                                voiceName,
                                text: int,
                                pinyin: int,
                                rate: customizedRate,
                            },
                            makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakWeak),
                        ])
                        .flat()
                );
                res.pop(); // remove the trailing punctuation phrase
                res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakStrong));
            }

            const noteLastTrain = variants.noteLastTrain ?? baseVariants[Stage.Departure]![voiceName]!.noteLastTrain;
            if (
                noteLastTrain &&
                (voiceName === VoiceName.ChineseMandarinSimplified ||
                    voiceName === VoiceName.ChineseWuSimplifiedXiaotong)
            ) {
                res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.NoteLastTrain));
            }
        }

        const branchTerminalName = variants.branchTerminalName as string;
        if (branchTerminalName) {
            // 需要往闵行开发区方向的乘客，请在本站下车后换乘
            // 可换乘往航中路方向的列车
            // 要往花桥方向的乘客，请在本站下车后换乘
            if (
                voiceName === VoiceName.ChineseMandarinSimplified ||
                voiceName === VoiceName.ChineseWuSimplifiedXiaotong
            ) {
                res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.BranchTerminal1));
                res.push({
                    type: PhraseType.Customized,
                    voiceName,
                    text: branchTerminalName,
                    pinyin: variants.branchTerminalNamePinyin as string,
                    rate: customizedRate,
                });
                res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.BranchTerminal2));
                res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakStrong));
            }
            // You may transfer trains bound for Hangzhong Road.
            if (voiceName === VoiceName.ChineseWuSimplifiedYunzhe) {
                res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.BranchTerminalEnglish));
                res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakWeak));
                res.push({
                    type: PhraseType.Customized,
                    voiceName,
                    text: branchTerminalName,
                    pinyin: variants.branchTerminalNamePinyin as string,
                    rate: customizedRate,
                });
                res.push(makePunctuationPhrase(voiceName, PunctuationPhraseType.BreakStrong));
            }
        }
    } else if (stage === Stage.Midway) {
        const leaveLoveSeat = variants.leaveLoveSeat ?? baseVariants[Stage.Midway]![voiceName]!.leaveLoveSeat;
        if (leaveLoveSeat) {
            res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.LeaveLoveSeat));
        }
        const caution = variants.caution ?? baseVariants[Stage.Midway]![voiceName]!.caution;
        if (caution) {
            res.push(getPredefinedPhrases(stage, voiceName, PredefinedPhraseType.Caution));
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
