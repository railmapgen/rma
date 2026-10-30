import { Box, Radio, RadioGroup } from '@chakra-ui/react';
import { RmgDebouncedInput, RmgLabel, RmgOutput } from '@railmapgen/rmg-components';
import { useTranslation } from 'react-i18next';
import { Serializable, Stage, VoiceName } from '../../../constants/constants';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { setVariant } from '../../../redux/param/param-slice';

export default function VariantsENArrival() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();

    const { project } = useRootSelector(state => state.param);
    const { currentStationID } = useRootSelector(state => state.runtime);

    const currentStage = Stage.Arrival;
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

    const name = (variants.name as string | undefined) ?? 'Name';
    const namePinyin = (variants.namePinyin as string | undefined) ?? 'Name';
    const doorDirection = (variants.doorDirection as 'left' | 'right' | undefined) ?? 'left';

    return (
        <Box>
            <RmgLabel label={t('editor.currentName')}>
                <RmgOutput>{name}</RmgOutput>
            </RmgLabel>
            <RmgLabel label={t('editor.currentNamePinyin')}>
                <RmgDebouncedInput
                    defaultValue={namePinyin}
                    onDebouncedChange={val => handleVariantChange('namePinyin', val)}
                />
            </RmgLabel>
            <RmgLabel label={t('editor.door')} oneLine>
                <RadioGroup value={doorDirection} onChange={val => handleVariantChange('doorDirection', val)}>
                    <Radio value="left">{t('editor.left')}</Radio>
                    <Radio value="right">{t('editor.right')}</Radio>
                </RadioGroup>
            </RmgLabel>
        </Box>
    );
}
