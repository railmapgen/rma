import { LanguageCode, Translation } from '@railmapgen/rmg-translate';
import { emptyProject, Stage, VoiceName } from '../constants/constants';
import { Direction, Name, RMGParam, Services, ShortDirection } from '../constants/rmg';
import { getRoutes } from './graph-theory';

const makeBaseVariants = (
    terminal: Translation, // arrival & departure
    lineName: Name, // departure
    doorDirection: 'left' | 'right' = 'left', // arrival
    nextDoorDirection: 'left' | 'right' = 'left', // departure
    railwayName?: Name, // arrival & departure, used in welcomeAbroad & thanksForTaking
    noteLastTrain: boolean = true, // departure
    caution: boolean = false, // midway
    loop: 'none' | 'inner' | 'outer' = 'none', // departure
    loopTerminal: boolean = false, // departure
    service: Services = Services.local // departure
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
            terminalPinyin: terminal['en'],
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
            service,
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
            service,
        },
        [VoiceName.ChineseWuSimplifiedYunzhe]: {
            welcomeAbroad: railwayName?.at(1),
            welcomeAbroadPinyin: railwayName?.at(0),
            terminal: terminal['en'],
            terminalPinyin: terminal['en'],
            nextDoorDirection,
            lineName: lineName[1],
            lineNamePinyin: lineName[1],
            service,
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

export const makeProject = (rmg: RMGParam, preferRouteIndex: number, preferService: Services = Services.local) => {
    const proj = structuredClone(emptyProject);

    const { line_name: lineName, stn_list: stnList, loop, direction } = rmg;
    const doorDirection = 'left';
    const nextDoorDirection = 'left';
    const railwayName: [string, string] = ['轨道交通', 'Rail Transit'];

    // TODO: get service before route and then filter route
    // get route
    const routes = getRoutes(stnList).map(route => route.slice(1, -1));
    if (direction === ShortDirection.left) {
        routes.forEach(route => route.reverse());
    }
    let rawRoute = routes.at(preferRouteIndex) ?? routes.at(-1)!;
    if (preferService !== Services.local) {
        rawRoute = rawRoute.filter(stnID => stnList[stnID].services.includes(preferService));
    }
    const route = rawRoute;

    // all services
    const allServices = new Set(route.map(stnID => stnList[stnID].services).flat());

    // get terminal
    const terminalID = route.at(-1)!;
    // get possible branch terminal
    const branchTerminalID = routes.map(route => route[route.length - 1]).find(id => id !== terminalID);

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
        false, // loopTerminal
        allServices.has(preferService) ? preferService : Services.local
    );

    // make variants for each station
    for (const [i, currentStnID] of route.entries()) {
        const { localisedName: currentName } = stnList[currentStnID];
        replaceLineBreak(currentName);
        proj.metadata[currentStnID] = { name: Object.values(currentName).at(0) ?? '' };
        proj.stations[currentStnID] = {};

        proj.stations[currentStnID][Stage.Midway] = {
            [VoiceName.ChineseWuSimplifiedXiaotong]: {},
            [VoiceName.ChineseMandarinSimplified]: {},
            [VoiceName.ChineseWuSimplifiedYunzhe]: {},
        };

        // has arr stage if current station is not the start
        if (i !== 0) {
            proj.stations[currentStnID][Stage.Arrival] = {
                [VoiceName.ChineseWuSimplifiedXiaotong]: { name: currentName['zh'], namePinyin: currentName['zh'] },
                [VoiceName.ChineseMandarinSimplified]: { name: currentName['zh'], namePinyin: currentName['zh'] },
                [VoiceName.ChineseWuSimplifiedYunzhe]: { name: currentName['en'], namePinyin: currentName['en'] },
            };
        }

        // has dep stage if current station is not the terminal
        if (i !== route.length - 1 || loop) {
            const nextValidID = loop && i === route.length - 1 ? route[0] : route[i + 1];
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
                    next: nextName['en'],
                    nextPinyin: nextName['en'],
                    int: nextInt?.map(i => i?.map(_ => _[1])),
                    noteLastTrain: false,
                },
            };

            // add branch info
            if (
                branchTerminalID && // has branch
                i + 1 < route.length && // current station is not the terminal
                stnList[route[i + 1]].branch?.[direction === 'l' ? Direction.left : Direction.right] // next station has branch
            ) {
                const { localisedName: branchTerminalName } = stnList[branchTerminalID];
                replaceLineBreak(branchTerminalName);
                proj.stations[currentStnID][Stage.Departure]![VoiceName.ChineseWuSimplifiedXiaotong] = {
                    ...proj.stations[currentStnID][Stage.Departure]![VoiceName.ChineseWuSimplifiedXiaotong],
                    branchTerminalName: branchTerminalName['zh'],
                    branchTerminalNamePinyin: branchTerminalName['zh'],
                };
                proj.stations[currentStnID][Stage.Departure]![VoiceName.ChineseMandarinSimplified] = {
                    ...proj.stations[currentStnID][Stage.Departure]![VoiceName.ChineseMandarinSimplified],
                    branchTerminalName: branchTerminalName['zh'],
                    branchTerminalNamePinyin: branchTerminalName['zh'],
                };
                proj.stations[currentStnID][Stage.Departure]![VoiceName.ChineseWuSimplifiedYunzhe] = {
                    ...proj.stations[currentStnID][Stage.Departure]![VoiceName.ChineseWuSimplifiedYunzhe],
                    branchTerminalName: branchTerminalName['en'],
                    branchTerminalNamePinyin: branchTerminalName['en'],
                };
            }

            // add service info
            if (preferService !== Services.local) {
                const stopovers = route.slice(i + 1, -1);
                const stopoverNames = stopovers.map(id => {
                    const { localisedName: name } = stnList[id];
                    replaceLineBreak(name);
                    return name;
                });
                proj.stations[currentStnID][Stage.Departure]![VoiceName.ChineseWuSimplifiedXiaotong] = {
                    ...proj.stations[currentStnID][Stage.Departure]![VoiceName.ChineseWuSimplifiedXiaotong],
                    stopovers: stopoverNames.map(n => n['zh']),
                };
                proj.stations[currentStnID][Stage.Departure]![VoiceName.ChineseMandarinSimplified] = {
                    ...proj.stations[currentStnID][Stage.Departure]![VoiceName.ChineseMandarinSimplified],
                    stopovers: stopoverNames.map(n => n['zh']),
                };
                proj.stations[currentStnID][Stage.Departure]![VoiceName.ChineseWuSimplifiedYunzhe] = {
                    ...proj.stations[currentStnID][Stage.Departure]![VoiceName.ChineseWuSimplifiedYunzhe],
                    stopovers: stopoverNames.map(n => n['en']),
                };
            }
        }
    }

    // Add departure stage for terminal station when loop
    if (loop) {
        const firstID = route[0];
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
