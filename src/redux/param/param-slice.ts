import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { emptyProject, Project, Stage, VoiceName } from '../../constants/constants';
import { StnID } from '../../constants/rmg';

/**
 * ParamState contains all the data that a save has, except for the `version` key.
 * Should be persisted and updated as soon as possible when there is a change in the project.
 */
export interface ParamState {
    project: Project;
}

const initialState: ParamState = {
    project: emptyProject,
};

const paramSlice = createSlice({
    name: 'param',
    initialState,
    reducers: {
        setProject: (state, action: PayloadAction<Project>) => {
            state.project = action.payload;
        },
        setVariant: (
            state,
            action: PayloadAction<{ stnID: StnID; stage: Stage; voiceName: VoiceName; variant: string; value: any }>
        ) => {
            const { stnID, stage, voiceName, variant, value } = action.payload;
            if (!state.project.stations[stnID]?.[stage]?.[voiceName]) {
                // make project should set {} even if no variant is set
                return;
            }
            state.project.stations[stnID][stage][voiceName][variant] = value;
        },
        setBaseVariant: (
            state,
            action: PayloadAction<{ stage: Stage; voiceName: VoiceName; variant: string; value: any }>
        ) => {
            const { stage, voiceName, variant, value } = action.payload;
            if (!state.project.baseVariants[stage]?.[voiceName]) {
                return;
            }
            state.project.baseVariants[stage][voiceName][variant] = value;
        },
    },
});

export const { setProject, setVariant, setBaseVariant } = paramSlice.actions;
export default paramSlice.reducer;
