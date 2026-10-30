import { Box, Radio, RadioGroup, Switch } from '@chakra-ui/react';
import { RmgDebouncedInput, RmgLabel, RmgOutput } from '@railmapgen/rmg-components';
import { useTranslation } from 'react-i18next';
import { Serializable, Stage, VoiceName } from '../../../constants/constants';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { setVariant } from '../../../redux/param/param-slice';

export default function VariantsENDeparture() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const { project } = useRootSelector(state => state.param);
    const { currentStationID } = useRootSelector(state => state.runtime);

    const currentStage = Stage.Departure;
    const currentVoice = VoiceName.ChineseWuSimplifiedYunzhe;
    const variants = project.stations[currentStationID]?.[currentStage]?.[currentVoice] ?? {};

    const baseVariants = project.baseVariants[currentStage]?.[currentVoice] ?? {};
    const currentVariants = { ...baseVariants, ...variants };

    const handleVariantChange = (variant: string, value: Serializable) => {
        dispatch(
            setVariant({
                stnID: currentStationID,
                stage: currentStage,
                voiceName: currentVoice,
                variant,
                value,
            })
        );
    };

    const next = (currentVariants.next as string | undefined) ?? 'Next';
    const nextPinyin = (currentVariants.nextPinyin as string | undefined) ?? 'Next';
    const nextDoorDirection = (currentVariants.nextDoorDirection as 'left' | 'right' | undefined) ?? 'left';
    const int = (currentVariants.int as string[] | undefined) ?? [];
    const branchTerminalName = (currentVariants.branchTerminalName as string | undefined) ?? '';
    const branchTerminalNamePinyin = (currentVariants.branchTerminalNamePinyin as string | undefined) ?? '';
    const noteLastTrain = (currentVariants.noteLastTrain as boolean | undefined) ?? false;

    return (
        <Box>
            <RmgLabel label={t('editor.nextName')}>
                <RmgOutput>{next}</RmgOutput>
            </RmgLabel>
            <RmgLabel label={t('editor.nextNamePinyin')}>
                <RmgDebouncedInput
                    defaultValue={nextPinyin}
                    onDebouncedChange={val => handleVariantChange('nextPinyin', val)}
                />
            </RmgLabel>
            <RmgLabel label={t('editor.nextDoor')} oneLine>
                <RadioGroup value={nextDoorDirection} onChange={val => handleVariantChange('nextDoorDirection', val)}>
                    <Radio value="left">{t('editor.left')}</Radio>
                    <Radio value="right">{t('editor.right')}</Radio>
                </RadioGroup>
            </RmgLabel>
            <RmgLabel label={t('editor.interchange')}>
                <RmgOutput>{int.join(' ')}</RmgOutput>
            </RmgLabel>
            {currentVariants.branchTerminalName && currentVariants.branchTerminalNamePinyin && (
                <>
                    <RmgLabel label={t('editor.branchTerminal')}>
                        <RmgOutput>{branchTerminalName}</RmgOutput>
                    </RmgLabel>
                    {/* <RmgLabel label="支线终点站名拼音">
                        <RmgDebouncedInput
                            defaultValue={branchTerminalNamePinyin}
                            onDebouncedChange={val => handleVariantChange('branchTerminalNamePinyin', val)}
                        />
                    </RmgLabel> */}
                </>
            )}
            <RmgLabel label={t('editor.lastTrain')} oneLine>
                <Switch
                    isChecked={noteLastTrain}
                    onChange={({ target: { checked } }) => handleVariantChange('noteLastTrain', checked)}
                />
            </RmgLabel>
        </Box>
    );
}
