import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMic, FiMicOff, FiLoader } = FiIcons;

const SUPPORTED_LANGUAGES = [
  { code: 'th-TH', name: 'ไทย' },
  { code: 'en-US', name: 'English' },
  { code: 'zh-CN', name: '中文' },
  { code: 'ja-JP', name: '日本語' },
];

const VoiceInput = ({ onVoiceInput }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('th-TH');
  const [error, setError] = useState(null);
  const [showLanguageSelect, setShowLanguageSelect] = useState(true);

  useEffect(() => {
    initializeSpeechRecognition();
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [selectedLanguage]);

  const initializeSpeechRecognition = () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = selectedLanguage;
        
        recognition.onstart = () => {
          setIsRecording(true);
          setError(null);
          setShowLanguageSelect(false);
        };
        
        recognition.onend = () => {
          setIsRecording(false);
          setIsProcessing(false);
          setShowLanguageSelect(true);
        };
        
        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          
          if (event.results[0].isFinal) {
            onVoiceInput(transcript);
          }
        };
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setError(event.error);
          setIsRecording(false);
          setIsProcessing(false);
          setShowLanguageSelect(true);
        };
        
        setRecognition(recognition);
      }
    } catch (error) {
      console.error('Speech recognition initialization error:', error);
      setError('Speech recognition not supported');
    }
  };

  const handleVoiceToggle = async () => {
    if (isRecording) {
      recognition?.stop();
    } else {
      setIsProcessing(true);
      setError(null);
      try {
        await recognition?.start();
      } catch (error) {
        console.error('Error starting voice input:', error);
        setError('Failed to start recording');
        setIsProcessing(false);
      }
    }
  };

  const getButtonStyle = () => {
    if (isProcessing) return 'bg-yellow-100 text-yellow-600 border-yellow-300';
    if (isRecording) return 'bg-red-100 text-red-600 border-red-300 animate-pulse';
    if (error) return 'bg-red-100 text-red-600 border-red-300';
    return 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200';
  };

  return (
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
      {showLanguageSelect && (
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="text-sm border rounded-md py-1 px-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#954eda] focus:border-transparent"
          disabled={isRecording}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      )}
      
      <motion.button
        onClick={handleVoiceToggle}
        disabled={isProcessing && !isRecording}
        className={`
          p-2 rounded-full border-2 transition-all duration-200
          ${getButtonStyle()}
          ${error ? 'shake-animation' : ''}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={isRecording ? 'หยุดการบันทึก' : 'เริ่มการบันทึกเสียง'}
      >
        {isProcessing && !isRecording ? (
          <SafeIcon icon={FiLoader} className="w-4 h-4 animate-spin" />
        ) : isRecording ? (
          <SafeIcon icon={FiMicOff} className="w-4 h-4" />
        ) : (
          <SafeIcon icon={FiMic} className="w-4 h-4" />
        )}
      </motion.button>
      
      {error && (
        <div className="absolute top-full right-0 mt-1 text-xs text-red-500 whitespace-nowrap bg-white p-1 rounded shadow-sm">
          {error === 'not-allowed' ? 'โปรดอนุญาตการใช้ไมโครโฟน' : 'เกิดข้อผิดพลาด โปรดลองใหม่'}
        </div>
      )}
    </div>
  );
};

export default VoiceInput;