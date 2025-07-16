import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const {
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX
} = FiIcons;

const AudioPlayer = ({ audioUrl, fileName, compact = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef(null);

  useEffect(() => {
    // Reset player when audio URL changes
    setIsPlaying(false);
    setCurrentTime(0);
    if (!audioUrl) return;

    // Set up audio event listeners
    const audio = audioRef.current;
    const setAudioData = () => { setDuration(audio.duration); };
    const setAudioTime = () => { setCurrentTime(audio.currentTime); };
    const setAudioEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    // Add event listeners
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', setAudioEnded);

    // Clean up event listeners
    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', setAudioEnded);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!audioUrl) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-gray-50 rounded-md p-1">
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
        <motion.button
          onClick={togglePlay}
          className="p-1 bg-[#954eda] text-white rounded-full flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          <SafeIcon icon={isPlaying ? FiPause : FiPlay} className="w-3 h-3" />
        </motion.button>
        <div className="flex-1">
          <input
            type="range"
            value={currentTime}
            min={0}
            max={duration || 100}
            step={0.01}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#954eda]"
            onChange={handleProgressChange}
          />
        </div>
        <span className="text-xs text-gray-500 min-w-[40px]">
          {formatTime(currentTime)}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-3 rounded-lg w-full">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Progress bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          value={currentTime}
          min={0}
          max={duration || 100}
          step={0.01}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#954eda]"
          onChange={handleProgressChange}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <motion.button
          onClick={togglePlay}
          className="p-2 bg-[#954eda] text-white rounded-full flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          <SafeIcon icon={isPlaying ? FiPause : FiPlay} className="w-5 h-5" />
        </motion.button>

        <div className="flex items-center gap-2">
          <motion.button
            onClick={toggleMute}
            className="p-1 text-gray-600 hover:text-[#954eda]"
            whileTap={{ scale: 0.9 }}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            <SafeIcon icon={isMuted ? FiVolumeX : FiVolume2} className="w-4 h-4" />
          </motion.button>
          <input
            type="range"
            value={volume}
            min={0}
            max={1}
            step={0.01}
            className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#954eda]"
            onChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;