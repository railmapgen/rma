import { Box, Button, Divider, Flex } from '@chakra-ui/react';
import { RmgPage, RmgThemeProvider, RmgWindow } from '@railmapgen/rmg-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { D, FONT_HEIGHT, StyleType } from '../constants/constants';
import { useRootDispatch, useRootSelector } from '../redux';
import { setStationVariantsExpanded } from '../redux/runtime/runtime-slice';
import { useWindowSize } from '../util/hooks';
import Crawl from './crawl';
import StationAgGrid from './station/station-variants';

const PageHeader = React.lazy(() => import('./page-header/page-header'));
const SHMetroStageView = React.lazy(() => import('./panel/shmetro/stage'));

export default function AppRoot() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();
    const {
        project: { style },
    } = useRootSelector(state => state.param);
    const { stationVariantsExpanded } = useRootSelector(state => state.runtime);
    const { scale } = useRootSelector(state => state.crawl);

    const size = useWindowSize();
    const { width = 1280, height = 720 } = size;

    const stationVariantsWidth = stationVariantsExpanded ? 200 : 0;

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
                                <StationAgGrid />
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
                            <Divider marginTop="2" />
                            <Box style={{ height: height - 40 - FONT_HEIGHT * D * scale - 10, overflowY: 'auto' }}>
                                {style === StyleType.ShanghaiMetro && <SHMetroStageView />}
                            </Box>
                        </Flex>
                    </Flex>
                </RmgPage>
            </RmgWindow>
        </RmgThemeProvider>
    );
}
