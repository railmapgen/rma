import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CrawlState {
    content: string;
    /**
     * Expected columns width
     */
    columns: number;
    /**
     * Actual columns width
     */
    realColumns: number;
    scale: number;
}

const initialState: CrawlState = {
    content: 'ご欢１迎1乘こじ。nihao',
    columns: 200,
    realColumns: 200,
    scale: 0.2,
};

const crawlSlice = createSlice({
    name: 'crawl',
    initialState,
    reducers: {
        setContent: (state, action: PayloadAction<string>) => {
            state.content = action.payload;
        },
        setColumns: (state, action: PayloadAction<number>) => {
            state.columns = action.payload;
        },
        setRealColumns: (state, action: PayloadAction<number>) => {
            state.realColumns = action.payload;
        },
        setScale: (state, action: PayloadAction<number>) => {
            state.scale = action.payload;
        },
    },
});

export const { setContent, setColumns, setRealColumns, setScale } = crawlSlice.actions;
export default crawlSlice.reducer;
