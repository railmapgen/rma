import { LanguageCode, Translation } from '@railmapgen/rmg-translate';
import { emptyProject, Stage, VoiceName } from '../constants/constants';
import { Name, RMGParam } from '../constants/rmg';

const makeBaseVariants = (
    terminal: Translation, // arrival & departure
    lineName: Name, // departure
    doorDirection: 'left' | 'right' = 'left', // arrival
    nextDoorDirection: 'left' | 'right' = 'left', // departure
    railwayName?: Name, // arrival & departure, used in welcomeAbroad & thanksForTaking
    noteLastTrain: boolean = true, // departure
    caution: boolean = false, // midway
    loop: 'none' | 'inner' | 'outer' = 'none', // departure
    loopTerminal: boolean = false // departure
) => ({
    [Stage.Arrival]: {
        [VoiceName.ChineseWuSimplifiedXiaotong]: {
            terminal: terminal['zh'],
            terminalPinyin: terminal['zh'],
            doorDirection,
            thanksForTaking: railwayName?.at(0),
            thanksForTakingPinyin: railwayName?.at(0),
        },
        [VoiceName.ChineseMandarinSimplified]: {
            terminal: terminal['zh'],
            terminalPinyin: terminal['zh'],
            doorDirection,
            thanksForTaking: railwayName?.at(0),
            thanksForTakingPinyin: railwayName?.at(0),
        },
        [VoiceName.ChineseWuSimplifiedYunzhe]: {
            terminal: terminal['en'],
            terminalPinyin: terminal['zh'],
            doorDirection,
            thanksForTaking: railwayName?.at(1),
            thanksForTakingPinyin: railwayName?.at(1),
        },
    },
    [Stage.Departure]: {
        [VoiceName.ChineseWuSimplifiedXiaotong]: {
            welcomeAbroad: railwayName?.at(0),
            welcomeAbroadPinyin: railwayName?.at(0),
            terminal: terminal['zh'],
            terminalPinyin: terminal['zh'],
            nextDoorDirection,
            lineName: lineName[0],
            lineNamePinyin: lineName[0],
            noteLastTrain,
            loop,
            loopTerminal,
        },
        [VoiceName.ChineseMandarinSimplified]: {
            welcomeAbroad: railwayName?.at(0),
            welcomeAbroadPinyin: railwayName?.at(0),
            terminal: terminal['zh'],
            terminalPinyin: terminal['zh'],
            nextDoorDirection,
            lineName: lineName[0],
            lineNamePinyin: lineName[0],
            noteLastTrain,
            loop,
            loopTerminal,
        },
        [VoiceName.ChineseWuSimplifiedYunzhe]: {
            welcomeAbroad: railwayName?.at(1),
            welcomeAbroadPinyin: railwayName?.at(0),
            terminal: terminal['en'],
            terminalPinyin: terminal['en'],
            nextDoorDirection,
            lineName: lineName[1],
            lineNamePinyin: lineName[1],
        },
    },
    [Stage.Midway]: {
        [VoiceName.ChineseWuSimplifiedXiaotong]: {
            caution,
        },
        [VoiceName.ChineseMandarinSimplified]: {
            caution,
        },
        [VoiceName.ChineseWuSimplifiedYunzhe]: {},
    },
});

const replaceLineBreak = (localisedName: Partial<Record<LanguageCode, string>>) => {
    for (const lng in localisedName) {
        localisedName[lng as LanguageCode] = localisedName[lng as LanguageCode]!.replaceAll('\\', ' ').replaceAll(
            '\n',
            ' '
        );
    }
    return localisedName;
};

export const makeProject = (rmg: RMGParam) => {
    const proj = structuredClone(emptyProject);

    const { line_name: lineName, stn_list: stnList, loop } = rmg;
    const doorDirection = 'left';
    const nextDoorDirection = 'left';
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

    const { localisedName: terminalName } = stnList[terminalID];
    replaceLineBreak(terminalName);
    proj.baseVariants = makeBaseVariants(
        terminalName,
        lineName,
        doorDirection,
        nextDoorDirection,
        undefined, // railwayName
        undefined, // noteLastTrain
        undefined, // caution
        loop ? 'inner' : 'none',
        false // loopTerminal
    );

    // make variants for each station
    currentStnID = stnList['linestart'].children[0];
    while (currentStnID !== 'lineend') {
        const { localisedName: currentName } = stnList[currentStnID];
        replaceLineBreak(currentName);
        proj.metadata[currentStnID] = { name: Object.values(currentName).at(0) ?? '' };
        proj.stations[currentStnID] = {};

        proj.stations[currentStnID][Stage.Midway] = {
            [VoiceName.ChineseWuSimplifiedXiaotong]: {},
            [VoiceName.ChineseMandarinSimplified]: {},
            [VoiceName.ChineseWuSimplifiedYunzhe]: {},
        };

        const prevID = stnList[currentStnID].parents[0];
        // has arr stage if current station is not the start
        if (prevID !== 'linestart') {
            proj.stations[currentStnID][Stage.Arrival] = {
                [VoiceName.ChineseWuSimplifiedXiaotong]: { name: currentName['zh'], namePinyin: currentName['zh'] },
                [VoiceName.ChineseMandarinSimplified]: { name: currentName['zh'], namePinyin: currentName['zh'] },
                [VoiceName.ChineseWuSimplifiedYunzhe]: { name: currentName['en'], namePinyin: currentName['en'] },
            };
        }

        const nextID = stnList[currentStnID].children[0];
        // has dep stage if current station is not the terminal
        if (nextID !== 'lineend' || loop) {
            const nextValidID = loop && nextID === 'lineend' ? stnList['linestart'].children[0] : nextID;
            const { localisedName: nextName } = stnList[nextValidID];
            replaceLineBreak(nextName);

            const nextInt = stnList[nextValidID].transfer.groups
                .map(g => g.lines?.map(l => l.name))
                .filter(n => n !== undefined);

            proj.stations[currentStnID][Stage.Departure] = {
                [VoiceName.ChineseWuSimplifiedXiaotong]: {
                    next: nextName['zh'],
                    nextPinyin: nextName['zh'],
                    int: nextInt?.map(i => i?.map(_ => _[0])),
                },
                [VoiceName.ChineseMandarinSimplified]: {
                    next: nextName['zh'],
                    nextPinyin: nextName['zh'],
                    int: nextInt?.map(i => i?.map(_ => _[0])),
                },
                [VoiceName.ChineseWuSimplifiedYunzhe]: {
                    welcomeAbroad: false,
                    next: nextName['en'],
                    nextPinyin: nextName['en'],
                    int: nextInt?.map(i => i?.map(_ => _[1])),
                    noteLastTrain: false,
                },
            };
        }

        currentStnID = nextID;
    }

    // Add departure stage for terminal station when loop
    if (loop) {
        const firstID = stnList['linestart'].children[0];
        const { localisedName: currentName } = stnList[firstID];
        replaceLineBreak(currentName);
        proj.stations[firstID][Stage.Arrival] = {
            [VoiceName.ChineseWuSimplifiedXiaotong]: {
                name: currentName['zh'],
                namePinyin: currentName['zh'],
                doorDirection,
            },
            [VoiceName.ChineseMandarinSimplified]: {
                name: currentName['zh'],
                namePinyin: currentName['zh'],
                doorDirection,
            },
            [VoiceName.ChineseWuSimplifiedYunzhe]: {
                name: currentName['en'],
                namePinyin: currentName['en'],
                doorDirection,
            },
        };
    }

    return proj;
};
