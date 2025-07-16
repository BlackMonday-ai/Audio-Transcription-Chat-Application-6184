import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import SafeIcon from '../common/SafeIcon';
import VoiceInput from './VoiceInput';

const { FiSend, FiUser, FiMessageCircle, FiLoader, FiCopy, FiCheck } = FiIcons;

const ChatPanel = ({ transcript, onSendMessage, isLoading }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || !transcript) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      const response = await onSendMessage(messageText, transcript);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'ขออภัย เกิดข้อผิดพลาด โปรดลองใหม่อีกครั้ง',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleCopyMessage = async (content, id) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceMessage = (voiceText) => {
    handleSendMessage(voiceText);
  };

  const suggestedQuestions = [
    'สรุปประเด็นสำคัญของการประชุมนี้',
    'มีงานที่ต้องทำอะไรบ้าง?',
    'ใครเข้าร่วมประชุมบ้าง?',
    'มีกำหนดเวลาอะไรที่สำคัญบ้าง?',
    'มีปัญหาหรือความท้าทายอะไรบ้าง?',
  ];

  if (!transcript) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <SafeIcon icon={FiMessageCircle} className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg mb-2">พร้อมสนทนา</p>
          <p className="text-sm">อัพโหลดไฟล์เพื่อเริ่มถามคำถามเกี่ยวกับการถอดความ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">ผู้ช่วยสนทนา</h2>
        <p className="text-sm text-gray-600 mt-1">
          ถามคำถามเกี่ยวกับการถอดความของคุณ
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-gray-600 text-sm mb-4">ลองถามดูสิ:</p>
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(question)}
                className="block w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence>
          {messages.map((messageItem) => (
            <motion.div
              key={messageItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${messageItem.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[80%] p-3 rounded-lg relative group
                  ${messageItem.type === 'user' ? 'bg-[#954eda] text-white' : 'bg-gray-100 text-gray-800'}
                `}
              >
                <div className="flex items-start gap-2">
                  <SafeIcon
                    icon={messageItem.type === 'user' ? FiUser : FiMessageCircle}
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="text-sm prose-sm max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                      >
                        {messageItem.content}
                      </ReactMarkdown>
                    </div>
                    <p className={`text-xs mt-1 ${
                      messageItem.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                    }`}>
                      {messageItem.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {messageItem.type === 'bot' && (
                    <button
                      onClick={() => handleCopyMessage(messageItem.content, messageItem.id)}
                      className={`
                        opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 p-1 rounded
                        ${copiedId === messageItem.id ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'}
                      `}
                      title={copiedId === messageItem.id ? 'คัดลอกแล้ว' : 'คัดลอก'}
                    >
                      <SafeIcon icon={copiedId === messageItem.id ? FiCheck : FiCopy} className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <SafeIcon icon={FiLoader} className="w-4 h-4 animate-spin" />
                <span className="text-sm text-gray-600">กำลังคิด...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="ถามคำถามเกี่ยวกับการถอดความ..."
              className="w-full p-3 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#954eda] focus:border-transparent resize-none"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            <VoiceInput onVoiceInput={handleVoiceMessage} />
          </div>
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2 bg-[#954eda] text-white rounded-lg hover:bg-[#8144c5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <SafeIcon icon={FiSend} className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;