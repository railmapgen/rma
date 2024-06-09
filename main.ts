import { readFile, writeFile } from 'fs/promises';
import { makeProject } from './make-project.js';
import { PredefinedPhraseType } from './predefined-phrases.js';
import { reconcile } from './reconcile.js';
import { resolve } from './resolve.js';
import { Project, reconciledPhrasesToString, Stage, StyleType, VoiceName } from './types.js';

const testStyle: Project = {
    style: StyleType.ShanghaiMetro,
    baseVariants: {
        [Stage.Arrival]: {
            [VoiceName.ChineseMandarinSimplified]: {
                terminal: '莘庄',
                doorDirection: 'left',
            },
        },
        [Stage.Departure]: {
            [VoiceName.ChineseMandarinSimplified]: {
                terminal: '莘庄',
                nextDoorDirection: 'left',
                lineName: '1号线',
            },
        },
    },
    stations: {
        xinzhuang: {
            [Stage.Arrival]: {
                [VoiceName.ChineseMandarinSimplified]: {
                    mode: 'auto',
                    text: '终点站，莘庄，到了。请全体乘客在屏蔽门完全打开后，从右边车门下车。',
                    variants: { name: '莘庄', doorDirection: 'right' },
                },
            },
        },
        southShaanXiRoad: {
            [Stage.Arrival]: {
                [VoiceName.ChineseMandarinSimplified]: {
                    mode: 'auto',
                    text: '陕西南路，到了。开左边门。',
                    variants: { name: '陕西南路', doorDirection: 'left' },
                },
            },
            [Stage.Departure]: {
                [VoiceName.ChineseMandarinSimplified]: {
                    mode: 'auto',
                    text: '欢迎乘坐轨道交通1号线。本次列车终点站，莘庄。下一站，常熟路，开左边门。可换乘 7号线。请注意换乘列车的首末班车时间。',
                    variants: {
                        welcomeAbroad: '轨道交通',
                        next: '常熟路',
                        nextDoorDirection: 'left',
                        int: [['7号线']],
                        noteLastTrain: true,
                    },
                },
            },
            [Stage.Midway]: {
                [VoiceName.ChineseMandarinSimplified]: {
                    mode: 'auto',
                    text: '请把爱心专座留给有需要的乘客。',
                    variants: { leaveLoveSeat: true },
                },
            },
        },
    },
};

const shijiaoxianStyle: Project = {
    style: StyleType.ShanghaiMetro,
    baseVariants: {
        [Stage.Arrival]: {
            [VoiceName.ChineseMandarinSimplified]: {
                terminal: '文溪大学',
                doorDirection: 'left',
                thanksForTaking: '文溪市域铁路',
            },
            [VoiceName.ChineseWuSimplifiedXiaotong]: {
                terminal: '文溪大学',
                doorDirection: 'left',
                thanksForTaking: '文溪市域铁路',
            },
            [VoiceName.ChineseWuSimplifiedYunzhe]: {
                terminal: '文溪 University',
                doorDirection: 'left',
                thanksForTaking: '文溪 Intercity Railway',
            },
        },
        [Stage.Departure]: {
            [VoiceName.ChineseMandarinSimplified]: {
                welcomeAbroad: '文溪市域铁路',
                terminal: '文溪大学',
                nextDoorDirection: 'left',
                lineName: '市郊线',
            },
            [VoiceName.ChineseWuSimplifiedXiaotong]: {
                welcomeAbroad: '文溪市域铁路',
                terminal: '文溪大学',
                nextDoorDirection: 'left',
                lineName: '市郊线',
            },
            [VoiceName.ChineseWuSimplifiedYunzhe]: {
                welcomeAbroad: '文溪 Intercity Railway',
                terminal: '文溪 University',
                nextDoorDirection: 'left',
                lineName: '市郊 Line',
            },
        },
    },
    stations: {
        wenxiUniv: {
            [Stage.Arrival]: {
                [VoiceName.ChineseMandarinSimplified]: {
                    mode: 'auto',
                    text: '终点站，文溪大学，到了。请全体乘客在屏蔽门完全打开后，从左边车门下车。感谢您乘坐文溪市域铁路，祝您旅途愉快。',
                    variants: {
                        name: '文溪大学',
                        doorDirection: 'left',
                    },
                },
                [VoiceName.ChineseWuSimplifiedXiaotong]: {
                    mode: 'auto',
                    text: '终点站，文溪大学，到了。请所有乘客勒屏蔽门完全打开后，从左边车门下车。谢谢侬搭乘文溪市域铁路，阿拉下趟再会。',
                    variants: {
                        name: '文溪大学',
                        doorDirection: 'left',
                    },
                },
                [VoiceName.ChineseWuSimplifiedYunzhe]: {
                    mode: 'auto',
                    text: '终点站，文溪大学，到了。请所有乘客勒屏蔽门完全打开后，从左边车门下车。谢谢侬搭乘文溪市域铁路，阿拉下趟再会。',
                    variants: {
                        name: '文溪 University',
                        doorDirection: 'left',
                    },
                },
            },
        },
        sanying: {
            [Stage.Departure]: {
                [VoiceName.ChineseMandarinSimplified]: {
                    mode: 'auto',
                    text: '欢迎乘坐文溪市域铁路市郊线。本次列车终点站，文溪大学。下一站，白玉兰路，开左边门。',
                    variants: {
                        next: '白玉兰路',
                        nextDoorDirection: 'left',
                    },
                },
                [VoiceName.ChineseWuSimplifiedXiaotong]: {
                    mode: 'auto',
                    text: '欢迎搭乘文溪市域铁路市郊线。本趟列车额终点站是，文溪大学。下一站，白玉兰路，开左边门。',
                    variants: {
                        next: '白玉兰路',
                        nextDoorDirection: 'left',
                    },
                },
                [VoiceName.ChineseWuSimplifiedYunzhe]: {
                    mode: 'auto',
                    text: '欢迎搭乘文溪市域铁路市郊线。本趟列车额终点站是，文溪大学。下一站，白玉兰路，开左边门。',
                    variants: {
                        next: '白玉兰 Road',
                        nextDoorDirection: 'left',
                    },
                },
            },
        },
    },
};

const saveName = process.argv.at(2);
if (!saveName || saveName === '') throw new Error('No save name specified!');
const rmg = await readFile(`${saveName}.json`, { encoding: 'utf8' });

const proj = makeProject(JSON.parse(rmg));

// const proj = JSON.parse(await readFile('project.json', { encoding: 'utf8' }));
const reconciledPhrases = reconcile(proj);
await writeFile('project.json', JSON.stringify(proj, null, 2));
// await writeFile('reconciledPhrases.json', JSON.stringify(reconciledPhrases, null, 2));
// console.log(JSON.stringify(reconciledPhrasesToString(reconciledPhrases), null, 2));

await resolve(reconciledPhrases);
