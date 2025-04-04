import {
    Box,
    Heading,
    ListItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    OrderedList,
    Text,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const WelcomeModal = (props: { isOpen: boolean; onClose: () => void }) => {
    const { isOpen, onClose } = props;
    const { t } = useTranslation();

    const headingColor = useColorModeValue('blue.700', 'blue.200');
    const textColor = useColorModeValue('gray.800', 'gray.200');
    const bgColor = useColorModeValue('blue.50', 'blue.600');

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
            <ModalOverlay backdropFilter="blur(5px)" />
            <ModalContent borderRadius="xl" overflow="hidden">
                <ModalHeader
                    bgGradient="linear(to-r, blue.500, teal.400)"
                    color="white"
                    py={6}
                    fontSize="2xl"
                    fontWeight="bold"
                    textAlign="center"
                >
                    {t('welcome.title')}
                </ModalHeader>
                <ModalCloseButton color="white" _hover={{ bg: 'rgba(255,255,255,0.2)' }} size="lg" />

                <ModalBody p={8}>
                    <VStack spacing={6} align="stretch">
                        <Box textAlign="center" mb={4}>
                            <Text fontSize="lg" color={textColor}>
                                {t('welcome.desc')}
                            </Text>
                        </Box>

                        <Box bg={bgColor} p={4} borderRadius="lg">
                            <Heading size="md" color={headingColor} mb={3}>
                                {t('welcome.steps')}
                            </Heading>
                            <OrderedList spacing={3}>
                                <ListItem>
                                    <Text fontWeight="medium">{t('welcome.step1')}</Text>
                                </ListItem>
                                <ListItem>
                                    <Text fontWeight="medium">{t('welcome.step2')}</Text>
                                </ListItem>
                                <ListItem>
                                    <Text fontWeight="medium">{t('welcome.step3')}</Text>
                                </ListItem>
                            </OrderedList>
                        </Box>

                        <Box bgGradient="linear(to-r, teal.100, blue.100)" p={4} borderRadius="lg" textAlign="center">
                            <Text fontWeight="bold" color="teal.800">
                                {t('welcome.start')}
                            </Text>
                        </Box>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default WelcomeModal;
