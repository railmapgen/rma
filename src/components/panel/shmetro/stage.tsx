import { Card, CardBody, CardHeader, Flex, IconButton, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md';
import { Stage, VoiceName } from '../../../constants/constants';
import { useRootDispatch, useRootSelector } from '../../../redux';
import { setCurrentStage, setCurrentVoice } from '../../../redux/runtime/runtime-slice';
import VariantsENArrival from './variants-en-arr';
import VariantsENDeparture from './variants-en-dep';
import VariantsZHArrival from './variants-zh-arr';
import VariantsZHDeparture from './variants-zh-dep';
import VariantsZHMidway from './variants-zh-mdw';
import VariantsDefault from './variants-default';

const validVariants = [
    [Stage.Departure, VoiceName.ChineseMandarinSimplified, '出发'],
    [Stage.Arrival, VoiceName.ChineseMandarinSimplified, '到达'],
    [Stage.Midway, VoiceName.ChineseMandarinSimplified, '中途'],
    [Stage.Departure, VoiceName.ChineseWuSimplifiedYunzhe, 'Departure'],
    [Stage.Arrival, VoiceName.ChineseWuSimplifiedYunzhe, 'Arrival'],
] as [Stage, VoiceName, string][];

export default function StageView() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();
    const { project } = useRootSelector(state => state.param);
    const { showDefaultVariants, currentStationID, currentStage, currentVoice } = useRootSelector(
        state => state.runtime
    );

    const stageExistence = project.stations[currentStationID];

    const handleStageChange = (stage: Stage, voice: VoiceName) => {
        dispatch(setCurrentStage(stage));
        dispatch(setCurrentVoice(voice));
    };

    return (
        <Flex flexDirection="row" wrap="wrap" flex="1" gap={4} margin="2">
            {showDefaultVariants ? (
                <VariantsDefault />
            ) : (
                validVariants
                    .filter(([stage, voice, _]) => stageExistence?.[stage]?.[voice] !== undefined)
                    .map(([stage, voice, name]) => (
                        <Card height="350px" width="400px" key={`${stage}-${voice}`} variant="outline">
                            <CardHeader width="100%" display="flex">
                                <Text as="b" flex="1">
                                    {name}
                                </Text>
                                <IconButton
                                    aria-label={`set current stage to ${stage}`}
                                    icon={
                                        currentStage === stage && currentVoice === voice ? (
                                            <MdRadioButtonChecked />
                                        ) : (
                                            <MdRadioButtonUnchecked />
                                        )
                                    }
                                    onClick={() => handleStageChange(stage, voice)}
                                />
                            </CardHeader>
                            <CardBody>
                                {stage === Stage.Departure && voice === VoiceName.ChineseMandarinSimplified && (
                                    <VariantsZHDeparture />
                                )}
                                {stage === Stage.Arrival && voice === VoiceName.ChineseMandarinSimplified && (
                                    <VariantsZHArrival />
                                )}
                                {stage === Stage.Midway && voice === VoiceName.ChineseMandarinSimplified && (
                                    <VariantsZHMidway />
                                )}
                                {stage === Stage.Departure && voice === VoiceName.ChineseWuSimplifiedYunzhe && (
                                    <VariantsENDeparture />
                                )}
                                {stage === Stage.Arrival && voice === VoiceName.ChineseWuSimplifiedYunzhe && (
                                    <VariantsENArrival />
                                )}
                            </CardBody>
                        </Card>
                    ))
            )}
        </Flex>
    );
}
