import { Box, Switch } from '@chakra-ui/react';
import { RmgLabel } from '@railmapgen/rmg-components';
import { useTranslation } from 'react-i18next';
import { Serializable, Stage, VoiceName } from '../../../constants/constants';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { setVariant } from '../../../redux/param/param-slice';

export default function VariantsZHMidway() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const { project } = useRootSelector(state => state.param);
    const { currentStationID } = useRootSelector(state => state.runtime);

    const currentStage = Stage.Midway;
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

    const caution = (currentVariants.caution as boolean | undefined) ?? false;

    return (
        <Box>
            <RmgLabel label="注意安全" oneLine>
                <Switch
                    isChecked={caution}
                    onChange={({ target: { checked } }) => handleVariantChange('caution', checked)}
                />
            </RmgLabel>
        </Box>
    );
}
