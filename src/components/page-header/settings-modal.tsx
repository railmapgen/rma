import {
    Box,
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
import { useTranslation } from 'react-i18next';
import { MdOpenInNew } from 'react-icons/md';
import { Services } from '../../constants/rmg';
import { useRootDispatch, useRootSelector } from '../../redux';
import { setPreferenceImport, setTelemetryProject } from '../../redux/app/app-slice';
import { setScale } from '../../redux/crawl/crawl-slice';

const SettingsModal = (props: { isOpen: boolean; onClose: () => void }) => {
    const { isOpen, onClose } = props;
    const {
        telemetry: { project: isAllowProjectTelemetry },
        preference: {
            import: { route, service },
        },
    } = useRootSelector(state => state.app);
    const dispatch = useRootDispatch();
    const { t } = useTranslation();
    const linkColour = useColorModeValue('primary.500', 'primary.300');

    const { scale } = useRootSelector(state => state.crawl);

    const isAllowAppTelemetry = rmgRuntime.isAllowAnalytics();
    const handleAdditionalTelemetry = (allowTelemetry: boolean) => {
        dispatch(setTelemetryProject(allowTelemetry));
    };

    const handlePreferenceChange = (route: number, service: Services) => {
        dispatch(setPreferenceImport({ route, service }));
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
                            <Text as="b" fontSize="xl">
                                {t('header.settings.preference.title')}
                            </Text>
                            <Box mt="3">
                                <Box mb="1" display="flex">
                                    <Text flex="1">{t('header.settings.preference.style.title')}</Text>
                                    <Select size="xs" width="auto" ml="1" defaultValue="shmetro">
                                        <option value="shmetro">{t('header.settings.preference.style.shmetro')}</option>
                                    </Select>
                                </Box>
                                <Box mb="1" display="flex">
                                    <Text flex="1">{t('header.settings.preference.branch.title')}</Text>
                                    <Select
                                        size="xs"
                                        width="auto"
                                        ml="1"
                                        defaultValue={route}
                                        onChange={({ target: { value } }) =>
                                            handlePreferenceChange(Number(value), service)
                                        }
                                    >
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                    </Select>
                                </Box>
                                <Box mb="1" display="flex">
                                    <Text flex="1">{t('header.settings.preference.service.title')}</Text>
                                    <Select
                                        size="xs"
                                        width="auto"
                                        ml="1"
                                        defaultValue={service}
                                        onChange={({ target: { value } }) =>
                                            handlePreferenceChange(route, value as Services)
                                        }
                                    >
                                        <option value="local">{t('header.settings.preference.service.local')}</option>
                                        <option value="express">
                                            {t('header.settings.preference.service.express')}
                                        </option>
                                        <option value="direct">{t('header.settings.preference.service.direct')}</option>
                                    </Select>
                                </Box>
                            </Box>
                        </Box>

                        <Box width="100%" mb="3">
                            <Text as="b" fontSize="xl">
                                {t('header.settings.crawl.title')}
                            </Text>
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
                            <Text as="b" fontSize="xl">
                                {t('header.settings.telemetry.title')}
                            </Text>
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
