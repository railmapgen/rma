import {
    Box,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    VStack,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AudioTaskStatus } from '../../constants/audio';
import { useRootDispatch, useRootSelector } from '../../redux';
import { cancelTask, fetchAudioTasks, newTask } from '../../redux/audio/audio-slice';
import { downloadBlobAs } from '../../util/download';
import { API_ENDPOINT, apiFetch } from '../../util/token';

const AudioModal = (props: { isOpen: boolean; onClose: () => void }) => {
    const { isOpen, onClose } = props;
    const { t } = useTranslation();
    const dispatch = useRootDispatch();
    const { tasks } = useRootSelector(state => state.audio);
    const { rmtToken } = useRootSelector(state => state.runtime);

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

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{t('header.audioTask.title')}</ModalHeader>
                <ModalCloseButton />

                <ModalBody paddingBottom={10}>
                    <VStack spacing={4} align="stretch">
                        <Text>{rmtToken ? 'Task List' : 'Please login first'}</Text>
                        {tasks.map(task => (
                            <Box key={task.id} border="1px" borderColor="gray.300" p={4} borderRadius="md">
                                <Text>ID: {task.id}</Text>
                                <Text>Status: {task.status}</Text>
                                <Text>Created At: {new Date(task.createdAt).toLocaleString()}</Text>
                                <Text>Updated At: {new Date(task.updatedAt).toLocaleString()}</Text>
                                {task.status === AudioTaskStatus.CREATED && (
                                    <Button colorScheme="red" onClick={() => dispatch(cancelTask(task.id))}>
                                        Cancel Task
                                    </Button>
                                )}
                                {task.status === AudioTaskStatus.COMPLETED && (
                                    <Button colorScheme="blue" onClick={() => handleTaskDownload(task.id)}>
                                        Download Audio
                                    </Button>
                                )}
                            </Box>
                        ))}
                        {rmtToken && (
                            <Box p={4} border="1px" borderColor="gray.300" borderRadius="md">
                                <VStack spacing={4}>
                                    <Button colorScheme="blue" onClick={() => dispatch(newTask())}>
                                        Upload current project as a new task
                                    </Button>
                                </VStack>
                            </Box>
                        )}
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AudioModal;
