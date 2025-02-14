import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
    telemetry: {
        /**
         * App level telemetry such as app load and import/export works/images.
         *
         * WARNING! Use rmgRuntime.isAllowAnalytics() instead.
         * This is not read or write currently, but kept in the localstorage due to previous versions.
         */
        app: boolean;
        /**
         * Project level telemetry such as stations'/lines' addition and their count.
         */
        project: boolean;
    };
}

const initialState: AppState = {
    telemetry: {
        app: true,
        project: true,
    },
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setTelemetryApp: (state, action: PayloadAction<boolean>) => {
            state.telemetry.app = action.payload;
        },
        setTelemetryProject: (state, action: PayloadAction<boolean>) => {
            state.telemetry.project = action.payload;
        },
    },
});

export const { setTelemetryApp, setTelemetryProject } = appSlice.actions;
export default appSlice.reducer;
