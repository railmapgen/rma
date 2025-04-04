import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import { APIAudioTasks, AudioTask, AudioTaskStatus } from '../../constants/audio';
import { simplifyReconciledPhrases } from '../../constants/constants';
import { API_ENDPOINT, apiFetch } from '../../util/token';

interface AudioTaskState {
    isModalOpen: boolean;
    tasks: AudioTask[];
    points: number;
}

const initialState: AudioTaskState = {
    isModalOpen: false,
    tasks: [],
    points: 0,
};

export const fetchAudioTasks = createAsyncThunk<APIAudioTasks>(
    'audio/fetchTasks',
    async (_, { getState, rejectWithValue }) => {
        const { rmtToken: token } = (getState() as RootState).runtime;
        if (!token) return rejectWithValue('No token.');
        const rep = await apiFetch(API_ENDPOINT.AUDIOTASKS, {}, token);
        if (!rep) {
            return rejectWithValue('Can not recover from expired refresh token.');
        }
        if (rep.status !== 200) {
            return rejectWithValue(rep.text);
        }
        const apiAudioTasks = (await rep.json()) as APIAudioTasks;
        return apiAudioTasks;
    }
);

export const cancelTask = createAsyncThunk<void, number>(
    'audio/cancelTask',
    async (taskId: number, { getState, dispatch, rejectWithValue }) => {
        const { rmtToken: token } = (getState() as RootState).runtime;
        if (!token) return rejectWithValue('No token.');
        const rep = await apiFetch(
            `${API_ENDPOINT.AUDIOTASKS}/${taskId}`,
            {
                method: 'PATCH',
                body: JSON.stringify({ status: AudioTaskStatus.CANCELLED }),
            },
            token
        );
        if (!rep) {
            return rejectWithValue('Can not recover from expired refresh token.');
        }
        if (rep.status !== 200) {
            return rejectWithValue(rep.text);
        }
        dispatch(fetchAudioTasks());
    }
);

export const newTask = createAsyncThunk<void, void>(
    'audio/newTask',
    async (_, { getState, dispatch, rejectWithValue }) => {
        const { rmtToken: token, reconciledPhrases } = (getState() as RootState).runtime;
        if (!token) return rejectWithValue('No token.');
        const simplifiedPhrases = simplifyReconciledPhrases(reconciledPhrases);
        const rep = await apiFetch(
            API_ENDPOINT.AUDIOTASKS,
            {
                method: 'POST',
                body: JSON.stringify({ data: simplifiedPhrases }),
            },
            token
        );
        if (!rep) {
            return rejectWithValue('Can not recover from expired refresh token.');
        }
        if (rep.status !== 201) {
            return rejectWithValue(rep.text);
        }
        dispatch(fetchAudioTasks());
    }
);

export const redeem = createAsyncThunk<void, string>(
    'audio/redeem',
    async (cdkey, { getState, dispatch, rejectWithValue }) => {
        const { rmtToken: token } = (getState() as RootState).runtime;
        if (!token) return rejectWithValue('No token.');
        const rep = await apiFetch(
            API_ENDPOINT.SUBSCRIPTION_REDEEM,
            { method: 'POST', body: JSON.stringify({ cdkey }) },
            token
        );
        if (!rep) {
            return rejectWithValue('Can not recover from expired refresh token.');
        }
        if (rep.status !== 202) {
            return rejectWithValue(rep.text);
        }
        dispatch(fetchAudioTasks());
    }
);

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        openAudioModal: state => {
            state.isModalOpen = true;
        },
        closeAudioModal: state => {
            state.isModalOpen = false;
        },
    },
    extraReducers: builder => {
        builder.addCase(fetchAudioTasks.fulfilled, (state, action: PayloadAction<APIAudioTasks>) => {
            state.tasks = action.payload.tasks;
            state.points = action.payload.points;
        });
    },
});

export const { openAudioModal, closeAudioModal } = appSlice.actions;
export default appSlice.reducer;
