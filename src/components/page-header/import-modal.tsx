import {
    Box,
    Button,
    Heading,
    HStack,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Radio,
    RadioGroup,
    Text,
    VStack,
} from '@chakra-ui/react';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { useTranslation } from 'react-i18next';
import { Events, Stage } from '../../constants/constants';
import { Services } from '../../constants/rmg';
import { useRootDispatch, useRootSelector } from '../../redux';
import { removeRMGParam, setRoute, setService } from '../../redux/import/import-slice';
import { setProject } from '../../redux/param/param-slice';
import { setCurrentStage, setCurrentStationID, setGlobalAlert } from '../../redux/runtime/runtime-slice';
import { getRoutes } from '../../util/graph-theory';
import { makeProject } from '../../util/make-project';

const ImportModal = () => {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();
    const isAllowAppTelemetry = rmgRuntime.isAllowAnalytics();

    const { rmgParam, route, service } = useRootSelector(state => state.import);

    const routes = rmgParam ? getRoutes(rmgParam.stn_list).map(route => [route.at(1)!, route.at(-2)!]) : [];
    const routesOptions = rmgParam
        ? routes.map(route => route.map(stnID => Object.values(rmgParam.stn_list[stnID].localisedName).join(' ')))
        : [];

    const allServices = new Set<Services>(
        Object.values(rmgParam?.stn_list ?? {})
            .map(station => station.services)
            .flat()
    );

    const handleImport = () => {
        if (!rmgParam) return;
        if (isAllowAppTelemetry) rmgRuntime.event(Events.IMPORT_RMG_PARAM);
        try {
            const project = makeProject(structuredClone(rmgParam), route, service);
            dispatch(setProject(project));
            dispatch(setCurrentStationID(Object.keys(project['metadata'])[0]));
            dispatch(setCurrentStage(Stage.Departure));
        } catch (err) {
            dispatch(setGlobalAlert({ status: 'error', message: t('header.open.unknownError') }));
            console.error('OpenActions.handleUploadRMG():: Unknown error occurred while parsing the RMG project', err);
        } finally {
            dispatch(removeRMGParam());
            dispatch(setRoute(0));
            dispatch(setService(Services.local));
        }
    };

    return (
        <Modal isOpen={rmgParam !== undefined} onClose={() => dispatch(removeRMGParam())} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{t('import.title')}</ModalHeader>
                <ModalCloseButton color="white" />

                <ModalBody py={3}>
                    {routes.length === 1 && allServices.size === 1 && <Text>{t('import.goodToGo')}</Text>}
                    {routes.length > 1 && (
                        <>
                            <Heading fontSize="md" mb={4}>
                                {t('import.routes')}
                            </Heading>
                            <RadioGroup onChange={val => dispatch(setRoute(Number(val)))} value={route.toString()}>
                                <HStack spacing={4} align="stretch">
                                    {routesOptions.map((option, index) => (
                                        <Box
                                            key={index}
                                            borderWidth="1px"
                                            borderRadius="lg"
                                            p={4}
                                            _hover={{ borderColor: 'blue.300', bg: 'blue.50' }}
                                            borderColor={route === index ? 'blue.500' : 'gray.200'}
                                        >
                                            <Radio value={index.toString()} colorScheme="blue">
                                                <VStack align="start" spacing={1} ml={2}>
                                                    <Text fontSize="sm">{option.join(' <=> ')}</Text>
                                                </VStack>
                                            </Radio>
                                        </Box>
                                    ))}
                                </HStack>
                            </RadioGroup>
                        </>
                    )}
                    {allServices.size > 1 && (
                        <>
                            <Heading fontSize="md" mb={4}>
                                {t('import.services')}
                            </Heading>
                            <RadioGroup onChange={val => dispatch(setService(val as Services))} value={service}>
                                <HStack spacing={4} align="stretch">
                                    {[...allServices].map(option => (
                                        <Box
                                            key={option}
                                            borderWidth="1px"
                                            borderRadius="lg"
                                            p={4}
                                            _hover={{ borderColor: 'blue.300', bg: 'blue.50' }}
                                            borderColor={service === option ? 'blue.500' : 'gray.200'}
                                        >
                                            <Radio value={option} colorScheme="blue">
                                                <VStack align="start" spacing={1} ml={2}>
                                                    <Text fontSize="sm">{t(`import.service.${option}`)}</Text>
                                                </VStack>
                                            </Radio>
                                        </Box>
                                    ))}
                                </HStack>
                            </RadioGroup>
                        </>
                    )}
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="teal" variant="outline" onClick={handleImport}>
                        {t('import.import')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ImportModal;
