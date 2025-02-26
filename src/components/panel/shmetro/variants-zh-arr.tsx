import { Box, Radio, RadioGroup } from '@chakra-ui/react';
import { RmgDebouncedInput, RmgLabel, RmgOutput } from '@railmapgen/rmg-components';
import { useTranslation } from 'react-i18next';
import { Serializable, Stage, VoiceName } from '../../../constants/constants';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { setVariant } from '../../../redux/param/param-slice';

export default function VariantsZHArrival() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const { project } = useRootSelector(state => state.param);
    const { currentStationID } = useRootSelector(state => state.runtime);

    const currentStage = Stage.Arrival;
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

    const name = (currentVariants.name as string | undefined) ?? 'Name';
    // const namePinyin = (currentVariants.namePinyin as string | undefined) ?? 'Name';
    const doorDirection = (currentVariants.doorDirection as 'left' | 'right' | undefined) ?? 'left';

    return (
        <Box>
            <RmgLabel label="本站名">
                <RmgOutput>{name}</RmgOutput>
            </RmgLabel>
            {/* <RmgLabel label="本站名拼音">
                <RmgDebouncedInput
                    defaultValue={namePinyin}
                    value={namePinyin}
                    onDebouncedChange={val => handleVariantChange('namePinyin', val)}
                />
            </RmgLabel> */}
            <RmgLabel label="开门方向" oneLine>
                <RadioGroup value={doorDirection} onChange={val => handleVariantChange('doorDirection', val)}>
                    <Radio value="left">左</Radio>
                    <Radio value="right">右</Radio>
                </RadioGroup>
            </RmgLabel>
        </Box>
    );
}
