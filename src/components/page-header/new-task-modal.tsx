import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useRootDispatch, useRootSelector } from '../../redux';
import { newTask } from '../../redux/audio/audio-slice';

const NewTaskModal = (props: { isOpen: boolean; onClose: () => void }) => {
    const { isOpen, onClose } = props;
    const { t } = useTranslation();
    const dispatch = useRootDispatch();
    const { reconciledPhrases } = useRootSelector(state => state.runtime);
    const { points } = useRootSelector(state => state.audio);

    const estimatedPoints = Object.keys(reconciledPhrases).length * 100;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{t('header.audioTask.new.title')}</ModalHeader>
                <ModalCloseButton />

                <ModalBody paddingBottom={10}>
                    <Text>This will create a new task from the current project.</Text>
                    <Text>The estimated points consumed will be {estimatedPoints}.</Text>
                    <Text>The actual points used is subject to the server.</Text>
                    <Text>You may cancel the task before processing to get a full refund.</Text>
                </ModalBody>

                <ModalFooter>
                    <Button
                        style={{ alignSelf: 'center' }}
                        onClick={() => dispatch(newTask())}
                        isDisabled={points < estimatedPoints}
                    >
                        Create a new task
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default NewTaskModal;
