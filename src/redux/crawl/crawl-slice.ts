import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CrawlState {
    content: string;
    /**
     * Aka "valid columns width"
     * Valid means either with glyph or dim gray LED.
     */
    columns: number;
    /**
     * Aka "svg viewport width"
     */
    viewableColumns: number;
    scale: number;
}

const initialState: CrawlState = {
    content: 'ご欢１迎1乘こじ。nihao',
    columns: 207,
    viewableColumns: 200,
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
        setViewableColumns: (state, action: PayloadAction<number>) => {
            state.viewableColumns = action.payload;
        },
        setScale: (state, action: PayloadAction<number>) => {
            state.scale = action.payload;
        },
    },
});

export const { setContent, setColumns, setViewableColumns, setScale } = crawlSlice.actions;
export default crawlSlice.reducer;
