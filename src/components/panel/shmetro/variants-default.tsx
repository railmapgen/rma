import { Card, CardBody, CardHeader, Radio, RadioGroup, Switch, SystemStyleObject, Text } from '@chakra-ui/react';
import { RmgDebouncedInput, RmgLabel, RmgOutput } from '@railmapgen/rmg-components';
import { useTranslation } from 'react-i18next';
import { Serializable, Stage, VoiceName } from '../../../constants/constants';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { setBaseVariant } from '../../../redux/param/param-slice';

const cardStyle: SystemStyleObject = { width: '400px' };

export default function VariantsDefault() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const { project } = useRootSelector(state => state.param);

    const variantsZHDep = project.baseVariants[Stage.Departure]?.[VoiceName.ChineseMandarinSimplified] ?? {};
    const variantsZHArr = project.baseVariants[Stage.Arrival]?.[VoiceName.ChineseMandarinSimplified] ?? {};
    const variantsZHMid = project.baseVariants[Stage.Midway]?.[VoiceName.ChineseMandarinSimplified] ?? {};
    const variantsENDep = project.baseVariants[Stage.Departure]?.[VoiceName.ChineseWuSimplifiedYunzhe] ?? {};
    const variantsENArr = project.baseVariants[Stage.Arrival]?.[VoiceName.ChineseWuSimplifiedYunzhe] ?? {};

    const handleVariantChange = (stage: Stage, voiceName: VoiceName, variant: string, value: Serializable) => {
        const val = value === '' ? undefined : value;
        dispatch(setBaseVariant({ stage, voiceName, variant, value: val }));
    };

    // welcomeAbroad: railwayName?.at(0),

    const welcomeAbroad = (variantsZHDep.welcomeAbroad as string | undefined) ?? '';
    const welcomeAbroadPinyin = (variantsZHDep.welcomeAbroadPinyin as string | undefined) ?? '';
    const terminal = (variantsZHDep.terminal as string | undefined) ?? 'Terminal';
    const terminalPinyin = (variantsZHDep.terminalPinyin as string | undefined) ?? 'TerminalPinyin';
    const nextDoorDirection = (variantsZHDep.nextDoorDirection as 'left' | 'right' | undefined) ?? 'left';
    const lineName = (variantsZHDep.lineName as string[] | undefined) ?? [];
    const lineNamePinyin = (variantsZHDep.lineNamePinyin as string[] | undefined) ?? [];
    const noteLastTrain = (variantsZHDep.noteLastTrain as boolean | undefined) ?? false;
    const loop = (variantsZHDep.loop as 'inner' | 'outer' | 'none') ?? false;
    const loopTerminal = (variantsZHDep.loopTerminal as boolean | undefined) ?? false;
    const service = (variantsZHDep.service as string | undefined) ?? '';

    const doorDirection = (variantsZHArr.doorDirection as 'left' | 'right' | undefined) ?? 'left';
    const thanksForTaking = variantsZHArr.thanksForTaking as string | undefined;
    const thanksForTakingPinyin = variantsZHArr.thanksForTakingPinyin as string | undefined;

    const caution = (variantsZHMid.caution as boolean | undefined) ?? false;

    const welcomeAbroadEN = (variantsENDep.welcomeAbroad as string | undefined) ?? '';
    const welcomeAbroadPinyinEN = (variantsENDep.welcomeAbroadPinyin as string | undefined) ?? '';
    const terminalEN = (variantsENDep.terminal as string | undefined) ?? 'TerminalEN';
    const terminalPinyinEN = (variantsENDep.terminalPinyin as string | undefined) ?? 'TerminalPinyinEN';
    const nextDoorDirectionEN = (variantsENDep.nextDoorDirection as 'left' | 'right' | undefined) ?? 'left';
    const lineNameEN = (variantsENDep.lineName as string[] | undefined) ?? [];
    const lineNamePinyinEN = (variantsENDep.lineNamePinyin as string[] | undefined) ?? [];

    const doorDirectionEN = (variantsENArr.doorDirection as 'left' | 'right' | undefined) ?? 'left';
    const thanksForTakingEN = variantsENArr.thanksForTaking as string | undefined;
    const thanksForTakingPinyinEN = variantsENArr.thanksForTakingPinyin as string | undefined;

    return (
        <>
            <Card sx={{ ...cardStyle, height: '450px' }} variant="outline">
                <CardHeader width="100%" display="flex">
                    <Text as="b" flex="1">
                        出发
                    </Text>
                </CardHeader>
                <CardBody>
                    <RmgLabel label="欢迎乘坐">
                        <RmgDebouncedInput
                            defaultValue={welcomeAbroad}
                            onDebouncedChange={val =>
                                handleVariantChange(
                                    Stage.Arrival,
                                    VoiceName.ChineseMandarinSimplified,
                                    'welcomeAbroad',
                                    val
                                )
                            }
                        />
                    </RmgLabel>
                    <RmgLabel label="欢迎乘坐拼音">
                        <RmgDebouncedInput
                            defaultValue={welcomeAbroadPinyin}
                            onDebouncedChange={val =>
                                handleVariantChange(
                                    Stage.Arrival,
                                    VoiceName.ChineseMandarinSimplified,
                                    'welcomeAbroadPinyin',
                                    val
                                )
                            }
                        />
                    </RmgLabel>
                    <RmgLabel label="终点站名">
                        <RmgOutput>{terminal}</RmgOutput>
                    </RmgLabel>
                    <RmgLabel label="终点站名拼音">
                        <RmgDebouncedInput
                            defaultValue={terminalPinyin}
                            onDebouncedChange={val =>
                                handleVariantChange(
                                    Stage.Arrival,
                                    VoiceName.ChineseMandarinSimplified,
                                    'terminalPinyin',
                                    val
                                )
                            }
                        />
                    </RmgLabel>
                    <RmgLabel label="下一站开门方向" oneLine>
                        <RadioGroup
                            value={nextDoorDirection}
                            onChange={val =>
                                handleVariantChange(
                                    Stage.Departure,
                                    VoiceName.ChineseMandarinSimplified,
                                    'nextDoorDirection',
                                    val
                                )
                            }
                        >
                            <Radio value="left">左</Radio>
                            <Radio value="right">右</Radio>
                        </RadioGroup>
                    </RmgLabel>
                    <RmgLabel label="线路名">
                        <RmgOutput>{lineName}</RmgOutput>
                    </RmgLabel>
                    <RmgLabel label="线路名拼音">
                        <RmgDebouncedInput
                            defaultValue={lineNamePinyin}
                            onDebouncedChange={val =>
                                handleVariantChange(
                                    Stage.Arrival,
                                    VoiceName.ChineseMandarinSimplified,
                                    'lineNamePinyin',
                                    val
                                )
                            }
                        />
                    </RmgLabel>
                    <RmgLabel label="列车种别">
                        <RmgOutput>{service}</RmgOutput>
                    </RmgLabel>
                    <RmgLabel label="注意换乘列车末班车时间" oneLine>
                        <Switch
                            isChecked={noteLastTrain}
                            onChange={({ target: { checked } }) =>
                                handleVariantChange(
                                    Stage.Departure,
                                    VoiceName.ChineseMandarinSimplified,
                                    'noteLastTrain',
                                    checked
                                )
                            }
                        />
                    </RmgLabel>
                    {loop !== 'none' && (
                        <>
                            <RmgLabel label="环线内外圈">
                                <RadioGroup
                                    value={loop}
                                    onChange={val =>
                                        handleVariantChange(
                                            Stage.Departure,
                                            VoiceName.ChineseMandarinSimplified,
                                            'loop',
                                            val
                                        )
                                    }
                                >
                                    <Radio value="inner">内圈</Radio>
                                    <Radio value="outer">外圈</Radio>
                                </RadioGroup>
                            </RmgLabel>
                            <RmgLabel label="环线终点站" oneLine>
                                <Switch
                                    isChecked={loopTerminal}
                                    onChange={({ target: { checked } }) =>
                                        handleVariantChange(
                                            Stage.Departure,
                                            VoiceName.ChineseMandarinSimplified,
                                            'loopTerminal',
                                            checked
                                        )
                                    }
                                />
                            </RmgLabel>
                        </>
                    )}
                </CardBody>
            </Card>
            <Card sx={{ ...cardStyle, height: '250px' }} variant="outline">
                <CardHeader width="100%" display="flex">
                    <Text as="b" flex="1">
                        到达
                    </Text>
                </CardHeader>
                <CardBody>
                    <RmgLabel label="开门方向" oneLine>
                        <RadioGroup
                            value={doorDirection}
                            onChange={val =>
                                handleVariantChange(
                                    Stage.Arrival,
                                    VoiceName.ChineseMandarinSimplified,
                                    'doorDirection',
                                    val
                                )
                            }
                        >
                            <Radio value="left">左</Radio>
                            <Radio value="right">右</Radio>
                        </RadioGroup>
                    </RmgLabel>
                    <RmgLabel label="感谢乘坐">
                        <RmgDebouncedInput
                            defaultValue={thanksForTaking}
                            onDebouncedChange={val =>
                                handleVariantChange(
                                    Stage.Arrival,
                                    VoiceName.ChineseMandarinSimplified,
                                    'thanksForTaking',
                                    val
                                )
                            }
                        />
                    </RmgLabel>
                    <RmgLabel label="感谢乘坐拼音">
                        <RmgDebouncedInput
                            defaultValue={thanksForTakingPinyin}
                            onDebouncedChange={val =>
                                handleVariantChange(
                                    Stage.Arrival,
                                    VoiceName.ChineseMandarinSimplified,
                                    'thanksForTakingPinyin',
                                    val
                                )
                            }
                        />
                    </RmgLabel>
                </CardBody>
            </Card>
            <Card sx={{ ...cardStyle, height: '150px' }} variant="outline">
                <CardHeader width="100%" display="flex">
                    <Text as="b" flex="1">
                        中途
                    </Text>
                </CardHeader>
                <CardBody>
                    <RmgLabel label="注意安全" oneLine>
                        <Switch
                            isChecked={caution}
                            onChange={({ target: { checked } }) =>
                                handleVariantChange(
                                    Stage.Midway,
                                    VoiceName.ChineseMandarinSimplified,
                                    'caution',
                                    checked
                                )
                            }
                        />
                    </RmgLabel>
                </CardBody>
            </Card>
            <Card sx={{ ...cardStyle, height: '450px' }} variant="outline">
                <CardHeader width="100%" display="flex">
                    <Text as="b" flex="1">
                        Departure
                    </Text>
                </CardHeader>
                <CardBody>
                    <RmgLabel label="Welcome abroad">
                        <RmgDebouncedInput
                            defaultValue={welcomeAbroadEN}
                            onDebouncedChange={val =>
                                handleVariantChange(
                                    Stage.Departure,
                                    VoiceName.ChineseWuSimplifiedYunzhe,
                                    'welcomeAbroad',
                                    val
                                )
                            }
                        />
                    </RmgLabel>
                    <RmgLabel label="Welcome abroad Pinyin">
                        <RmgDebouncedInput
                            defaultValue={welcomeAbroadPinyinEN}
                            onDebouncedChange={val =>
                                handleVariantChange(
                                    Stage.Departure,
                                    VoiceName.ChineseWuSimplifiedYunzhe,
                                    'welcomeAbroadPinyin',
                                    val
                                )
                            }
                        />
                    </RmgLabel>
                    <RmgLabel label="Terminal name">
                        <RmgOutput>{terminalEN}</RmgOutput>
                    </RmgLabel>
                    <RmgLabel label="Terminal name Pinyin">
                        <RmgDebouncedInput
                            defaultValue={terminalPinyinEN}
                            onDebouncedChange={val =>
                                handleVariantChange(
                                    Stage.Departure,
                                    VoiceName.ChineseWuSimplifiedYunzhe,
                                    'terminalPinyin',
                                    val
                                )
                            }
                        />
                    </RmgLabel>
                    <RmgLabel label="Next door direction" oneLine>
                        <RadioGroup
                            value={nextDoorDirectionEN}
                            onChange={val =>
                                handleVariantChange(
                                    Stage.Departure,
                                    VoiceName.ChineseWuSimplifiedYunzhe,
                                    'nextDoorDirection',
                                    val
                                )
                            }
                        >
                            <Radio value="left">左</Radio>
                            <Radio value="right">右</Radio>
                        </RadioGroup>
                    </RmgLabel>
                    <RmgLabel label="Line name">
                        <RmgOutput>{lineNameEN}</RmgOutput>
                    </RmgLabel>
                    <RmgLabel label="Line name Pinyin">
                        <RmgDebouncedInput
                            defaultValue={lineNamePinyinEN}
                            onDebouncedChange={val =>
                                handleVariantChange(
                                    Stage.Departure,
                                    VoiceName.ChineseWuSimplifiedYunzhe,
                                    'lineNamePinyin',
                                    val
                                )
                            }
                        />
                    </RmgLabel>
                </CardBody>
            </Card>
            <Card sx={{ ...cardStyle, height: '250px' }} variant="outline">
                <CardHeader width="100%" display="flex">
                    <Text as="b" flex="1">
                        Arrival
                    </Text>
                </CardHeader>
                <CardBody>
                    <RmgLabel label="Door direction" oneLine>
                        <RadioGroup
                            value={doorDirectionEN}
                            onChange={val =>
                                handleVariantChange(
                                    Stage.Arrival,
                                    VoiceName.ChineseWuSimplifiedYunzhe,
                                    'doorDirection',
                                    val
                                )
                            }
                        >
                            <Radio value="left">左</Radio>
                            <Radio value="right">右</Radio>
                        </RadioGroup>
                    </RmgLabel>
                    <RmgLabel label="Thanks for taking">
                        <RmgDebouncedInput
                            defaultValue={thanksForTakingEN}
                            onDebouncedChange={val =>
                                handleVariantChange(
                                    Stage.Arrival,
                                    VoiceName.ChineseWuSimplifiedYunzhe,
                                    'thanksForTaking',
                                    val
                                )
                            }
                        />
                    </RmgLabel>
                    <RmgLabel label="Thanks for taking Pinyin">
                        <RmgDebouncedInput
                            defaultValue={thanksForTakingPinyinEN}
                            onDebouncedChange={val =>
                                handleVariantChange(
                                    Stage.Arrival,
                                    VoiceName.ChineseWuSimplifiedYunzhe,
                                    'thanksForTakingPinyin',
                                    val
                                )
                            }
                        />
                    </RmgLabel>
                </CardBody>
            </Card>
        </>
    );
}
