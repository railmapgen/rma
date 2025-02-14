import { Box, Card, CardBody, Divider, Flex, Text } from '@chakra-ui/react';
import { RmgPage, RmgThemeProvider, RmgWindow } from '@railmapgen/rmg-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleType } from '../constants/constants';
import { useRootDispatch, useRootSelector } from '../redux';
import StationAgGrid from './station/station-variants';
import Crawl from './crawl';
import CrawlSetting from './crawl-setting';

const PageHeader = React.lazy(() => import('./page-header/page-header'));
const SHMetroStageView = React.lazy(() => import('./panel/shmetro/stage'));

export default function AppRoot() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();
    const {
        project: { style },
    } = useRootSelector(state => state.param);

    return (
        <RmgThemeProvider>
            <RmgWindow>
                <PageHeader />
                <RmgPage>
                    <Flex flexDirection="row">
                        <Box style={{ width: '200px', height: 'calc(100vh - 40px)', overflowY: 'auto' }}>
                            <StationAgGrid />
                        </Box>
                        <Flex width="calc(100% - 200px)" flexDirection="column">
                            <CrawlSetting />
                            <Box style={{ overflow: 'scroll' }}>
                                <Crawl />
                            </Box>
                            <Divider marginTop="2" />
                            {style === StyleType.ShanghaiMetro && <SHMetroStageView />}
                            {/* <ScrollableColumn /> */}
                        </Flex>
                    </Flex>
                </RmgPage>
            </RmgWindow>
        </RmgThemeProvider>
    );
}

function ScrollableColumn() {
    return (
        <Flex
            direction="row"
            wrap="wrap"
            gap={4}
            width="1000px"
            height="500px" // 固定容器高度
            overflowY="auto" // 启用垂直滚动
            p={2} // 添加内边距
        >
            {[...Array(20)].map((_, i) => (
                <Card key={i} width="300px">
                    <CardBody>
                        卡片 {i + 1}
                        {Array.from({ length: i }).map((_, j) => (
                            <Text key={j}>{j}</Text>
                        ))}
                    </CardBody>
                </Card>
            ))}
        </Flex>
    );
}
