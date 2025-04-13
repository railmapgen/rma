import { logger } from '@railmapgen/rmg-runtime';
import React from 'react';
import { D, FONT_HEIGHT, R } from '../constants/constants';
import { useRootDispatch, useRootSelector } from '../redux';
import { setRealColumns } from '../redux/crawl/crawl-slice';
import { PCFEncoding, getGlyph, parsePCF } from '../util/pcf-font-reader';

const Crawl = () => {
    const dispatch = useRootDispatch();
    const { content, columns, realColumns, scale } = useRootSelector(state => state.crawl);

    const fontDataRef = React.useRef<ArrayBuffer | null>(null);
    const bitmapsRef = React.useRef<boolean[][][]>([]);
    const encDataRef = React.useRef<PCFEncoding | null>(null);

    const [bitmaps, setBitmaps] = React.useState<boolean[][][]>([]);
    const [characterColumns, setCharacterColumns] = React.useState<number[]>([]);

    const reconcileBitmaps = React.useCallback(() => {
        if (!bitmapsRef.current || !encDataRef.current || !content) return;

        logger.debug(`Reconciling bitmaps for "${content}"`);

        const bitmaps = [];
        const characterColumns = [];
        for (const character of content) {
            const bitmap = getGlyph(bitmapsRef.current, encDataRef.current, character);
            if (!bitmap) continue;
            if (bitmap.length < FONT_HEIGHT) {
                bitmap.unshift(
                    ...Array.from({ length: FONT_HEIGHT - bitmap.length }, () => Array(bitmap[0].length).fill(false))
                );
            }
            bitmaps.push(bitmap);
            characterColumns.push(bitmap[0].length);
            // console.log(character, bitmap[0].length, bitmap.length);
        }

        setBitmaps(bitmaps);
        setCharacterColumns(characterColumns);
        dispatch(setRealColumns(characterColumns.reduce((a, b) => a + b, 0)));
    }, [content]);
    React.useEffect(() => reconcileBitmaps(), [content]);

    React.useEffect(() => {
        const fetchLocalFile = async () => {
            const response = await fetch('fonts/wenquanyi_12pt.pcf');
            const arrayBuffer = await response.arrayBuffer();
            fontDataRef.current = arrayBuffer;

            const { allBitmaps, encData } = parsePCF(arrayBuffer);
            bitmapsRef.current = allBitmaps;
            encDataRef.current = encData;

            reconcileBitmaps();
        };

        fetchLocalFile();
    }, []);

    const remainingColumns = columns - realColumns && 0;
    const remainingLeftColumns = Math.floor(remainingColumns / 2);
    const remainingRightColumns = remainingColumns - remainingLeftColumns;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            id="crawl"
            style={{ backgroundColor: 'black' }}
            viewBox={`0 0 ${realColumns * D} ${FONT_HEIGHT * D}`}
            width={realColumns * D * scale}
            height={FONT_HEIGHT * D * scale}
        >
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <filter id="neon" x="-50%" y="-50%" width="200%" height="200%">
                    {/* <!-- First pass: a bright, tight glow --> */}
                    <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor={LED_HEX} floodOpacity="1" />
                    {/* <!-- Second pass: a softer, bigger glow --> */}
                    <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor={LED_HEX} floodOpacity="0.7" />
                    {/* <!-- Third pass: even bigger, lighter glow --> */}
                    <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor={LED_HEX} floodOpacity="0.4" />
                </filter>
                <filter id="orange-glow" filterUnits="userSpaceOnUse" x="-50%" y="-50%" width="200%" height="200%">
                    {/* <!-- blur the text at different levels--> */}
                    <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur5" />
                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur10" />
                    <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur20" />
                    <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur30" />
                    <feGaussianBlur in="SourceGraphic" stdDeviation="50" result="blur50" />
                    {/* <!-- merge all the blurs except for the first one --> */}
                    <feMerge result="blur-merged">
                        <feMergeNode in="blur10" />
                        <feMergeNode in="blur20" />
                        <feMergeNode in="blur30" />
                        <feMergeNode in="blur50" />
                    </feMerge>
                    {/* <!-- recolour the merged blurs orange--> */}
                    <feColorMatrix
                        result="red-blur"
                        in="blur-merged"
                        type="matrix"
                        values="1 0 0 0 0
                                0 0.65 0 0 0
                                0 0 0.1 0 0
                                0 0 0 1 0"
                    />
                    <feMerge>
                        <feMergeNode in="red-blur" /> {/* <!-- largest blurs coloured orange --> */}
                        <feMergeNode in="blur5" /> {/* <!-- smallest blur left white --> */}
                        <feMergeNode in="SourceGraphic" /> {/* <!-- original white text --> */}
                    </feMerge>
                </filter>
            </defs>
            {remainingColumns > 0 && (
                <g id="remaining-left">
                    {Array(remainingLeftColumns)
                        .fill(0)
                        .map((_, i) =>
                            Array(FONT_HEIGHT)
                                .fill(0)
                                .map((_, j) => <LED key={`rl${i}${j}`} x={i * D + R} y={j * D + R} />)
                        )}
                </g>
            )}
            {bitmaps.map((bitmap, i) => (
                <g key={`${content.at(i)}+${i}}`} id={content.at(i)}>
                    {bitmap.map((row, y) =>
                        row.map((on, x) => (
                            <LED
                                key={content.at(i) + x.toString() + y.toString()}
                                x={
                                    x * D +
                                    characterColumns.slice(0, i).reduce((a, b) => a + b, 0) * D +
                                    R +
                                    (remainingColumns > 0 ? remainingLeftColumns * D : 0)
                                }
                                y={y * D + R}
                                on={on}
                            />
                        ))
                    )}
                </g>
            ))}
            {remainingColumns > 0 && (
                <g id="remaining-right">
                    {Array(remainingRightColumns)
                        .fill(0)
                        .map((_, i) =>
                            Array(FONT_HEIGHT)
                                .fill(0)
                                .map((_, j) => (
                                    <LED
                                        key={`rr${i}${j}`}
                                        x={(remainingLeftColumns + realColumns + i) * D + R}
                                        y={j * D + R}
                                    />
                                ))
                        )}
                </g>
            )}
        </svg>
    );
};

const LED_R = R - 2;
const LED_HEX = 'orange';

const LED = ({ x, y, on = false }: { x: number; y: number; on?: boolean }) => (
    <circle cx={x} cy={y} r={LED_R} fill={on ? LED_HEX : 'dimgray'} filter={on ? 'url(#neon)' : undefined} />
);

export default Crawl;
