import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../../common/SafeIcon';

const { FiCopy, FiDownload, FiSearch, FiX } = FiIcons;

const TranscriptionViewer = ({ transcript, fileName, metadata }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedText, setHighlightedText] = useState('');
  const transcriptRef = useRef(null);

  useEffect(() => {
    if (searchTerm && transcript) {
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      const highlighted = transcript.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
      setHighlightedText(highlighted);
    } else {
      setHighlightedText(transcript);
    }
  }, [searchTerm, transcript]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName || 'transcript'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (!transcript) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <SafeIcon icon={FiSearch} className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg mb-2">No transcript available</p>
          <p className="text-sm">Upload an audio or video file to get started</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="h-full flex flex-col bg-white"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Transcript</h2>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Copy transcript"
            >
              <SafeIcon icon={FiCopy} className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Download transcript"
            >
              <SafeIcon icon={FiDownload} className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* File metadata */}
        {metadata && (
          <div className="text-sm text-gray-600 mb-3">
            <p className="font-medium">{fileName}</p>
            <div className="flex gap-4 mt-1">
              {metadata.duration && <span>Duration: {metadata.duration}</span>}
              {metadata.fileSize && <span>Size: {metadata.fileSize}</span>}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <SafeIcon
            icon={FiSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
          />
          <input
            type="text"
            placeholder="Search in transcript..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <SafeIcon icon={FiX} className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Transcript content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div
          ref={transcriptRef}
          className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: highlightedText }}
        />
      </div>
    </motion.div>
  );
};

export default TranscriptionViewer;