import {
    Box,
    Heading,
    Icon,
    Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Select,
    StackDivider,
    Switch,
    Text,
    Tooltip,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import { RmgLabel, RmgThrottledSlider } from '@railmapgen/rmg-components';
import rmgRuntime from '@railmapgen/rmg-runtime';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdOpenInNew } from 'react-icons/md';
import { StyleType, VoiceName, voiceToPreview } from '../../constants/constants';
import { Services } from '../../constants/rmg';
import { useRootDispatch, useRootSelector } from '../../redux';
import {
    removePreviewAudio,
    setPreferenceImport,
    setPreviewAudio,
    setTelemetryProject,
} from '../../redux/app/app-slice';
import { setScale } from '../../redux/crawl/crawl-slice';
import { useVoices } from '../../util/hooks';

const SettingsModal = (props: { isOpen: boolean; onClose: () => void }) => {
    const { isOpen, onClose } = props;
    const {
        telemetry: { project: isAllowProjectTelemetry },
        preference: {
            import: { route, service },
            previewAudio,
        },
    } = useRootSelector(state => state.app);
    const dispatch = useRootDispatch();
    const { t } = useTranslation();
    const linkColour = useColorModeValue('primary.500', 'primary.300');

    const handlePreferenceChange = (route: number, service: Services) => {
        dispatch(setPreferenceImport({ route, service }));
    };

    const { scale } = useRootSelector(state => state.crawl);

    const allVoices = useVoices();
    const [availableVoices, setAvailableVoices] = React.useState<{
        [k in VoiceName]: string[];
    }>({
        [VoiceName.ChineseMandarinSimplified]: [],
        [VoiceName.ChineseWuSimplifiedXiaotong]: [],
        [VoiceName.ChineseWuSimplifiedYunzhe]: [],
    });
    React.useEffect(() => {
        setAvailableVoices({
            [VoiceName.ChineseMandarinSimplified]: allVoices
                .filter(
                    voice =>
                        voice.lang ===
                        voiceToPreview[StyleType.ShanghaiMetro]?.defaultLang?.[VoiceName.ChineseMandarinSimplified]
                )
                .map(voice => voice.name),
            [VoiceName.ChineseWuSimplifiedXiaotong]: [],
            [VoiceName.ChineseWuSimplifiedYunzhe]: allVoices
                .filter(
                    voice =>
                        voice.lang ===
                        voiceToPreview[StyleType.ShanghaiMetro]?.defaultLang?.[VoiceName.ChineseWuSimplifiedYunzhe]
                )
                .map(voice => voice.name),
        });
    }, [allVoices]);

    const handlePreviewAudioChange = (voiceName: VoiceName, systemTTSVoiceName: string) => {
        if (systemTTSVoiceName === 'undefined') {
            dispatch(removePreviewAudio(voiceName));
        } else {
            dispatch(setPreviewAudio([voiceName, systemTTSVoiceName]));
        }
    };

    const isAllowAppTelemetry = rmgRuntime.isAllowAnalytics();
    const handleAdditionalTelemetry = (allowTelemetry: boolean) => {
        dispatch(setTelemetryProject(allowTelemetry));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside" trapFocus={false}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{t('header.settings.title')}</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <VStack divider={<StackDivider borderColor="gray.200" />}>
                        <Box width="100%" mb="3">
                            <Heading fontSize="md">{t('header.settings.crawl.title')}</Heading>
                            <Box mt="3">
                                {/* <RmgLabel label="columns">
                                    <RmgThrottledSlider
                                        isReadOnly
                                        defaultValue={columns}
                                        value={columns}
                                        min={100}
                                        max={300}
                                        step={1}
                                        onThrottledChange={val => dispatch(setColumns(val))}
                                    />
                                </RmgLabel> */}
                                <RmgLabel label={t('header.settings.crawl.scale')}>
                                    <RmgThrottledSlider
                                        defaultValue={scale}
                                        value={scale}
                                        min={0.1}
                                        max={1}
                                        step={0.1}
                                        onThrottledChange={val => dispatch(setScale(val))}
                                    />
                                </RmgLabel>
                            </Box>
                        </Box>

                        <Box width="100%" mb="3">
                            <Heading fontSize="md">{t('header.settings.previewAudio.title')}</Heading>
                            <Box mt="3">
                                <Box mb="1" display="flex">
                                    <Text flex="1">{t('header.settings.previewAudio.shmetro-zh')}</Text>
                                    <Select
                                        size="xs"
                                        width="300px"
                                        ml="1"
                                        defaultValue={previewAudio[VoiceName.ChineseMandarinSimplified] ?? 'undefined'}
                                        onChange={({ target: { value } }) =>
                                            handlePreviewAudioChange(VoiceName.ChineseMandarinSimplified, value)
                                        }
                                    >
                                        <option value="undefined">
                                            {t('header.settings.previewAudio.notModified')}
                                        </option>
                                        {availableVoices[VoiceName.ChineseMandarinSimplified].map(voice => (
                                            <option key={voice} value={voice}>
                                                {voice}
                                            </option>
                                        ))}
                                    </Select>
                                </Box>
                                <Box mb="1" display="flex">
                                    <Text flex="1">{t('header.settings.previewAudio.shmetro-en')}</Text>
                                    <Select
                                        size="xs"
                                        width="300px"
                                        ml="1"
                                        defaultValue={previewAudio[VoiceName.ChineseWuSimplifiedYunzhe] ?? 'undefined'}
                                        onChange={({ target: { value } }) =>
                                            handlePreviewAudioChange(VoiceName.ChineseWuSimplifiedYunzhe, value)
                                        }
                                    >
                                        <option value="undefined">
                                            {t('header.settings.previewAudio.notModified')}
                                        </option>
                                        {availableVoices[VoiceName.ChineseWuSimplifiedYunzhe].map(voice => (
                                            <option key={voice} value={voice}>
                                                {voice}
                                            </option>
                                        ))}
                                    </Select>
                                </Box>
                            </Box>
                        </Box>

                        <Box width="100%" mb="3">
                            <Heading fontSize="md">{t('header.settings.telemetry.title')}</Heading>
                            <Box mt="3">
                                <Text fontSize="sm" lineHeight="100%" color="gray.600">
                                    {t('header.settings.telemetry.info')}
                                </Text>

                                <Box mt="3" mb="1">
                                    <Box display="flex" mb="1">
                                        <Text flex="1">{t('header.settings.telemetry.essential')}</Text>
                                        <Tooltip label={t('header.settings.telemetry.essentialTooltip')}>
                                            <Switch isChecked={isAllowAppTelemetry} isDisabled />
                                        </Tooltip>
                                    </Box>
                                    <Text fontSize="sm" lineHeight="100%" color="gray.600">
                                        {t('header.settings.telemetry.essentialInfo')}
                                    </Text>
                                    <Link
                                        color={linkColour}
                                        fontSize="sm"
                                        lineHeight="100%"
                                        href="https://support.google.com/analytics/answer/11593727"
                                        isExternal={true}
                                    >
                                        {t('header.settings.telemetry.essentialLink')} <Icon as={MdOpenInNew} />
                                    </Link>
                                </Box>

                                <Box mt="1" mb="1">
                                    <Box display="flex">
                                        <Text flex="1">{t('header.settings.telemetry.additional')}</Text>
                                        <Switch
                                            isChecked={isAllowProjectTelemetry}
                                            onChange={({ target: { checked } }) => handleAdditionalTelemetry(checked)}
                                        />
                                    </Box>
                                    <Text fontSize="sm" lineHeight="100%" color="gray.600">
                                        {t('header.settings.telemetry.additionalInfo')}
                                    </Text>
                                </Box>
                            </Box>
                        </Box>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default SettingsModal;
