import rmgRuntime, { logger } from '@railmapgen/rmg-runtime';
import { LocalStorageKey, Stage } from '../constants/constants';
import defaultProject from '../constants/default-project.json';
import { reconcile } from '../util/reconcile';
import { RootStore, startRootListening } from './index';
import { setPreferenceImport, setTelemetryProject } from './app/app-slice';
import { ParamState, setProject } from './param/param-slice';
import { setCurrentStage, setCurrentStationID, setReconciledPhrases } from './runtime/runtime-slice';

export default function initStore(store: RootStore) {
    // Reconcile phrases when project changes
    startRootListening({
        predicate: (_action, currentState, previousState) => {
            return JSON.stringify(currentState.param.project) !== JSON.stringify(previousState.param.project);
        },
        effect: (_action, listenerApi) => {
            const { project } = listenerApi.getState().param;
            // TODO: there is a lot of overhead here,
            // better reconcile specific stnid-stage-voice in param/setVariant
            const reconciledPhrases = reconcile(project);
            logger.debug(reconciledPhrases);
            listenerApi.dispatch(setReconciledPhrases(reconciledPhrases));

            const param = listenerApi.getState().param;
            rmgRuntime.storage.set(LocalStorageKey.PARAM, JSON.stringify(param));
        },
    });

    startRootListening({
        predicate: (_action, currentState, previousState) => {
            return JSON.stringify(currentState.app) !== JSON.stringify(previousState.app);
        },
        effect: (_action, listenerApi) => {
            const app = listenerApi.getState().app;
            rmgRuntime.storage.set(LocalStorageKey.APP, JSON.stringify(app));
        },
    });

    initAppStore(store);
    initParamStore(store);
}

const initAppStore = (store: RootStore) => {
    const appString = rmgRuntime.storage.get(LocalStorageKey.APP);
    if (appString) {
        const app = JSON.parse(appString);

        if ('telemetry' in app) {
            if ('project' in app.telemetry) store.dispatch(setTelemetryProject(app.telemetry.project));
        }
        if ('preference' in app) {
            if ('import' in app.preference) {
                store.dispatch(setPreferenceImport(app.preference.import));
            }
        }
    }
};

const initParamStore = (store: RootStore) => {
    const paramString = rmgRuntime.storage.get(LocalStorageKey.PARAM);

    if (paramString) {
        const param = JSON.parse(paramString) as ParamState;
        logger.debug(`Get param from local storage: ${paramString}`);
        store.dispatch(setProject(param.project));
        store.dispatch(setCurrentStationID(Object.keys(param.project['metadata'])[0]));
        store.dispatch(setCurrentStage(Stage.Departure));
    } else {
        logger.warn('No param from local storage. Setting to default.');
        store.dispatch(setProject(defaultProject as ParamState['project']));
    }
};
