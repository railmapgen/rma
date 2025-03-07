import { useState, useEffect } from 'react';

// Define general type for useWindowSize hook, which includes width and height
export interface Size {
    width: number | undefined;
    height: number | undefined;
}

export const useWindowSize = (): Size => {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState<Size>({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty array ensures that effect is only run on mount

    return windowSize;
};

/**
 * Find all available voices in the browser via the Web Speech API.
 */
export const useVoices = (): SpeechSynthesisVoice[] => {
    const [allVoices, setAllVoices] = useState<SpeechSynthesisVoice[]>([]);

    useEffect(() => {
        const synth = window.speechSynthesis;
        const updateVoices = () => {
            const voices = synth.getVoices();
            setAllVoices(voices);
        };

        // voices are loaded asynchronously on first load
        // so listen to this event and know all voices
        synth.addEventListener('voiceschanged', updateVoices);

        // after tab refresh, voices may be already loaded
        updateVoices();

        return () => {
            synth.removeEventListener('voiceschanged', updateVoices);
        };
    }, []);

    return allVoices;
};
