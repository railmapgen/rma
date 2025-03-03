import { Box, Radio, RadioGroup, Switch } from '@chakra-ui/react';
import { RmgDebouncedInput, RmgLabel, RmgOutput } from '@railmapgen/rmg-components';
import { useTranslation } from 'react-i18next';
import { Serializable, Stage, VoiceName } from '../../../constants/constants';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { setVariant } from '../../../redux/param/param-slice';

export default function VariantsZHDeparture() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const { project } = useRootSelector(state => state.param);
    const { currentStationID } = useRootSelector(state => state.runtime);

    const currentStage = Stage.Departure;
    const currentVoice = VoiceName.ChineseMandarinSimplified;
    const variants = project.stations[currentStationID]?.[currentStage]?.[currentVoice] ?? {};

    const baseVariants = project.baseVariants[currentStage]?.[VoiceName.ChineseMandarinSimplified] ?? {};
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
    // const nextPinyin = (currentVariants.nextPinyin as string | undefined) ?? 'Next';
    const nextDoorDirection = (currentVariants.nextDoorDirection as 'left' | 'right' | undefined) ?? 'left';
    const int = (variants.int as string[] | undefined) ?? [];
    const branchTerminalName = (currentVariants.branchTerminalName as string | undefined) ?? '';
    const branchTerminalNamePinyin = (currentVariants.branchTerminalNamePinyin as string | undefined) ?? '';
    const service = (currentVariants.service as string | undefined) ?? '';
    const stopovers = (variants.stopovers as string[] | undefined) ?? [];
    const noteLastTrain = (currentVariants.noteLastTrain as boolean | undefined) ?? false;

    return (
        <Box>
            <RmgLabel label="下一站名">
                <RmgOutput>{next}</RmgOutput>
            </RmgLabel>
            {/* <RmgLabel label="下一站名拼音">
                <RmgDebouncedInput
                    defaultValue={nextPinyin}
                    onDebouncedChange={val => handleVariantChange('nextPinyin', val)}
                />
            </RmgLabel> */}
            <RmgLabel label="下一站开门方向" oneLine>
                <RadioGroup value={nextDoorDirection} onChange={val => handleVariantChange('nextDoorDirection', val)}>
                    <Radio value="left">左</Radio>
                    <Radio value="right">右</Radio>
                </RadioGroup>
            </RmgLabel>
            <RmgLabel label="换乘信息">
                <RmgOutput>{int.join(' ')}</RmgOutput>
            </RmgLabel>
            {currentVariants.branchTerminalName && currentVariants.branchTerminalNamePinyin && (
                <>
                    <RmgLabel label="支线终点站名">
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
            {service !== 'local' && (
                <RmgLabel label="停靠站信息">
                    <RmgOutput>{stopovers.join(' ')}</RmgOutput>
                </RmgLabel>
            )}
            <RmgLabel label="注意换乘列车末班车时间" oneLine>
                <Switch
                    isChecked={noteLastTrain}
                    onChange={({ target: { checked } }) => handleVariantChange('noteLastTrain', checked)}
                />
            </RmgLabel>
        </Box>
    );
}
