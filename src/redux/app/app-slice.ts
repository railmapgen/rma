import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Services } from '../../constants/rmg';

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
    preference: {
        import: {
            route: number;
            service: Services;
        };
    };
}

const initialState: AppState = {
    telemetry: {
        app: true,
        project: true,
    },
    preference: {
        import: {
            route: 0,
            service: Services.local,
        },
    },
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setTelemetryProject: (state, action: PayloadAction<boolean>) => {
            state.telemetry.project = action.payload;
        },
        setPreferenceImport: (state, action: PayloadAction<AppState['preference']['import']>) => {
            state.preference.import = action.payload;
        },
    },
});

export const { setTelemetryProject, setPreferenceImport } = appSlice.actions;
export default appSlice.reducer;
