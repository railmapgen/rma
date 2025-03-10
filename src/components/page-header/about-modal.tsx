import {
    Avatar,
    Box,
    Flex,
    Heading,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Tag,
    TagLabel,
    Text,
    VStack,
} from '@chakra-ui/react';
import rmgRuntime from '@railmapgen/rmg-runtime';
import { useTranslation } from 'react-i18next';

const AboutModal = (props: { isOpen: boolean; onClose: () => void }) => {
    const { isOpen, onClose } = props;
    const { t } = useTranslation();
    const appVersion = rmgRuntime.getAppVersion();

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{t('header.about.title')}</ModalHeader>
                <ModalCloseButton />

                <ModalBody paddingBottom={10}>
                    <Flex direction="row">
                        <Image boxSize="128px" src={import.meta.env.BASE_URL + '/logo192.png'} />
                        <Flex direction="column" width="100%" alignItems="center" justifyContent="center">
                            <Text fontSize="xl" as="b">
                                {t('header.about.rma')}
                            </Text>
                            <Text>{appVersion}</Text>
                            <Text />
                            <Text fontSize="sm">{t('header.about.railmapgen')}</Text>
                        </Flex>
                    </Flex>

                    <Box margin={5}>
                        <Text fontSize="xl">{t('header.about.desc')}</Text>
                    </Box>

                    <Heading as="h5" size="sm" mt={3} mb={2}>
                        {t('header.about.contributors')}
                    </Heading>

                    <VStack>
                        <Tag
                            size="lg"
                            w="85%"
                            onClick={() => window.open('https://github.com/thekingofcity', '_blank')}
                            cursor="pointer"
                        >
                            <Avatar src="https://github.com/thekingofcity.png" size="lg" my={2} ml={-1} mr={2} />
                            <TagLabel display="block" width="100%">
                                <Text fontSize="lg" fontWeight="bold" mb={1}>
                                    thekingofcity
                                </Text>
                                <Text fontSize="sm">{t('header.about.content1')}</Text>
                                <Text fontSize="sm" align="right" mb={1}>
                                    {t('header.about.content2')}
                                </Text>
                            </TagLabel>
                        </Tag>
                    </VStack>

                    <Heading as="h5" size="sm" mt={3} mb={2}>
                        {t('header.about.contactUs')}
                    </Heading>

                    <VStack>
                        <Tag
                            size="lg"
                            w="85%"
                            onClick={() => window.open('https://github.com/railmapgen/rma/issues', '_blank')}
                            cursor="pointer"
                        >
                            <Avatar src="images/github-mark.svg" size="lg" my={2} ml={-1} mr={2} />
                            <TagLabel display="block" width="100%">
                                <Text fontSize="lg" fontWeight="bold" mb={1}>
                                    {t('header.about.github')}
                                </Text>
                                <Text fontSize="sm">{t('header.about.githubContent')}</Text>
                            </TagLabel>
                        </Tag>
                        <Tag
                            size="lg"
                            w="85%"
                            onClick={() =>
                                window.open(
                                    'https://join.slack.com/t/railmapgenerator/shared_invite/zt-1odhhta3n-DdZF~fnVwo_q0S0RJmgV8A',
                                    '_blank'
                                )
                            }
                            cursor="pointer"
                        >
                            <Avatar src="images/slack-mark.svg" size="lg" my={2} ml={-1} mr={2} />
                            <TagLabel display="block" width="100%">
                                <Text fontSize="lg" fontWeight="bold" mb={1}>
                                    {t('header.about.slack')}
                                </Text>
                                <Text fontSize="sm">{t('header.about.slackContent')}</Text>
                                <Text fontSize="sm" as="i">
                                    #rma, #rmp, #gallery, #rmg, #palette-and-templates
                                </Text>
                            </TagLabel>
                        </Tag>
                    </VStack>

                    <Heading as="h5" size="sm" mt={3} mb={2}>
                        {t('header.donation.title')}
                    </Heading>

                    <VStack>
                        <Tag
                            size="lg"
                            w="85%"
                            onClick={() => window.open('https://afdian.com/a/rail-map-toolkit', '_blank')}
                            cursor="pointer"
                        >
                            <Avatar src="images/afdian.png" size="lg" my={2} ml={-1} mr={2} />
                            <TagLabel display="block" width="100%" pb={1}>
                                <Text fontSize="lg" fontWeight="bold" mb={1}>
                                    {t('header.donation.afdian')}
                                </Text>
                                <Text fontSize="sm">{t('header.donation.viaCNY')}</Text>
                            </TagLabel>
                        </Tag>
                        <Tag
                            size="lg"
                            w="85%"
                            onClick={() => window.open('https://opencollective.com/rail-map-toolkit', '_blank')}
                            cursor="pointer"
                        >
                            <Avatar src="images/opencollective-icon.webp" size="lg" my={2} ml={-1} mr={2} />
                            <TagLabel display="block" width="100%" pb={1}>
                                <Text fontSize="lg" fontWeight="bold" mb={1}>
                                    {t('header.donation.openCollective')}
                                </Text>
                                <Text fontSize="sm">{t('header.donation.viaUSD')}</Text>
                            </TagLabel>
                        </Tag>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AboutModal;
