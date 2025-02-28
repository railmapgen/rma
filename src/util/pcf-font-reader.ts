/***************************************************************
 * PCF constants from the spec
 ***************************************************************/
const PCF_PROPERTIES = 1 << 0;
const PCF_ACCELERATORS = 1 << 1;
const PCF_METRICS = 1 << 2;
const PCF_BITMAPS = 1 << 3;
const PCF_INK_METRICS = 1 << 4;
const PCF_BDF_ENCODINGS = 1 << 5;
const PCF_SWIDTHS = 1 << 6;
const PCF_GLYPH_NAMES = 1 << 7;
const PCF_BDF_ACCELERATORS = 1 << 8;

/** For reading the 32-bit `format` flags: */
const PCF_GLYPH_PAD_MASK = 3; // (3 << 0)
const PCF_BYTE_MASK = 1 << 2; // (1 << 2)
const PCF_BIT_MASK = 1 << 3; // (1 << 3)
const PCF_SCAN_UNIT_MASK = 3 << 4; // (3 << 4)

/***************************************************************
 * Constants for rendering
 * These are specific to the font and can be adjusted as needed.
 * The PCF format does not store these values.
 * The values below are for the "WenQuanYi" font.
 * Max ascent is 16 pixels, max descent is 4 pixels.
 * The baseline is at 4 pixels from the bottom.
 * So the total height is 20 pixels.
 ***************************************************************/

const GLYPH_BASELINE = 4;

/***************************************************************
 * Helper: read integers from DataView with little-endian
 *         (the spec says "Always stored with LSB first")
 *         Mostly for reading the 32-bit `format` flags.
 ***************************************************************/
function readUint32LE(view: DataView, offset: number): number {
    return view.getUint32(offset, true);
}

/***************************************************************
 * Data structures
 ***************************************************************/
interface PCFTableOfContents {
    type: number;
    format: number;
    size: number;
    offset: number;
}

interface PCFMetric {
    leftSideBearing: number;
    rightSideBearing: number;
    characterWidth: number;
    ascent: number;
    descent: number;
    /* characterAttributes is only in uncompressed; we can ignore or store it if needed */
}

export interface PCFEncoding {
    minCharOrByte2: number;
    maxCharOrByte2: number;
    minByte1: number;
    maxByte1: number;
    defaultChar: number;
    glyphIndexes: Uint16Array; // or number[]
}

/***************************************************************
 * Main parsing function
 ***************************************************************/
export function parsePCF(data: ArrayBuffer) {
    const view = new DataView(data);
    const bytes = new Uint8Array(data);

    // 1) Check the PCF signature (header)
    //    The first 4 bytes should be 0x01 0x66 0x63 0x70 == "\1fcp"
    if (bytes[0] !== 0x01 || bytes[1] !== 0x66 || bytes[2] !== 0x63 || bytes[3] !== 0x70) {
        throw new Error('Not a valid PCF file (bad signature)');
    }

    // 2) Read the table count
    const tableCount = readUint32LE(view, 4);
    // console.log("Table count: ", tableCount);

    // 3) Read the table of contents
    let offset = 8;
    const tables: PCFTableOfContents[] = [];
    for (let i = 0; i < tableCount; i++) {
        const type = readUint32LE(view, offset + 0);
        const format = readUint32LE(view, offset + 4);
        const size = readUint32LE(view, offset + 8);
        const toff = readUint32LE(view, offset + 12);
        tables.push({ type, format, size, offset: toff });
        offset += 16;
    }

    // 4) Parse PCF_METRICS => metrics[]
    const metricsEntry = tables.find(t => t.type === PCF_METRICS);
    if (!metricsEntry) throw new Error('No PCF_METRICS in file');
    const metrics = parseMetrics(view, metricsEntry);

    // 5) Parse PCF_BITMAPS => allBitmaps
    const bitmapsEntry = tables.find(t => t.type === PCF_BITMAPS);
    if (!bitmapsEntry) throw new Error('No PCF_BITMAPS in file');
    const allBitmaps = parseBitmaps(view, bytes, bitmapsEntry, metrics);

    // 6) Parse PCF_BDF_ENCODINGS => encData
    const encEntry = tables.find(t => t.type === PCF_BDF_ENCODINGS);
    if (!encEntry) throw new Error('No PCF_BDF_ENCODINGS in file');
    const encData = parseBdfEncodings(view, encEntry);

    return { allBitmaps, encData };
}

export const getGlyph = (allBitmaps: boolean[][][], encData: PCFEncoding, character: string) => {
    // 7) Get glyphIndex for the requested `character`
    const glyphIndex = getGlyphIndexForChar(character, encData);
    if (glyphIndex == null) {
        console.warn(`No glyph found for character: '${character}'`);
        return null;
    }
    // console.log(`Glyph index for '${character}': ${glyphIndex}`);

    // 8) Return the 2D array of booleans for that glyph
    const glyphBitmap = allBitmaps[glyphIndex];
    return glyphBitmap;
};

/***************************************************************
 * parseMetrics: read the PCF_METRICS table
 ***************************************************************/
function parseMetrics(view: DataView, entry: PCFTableOfContents): PCFMetric[] {
    const base = entry.offset;

    // The first 4 bytes of the table is the "format" repeated
    // but recall that "format" is stored as LSB always, so read as LE
    const format = readUint32LE(view, base);

    // Compressed or uncompressed?
    const PCF_COMPRESSED_METRICS = 0x00000100;
    const isCompressed = (format & PCF_COMPRESSED_METRICS) !== 0;
    // console.log("Metrics format: ", format.toString(2), isCompressed ? "compressed" : "uncompressed");

    let offset = base + 4; // skip the format field
    let metricsCount: number;
    if (isCompressed) {
        // int16 metrics_count
        metricsCount = view.getInt16(offset);
        offset += 2;
    } else {
        // int32 metrics_count
        metricsCount = view.getInt32(offset);
        offset += 4;
    }

    const result: PCFMetric[] = [];
    for (let i = 0; i < metricsCount; i++) {
        let leftSideBearing: number;
        let rightSideBearing: number;
        let characterWidth: number;
        let ascent: number;
        let descent: number;

        if (isCompressed) {
            // Each is uint8 offset by 0x80
            const lsb = view.getUint8(offset + 0) - 0x80;
            const rsb = view.getUint8(offset + 1) - 0x80;
            const wid = view.getUint8(offset + 2) - 0x80;
            const asc = view.getUint8(offset + 3) - 0x80;
            const dsc = view.getUint8(offset + 4) - 0x80;

            leftSideBearing = lsb;
            rightSideBearing = rsb;
            characterWidth = wid;
            ascent = asc;
            descent = dsc;

            offset += 5;
        } else {
            // int16
            leftSideBearing = view.getInt16(offset + 0);
            rightSideBearing = view.getInt16(offset + 2);
            characterWidth = view.getInt16(offset + 4);
            ascent = view.getInt16(offset + 6);
            descent = view.getInt16(offset + 8);
            offset += 10; // plus 2 for the attribute => total 12, but let's keep it simple:
            // Actually the spec says there's a uint16 for characterAttributes
            // so let's skip that 2 bytes properly
            offset += 2;
        }

        result.push({
            leftSideBearing,
            rightSideBearing,
            characterWidth,
            ascent,
            descent,
        });
    }
    return result;
}

/***************************************************************
 * parseBitmaps: read the PCF_BITMAPS table
 * returns an array of glyph bitmaps as boolean[row][col].
 *
 * For simplicity, this function assumes:
 *  - (format & PCF_BIT_MASK) => bits are LSB first
 *  - (format & PCF_BYTE_MASK) => we are reading in little-endian
 *  - (format & PCF_GLYPH_PAD_MASK) === 0 => glyph row padded to byte boundaries
 ***************************************************************/
function parseBitmaps(
    view: DataView,
    bytes: Uint8Array,
    entry: PCFTableOfContents,
    metrics: PCFMetric[]
): boolean[][][] {
    const base = entry.offset;
    const format = readUint32LE(view, base); // repeated format
    // console.log("Bitmaps format: ", format.toString(2));
    let offset = base + 4;

    // The actual bitmap data begins at offset + 0 (the spec calls it "char bitmap_data[...]")
    // but we need to figure out which size is used:
    // (format & PCF_GLYPH_PAD_MASK) = which index in bitmapSizes is relevant
    const rowPadding = format & PCF_GLYPH_PAD_MASK; // 0..3
    // console.log("Bitmaps ", rowPadding === 0 ? "Bytes-aligned" : rowPadding === 1 ? "Shorts-aligned" : "Ints-aligned"); // Ints-aligned
    const rowBytes = (rowPadding === 0 ? 8 : rowPadding === 1 ? 16 : 32) / 8;
    const bitsPadding = (format >> 4) & PCF_GLYPH_PAD_MASK;
    // console.log("Bitmaps ", bitsPadding === 0 ? "Bytes-aligned" : rowPadding === 1 ? "Shorts-aligned" : "Ints-aligned"); // Bytes-aligned

    const byteOrderLSB = (format & PCF_BYTE_MASK) === 0;
    const bitOrderLSB = (format & PCF_BIT_MASK) === 0;
    // console.log("Bitmaps Byte order: ", byteOrderLSB ? "LSByte first" : "MSByte first");
    // console.log("Bitmaps Bit order: ", bitOrderLSB ? "LSBit first" : "MSBit first");

    const glyphCount = view.getInt32(offset);
    offset += 4;

    // Read offsets array
    const glyphOffsets: number[] = [];
    for (let i = 0; i < glyphCount; i++) {
        glyphOffsets.push(view.getInt32(offset));
        offset += 4;
    }

    // Next 4 "bitmapSizes"
    const bitmapSizes = [
        view.getInt32(offset + 0),
        view.getInt32(offset + 4),
        view.getInt32(offset + 8),
        view.getInt32(offset + 12),
    ];
    offset += 16;

    const bitmapBase = offset;
    const bitmapDataSize = bitmapSizes[rowPadding];
    // glyph bitmaps is up to bitmapBase + bitmapDataSize

    // Prepare output array
    const glyphBitmaps: boolean[][][] = new Array(glyphCount);

    for (let g = 0; g < glyphCount; g++) {
        const metric = metrics[g];
        const w = metric.rightSideBearing - metric.leftSideBearing; // glyph width
        const h = metric.ascent + metric.descent;

        const width = Math.max(metric.characterWidth, w);

        // if (g === 19) console.log(metric); // 1
        // if (g === 44) console.log(metric); // J
        // if (g === 121) console.log(metric); // ·
        // if (g === 1293) console.log(metric); // 。
        // if (g === 1364) console.log(metric); // ご
        // if (g === 8344) console.log(metric); // 乘

        const glyphOffset = glyphOffsets[g];

        const glyphDataStart = bitmapBase + glyphOffset;
        // Convert these bytes into a 2D boolean array
        const bitmap2d: boolean[][] = [];
        let bytePos = glyphDataStart;

        for (let row = 0; row < h; row++) {
            const rowBits: boolean[] = new Array(w).fill(false);
            for (let b = 0; b < rowBytes; b++) {
                const byteVal = bytes[bytePos + b];

                for (let bit = 0; bit < 8; bit++) {
                    const col = b * 8 + bit;
                    if (col < w) {
                        // If that bit is set, turn pixel on
                        if (bitOrderLSB) {
                            const mask = 1 << bit; // LSB first
                            rowBits[col] = (byteVal & mask) !== 0;
                        } else {
                            const mask = 1 << (7 - bit); // MSB first
                            rowBits[col] = (byteVal & mask) !== 0;
                        }
                    }
                }
            }

            // Pad the right if the glyph width is less than the visual width
            if (width > w) {
                rowBits.push(...new Array(width - w).fill(false));
            }

            bitmap2d.push(rowBits);
            bytePos += rowBytes;
        }

        // Pad the bottom if descent is not max descent 4.
        let padBottom = GLYPH_BASELINE;
        if (metric.descent !== 0) {
            padBottom = -metric.descent + GLYPH_BASELINE;
        }
        for (let i = 0; i < padBottom; i++) {
            const rowBits = new Array(width).fill(false);
            bitmap2d.push(rowBits);
        }

        glyphBitmaps[g] = bitmap2d;
    }

    return glyphBitmaps;
}

/***************************************************************
 * parseBdfEncodings: read the PCF_BDF_ENCODINGS table
 ***************************************************************/
function parseBdfEncodings(view: DataView, entry: PCFTableOfContents): PCFEncoding {
    const base = entry.offset;
    const format = readUint32LE(view, base);
    let offset = base + 4;

    const minCharOrByte2 = view.getInt16(offset);
    offset += 2;
    const maxCharOrByte2 = view.getInt16(offset);
    offset += 2;
    const minByte1 = view.getInt16(offset);
    offset += 2;
    const maxByte1 = view.getInt16(offset);
    offset += 2;
    const defaultChar = view.getInt16(offset);
    offset += 2;

    // size of glyphIndexes array
    const count = (maxCharOrByte2 - minCharOrByte2 + 1) * (maxByte1 - minByte1 + 1);

    const glyphIndexes = new Uint16Array(count);
    for (let i = 0; i < count; i++) {
        glyphIndexes[i] = view.getInt16(offset);
        offset += 2;
    }

    return {
        minCharOrByte2,
        maxCharOrByte2,
        minByte1,
        maxByte1,
        defaultChar,
        glyphIndexes,
    };
}

/**
 * Returns the glyph index for character `c`,
 * or null if the font does not have a glyph for that code.
 */
function getGlyphIndexForChar(
    c: string,
    encData: {
        minCharOrByte2: number;
        maxCharOrByte2: number;
        minByte1: number;
        maxByte1: number;
        glyphIndexes: Uint16Array;
    }
): number | null {
    // We'll handle just the *first* code point in `c`.
    // If `c` is "A" => codePoint=0x0041
    // If `c` is "你" => codePoint=0x4F60, etc.
    const codePoint = c.codePointAt(0);
    if (codePoint == null) {
        // empty string
        return null;
    }

    // Split into two bytes: enc1 is high byte, enc2 is low byte.
    // e.g. 0x4F60 => enc1=0x4F (79 decimal), enc2=0x60 (96 decimal)
    const enc1 = (codePoint >> 8) & 0xff; // high byte
    const enc2 = codePoint & 0xff; // low byte

    // 1) If the font is single-byte only => minByte1==0 && maxByte1==0.
    //    Then enc1 must be 0, and enc2 is the "char code".
    // 2) If it's multi-byte, check enc1 range as well.

    // Check ranges
    if (enc1 < encData.minByte1 || enc1 > encData.maxByte1) {
        return null; // out of range
    }
    if (enc2 < encData.minCharOrByte2 || enc2 > encData.maxCharOrByte2) {
        return null; // out of range
    }

    // Calculate offset
    const rowLength = encData.maxCharOrByte2 - encData.minCharOrByte2 + 1;
    const rowIndex = enc1 - encData.minByte1;
    const colIndex = enc2 - encData.minCharOrByte2;
    const arrayIndex = rowIndex * rowLength + colIndex;

    // Retrieve the glyph index from glyphIndexes[]
    const glyphIndex = encData.glyphIndexes[arrayIndex];

    // A value of 0xFFFF means "no glyph" per spec
    if (glyphIndex === 0xffff) {
        return null;
    }

    return glyphIndex;
}
