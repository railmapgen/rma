import {
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
import { Events, reconciledPhrasesToText } from '../../constants/constants';
import { useRootDispatch, useRootSelector } from '../../redux';
import { cancelTask, fetchAudioTasks } from '../../redux/audio/audio-slice';
import { downloadAs, downloadBlobAs } from '../../util/download';
import { API_ENDPOINT, apiFetch } from '../../util/token';
import NewTaskModal from './new-task-modal';

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

    React.useEffect(() => {
        if (!isOpen) return;
        dispatch(fetchAudioTasks());
    }, [isOpen]);

    const handleTaskDownload = async (taskId: number) => {
        const response = await apiFetch(`${API_ENDPOINT.AUDIOTASKS}/${taskId}/download`, {}, rmtToken);
        if (!response || !response.ok) {
            // TODO: show error message using global alert
            throw new Error('文件下载失败');
        }

        downloadBlobAs(`${taskId}.zip`, await response.blob());
    };

    const handleDownloadText = () => {
        if (isAllowAppTelemetry)
            rmgRuntime.event(
                Events.DOWNLOAD_TEXT,
                isAllowProjectTelemetry ? { style, '#stations': Object.keys(metadata).length } : {}
            );
        const text = reconciledPhrasesToText(reconciledPhrases);
        downloadAs(`RMA_${new Date().valueOf()}.txt`, 'text/plain', text.join('\n'));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{t('header.audioTask.title')}</ModalHeader>
                <ModalCloseButton />

                <ModalBody paddingBottom={10}>
                    {!rmtToken ? (
                        <Text textAlign="center">{t('Please login first.')}</Text>
                    ) : (
                        <>
                            <Flex pl="4" pr="4" mb="4">
                                <Text as="b" fontSize="4xl">
                                    {points}
                                </Text>
                                <Text style={{ alignSelf: 'self-end', marginLeft: '10px' }}>pts</Text>
                                <Flex style={{ flex: 1 }} />
                                <IconButton
                                    icon={<MdOutlinePayments />}
                                    variant="ghost"
                                    style={{ alignSelf: 'center' }}
                                    aria-label={t('Top up points')}
                                    isDisabled
                                />
                                <IconButton
                                    icon={<MdOutlineUpload />}
                                    variant="ghost"
                                    style={{ alignSelf: 'center' }}
                                    aria-label={t('Upload current project as a new task')}
                                    onClick={() => setNewTaskModalOpen(true)}
                                />
                                <NewTaskModal isOpen={isNewTaskModalOpen} onClose={() => setNewTaskModalOpen(false)} />
                            </Flex>
                            <TableContainer height="100%" overflowY="auto">
                                <Table variant="simple" height="100%">
                                    <Thead>
                                        <Tr>
                                            <Th>{t('ID')}</Th>
                                            <Th>{t('Status')}</Th>
                                            <Th>{t('Created At')}</Th>
                                            <Th>{t('Updated At')}</Th>
                                            <Th>{t('Action')}</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {tasks.map(({ id, status, createdAt, updatedAt }) => (
                                            <Tr key={id}>
                                                <Td>{id}</Td>
                                                <Td>{status}</Td>
                                                <Td>{new Date(createdAt).toLocaleString()}</Td>
                                                <Td>{new Date(updatedAt).toLocaleString()}</Td>
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
                        </>
                    )}

                    <VStack mt={4}>
                        <Text fontSize="sm" lineHeight="100%" color="gray.600">
                            We believe in a free and open internet. You may also{' '}
                            <Link color={linkColour} fontSize="sm" lineHeight="100%" onClick={handleDownloadText}>
                                download raw text
                            </Link>{' '}
                            and use in your preferred audio provider :)
                        </Text>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AudioModal;
