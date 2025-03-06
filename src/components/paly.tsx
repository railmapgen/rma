import { IconButton } from '@chakra-ui/react';
import React from 'react';
import { MdPause, MdPlayArrow } from 'react-icons/md';
import { phrasesToText } from '../constants/phrases';
import { useRootSelector } from '../redux';

const synth = window.speechSynthesis;

export default function Play() {
    const { reconciledPhrases, currentStationID, currentStage, currentVoice } = useRootSelector(state => state.runtime);

    const [isPlaying, setIsPlaying] = React.useState(false);

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
            icon={isPlaying ? <MdPause /> : <MdPlayArrow />}
            onClick={isPlaying ? handlePause : handlePlay}
        />
    );
}
