import { Heading, IconButton, Menu, MenuButton, MenuItem, MenuList, Wrap, WrapItem } from '@chakra-ui/react';
import { RmgEnvBadge, RmgWindowHeader, useReadyConfig } from '@railmapgen/rmg-components';
import rmgRuntime, { RmgEnv } from '@railmapgen/rmg-runtime';
import { LANGUAGE_NAMES, LanguageCode } from '@railmapgen/rmg-translate';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { MdHelp, MdSettings, MdTranslate } from 'react-icons/md';
import { Events } from '../../constants/constants';
import { useRootDispatch } from '../../redux';
import AboutModal from './about-modal';
import DownloadActions from './download-actions';
import OpenActions from './open-actions';
import SettingsModal from './settings-modal';

export default function WindowHeader() {
    const { t } = useTranslation();
    const dispatch = useRootDispatch();
    const isAllowAppTelemetry = rmgRuntime.isAllowAnalytics();

    const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false);
    const [isAboutModalOpen, setIsAboutModalOpen] = React.useState(false);

    const environment = useReadyConfig(rmgRuntime.getEnv);
    const appVersion = useReadyConfig(rmgRuntime.getAppVersion);

    React.useEffect(() => {
        // environment !== RmgEnv.DEV -> wait after rmgRuntime.ready() in useReadyConfig
        if (isAllowAppTelemetry && environment !== RmgEnv.DEV)
            rmgRuntime.event(Events.APP_LOAD, { isStandaloneWindow: rmgRuntime.isStandaloneWindow() });
    }, [environment]);

    const handleChangeLanguage = (language: LanguageCode) => {
        rmgRuntime.getI18nInstance().changeLanguage(language);
    };

    return (
        <RmgWindowHeader>
            <Heading as="h4" size="md" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                {t('header.about.rma')}
            </Heading>
            <RmgEnvBadge
                environment={environment}
                version={appVersion}
                popoverHeader={
                    environment === RmgEnv.PRD ? undefined : (
                        <Trans i18nKey="header.popoverHeader" environment={environment}>
                            You&apos;re on {{ environment }} environment!
                        </Trans>
                    )
                }
                popoverBody={
                    environment === RmgEnv.PRD ? undefined : (
                        <Trans i18nKey="header.popoverBody">
                            This is a testing environment where we test the latest beta RMP.
                        </Trans>
                    )
                }
            />

            <Wrap ml="auto">
                <WrapItem>
                    <OpenActions />
                </WrapItem>

                <WrapItem>
                    <DownloadActions />
                </WrapItem>

                <WrapItem>
                    <IconButton
                        size="sm"
                        variant="ghost"
                        aria-label="Settings"
                        icon={<MdSettings />}
                        onClick={() => setIsSettingsModalOpen(true)}
                    />
                </WrapItem>

                {rmgRuntime.isStandaloneWindow() && (
                    <WrapItem>
                        <Menu>
                            <MenuButton as={IconButton} icon={<MdTranslate />} variant="ghost" size="sm" />
                            <MenuList>
                                {(['en', 'zh-Hans', 'zh-Hant', 'ja', 'ko'] as LanguageCode[]).map(lang => (
                                    <MenuItem key={lang} onClick={() => handleChangeLanguage(lang)}>
                                        {LANGUAGE_NAMES[lang][lang]}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
                    </WrapItem>
                )}

                <WrapItem>
                    <IconButton
                        size="sm"
                        variant="ghost"
                        aria-label="Help"
                        icon={<MdHelp />}
                        onClick={() => setIsAboutModalOpen(true)}
                    />
                </WrapItem>
            </Wrap>

            <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
            <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
        </RmgWindowHeader>
    );
}
