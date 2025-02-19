import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import { AudioTask, AudioTaskStatus } from '../../constants/audio';
import { simplifyReconciledPhrases } from '../../constants/constants';
import { API_ENDPOINT, apiFetch } from '../../util/token';

interface AudioTaskState {
    isModalOpen: boolean;
    tasks: AudioTask[];
}

const initialState: AudioTaskState = {
    isModalOpen: false,
    tasks: [],
};

interface APIAudioTasks {
    page: number;
    limit: number;
    tasks: AudioTask[];
}

export const fetchAudioTasks = createAsyncThunk<AudioTask[]>(
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
        apiAudioTasks.tasks.forEach(t => {
            t.createdAt = new Date(t.createdAt).getTime();
            t.updatedAt = new Date(t.updatedAt).getTime();
        });
        return apiAudioTasks.tasks;
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
        builder.addCase(fetchAudioTasks.fulfilled, (state, action: PayloadAction<AudioTask[]>) => {
            state.tasks = action.payload;
        });
    },
});

export const { openAudioModal, closeAudioModal } = appSlice.actions;
export default appSlice.reducer;
