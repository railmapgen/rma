import {
    Button,
    Card,
    CardBody,
    CardFooter,
    Checkbox,
    HStack,
    Icon,
    IconButton,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
} from '@chakra-ui/react';
import { RmgFields, RmgFieldsField } from '@railmapgen/rmg-components';
import rmgRuntime from '@railmapgen/rmg-runtime';
import canvasSize from 'canvas-size';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    MdDownload,
    MdImage,
    MdOpenInNew,
    MdOutlineAudiotrack,
    MdOutlineCloud,
    MdOutlineTextSnippet,
    MdSave,
} from 'react-icons/md';
import { Events, reconciledPhrasesToText } from '../../constants/constants';
import { useRootSelector } from '../../redux';
import { downloadAs, downloadBlobAs } from '../../util/download';
import TermsAndConditionsModal from './terms-and-conditions';

const R = 16;
const D = R * 2;
const FONT_HEIGHT = 16;

export default function DownloadActions() {
    const {
        telemetry: { project: isAllowProjectTelemetry },
    } = useRootSelector(state => state.app);
    const { content, columns, viewableColumns } = useRootSelector(state => state.crawl);
    const { project } = useRootSelector(state => state.param);
    const { reconciledPhrases } = useRootSelector(state => state.runtime);
    const { style, metadata } = project;
    const isAllowAppTelemetry = rmgRuntime.isAllowAnalytics();
    const { t } = useTranslation();

    const [format, setFormat] = React.useState('png' as 'png' | 'svg');
    const formatOptions = {
        png: t('header.download.png'),
        svg: t('header.download.svg'),
    };
    const [maxArea, setMaxArea] = React.useState({ width: 1, height: 1, benchmark: 0.001 });
    const [scale, setScale] = React.useState(200);
    const scales = [10, 25, 33, 50, 67, 75, 100, 125, 150, 175, 200, 250, 300, 400, 500, 750, 1000];
    const scaleOptions: { [k: number]: string } = Object.fromEntries(scales.map(v => [v, `${v}%`]));
    const [disabledScaleOptions, setDisabledScaleOptions] = React.useState<number[]>([]);
    const [isTransparent, setIsTransparent] = React.useState(false);
    const fields: RmgFieldsField[] = [
        {
            type: 'select',
            label: t('header.download.format'),
            value: format,
            options: formatOptions,
            onChange: value => setFormat(value === 'png' ? 'png' : 'svg'),
        },
    ];
    const svgFields: RmgFieldsField[] = [];
    const pngFields: RmgFieldsField[] = [
        {
            type: 'select',
            label: t('header.download.scale'),
            value: scale,
            options: scaleOptions,
            disabledOptions: disabledScaleOptions,
            onChange: value => setScale(value as number),
        },
        {
            type: 'switch',
            label: t('header.download.transparent'),
            isChecked: isTransparent,
            onChange: setIsTransparent,
        },
    ];
    const [isDownloadModalOpen, setIsDownloadModalOpen] = React.useState(false);
    const [isTermsAndConditionsModalOpen, setIsTermsAndConditionsModalOpen] = React.useState(false);
    const [isAttachSelected, setIsAttachSelected] = React.useState(false);
    const [isTermsAndConditionsSelected, setIsTermsAndConditionsSelected] = React.useState(false);

    const [isAudioModalOpen, setIsAudioModalOpen] = React.useState(false);

    // calculate the max canvas area the current browser can support
    React.useEffect(() => {
        const getMaxArea = async () => {
            const maximumArea = await canvasSize.maxArea({
                usePromise: true,
                useWorker: true,
            });
            setMaxArea(maximumArea);
        };
        getMaxArea();
    }, []);
    // disable some scale options that are too big for the current browser to generate
    React.useEffect(() => {
        if (isDownloadModalOpen) {
            const [width, height] = [(viewableColumns * D * scale) / 100, (FONT_HEIGHT * D * scale) / 100];
            const disabledScales = scales.filter(
                scale => (width * scale) / 100 > maxArea.width && (height * scale) / 100 > maxArea.height
            );
            setDisabledScaleOptions(disabledScales);
        }
    }, [isDownloadModalOpen]);

    const handleDownloadJson = () => {
        if (isAllowAppTelemetry)
            rmgRuntime.event(
                Events.DOWNLOAD_PARAM,
                isAllowProjectTelemetry ? { style, '#stations': Object.keys(metadata).length } : {}
            );
        downloadAs(`RMA_${new Date().valueOf()}.json`, 'application/json', JSON.stringify(project, null, 2));
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
    // thanks to this article that includes all steps to convert a svg to a png
    // https://levelup.gitconnected.com/draw-an-svg-to-canvas-and-download-it-as-image-in-javascript-f7f7713cf81f
    const handleDownload = () => {
        const elem = document.getElementById('crawl')!.cloneNode(true) as SVGSVGElement;
        const svgString = elem.outerHTML;
        // append to document to render the svg
        document.body.appendChild(elem);
        // convert it to an encoded string
        const src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
        // release after use
        document.body.removeChild(elem);
        elem.remove();

        // prepare a clean canvas to be drawn on
        const canvas = document.createElement('canvas');
        const [canvasWidth, canvasHeight] = [(viewableColumns * D * scale) / 100, (FONT_HEIGHT * D * scale) / 100];
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        // set background, with respect to dark mode
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        const img = new Image();
        img.onload = () => {
            setTimeout(() => {
                ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
                canvas.toBlob(blob => {
                    downloadBlobAs(`${content}.png`, blob!);
                    // downloadBlobAs(`RMA_${new Date().valueOf()}.png`, blob!);
                }, 'image/png');
            }, 0);
        };
        img.src = src; // draw src on canvas
    };

    return (
        <Menu id="download">
            <MenuButton as={IconButton} size="sm" variant="ghost" icon={<MdDownload />} />
            <MenuList>
                <MenuItem icon={<MdSave />} onClick={handleDownloadJson}>
                    {t('header.download.config')}
                </MenuItem>
                <MenuItem icon={<MdImage />} onClick={() => setIsDownloadModalOpen(true)}>
                    {t('header.download.image')}
                </MenuItem>
                <MenuItem icon={<MdOutlineAudiotrack />} onClick={() => setIsAudioModalOpen(true)}>
                    {t('header.download.audio')}
                </MenuItem>
            </MenuList>

            <Modal size="xl" isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{t('header.download.image')}</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <RmgFields fields={fields} />
                        {format === 'svg' && <RmgFields fields={svgFields} />}
                        {format === 'png' && <RmgFields fields={pngFields} />}
                        {format === 'png' && disabledScaleOptions.length > 0 && (
                            <>
                                <Text as="i" fontSize="sm">
                                    {t('header.download.disabledScaleOptions')}
                                </Text>
                                <br />
                                <Text as="i" fontSize="sm">
                                    {t('header.download.disabledScaleOptionsWorkarounds')}
                                </Text>
                                <Link
                                    color="teal.500"
                                    onClick={() => window.open('https://github.com/RazrFalcon/resvg', '_blank')}
                                >
                                    RazrFalcon/resvg <Icon as={MdOpenInNew} />
                                </Link>
                                <br />
                            </>
                        )}
                        <br />
                        <Checkbox isChecked={isAttachSelected} onChange={e => setIsAttachSelected(e.target.checked)}>
                            <Text>
                                {t('header.download.shareInfo1')}
                                <Link
                                    color="teal.500"
                                    onClick={() => window.open('https://railmapgen.github.io/rmp', '_blank')}
                                >
                                    {t('header.about.rmp')} <Icon as={MdOpenInNew} />
                                </Link>
                                {t('header.download.shareInfo2')}
                            </Text>
                        </Checkbox>
                        <Checkbox
                            isChecked={isTermsAndConditionsSelected}
                            onChange={e => setIsTermsAndConditionsSelected(e.target.checked)}
                        >
                            <Text>
                                {t('header.download.termsAndConditionsInfo')}
                                <Link color="teal.500" onClick={() => setIsTermsAndConditionsModalOpen(true)}>
                                    {t('header.download.termsAndConditions')} <Icon as={MdOpenInNew} />
                                </Link>
                                {t('header.download.period')}
                            </Text>
                        </Checkbox>
                    </ModalBody>

                    <ModalFooter>
                        <HStack>
                            <Button
                                colorScheme="teal"
                                variant="outline"
                                size="sm"
                                isDisabled={
                                    !isTermsAndConditionsSelected ||
                                    (format === 'png' && disabledScaleOptions.includes(scale))
                                }
                                onClick={handleDownload}
                            >
                                {t('header.download.confirm')}
                            </Button>
                        </HStack>
                    </ModalFooter>

                    <TermsAndConditionsModal
                        isOpen={isTermsAndConditionsModalOpen}
                        onClose={() => setIsTermsAndConditionsModalOpen(false)}
                    />
                </ModalContent>
            </Modal>

            <Modal size="xl" isOpen={isAudioModalOpen} onClose={() => setIsAudioModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{t('header.download.audio.title')}</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <Card direction={{ base: 'column', sm: 'row' }} overflow="hidden" variant="outline">
                            <Icon as={MdOutlineTextSnippet} boxSize={20} color="blue.500" ml="2.5" alignSelf="center" />
                            <Stack>
                                <CardBody>{t('header.download.audio.rawText')}</CardBody>
                                <CardFooter>
                                    <Button variant="solid" colorScheme="blue" onClick={handleDownloadText}>
                                        {t('header.download.audio.rawTextExport')}
                                    </Button>
                                </CardFooter>
                            </Stack>
                        </Card>
                        <Card direction={{ base: 'column', sm: 'row' }} overflow="hidden" variant="outline">
                            <Icon as={MdOutlineCloud} boxSize={20} color="blue.500" ml="2.5" alignSelf="center" />
                            <Stack>
                                <CardBody>{t('header.download.audio.server')}</CardBody>
                                <CardFooter>
                                    <Button variant="solid" colorScheme="blue" isDisabled>
                                        {t('header.download.audio.serverExport')}
                                    </Button>
                                </CardFooter>
                            </Stack>
                        </Card>
                    </ModalBody>

                    <ModalFooter />
                </ModalContent>
            </Modal>
        </Menu>
    );
}
