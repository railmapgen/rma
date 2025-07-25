import {
    Alert,
    AlertIcon,
    Button,
    Flex,
    IconButton,
    Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import rmgRuntime from '@railmapgen/rmg-runtime';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineCancel, MdOutlineDownload, MdOutlinePayments, MdOutlineUpload } from 'react-icons/md';
import { AudioTaskStatus } from '../../constants/audio';
import { Events, reconciledPhrasesToPinyin } from '../../constants/constants';
import { useRootDispatch, useRootSelector } from '../../redux';
import { cancelTask, fetchAudioTasks } from '../../redux/audio/audio-slice';
import { downloadAs, downloadBlobAs } from '../../util/download';
import { API_ENDPOINT, apiFetch } from '../../util/token';
import NewTaskModal from './new-task-modal';
import RedeemModal from './redeem-modal';

const ISSUE_TEMPLATE_URL = 'https://github.com/railmapgen/rma/issues/new?template=task-report.yml';

const AudioModal = (props: { isOpen: boolean; onClose: () => void }) => {
    const { isOpen, onClose } = props;
    const { t } = useTranslation();
    const dispatch = useRootDispatch();
    const {
        telemetry: { project: isAllowProjectTelemetry },
    } = useRootSelector(state => state.app);
    const { tasks, points } = useRootSelector(state => state.audio);
    const { rmtToken, reconciledPhrases } = useRootSelector(state => state.runtime);
    const { project } = useRootSelector(state => state.param);
    const { style, metadata } = project;
    const isAllowAppTelemetry = rmgRuntime.isAllowAnalytics();

    const linkColour = useColorModeValue('primary.500', 'primary.300');

    const [isNewTaskModalOpen, setNewTaskModalOpen] = React.useState(false);
    const [isRedeemModalOpen, setRedeemModalOpen] = React.useState(false);

    React.useEffect(() => {
        if (!isOpen) return;
        dispatch(fetchAudioTasks());
    }, [isOpen]);

    const handleTaskDownload = async (taskId: number) => {
        const response = await apiFetch(`${API_ENDPOINT.AUDIOTASKS}/${taskId}/download`, {}, rmtToken);
        if (!response || !response.ok) {
            // TODO: show error message using global alert
            throw new Error('Download error');
        }

        downloadBlobAs(`${taskId}.zip`, await response.blob());
    };

    const handleDownloadText = () => {
        if (isAllowAppTelemetry)
            rmgRuntime.event(
                Events.DOWNLOAD_TEXT,
                isAllowProjectTelemetry ? { style, '#stations': Object.keys(metadata).length } : {}
            );
        const text = reconciledPhrasesToPinyin(reconciledPhrases);
        downloadAs(`RMA_${new Date().valueOf()}.txt`, 'text/plain', text.join('\n'));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{t('header.download.audio')}</ModalHeader>
                <ModalCloseButton />

                <ModalBody paddingBottom={10}>
                    <Text fontSize="lg" mb="4">
                        {t('header.audioTask.desc')}
                    </Text>
                    <Text fontSize="md" mt="4" color="gray.600">
                        {t('header.audioTask.exampleZH')}
                    </Text>
                    <audio controls>
                        <source src="audio/shmetro-zh.mp3" type="audio/mpeg" />
                        {t('header.audioTask.audioNotSupported')}
                    </audio>
                    <Text fontSize="md" mt="4" color="gray.600">
                        {t('header.audioTask.exampleEN')}
                    </Text>
                    <audio controls>
                        <source src="audio/shmetro-en.mp3" type="audio/mpeg" />
                        {t('header.audioTask.audioNotSupported')}
                    </audio>

                    <Alert status="error" mt="4">
                        <AlertIcon />
                        <Text fontSize="md" color="gray.600">
                            {t('header.audioTask.temporaryMaintenance')}
                        </Text>
                    </Alert>

                    <Alert status="info" mt="4">
                        <AlertIcon />
                        <Text fontSize="md" color="gray.600">
                            {t('header.audioTask.note1')}
                        </Text>
                    </Alert>

                    <Alert status="info" mt="4">
                        <AlertIcon />
                        <Text fontSize="md" color="gray.600">
                            {t('header.audioTask.note2')}
                        </Text>
                    </Alert>

                    <Alert status="info" mt="4">
                        <AlertIcon />
                        <Text fontSize="md" color="gray.600">
                            {t('header.audioTask.note3')}
                        </Text>
                    </Alert>

                    <Alert status="warning" mt="4">
                        <AlertIcon />
                        <Text fontSize="md" color="gray.600">
                            {t('header.audioTask.note4')}
                        </Text>
                    </Alert>

                    {!rmtToken ? (
                        <Text mt="10" textAlign="center">
                            {t('header.audioTask.loginFirst')}
                        </Text>
                    ) : (
                        <>
                            <Flex pl="4" pr="4" mt="10" mb="4">
                                <Text as="b" fontSize="4xl">
                                    {points}
                                </Text>
                                <Text style={{ alignSelf: 'self-end', marginLeft: '10px' }}>pts</Text>
                                <Flex style={{ flex: 1 }} />
                                <Text as="b" style={{ alignSelf: 'self-end' }}>
                                    {t('header.audioTask.title')}
                                </Text>
                                <Flex style={{ flex: 1 }} />
                                <Button
                                    leftIcon={<MdOutlinePayments />}
                                    style={{ alignSelf: 'center' }}
                                    onClick={() => setRedeemModalOpen(true)}
                                    mr="2"
                                >
                                    {t('header.audioTask.topUp')}
                                </Button>
                                <RedeemModal isOpen={isRedeemModalOpen} onClose={() => setRedeemModalOpen(false)} />
                                <Button
                                    leftIcon={<MdOutlineUpload />}
                                    style={{ alignSelf: 'center' }}
                                    onClick={() => setNewTaskModalOpen(true)}
                                >
                                    {t('header.audioTask.new.title')}
                                </Button>
                                <NewTaskModal isOpen={isNewTaskModalOpen} onClose={() => setNewTaskModalOpen(false)} />
                            </Flex>
                            <TableContainer height="100%" overflowY="auto">
                                <Table variant="simple" height="100%">
                                    <Thead>
                                        <Tr>
                                            <Th>{t('header.audioTask.table.id')}</Th>
                                            <Th>{t('header.audioTask.table.status')}</Th>
                                            <Th>{t('header.audioTask.table.createdAt')}</Th>
                                            <Th>{t('header.audioTask.table.updatedAt')}</Th>
                                            <Th>{t('header.audioTask.table.points')}</Th>
                                            <Th>{t('header.audioTask.table.actions')}</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {tasks.map(({ id, status, createdAt, updatedAt, points }) => (
                                            <Tr key={id}>
                                                <Td>{id}</Td>
                                                <Td>{status}</Td>
                                                <Td>{new Date(createdAt).toLocaleString()}</Td>
                                                <Td>{new Date(updatedAt).toLocaleString()}</Td>
                                                <Td>{points}</Td>
                                                <Td>
                                                    {status === AudioTaskStatus.CREATED && (
                                                        <IconButton
                                                            icon={<MdOutlineCancel />}
                                                            aria-label={t('Cancel Task')}
                                                            onClick={() => dispatch(cancelTask(id))}
                                                        />
                                                    )}
                                                    {status === AudioTaskStatus.COMPLETED && (
                                                        <IconButton
                                                            icon={<MdOutlineDownload />}
                                                            aria-label={t('Download Audio')}
                                                            onClick={() => handleTaskDownload(id)}
                                                        />
                                                    )}
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                            <VStack mt={10}>
                                <Text fontSize="sm" lineHeight="100%" color="gray.600">
                                    {t('header.audioTask.report1')}
                                    <Link
                                        color={linkColour}
                                        fontSize="sm"
                                        lineHeight="100%"
                                        onClick={() => window.open(ISSUE_TEMPLATE_URL, '_blank')}
                                    >
                                        {t('header.audioTask.report2')}
                                    </Link>
                                    {t('header.audioTask.report3')}
                                </Text>
                            </VStack>
                        </>
                    )}
                    <VStack mt={10}>
                        <Text fontSize="sm" lineHeight="100%" color="gray.600">
                            {t('header.audioTask.freeInternet1')}
                            <Link color={linkColour} fontSize="sm" lineHeight="100%" onClick={handleDownloadText}>
                                {t('header.audioTask.freeInternet2')}
                            </Link>
                            {t('header.audioTask.freeInternet3')}
                        </Text>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AudioModal;
