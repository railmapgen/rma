import { BasePhrase, PhraseType } from './phrases';
import { Stage, VoiceName } from './constants';

export enum PredefinedPhraseType {
    NextStopTerminal = 'NextStopTerminal',
    TerminalAllGetOffLeft = 'TerminalAllGetOffLeft',
    TerminalAllGetOffRight = 'TerminalAllGetOffRight',
    Arrive = 'Arrive',
    DoorOpenLeft = 'DoorOpenLeft',
    DoorOpenRight = 'DoorOpenRight',
    TheTerminalOfThisTrain = 'TheTerminalOfThisTrain',
    NextStop = 'NextStop',
    InterchangeAvailable = 'InterchangeAvailable',
    OutOfStationInterchangeAvailable = 'OutOfStationInterchangeAvailable',
    OutOfStationInterchangeAvailableEnglish2 = 'OutOfStationInterchangeAvailableEnglish2',
    OutOfSystemInterchangeAvailable = 'OutOfSystemInterchangeAvailable',
    NoteLastTrain = 'NoteLastTrain',
    // WelcomeAbroad = 'WelcomeAbroad',
    // RailTransit = 'RailTransit',
    // IntercityRailway = 'IntercityRailway',
    LeaveLoveSeat = 'LeaveLoveSeat',
    Caution = 'Caution',
    Loop = 'Loop',
    InnerLoop = 'InnerLoop',
    OuterLoop = 'OuterLoop',
}

export interface PredefinedPhrase extends BasePhrase {
    subType: PredefinedPhraseType;
}

export const predefinedPhrases: {
    [k in Stage]?: { [k in VoiceName]?: { [k in PredefinedPhraseType]?: BasePhrase } };
} = {
    [Stage.Arrival]: {
        [VoiceName.ChineseMandarinSimplified]: {
            [PredefinedPhraseType.NextStopTerminal]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseMandarinSimplified,
                text: '终点站',
                pinyin: '终点站',
                rate: '+18.00%',
            },
            [PredefinedPhraseType.Arrive]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseMandarinSimplified,
                text: '到了',
                pinyin: '到了',
                rate: '+18.00%',
            },
            [PredefinedPhraseType.TerminalAllGetOffLeft]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseMandarinSimplified,
                text: '请全体乘客在屏蔽门完全打开后，从左边车门下车。',
                pinyin: '请全体乘客在屏蔽门完全打开后，从左边车门下车。',
                rate: '+18.00%',
            },
            [PredefinedPhraseType.TerminalAllGetOffRight]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseMandarinSimplified,
                text: '请全体乘客在屏蔽门完全打开后，从右边车门下车。',
                pinyin: '请全体乘客在屏蔽门完全打开后，从右边车门下车。',
                rate: '+18.00%',
            },
            [PredefinedPhraseType.DoorOpenLeft]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseMandarinSimplified,
                text: '开左边门',
                pinyin: '开左边门',
                rate: '+18.00%',
            },
            [PredefinedPhraseType.DoorOpenRight]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseMandarinSimplified,
                text: '开右边门',
                pinyin: '开右边门',
                rate: '+18.00%',
            },
        },
        [VoiceName.ChineseWuSimplifiedXiaotong]: {
            [PredefinedPhraseType.NextStopTerminal]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedXiaotong,
                text: '终点站',
                rate: '+18.00%',
                pinyin: '终点站',
            },
            [PredefinedPhraseType.Arrive]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedXiaotong,
                text: '到了',
                pinyin: '到了',
                rate: '+18.00%',
            },
            [PredefinedPhraseType.TerminalAllGetOffLeft]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedXiaotong,
                text: '请所有乘客勒屏蔽门完全打开后，从左边车门下车。',
                pinyin: '请所有乘客勒屏蔽门完全打开后，从左边车门下车。',
                rate: '+18.00%',
            },
            [PredefinedPhraseType.TerminalAllGetOffRight]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedXiaotong,
                text: '请所有乘客勒屏蔽门完全打开后，从右边车门下车。',
                pinyin: '请所有乘客勒屏蔽门完全打开后，从右边车门下车。',
                rate: '+18.00%',
            },
            [PredefinedPhraseType.DoorOpenLeft]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedXiaotong,
                text: '开左边门',
                pinyin: '开左边门',
                rate: '+18.00%',
            },
            [PredefinedPhraseType.DoorOpenRight]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedXiaotong,
                text: '开右边门',
                pinyin: '开右边门',
                rate: '+18.00%',
            },
        },
        [VoiceName.ChineseWuSimplifiedYunzhe]: {
            [PredefinedPhraseType.NextStopTerminal]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedYunzhe,
                text: 'the terminal station',
                pinyin: 'the terminal station',
            },
            [PredefinedPhraseType.Arrive]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedYunzhe,
                text: 'We are now at',
                pinyin: 'We are now at',
            },
            [PredefinedPhraseType.TerminalAllGetOffLeft]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedYunzhe,
                text: 'Please get ready to the exit from the left side. ',
                pinyin: 'Please get ready to the exit from the left side. ',
            },
            [PredefinedPhraseType.TerminalAllGetOffRight]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedYunzhe,
                text: 'Please get ready to the exit from the right side. ',
                pinyin: 'Please get ready to the exit from the right side. ',
            },
            [PredefinedPhraseType.DoorOpenLeft]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedYunzhe,
                text: 'Doors will open on the left',
                pinyin: 'Doors will open on the left',
            },
            [PredefinedPhraseType.DoorOpenRight]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedYunzhe,
                text: 'Doors will open on the right',
                pinyin: 'Doors will open on the right',
            },
        },
    },
    [Stage.Departure]: {
        [VoiceName.ChineseMandarinSimplified]: {
            // [PredefinedPhraseType.WelcomeAbroad]: {
            //     type: PhraseType.Predefined,
            //     voiceName: voiceName.ChineseMandarinSimplified,
            //     text: '欢迎乘坐',
            //     rate: '+18.00%',
            //     contour: '(60%, +0%) (100%, +25%)',
            // },
            // [PredefinedPhraseType.RailTransit]: {
            //     type: PhraseType.Predefined,
            //     voiceName: voiceName.ChineseMandarinSimplified,
            //     text: '轨道交通',
            //     rate: '+18.00%',
            //     contour: '(60%, +0%) (100%, +25%)',
            // },
            // [PredefinedPhraseType.IntercityRailway]: {
            //     type: PhraseType.Predefined,
            //     voiceName: voiceName.ChineseMandarinSimplified,
            //     text: '市域铁路',
            //     rate: '+18.00%',
            //     contour: '(60%, +0%) (100%, +25%)',
            // },
            [PredefinedPhraseType.TheTerminalOfThisTrain]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseMandarinSimplified,
                text: '本次列车终点站',
                pinyin: '本次列车终点站',
                rate: '+18.00%',
            },
            [PredefinedPhraseType.InnerLoop]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseMandarinSimplified,
                text: '本次列车内圈运行',
                pinyin: '本次列车内圈运行',
                rate: '+18.00%',
            },
            [PredefinedPhraseType.OuterLoop]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseMandarinSimplified,
                text: '本次列车外圈运行',
                pinyin: '本次列车外圈运行',
                rate: '+18.00%',
            },
            [PredefinedPhraseType.Loop]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseMandarinSimplified,
                text: '本线为环线',
                pinyin: '本线为环线',
                rate: '+18.00%',
            },
            [PredefinedPhraseType.NextStop]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseMandarinSimplified,
                text: '下一站',
                pinyin: '下一站',
                rate: '+18.00%',
            },
            [PredefinedPhraseType.NextStopTerminal]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseMandarinSimplified,
                text: '终点站',
                pinyin: '终点站',
                rate: '+18.00%',
            },
            [PredefinedPhraseType.DoorOpenLeft]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseMandarinSimplified,
                text: '开左边门',
                pinyin: '开左边门',
                rate: '+18.00%',
            },
            [PredefinedPhraseType.DoorOpenRight]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseMandarinSimplified,
                text: '开右边门',
                pinyin: '开右边门',
                rate: '+18.00%',
            },
            [PredefinedPhraseType.InterchangeAvailable]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseMandarinSimplified,
                text: '可换乘',
                pinyin: '可换乘',
                rate: '+18.00%',
                contour: '(50%, +0%) (100%, +30%)',
            },
            [PredefinedPhraseType.OutOfStationInterchangeAvailable]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseMandarinSimplified,
                text: '手持交通卡的乘客，可在出站后30分钟内，免费换乘',
                pinyin: '手持交通卡的乘客，可在出站后30分钟内，免费换乘',
                rate: '+18.00%',
                contour: '(50%, +0%) (100%, +30%)',
            },
            [PredefinedPhraseType.OutOfSystemInterchangeAvailable]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseMandarinSimplified,
                text: '可转乘',
                pinyin: '可转乘',
                rate: '+18.00%',
                contour: '(50%, +0%) (100%, +30%)',
            },
            [PredefinedPhraseType.NoteLastTrain]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseMandarinSimplified,
                text: '请注意换乘列车的首末班车时间。',
                pinyin: '请注意换乘列车的首末班车时间。',
                rate: '+18.00%',
            },
        },
        [VoiceName.ChineseWuSimplifiedXiaotong]: {
            [PredefinedPhraseType.TheTerminalOfThisTrain]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedXiaotong,
                text: '本趟列车额终点站是',
                pinyin: '本趟列车额终点站是',
                rate: '+18.00%',
            },
            [PredefinedPhraseType.InnerLoop]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseMandarinSimplified,
                text: '本趟列车内圈运行',
                pinyin: '本趟列车内圈运行',
                rate: '+18.00%',
            },
            [PredefinedPhraseType.OuterLoop]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseMandarinSimplified,
                text: '本趟列车外圈运行',
                pinyin: '本趟列车外圈运行',
                rate: '+18.00%',
            },
            [PredefinedPhraseType.Loop]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseMandarinSimplified,
                text: '本线为环线',
                pinyin: '本线为环线',
                rate: '+18.00%',
            },
            [PredefinedPhraseType.NextStop]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedXiaotong,
                text: '下一站',
                pinyin: '下一站',
                rate: '+18.00%',
            },
            [PredefinedPhraseType.NextStopTerminal]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedXiaotong,
                text: '终点站',
                pinyin: '终点站',
                rate: '+18.00%',
            },
            [PredefinedPhraseType.DoorOpenLeft]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedXiaotong,
                text: '开左边门',
                pinyin: '开左边门',
                rate: '+18.00%',
            },
            [PredefinedPhraseType.DoorOpenRight]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedXiaotong,
                text: '开右边门',
                pinyin: '开右边门',
                rate: '+18.00%',
            },
            [PredefinedPhraseType.InterchangeAvailable]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedXiaotong,
                text: '可以换乘',
                pinyin: '可以换乘',
                rate: '+18.00%',
                contour: '(50%, +0%) (100%, +30%)',
            },
            [PredefinedPhraseType.OutOfStationInterchangeAvailable]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedXiaotong,
                text: '拿着交通卡的乘客，好勒出站后30分钟内，免费换乘',
                pinyin: '拿着交通卡的乘客，好勒出站后30分钟内，免费换乘',
                rate: '+18.00%',
                contour: '(50%, +0%) (100%, +30%)',
            },
            [PredefinedPhraseType.OutOfSystemInterchangeAvailable]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedXiaotong,
                text: '可以转乘',
                pinyin: '可以转乘',
                rate: '+18.00%',
                contour: '(50%, +0%) (100%, +30%)',
            },
            [PredefinedPhraseType.NoteLastTrain]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedXiaotong,
                text: '请注意换乘列车额首末班车辰光。',
                pinyin: '请注意换乘列车额首末班车辰光。',
                rate: '+18.00%',
            },
        },
        [VoiceName.ChineseWuSimplifiedYunzhe]: {
            [PredefinedPhraseType.TheTerminalOfThisTrain]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedYunzhe,
                text: 'The terminal station',
                pinyin: 'The terminal station',
            },
            [PredefinedPhraseType.NextStop]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedYunzhe,
                text: 'Next station',
                pinyin: 'Next station',
            },
            [PredefinedPhraseType.NextStopTerminal]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedYunzhe,
                text: 'is the terminal station',
                pinyin: 'is the terminal station',
            },
            [PredefinedPhraseType.DoorOpenLeft]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedYunzhe,
                text: 'Doors will open on the left',
                pinyin: 'Doors will open on the left',
            },
            [PredefinedPhraseType.DoorOpenRight]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedYunzhe,
                text: 'Doors will open on the right',
                pinyin: 'Doors will open on the right',
            },
            [PredefinedPhraseType.InterchangeAvailable]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedYunzhe,
                text: 'You can transfer to',
                pinyin: 'You can transfer to',
            },
            [PredefinedPhraseType.OutOfStationInterchangeAvailable]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedYunzhe,
                text: 'Passengers holding public transportation card, may transfer to',
                pinyin: 'Passengers holding public transportation card, may transfer to',
                contour: '(60%, +0%) (100%, +30%)',
            },
            [PredefinedPhraseType.OutOfStationInterchangeAvailableEnglish2]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedYunzhe,
                text: 'within 30 minutes after getting out of the station. ',
                pinyin: 'within 30 minutes after getting out of the station. ',
            },
            [PredefinedPhraseType.OutOfSystemInterchangeAvailable]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseWuSimplifiedYunzhe,
                text: 'or take the',
                pinyin: 'or take the',
                contour: '(50%, +0%) (100%, +30%)',
            },
        },
    },
    [Stage.Midway]: {
        [VoiceName.ChineseMandarinSimplified]: {
            [PredefinedPhraseType.LeaveLoveSeat]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseMandarinSimplified,
                text: '请把爱心专座留给有需要的乘客。',
                pinyin: '请把爱心专座留给有需要的乘客。',
                rate: '+18.00%',
            },
            [PredefinedPhraseType.Caution]: {
                type: PhraseType.Predefined,
                voiceName: VoiceName.ChineseMandarinSimplified,
                text: '列车运行，请站稳扶好，不要看手机，注意脚下安全。',
                pinyin: '列车运行，请站稳扶好，不要看手机，注意脚下安全。',
                rate: '+18.00%',
            },
        },
    },
};

export const getPredefinedPhrases = (
    stage: Stage,
    voiceName: VoiceName,
    predefinedPhraseType: PredefinedPhraseType
): PredefinedPhrase => {
    const predefinedPhrase = predefinedPhrases[stage]?.[voiceName]?.[predefinedPhraseType];
    if (!predefinedPhrase)
        throw new Error(
            `Predefined phrase must exist in predefinedPhrases, ` +
                `stage: ${stage}, voiceName: ${voiceName}, predefinedPhraseType: ${predefinedPhraseType}.`
        );
    return { ...predefinedPhrase, subType: predefinedPhraseType };
};
