import { Project, Stage, StyleType, VoiceName } from './types.js';

type Name = [string, string];

const makeBaseVariants = (
    terminal: Name,
    lineName: Name,
    doorDirection: 'left' | 'right' = 'left',
    nextDoorDirection: 'left' | 'right' = 'left',
    railwayName?: Name
) => ({
    [Stage.Arrival]: {
        [VoiceName.ChineseWuSimplifiedXiaotong]: {
            terminal: terminal[0],
            doorDirection,
            thanksForTaking: railwayName?.at(0),
        },
        [VoiceName.ChineseMandarinSimplified]: {
            terminal: terminal[0],
            doorDirection,
            thanksForTaking: railwayName?.at(0),
        },
        [VoiceName.ChineseWuSimplifiedYunzhe]: {
            terminal: terminal[1],
            doorDirection,
            thanksForTaking: railwayName?.at(1),
        },
    },
    [Stage.Departure]: {
        [VoiceName.ChineseWuSimplifiedXiaotong]: {
            welcomeAbroad: railwayName?.at(0),
            terminal: terminal[0],
            nextDoorDirection,
            lineName: lineName[0],
        },
        [VoiceName.ChineseMandarinSimplified]: {
            welcomeAbroad: railwayName?.at(0),
            terminal: terminal[0],
            nextDoorDirection,
            lineName: lineName[0],
        },
        [VoiceName.ChineseWuSimplifiedYunzhe]: {
            welcomeAbroad: railwayName?.at(1),
            terminal: terminal[1],
            nextDoorDirection,
            lineName: lineName[1],
            // noteLastTrain: false,
        },
    },
});

export const makeProject = (rmg: any): Project => {
    const proj: Project = { style: StyleType.ShanghaiMetro, baseVariants: {}, stations: {} };

    const lineName: Name = rmg.line_name;
    const stnList: Record<string, any> = rmg.stn_list;
    const doorDirection = 'left';
    const nextDoorDirection = 'left';
    // const railwayName: [string, string] = ['文溪市域铁路', '文溪 Intercity Railway'];
    const railwayName: [string, string] = ['轨道交通', 'Rail Transit'];

    // get terminal
    let terminalID = '';
    let currentStnID = 'linestart';
    while (currentStnID !== 'lineend') {
        const nextID = stnList[currentStnID].children[0];
        if (nextID === 'lineend') {
            terminalID = currentStnID;
            break;
        }
        currentStnID = nextID;
    }
    if (terminalID === '') throw new Error('Invalid RMG save!');

    const terminalName: Name = stnList[terminalID].name;
    proj.baseVariants = makeBaseVariants(terminalName, lineName, doorDirection, nextDoorDirection, railwayName);

    // make variants for each station
    currentStnID = stnList['linestart'].children[0];
    while (currentStnID !== 'lineend') {
        const currentName: Name = stnList[currentStnID].name;
        proj.stations[currentName[0]] = {};

        const prevID = stnList[currentStnID].parents[0];
        // has arr stage if current station is not the start
        if (prevID !== 'linestart') {
            proj.stations[currentName[0]][Stage.Arrival] = {
                [VoiceName.ChineseWuSimplifiedXiaotong]: {
                    mode: 'auto',
                    text: `（终点站，）${currentName[0]}，到了。请所有乘客勒屏蔽门完全打开后，从${doorDirection}边车门下车。谢谢侬搭乘${railwayName[0]}，阿拉下趟再会。`,
                    variants: { name: currentName[0], doorDirection },
                },
                [VoiceName.ChineseMandarinSimplified]: {
                    mode: 'auto',
                    text: `（终点站，）${currentName[0]}，到了。开${doorDirection}边门。`,
                    variants: { name: currentName[0], doorDirection },
                },
                [VoiceName.ChineseWuSimplifiedYunzhe]: {
                    mode: 'auto',
                    text: `We are now arriving at, (the terminal station, )${currentName[0]}. Please get ready to the exit from the ${doorDirection} side. Thanks for taking ${railwayName[0]}, see you next time`,
                    variants: { name: currentName[1], doorDirection },
                },
            };
        }

        const nextID = stnList[currentStnID].children[0];
        // has dep stage if current station is not the terminal
        if (nextID !== 'lineend') {
            const nextName: Name = stnList[nextID].name;

            const nextInt: Name[][] = stnList[nextID].transfer.groups.map(
                (g: { name: Name; lines: { name: Name }[] }) => g.lines?.map(l => l.name)
            );

            proj.stations[currentName[0]][Stage.Departure] = {
                [VoiceName.ChineseWuSimplifiedXiaotong]: {
                    mode: 'auto',
                    text: `欢迎搭乘${railwayName[0]}${lineName[0]}。本趟列车额终点站是，${terminalName[0]}。下一站，${
                        nextName[0]
                    }，开${doorDirection}边门。好调 ${nextInt?.at(
                        0
                    )}，拿着交通卡的乘客，好勒出站后30分钟内，伐要钞票调 ${nextInt?.at(1)}，好出去调 ${nextInt?.at(
                        2
                    )}。看清桑要调车子额首末班车辰光。`,
                    variants: {
                        next: nextName[0],
                        nextDoorDirection,
                        int: nextInt?.map(i => i?.map(_ => _[0])),
                        noteLastTrain: true,
                    },
                },
                [VoiceName.ChineseMandarinSimplified]: {
                    mode: 'auto',
                    text: `欢迎乘坐${railwayName[0]}${lineName[0]}。本次列车终点站，${terminalName[0]}。下一站，${
                        nextName[0]
                    }，开${doorDirection}边门。可换乘 ${nextInt?.at(
                        0
                    )}，手持交通卡的乘客，可在出站后30分钟内，免费换乘 ${nextInt?.at(1)}，可转乘 ${nextInt?.at(
                        1
                    )}。请注意换乘列车的首末班车时间。`,
                    variants: {
                        next: nextName[0],
                        nextDoorDirection,
                        int: nextInt?.map(i => i?.map(_ => _[0])),
                        noteLastTrain: true,
                    },
                },
                [VoiceName.ChineseWuSimplifiedYunzhe]: {
                    mode: 'auto',
                    text: `Welcome aboard ${railwayName[1]} ${lineName[1]}. The terminal is ${
                        terminalName[0]
                    }. Next station is (the terminal station )${
                        nextName[1]
                    }. Doors will open on the ${doorDirection}. Your can transfer to ${nextInt?.at(
                        0
                    )}, Passengers holding public transportation card, may transfer to ${nextInt?.at(
                        1
                    )} within 30 minutes after getting out of the station. or take the ${nextInt?.at(2)}`,
                    variants: {
                        next: nextName[1],
                        nextDoorDirection: 'left',
                        int: nextInt?.map(i => i?.map(_ => _[1])),
                    },
                },
            };
        }

        currentStnID = nextID;
    }

    return proj;
};
