import { AlertStatus } from '@chakra-ui/react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReconciledPhrases, Stage, StyleType, VoiceName } from '../../constants/constants';
import { StnID } from '../../constants/rmg';

/**
 * RuntimeState contains all the data that do not require any persistence.
 * All of them can be initiated with default value.
 */
interface RuntimeState {
    reconciledPhrases: ReconciledPhrases;
    stationVariantsExpanded: boolean;
    showDefaultVariants: boolean;
    currentStyle: StyleType;
    currentStationID: StnID;
    currentStage: Stage;
    currentVoice: VoiceName;
    rmtToken?: string;
    showWelcome: boolean;
    globalAlerts: Partial<Record<AlertStatus, { message: string; url?: string; linkedApp?: string }>>;
}

const initialState: RuntimeState = {
    reconciledPhrases: {},
    stationVariantsExpanded: true,
    showDefaultVariants: false,
    currentStyle: StyleType.ShanghaiMetro,
    currentStationID: 'kaxg',
    currentStage: Stage.Departure,
    currentVoice: VoiceName.ChineseMandarinSimplified,
    showWelcome: false,
    globalAlerts: {},
};

const runtimeSlice = createSlice({
    name: 'runtime',
    initialState,
    reducers: {
        setReconciledPhrases: (state, action: PayloadAction<ReconciledPhrases>) => {
            state.reconciledPhrases = action.payload;
        },
        setStationVariantsExpanded: (state, action: PayloadAction<boolean>) => {
            state.stationVariantsExpanded = action.payload;
        },
        setShowDefaultVariants: (state, action: PayloadAction<boolean>) => {
            state.showDefaultVariants = action.payload;
        },
        setCurrentStationID: (state, action: PayloadAction<string>) => {
            state.currentStationID = action.payload;
        },
        setCurrentStage: (state, action: PayloadAction<Stage>) => {
            state.currentStage = action.payload;
        },
        setCurrentVoice: (state, action: PayloadAction<VoiceName>) => {
            state.currentVoice = action.payload;
        },
        setRmtToken: (state, action: PayloadAction<string>) => {
            state.rmtToken = action.payload;
        },
        removeRmtToken: state => {
            state.rmtToken = undefined;
        },
        setShowWelcome: (state, action: PayloadAction<boolean>) => {
            state.showWelcome = action.payload;
        },
        /**
         * If linkedApp is true, alert will try to open link in the current domain.
         * E.g. linkedApp=true, url='/rmp' will open https://railmapgen.github.io/rmp/
         * If you want to open a url outside the domain, DO NOT set or pass FALSE to linkedApp.
         */
        setGlobalAlert: (
            state,
            action: PayloadAction<{ status: AlertStatus; message: string; url?: string; linkedApp?: string }>
        ) => {
            const { status, message, url, linkedApp } = action.payload;
            state.globalAlerts[status] = { message, url, linkedApp };
        },
        closeGlobalAlert: (state, action: PayloadAction<AlertStatus>) => {
            delete state.globalAlerts[action.payload];
        },
    },
});

export const {
    setReconciledPhrases,
    setStationVariantsExpanded,
    setShowDefaultVariants,
    setCurrentStationID,
    setCurrentStage,
    setCurrentVoice,
    setRmtToken,
    removeRmtToken,
    setShowWelcome,
    setGlobalAlert,
    closeGlobalAlert,
} = runtimeSlice.actions;
export default runtimeSlice.reducer;
