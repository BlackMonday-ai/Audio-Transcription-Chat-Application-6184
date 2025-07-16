import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import SafeIcon from '../common/SafeIcon';
import AudioPlayer from './AudioPlayer';

const {
  FiCopy,
  FiDownload,
  FiSearch,
  FiX,
  FiUpload,
  FiSave,
  FiShare2,
  FiCheck,
  FiChevronUp,
  FiChevronDown
} = FiIcons;

const TranscriptPanel = ({ transcript, fileName, metadata, onReset }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedText, setHighlightedText] = useState('');
  const [isMarkdown, setIsMarkdown] = useState(true);
  const [searchMatches, setSearchMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const transcriptRef = useRef(null);

  useEffect(() => {
    if (searchTerm && transcript) {
      const regex = new RegExp(searchTerm, 'gi');
      const matches = [...transcript.matchAll(regex)];
      setSearchMatches(matches);
      setCurrentMatchIndex(matches.length > 0 ? 0 : -1);

      // For markdown mode, we need to highlight the original text before markdown processing
      const highlighted = transcript.replace(regex, (match) => {
        return `<mark class="bg-yellow-300 px-1 py-0.5 rounded">${match}</mark>`;
      });
      setHighlightedText(highlighted);
    } else {
      setHighlightedText(transcript);
      setSearchMatches([]);
      setCurrentMatchIndex(-1);
    }
  }, [searchTerm, transcript]);

  useEffect(() => {
    if (currentMatchIndex >= 0 && searchMatches.length > 0) {
      // Scroll to the current match
      setTimeout(() => {
        const element = transcriptRef.current;
        if (element) {
          const marks = element.getElementsByTagName('mark');
          if (marks[currentMatchIndex]) {
            marks[currentMatchIndex].scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
            // Add current highlight class
            marks.forEach((mark, index) => {
              if (index === currentMatchIndex) {
                mark.classList.add('bg-yellow-400', 'ring-2', 'ring-yellow-500');
                mark.classList.remove('bg-yellow-300');
              } else {
                mark.classList.add('bg-yellow-300');
                mark.classList.remove('bg-yellow-400', 'ring-2', 'ring-yellow-500');
              }
            });
          }
        }
      }, 100);
    }
  }, [currentMatchIndex, searchMatches]);

  const handleNextMatch = () => {
    if (searchMatches.length > 0) {
      setCurrentMatchIndex((prev) => (prev + 1) % searchMatches.length);
    }
  };

  const handlePrevMatch = () => {
    if (searchMatches.length > 0) {
      setCurrentMatchIndex((prev) => (prev - 1 + searchMatches.length) % searchMatches.length);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleSave = () => {
    try {
      const savedTranscripts = JSON.parse(localStorage.getItem('savedTranscripts') || '[]');
      const newTranscript = {
        id: Date.now(),
        fileName,
        content: transcript,
        metadata,
        savedAt: new Date().toISOString()
      };
      savedTranscripts.push(newTranscript);
      localStorage.setItem('savedTranscripts', JSON.stringify(savedTranscripts));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save transcript:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: fileName || 'Transcript',
          text: transcript,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopy();
    }
  };

  const handleDownload = () => {
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName || 'transcript'}.${isMarkdown ? 'md' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleMarkdown = () => {
    setIsMarkdown(!isMarkdown);
    // Clear search when toggling markdown mode
    if (!isMarkdown) {
      setSearchTerm('');
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchMatches([]);
    setCurrentMatchIndex(-1);
  };

  // Custom markdown components to allow HTML rendering
  const markdownComponents = {
    // Allow HTML elements like <mark> to be rendered
    mark: ({ children, ...props }) => (
      <mark className="bg-yellow-300 px-1 py-0.5 rounded" {...props}>
        {children}
      </mark>
    ),
  };

  if (!transcript) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <SafeIcon icon={FiSearch} className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg mb-2">ไม่มีการถอดความที่พร้อมใช้งาน</p>
          <p className="text-sm">อัปโหลดไฟล์เสียงหรือวิดีโอเพื่อเริ่มต้น</p>
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
      <div className="p-2 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="bg-[#954eda] hover:bg-[#8144c5] text-white px-2 py-1 text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1"
            >
              <SafeIcon icon={FiUpload} className="w-3 h-3" />
              <span>อัพโหลด</span>
            </button>
            <h2 className="text-lg font-semibold text-gray-800">การถอดความ</h2>
          </div>
          <div className="flex gap-1">
            <button
              onClick={toggleMarkdown}
              className={`p-1 rounded-md transition-colors ${
                isMarkdown ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-[#954eda] hover:bg-gray-100'
              }`}
              title={isMarkdown ? 'แสดงข้อความธรรมดา' : 'แสดง Markdown'}
            >
              <span className="text-xs font-mono font-bold">MD</span>
            </button>
            <button
              onClick={handleSave}
              className={`p-1 rounded-md transition-colors ${
                isSaved ? 'text-green-500 bg-green-50' : 'text-gray-500 hover:text-[#954eda] hover:bg-gray-100'
              }`}
              title="บันทึกการถอดความ"
            >
              <SafeIcon icon={isSaved ? FiCheck : FiSave} className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="p-1 text-gray-500 hover:text-[#954eda] hover:bg-gray-100 rounded-md transition-colors"
              title="แชร์"
            >
              <SafeIcon icon={FiShare2} className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className={`p-1 rounded-md transition-colors ${
                isCopied ? 'text-green-500 bg-green-50' : 'text-gray-500 hover:text-[#954eda] hover:bg-gray-100'
              }`}
              title="คัดลอกการถอดความ"
            >
              <SafeIcon icon={isCopied ? FiCheck : FiCopy} className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-1 text-gray-500 hover:text-[#954eda] hover:bg-gray-100 rounded-md transition-colors"
              title="ดาวน์โหลดการถอดความ"
            >
              <SafeIcon icon={FiDownload} className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* File metadata and compact audio player */}
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-600">
            <p className="font-medium truncate">{fileName}</p>
            <div className="flex gap-2 text-xs">
              {metadata?.duration && <span>ระยะเวลา: {metadata.duration}</span>}
              {metadata?.fileSize && <span>ขนาด: {metadata.fileSize}</span>}
            </div>
          </div>
          {metadata?.audioUrl && (
            <div className="w-48">
              <AudioPlayer 
                audioUrl={metadata.audioUrl} 
                fileName={fileName}
                compact={true}
              />
            </div>
          )}
        </div>

        {/* Search with navigation */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <SafeIcon
              icon={FiSearch}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
            />
            <input
              type="text"
              placeholder="กรุณาปิด Markdown ก่อนใช้งานการค้นหา"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isMarkdown}
              className={`w-full pl-8 pr-24 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#954eda] focus:border-transparent ${
                isMarkdown ? 'bg-gray-100 cursor-not-allowed opacity-50' : ''
              }`}
            />
            {searchTerm && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <span className="text-xs text-gray-500">
                  {searchMatches.length > 0 ? `${currentMatchIndex + 1}/${searchMatches.length}` : '0/0'}
                </span>
                <button
                  onClick={handlePrevMatch}
                  disabled={searchMatches.length === 0}
                  className="p-1 text-gray-500 hover:text-[#954eda] disabled:opacity-50"
                >
                  <SafeIcon icon={FiChevronUp} className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextMatch}
                  disabled={searchMatches.length === 0}
                  className="p-1 text-gray-500 hover:text-[#954eda] disabled:opacity-50"
                >
                  <SafeIcon icon={FiChevronDown} className="w-4 h-4" />
                </button>
                <button
                  onClick={clearSearch}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={FiX} className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transcript content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isMarkdown ? (
          <div ref={transcriptRef} className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
              rehypePlugins={[rehypeRaw]}
            >
              {highlightedText}
            </ReactMarkdown>
          </div>
        ) : (
          <div
            ref={transcriptRef}
            className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: highlightedText }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default TranscriptPanel;