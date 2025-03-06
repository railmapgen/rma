import { IconButton } from '@chakra-ui/react';
import { logger } from '@railmapgen/rmg-runtime';
import React from 'react';
import { MdPause, MdPlayArrow, MdWarning } from 'react-icons/md';
import { voiceToPreview } from '../constants/constants';
import { phrasesToText } from '../constants/phrases';
import { useRootSelector } from '../redux';
import { detectOS } from '../util/platform';

const synth = window.speechSynthesis;
const os = detectOS();

export default function Play() {
    const { reconciledPhrases, currentStyle, currentStationID, currentStage, currentVoice } = useRootSelector(
        state => state.runtime
    );
    const {
        preference: { previewAudio },
    } = useRootSelector(state => state.app);

    const [isPlaying, setIsPlaying] = React.useState(false);
    const [isPlayable, setIsPlayable] = React.useState(false);

    React.useEffect(() => {
        const defaultLang = voiceToPreview[currentStyle]?.defaultLang?.[currentVoice];
        const voice = synth.getVoices().find(voice => voice.lang === defaultLang);
        if (voice) setIsPlayable(true);
        else setIsPlayable(false);
    }, [currentVoice]);

    const handlePlay = () => {
        if (synth.paused && synth.speaking) {
            setIsPlaying(true);
            synth.resume();
            return;
        }

        const phrases = reconciledPhrases[currentStationID]?.[currentStage]?.[currentVoice];
        const text = phrasesToText(phrases ?? []);
        const content = text === '' ? ' ' : text;

        const utterance = new SpeechSynthesisUtterance(content);

        const voiceName =
            previewAudio[currentVoice] ?? voiceToPreview[currentStyle]?.preferredPreviewVoiceName?.[currentVoice]?.[os];
        const voice = synth.getVoices().find(voice => voice.name === voiceName);
        const lang = voiceToPreview[currentStyle]?.defaultLang?.[currentVoice];
        if (voice) {
            // set voice if explicitly specified or preferred by style
            utterance.voice = voice;
        } else if (lang) {
            // set lang as a fallback and let the browser choose the voice
            utterance.lang = lang;
        } else {
            logger.error('Preview language not found for', currentVoice);
            return;
        }

        utterance.onend = () => {
            setIsPlaying(false);
        };
        setIsPlaying(true);

        synth.speak(utterance);
    };

    const handlePause = () => {
        synth.pause();
        setIsPlaying(false);
    };

    return (
        <IconButton
            size="sm"
            variant="ghost"
            aria-label="Settings"
            icon={isPlayable ? isPlaying ? <MdPause /> : <MdPlayArrow /> : <MdWarning />}
            isDisabled={!isPlayable}
            onClick={isPlaying ? handlePause : handlePlay}
        />
    );
}
