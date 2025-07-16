import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUpload, FiFile, FiX, FiCheck, FiLoader } = FiIcons;

const FileUpload = ({ onFileUpload, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    if (file && isValidFileType(file)) {
      setUploadedFile(file);
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files[0];
    if (file && isValidFileType(file)) {
      setUploadedFile(file);
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const isValidFileType = (file) => {
    const validTypes = ['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/webm', 'video/mp4', 'video/webm'];
    const validExtensions = ['.mp3', '.mp4', '.m4a', '.wav', '.webm'];
    return validTypes.includes(file.type) || validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  };

  const clearFile = () => {
    setUploadedFile(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}
          ${isLoading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          type="file"
          accept="audio/*,video/*,.mp3,.mp4,.m4a,.wav,.webm"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isLoading}
        />

        {isLoading ? (
          <div className="flex flex-col items-center">
            <SafeIcon icon={FiLoader} className="w-12 h-12 text-primary-500 animate-spin mb-4" />
            <p className="text-gray-600">กำลังประมวลผลไฟล์ของคุณ...</p>
          </div>
        ) : uploadedFile ? (
          <div className="flex flex-col items-center">
            <SafeIcon icon={FiCheck} className="w-12 h-12 text-green-500 mb-4" />
            <p className="text-gray-700 font-medium">{uploadedFile.name}</p>
            <p className="text-gray-500 text-sm">{formatFileSize(uploadedFile.size)}</p>
            <button
              onClick={clearFile}
              className="mt-2 text-red-500 hover:text-red-700 transition-colors"
            >
              <SafeIcon icon={FiX} className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <SafeIcon icon={FiUpload} className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">
              ลากและวางไฟล์เสียงหรือวิดีโอที่นี่
            </p>
            <p className="text-gray-500 text-sm">
              หรือคลิกเพื่อเลือกไฟล์
            </p>
            <p className="text-gray-400 text-xs mt-2">
              รองรับ MP3, MP4, M4A, WAV, WebM
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FileUpload;