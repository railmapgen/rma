import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
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
                    <Text>{t('header.audioTask.new.content1')}</Text>
                    <Text>
                        {t('header.audioTask.new.content2')}
                        {estimatedPoints}
                    </Text>
                    <Text>{t('header.audioTask.new.content3')}</Text>
                    <Text>{t('header.audioTask.new.content4')}</Text>
                </ModalBody>

                <ModalFooter>
                    <Button
                        style={{ alignSelf: 'center' }}
                        onClick={() => dispatch(newTask())}
                        isDisabled={points < estimatedPoints}
                    >
                        {t('header.audioTask.new.create')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default NewTaskModal;
