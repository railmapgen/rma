import {
    Button,
    Icon,
    Input,
    Link,
    ListItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    UnorderedList,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdOpenInNew } from 'react-icons/md';
import { useRootDispatch } from '../../redux';
import { redeem } from '../../redux/audio/audio-slice';

const RedeemModal = (props: { isOpen: boolean; onClose: () => void }) => {
    const toast = useToast();
    const { t } = useTranslation();
    const { isOpen, onClose } = props;
    const dispatch = useRootDispatch();

    const linkColour = useColorModeValue('primary.500', 'primary.300');
    const [CDKey, setCDKey] = React.useState('');

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{t('header.audioTask.redeem.title')}</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <Text mb="4">{t('header.audioTask.redeem.desc')}</Text>
                    <UnorderedList>
                        <ListItem>
                            <Link
                                color={linkColour}
                                href="https://afdian.com/item/851c2bb4110d11f0935a5254001e7c00"
                                isExternal={true}
                            >
                                爱发电 <Icon as={MdOpenInNew} />
                            </Link>
                        </ListItem>
                    </UnorderedList>

                    <Stack mt="5" direction={{ base: 'column', sm: 'row' }}>
                        <Text mr="auto">{t('header.audioTask.redeem.input')}</Text>
                        <Input w="200px" value={CDKey} onChange={e => setCDKey(e.target.value)} />
                        <Button colorScheme="teal" onClick={() => dispatch(redeem(CDKey.trim()))}>
                            {t('header.audioTask.redeem.redeem')}
                        </Button>
                    </Stack>
                </ModalBody>

                <ModalFooter />
            </ModalContent>
        </Modal>
    );
};

export default RedeemModal;
