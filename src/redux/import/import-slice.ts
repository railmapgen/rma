import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RMGParam, Services } from '../../constants/rmg';

/**
 * ImportWizardState contains how to import rmg data.
 */
interface ImportWizardState {
    /**
     * Non-empty means there is a on-going import process.
     */
    rmgParam?: RMGParam;
    /**
     * Preferred route index to make the project.
     */
    route: number;
    /**
     * Preferred services to make the project.
     */
    service: Services;
}

const initialState: ImportWizardState = {
    rmgParam: undefined,
    route: 0,
    service: Services.local,
};

const importSlice = createSlice({
    name: 'runtime',
    initialState,
    reducers: {
        setRMGParam: (state, action: PayloadAction<RMGParam>) => {
            state.rmgParam = action.payload;
        },
        removeRMGParam: state => {
            state.rmgParam = undefined;
        },
        setRoute: (state, action: PayloadAction<number>) => {
            state.route = action.payload;
        },
        setService: (state, action: PayloadAction<Services>) => {
            state.service = action.payload;
        },
    },
});

export const { setRMGParam, removeRMGParam, setRoute, setService } = importSlice.actions;
export default importSlice.reducer;
