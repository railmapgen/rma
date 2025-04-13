import { Box, Button, Divider, Flex } from '@chakra-ui/react';
import { RmgDebouncedInput, RmgPage, RmgThemeProvider, RmgWindow } from '@railmapgen/rmg-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { D, FONT_HEIGHT, StyleType } from '../constants/constants';
import { useRootDispatch, useRootSelector } from '../redux';
import { setContent } from '../redux/crawl/crawl-slice';
import { setShowWelcome, setStationVariantsExpanded } from '../redux/runtime/runtime-slice';
import { useWindowSize } from '../util/hooks';
import Crawl from './crawl';
import StationVariants from './station/station-variants';
import WelcomeModal from './welcome-modal';

const PageHeader = React.lazy(() => import('./page-header/page-header'));
const SHMetroStageView = React.lazy(() => import('./panel/shmetro/stage'));

export default function AppRoot() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();
    const {
        project: { style },
    } = useRootSelector(state => state.param);
    const { stationVariantsExpanded, showWelcome } = useRootSelector(state => state.runtime);
    const { content, scale } = useRootSelector(state => state.crawl);

    const size = useWindowSize();
    const { width = 1280, height = 720 } = size;

    const stationVariantsWidth = stationVariantsExpanded ? 200 : 0;

    const handleContentChange = (value: string) => {
        dispatch(setContent(value));
    };

    return (
        <RmgThemeProvider>
            <RmgWindow>
                <PageHeader />
                <RmgPage>
                    <Flex flexDirection="row">
                        {stationVariantsExpanded ? (
                            <Box
                                style={{
                                    width: '200px',
                                    height: 'calc(100vh - 40px)',
                                    overflowY: 'auto',
                                }}
                            >
                                <StationVariants />
                            </Box>
                        ) : (
                            <Button
                                onClick={() => dispatch(setStationVariantsExpanded(true))}
                                size="lg"
                                style={{ position: 'absolute', left: '0px', top: '0px' }}
                                borderRadius="0px"
                            >
                                {t('stationVariants.title')}
                            </Button>
                        )}
                        <Flex width={`calc(100% - ${stationVariantsWidth}px)`} flexDirection="column">
                            <Box style={{ overflowX: 'auto' }}>
                                <Crawl />
                            </Box>
                            <RmgDebouncedInput defaultValue={content} onDebouncedChange={handleContentChange} m="2" />
                            <Divider />
                            <Box style={{ height: height - 40 - FONT_HEIGHT * D * scale - 10, overflowY: 'auto' }}>
                                {style === StyleType.ShanghaiMetro && <SHMetroStageView />}
                            </Box>
                        </Flex>
                    </Flex>
                </RmgPage>
                <WelcomeModal isOpen={showWelcome} onClose={() => dispatch(setShowWelcome(false))} />
            </RmgWindow>
        </RmgThemeProvider>
    );
}
