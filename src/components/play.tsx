import { IconButton } from '@chakra-ui/react';
import { logger } from '@railmapgen/rmg-runtime';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MdPause, MdPlayArrow, MdWarning } from 'react-icons/md';
import { voiceToPreview } from '../constants/constants';
import { phrasesToPinyin } from '../constants/phrases';
import { useRootDispatch, useRootSelector } from '../redux';
import { setGlobalAlert } from '../redux/runtime/runtime-slice';
import { useVoices } from '../util/hooks';
import { detectOS } from '../util/platform';

const os = detectOS();

export default function Play() {
    const { reconciledPhrases, currentStyle, currentStationID, currentStage, currentVoice } = useRootSelector(
        state => state.runtime
    );
    const {
        preference: { previewAudio },
    } = useRootSelector(state => state.app);
    const dispatch = useRootDispatch();
    const { t } = useTranslation();

    const [isPlaying, setIsPlaying] = React.useState(false);
    const [isPlayable, setIsPlayable] = React.useState(false);
    const allVoices = useVoices();

    React.useEffect(() => {
        const defaultLang = voiceToPreview[currentStyle]?.defaultLang?.[currentVoice];
        const voice = allVoices.find(voice => voice.lang === defaultLang);
        if (voice) setIsPlayable(true);
        else setIsPlayable(false);
    }, [currentVoice, allVoices]);

    const handlePlay = () => {
        // warn this a not an AI voice, just a preview one from the browser
        dispatch(
            setGlobalAlert({
                status: 'info',
                message: t('header.paly.previewWarning'),
            })
        );

        const synth = window.speechSynthesis;

        if (synth.paused && synth.speaking) {
            setIsPlaying(true);
            synth.resume();
            return;
        }

        const phrases = reconciledPhrases[currentStationID]?.[currentStage]?.[currentVoice];
        const text = phrasesToPinyin(phrases ?? []);
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

        logger.debug(`Previewing audio "${content}" with ${utterance.voice?.name}`);
        synth.speak(utterance);
    };

    const handlePause = () => {
        const synth = window.speechSynthesis;
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
