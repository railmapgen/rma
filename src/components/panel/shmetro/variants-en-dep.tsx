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

    const next = (variants.next as string | undefined) ?? 'Next';
    const nextPinyin = (variants.nextPinyin as string | undefined) ?? 'Next';
    const nextDoorDirection = (variants.nextDoorDirection as 'left' | 'right' | undefined) ?? 'left';
    const noteLastTrain = (variants.noteLastTrain as boolean | undefined) ?? false;

    return (
        <Box>
            <RmgLabel label="Next station name">
                <RmgOutput>{next}</RmgOutput>
            </RmgLabel>
            <RmgLabel label="Next station name pinyin">
                <RmgDebouncedInput
                    defaultValue={nextPinyin}
                    value={nextPinyin}
                    onDebouncedChange={val => handleVariantChange('nextPinyin', val)}
                />
            </RmgLabel>
            <RmgLabel label="Next door direction" oneLine>
                <RadioGroup value={nextDoorDirection} onChange={val => handleVariantChange('nextDoorDirection', val)}>
                    <Radio value="left">Left</Radio>
                    <Radio value="right">Right</Radio>
                </RadioGroup>
            </RmgLabel>
            <RmgLabel label="Note last train" oneLine>
                <Switch
                    isChecked={noteLastTrain}
                    onChange={({ target: { checked } }) => handleVariantChange('noteLastTrain', checked)}
                />
            </RmgLabel>
        </Box>
    );
}
