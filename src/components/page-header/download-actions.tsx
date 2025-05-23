import {
    Button,
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
    Text,
} from '@chakra-ui/react';
import { RmgFields, RmgFieldsField } from '@railmapgen/rmg-components';
import rmgRuntime from '@railmapgen/rmg-runtime';
import canvasSize from 'canvas-size';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdDownload, MdImage, MdOpenInNew, MdOutlineAudiotrack, MdSave } from 'react-icons/md';
import { D, Events, FONT_HEIGHT } from '../../constants/constants';
import { useRootDispatch, useRootSelector } from '../../redux';
import { closeAudioModal, openAudioModal } from '../../redux/audio/audio-slice';
import { downloadAs, downloadBlobAs } from '../../util/download';
import AudioModal from './audio-modal';
import TermsAndConditionsModal from './terms-and-conditions';

export default function DownloadActions() {
    const {
        telemetry: { project: isAllowProjectTelemetry },
    } = useRootSelector(state => state.app);
    const dispatch = useRootDispatch();
    const { content, realColumns } = useRootSelector(state => state.crawl);
    const { project } = useRootSelector(state => state.param);
    const { isModalOpen: isAudioTaskModalOpen } = useRootSelector(state => state.audio);
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
    ];
    const [isDownloadModalOpen, setIsDownloadModalOpen] = React.useState(false);
    const [isTermsAndConditionsModalOpen, setIsTermsAndConditionsModalOpen] = React.useState(false);
    const [isTermsAndConditionsSelected, setIsTermsAndConditionsSelected] = React.useState(false);

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
            const [width, height] = [(realColumns * D * scale) / 100, (FONT_HEIGHT * D * scale) / 100];
            // TODO: more options should be disabled as the current method allows more than a browser could handle
            const disabledScales = scales.filter(
                scale => (width * scale) / 100 > maxArea.width || (height * scale) / 100 > maxArea.height
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
    // thanks to this article that includes all steps to convert a svg to a png
    // https://levelup.gitconnected.com/draw-an-svg-to-canvas-and-download-it-as-image-in-javascript-f7f7713cf81f
    const handleDownload = () => {
        const elem = document.getElementById('crawl')!.cloneNode(true) as SVGSVGElement;
        const svgString = elem.outerHTML;

        if (format === 'svg') {
            downloadAs(`RMP_${new Date().valueOf()}.svg`, 'image/svg+xml', svgString);
            return;
        }

        // append to document to render the svg
        document.body.appendChild(elem);
        // convert it to an encoded string
        const src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
        // release after use
        document.body.removeChild(elem);
        elem.remove();

        // prepare a clean canvas to be drawn on
        const canvas = document.createElement('canvas');
        const [canvasWidth, canvasHeight] = [(realColumns * D * scale) / 100, (FONT_HEIGHT * D * scale) / 100];
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
                    downloadBlobAs(`RMA_${content}.png`, blob!);
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
                <MenuItem icon={<MdOutlineAudiotrack />} onClick={() => dispatch(openAudioModal())}>
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
                        {/* <Checkbox isChecked={isAttachSelected} onChange={e => setIsAttachSelected(e.target.checked)}>
                            <Text>
                                {t('header.download.shareInfo1')}
                                <Link
                                    color="teal.500"
                                    onClick={() => window.open('https://railmapgen.github.io/rma', '_blank')}
                                >
                                    {t('header.about.rma')} <Icon as={MdOpenInNew} />
                                </Link>
                                {t('header.download.shareInfo2')}
                            </Text>
                        </Checkbox> */}
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

            <AudioModal isOpen={isAudioTaskModalOpen} onClose={() => dispatch(closeAudioModal())} />
        </Menu>
    );
}
