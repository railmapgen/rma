import {
    Box,
    IconButton,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react';
import { RmgLabel, RmgOutput, RmgThrottledSlider } from '@railmapgen/rmg-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineSettings } from 'react-icons/md';
import { phrasesToText } from '../constants/phrases';
import { useRootDispatch, useRootSelector } from '../redux';
import { setScale } from '../redux/crawl/crawl-slice';

export default function CrawlSetting() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();
    const { reconciledPhrases, currentStationID, currentStage, currentVoice } = useRootSelector(state => state.runtime);
    const { columns, scale } = useRootSelector(state => state.crawl);

    const phrases = reconciledPhrases[currentStationID]?.[currentStage]?.[currentVoice];
    const content = phrasesToText(phrases ?? []) ?? 'No content';

    const [isSettingOpen, setIsSettingOpen] = React.useState(false);

    return (
        <Box>
            <IconButton
                icon={<MdOutlineSettings />}
                aria-label={t('crawl.settings.title')}
                onClick={() => setIsSettingOpen(true)}
                style={{ position: 'absolute', right: '10px', top: '10px' }}
            />
            <Modal size="xl" isOpen={isSettingOpen} onClose={() => setIsSettingOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{t('crawl.settings.title')}</ModalHeader>
                    <ModalBody>
                        <RmgLabel label={t('crawl.settings.content')}>
                            <RmgOutput>{content}</RmgOutput>
                        </RmgLabel>
                        {/* <RmgLabel label="columns">
                            <RmgThrottledSlider
                                isReadOnly
                                defaultValue={columns}
                                value={columns}
                                min={100}
                                max={300}
                                step={1}
                                onThrottledChange={val => dispatch(setColumns(val))}
                            />
                        </RmgLabel> */}
                        <RmgLabel label={t('crawl.settings.scale')}>
                            <RmgThrottledSlider
                                defaultValue={scale}
                                value={scale}
                                min={0.1}
                                max={1}
                                step={0.1}
                                onThrottledChange={val => dispatch(setScale(val))}
                            />
                        </RmgLabel>
                    </ModalBody>
                    <ModalFooter></ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}
