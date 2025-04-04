import { IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useReadyConfig } from '@railmapgen/rmg-components';
import rmgRuntime, { logger, RmgEnv } from '@railmapgen/rmg-runtime';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdInsertDriveFile, MdUpload } from 'react-icons/md';
import { Project, Stage } from '../../constants/constants';
import { useRootDispatch, useRootSelector } from '../../redux';
import { setRMGParam } from '../../redux/import/import-slice';
import { setProject } from '../../redux/param/param-slice';
import { setCurrentStage, setCurrentStationID, setGlobalAlert } from '../../redux/runtime/runtime-slice';
import RmgParamAppClip from './rmg-param-app-clip';

export default function OpenActions() {
    const dispatch = useRootDispatch();
    const { t } = useTranslation();
    const {
        preference: {
            import: { route, service },
        },
    } = useRootSelector(state => state.app);

    const environment = useReadyConfig(rmgRuntime.getEnv);

    const fileInputRef = React.useRef<HTMLInputElement | null>(null);
    const fileRMGInputRef = React.useRef<HTMLInputElement | null>(null);

    const [isRmgParamAppClipOpen, setIsRmgParamAppClipOpen] = React.useState(false);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        logger.info('OpenActions.handleUpload():: received file', file);

        if (file?.type !== 'application/json') {
            dispatch(setGlobalAlert({ status: 'error', message: t('header.open.invalidType') }));
            logger.error('OpenActions.handleUpload():: Invalid file type! Only file in JSON format is accepted.');
        } else {
            try {
                const projectStr = await readFileAsText(file);
                const project = JSON.parse(projectStr) as Project;
                if (!('baseVariants' in project)) {
                    dispatch(setGlobalAlert({ status: 'error', message: t('header.open.invalidType') }));
                    logger.error('OpenActions.handleUpload():: Not a valid RMA project.');
                    event.target.value = '';
                    return;
                }
                dispatch(setProject(project));
                dispatch(setCurrentStationID(Object.keys(project['metadata'])[0]));
                dispatch(setCurrentStage(Stage.Departure));
            } catch (err) {
                dispatch(setGlobalAlert({ status: 'error', message: t('header.open.unknownError') }));
                logger.error(
                    'OpenActions.handleUpload():: Unknown error occurred while parsing the uploaded file',
                    err
                );
            }
        }

        // clear field for next upload
        event.target.value = '';
    };

    const handleImportRMGProject = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        logger.info('OpenActions.handleUpload():: received file', file);

        if (file?.type !== 'application/json') {
            dispatch(setGlobalAlert({ status: 'error', message: t('header.open.invalidType') }));
            logger.error('OpenActions.handleUpload():: Invalid file type! Only file in JSON format is accepted.');
        } else {
            try {
                const paramStr = await readFileAsText(file);
                dispatch(setRMGParam(JSON.parse(paramStr)));
            } catch (err) {
                dispatch(setGlobalAlert({ status: 'error', message: t('header.open.unknownError') }));
                logger.error(
                    'OpenActions.handleUpload():: Unknown error occurred while parsing the uploaded file',
                    err
                );
            }
        }

        // clear field for next upload
        event.target.value = '';
    };

    return (
        <Menu>
            <MenuButton as={IconButton} size="sm" variant="ghost" icon={<MdUpload />} />
            <MenuList>
                <input
                    id="upload_project"
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    hidden={true}
                    onChange={handleUpload}
                    data-testid="file-upload"
                />
                <MenuItem icon={<MdUpload />} onClick={() => fileInputRef?.current?.click()}>
                    {t('header.open.config')}
                </MenuItem>

                <input
                    id="upload_RMG"
                    ref={fileRMGInputRef}
                    type="file"
                    accept=".json"
                    hidden={true}
                    onChange={handleImportRMGProject}
                    data-testid="file-upload"
                />
                {environment === RmgEnv.DEV && (
                    <MenuItem icon={<MdUpload />} onClick={() => fileRMGInputRef?.current?.click()}>
                        {t('header.open.RMG')}
                    </MenuItem>
                )}

                <MenuItem icon={<MdInsertDriveFile />} onClick={() => setIsRmgParamAppClipOpen(true)}>
                    {t('header.open.projectRMG')}
                </MenuItem>
            </MenuList>

            <RmgParamAppClip isOpen={isRmgParamAppClipOpen} onClose={() => setIsRmgParamAppClipOpen(false)} />
        </Menu>
    );
}

const readFileAsText = (file: File) => {
    return new Promise((resolve: (text: string) => void) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsText(file);
    });
};
