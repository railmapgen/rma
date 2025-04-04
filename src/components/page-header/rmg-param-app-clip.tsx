import { SystemStyleObject } from '@chakra-ui/react';
import { RmgAppClip } from '@railmapgen/rmg-components';
import rmgRuntime, { logger } from '@railmapgen/rmg-runtime';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RMGParam } from '../../constants/rmg';
import { useRootDispatch } from '../../redux';
import { setRMGParam } from '../../redux/import/import-slice';
import { setGlobalAlert } from '../../redux/runtime/runtime-slice';

const CHANNEL_PREFIX = 'rmg-bridge--';

const styles: SystemStyleObject = {
    h: 500,
    maxH: '70%',

    '& iframe': {
        h: '100%',
        w: '100%',
    },
};

interface RmgAppClipProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RmgParamAppClip(props: RmgAppClipProps) {
    const { isOpen, onClose } = props;
    const { t } = useTranslation();

    const dispatch = useRootDispatch();

    const [appClipId] = useState(crypto.randomUUID());
    const frameUrl =
        '/rmg/#/import?' +
        new URLSearchParams({
            parentComponent: rmgRuntime.getAppName(),
            parentId: appClipId,
        });

    const handleImportRMGProject = (param: RMGParam) => {
        try {
            dispatch(setRMGParam(param));
        } catch (err) {
            dispatch(setGlobalAlert({ status: 'error', message: t('header.open.unknownError') }));
            console.error('OpenActions.handleUploadRMG():: Unknown error occurred while parsing the RMG project', err);
        } finally {
            onClose();
        }
    };

    useEffect(() => {
        const channel = new BroadcastChannel(CHANNEL_PREFIX + appClipId);
        channel.onmessage = ev => {
            const { event, data } = ev.data;
            logger.info('Received event from RMG app clip:', event);
            if (event === 'CLOSE') {
                onClose();
            } else if (event === 'IMPORT') {
                handleImportRMGProject(data as RMGParam);
            }
        };
        return () => channel.close();
    }, []);

    return (
        <RmgAppClip isOpen={isOpen} onClose={onClose} sx={styles}>
            <iframe src={frameUrl} loading="lazy" />
        </RmgAppClip>
    );
}
