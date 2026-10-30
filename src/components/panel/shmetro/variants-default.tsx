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
                        {t('editor.departureZH')}
                    </Text>
                </CardHeader>
                <CardBody>
                    <RmgLabel label={t('editor.welcome')}>
                        <RmgDebouncedInput
                            defaultValue={welcomeAbroad}
                            onDebouncedChange={val => {
                                handleVariantChange(
                                    Stage.Departure,
                                    VoiceName.ChineseMandarinSimplified,
                                    'welcomeAbroad',
                                    val
                                );
                                handleVariantChange(
                                    Stage.Departure,
                                    VoiceName.ChineseMandarinSimplified,
                                    'welcomeAbroadPinyin',
                                    val
                                );
                            }}
                        />
                    </RmgLabel>
                    <RmgLabel label={t('editor.terminal')}>
                        <RmgOutput>{terminal}</RmgOutput>
                    </RmgLabel>
                    <RmgLabel label={t('editor.terminalPinyin')}>
                        <RmgDebouncedInput
                            defaultValue={terminalPinyin}
                            onDebouncedChange={val =>
                                handleVariantChange(
                                    Stage.Departure,
                                    VoiceName.ChineseMandarinSimplified,
                                    'terminalPinyin',
                                    val
                                )
                            }
                        />
                    </RmgLabel>
                    <RmgLabel label={t('editor.nextDoor')} oneLine>
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
                            <Radio value="left">{t('editor.left')}</Radio>
                            <Radio value="right">{t('editor.right')}</Radio>
                        </RadioGroup>
                    </RmgLabel>
                    <RmgLabel label={t('editor.line')}>
                        <RmgOutput>{lineName}</RmgOutput>
                    </RmgLabel>
                    <RmgLabel label={t('editor.linePinyin')}>
                        <RmgDebouncedInput
                            defaultValue={lineNamePinyin}
                            onDebouncedChange={val =>
                                handleVariantChange(
                                    Stage.Departure,
                                    VoiceName.ChineseMandarinSimplified,
                                    'lineNamePinyin',
                                    val
                                )
                            }
                        />
                    </RmgLabel>
                    <RmgLabel label={t('editor.service')}>
                        <RmgOutput>{service}</RmgOutput>
                    </RmgLabel>
                    <RmgLabel label={t('editor.lastTrain')} oneLine>
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
                            <RmgLabel label={t('editor.loopDirection')}>
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
                                    <Radio value="inner">{t('editor.inner')}</Radio>
                                    <Radio value="outer">{t('editor.outer')}</Radio>
                                </RadioGroup>
                            </RmgLabel>
                            <RmgLabel label={t('editor.loopTerminal')} oneLine>
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
                        {t('editor.arrivalZH')}
                    </Text>
                </CardHeader>
                <CardBody>
                    <RmgLabel label={t('editor.door')} oneLine>
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
                            <Radio value="left">{t('editor.left')}</Radio>
                            <Radio value="right">{t('editor.right')}</Radio>
                        </RadioGroup>
                    </RmgLabel>
                    <RmgLabel label={t('editor.thanks')}>
                        <RmgDebouncedInput
                            defaultValue={thanksForTaking}
                            onDebouncedChange={val => {
                                handleVariantChange(
                                    Stage.Arrival,
                                    VoiceName.ChineseMandarinSimplified,
                                    'thanksForTaking',
                                    val
                                );
                                handleVariantChange(
                                    Stage.Arrival,
                                    VoiceName.ChineseMandarinSimplified,
                                    'thanksForTakingPinyin',
                                    val
                                );
                            }}
                        />
                    </RmgLabel>
                </CardBody>
            </Card>
            <Card sx={{ ...cardStyle, height: '150px' }} variant="outline">
                <CardHeader width="100%" display="flex">
                    <Text as="b" flex="1">
                        {t('editor.midwayZH')}
                    </Text>
                </CardHeader>
                <CardBody>
                    <RmgLabel label={t('editor.caution')} oneLine>
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
                        {t('editor.departureEN')}
                    </Text>
                </CardHeader>
                <CardBody>
                    <RmgLabel label={t('editor.welcome')}>
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
                    <RmgLabel label={t('editor.welcomePinyin')}>
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
                    <RmgLabel label={t('editor.terminal')}>
                        <RmgOutput>{terminalEN}</RmgOutput>
                    </RmgLabel>
                    <RmgLabel label={t('editor.terminalPinyin')}>
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
                    <RmgLabel label={t('editor.nextDoor')} oneLine>
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
                            <Radio value="left">{t('editor.left')}</Radio>
                            <Radio value="right">{t('editor.right')}</Radio>
                        </RadioGroup>
                    </RmgLabel>
                    <RmgLabel label={t('editor.line')}>
                        <RmgOutput>{lineNameEN}</RmgOutput>
                    </RmgLabel>
                    <RmgLabel label={t('editor.linePinyin')}>
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
                        {t('editor.arrivalEN')}
                    </Text>
                </CardHeader>
                <CardBody>
                    <RmgLabel label={t('editor.door')} oneLine>
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
                            <Radio value="left">{t('editor.left')}</Radio>
                            <Radio value="right">{t('editor.right')}</Radio>
                        </RadioGroup>
                    </RmgLabel>
                    <RmgLabel label={t('editor.thanks')}>
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
                    <RmgLabel label={t('editor.thanksPinyin')}>
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
