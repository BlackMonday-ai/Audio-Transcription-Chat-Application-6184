import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import TranscriptPanel from './components/TranscriptPanel';
import ChatPanel from './components/ChatPanel';
import LoadingSpinner from './components/LoadingSpinner';
import mockApi from './services/mockApi';
import './App.css';

function App() {
  const [transcript, setTranscript] = useState('');
  const [fileName, setFileName] = useState('');
  const [metadata, setMetadata] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleFileUpload = async (file) => {
    setIsTranscribing(true);
    try {
      const result = await mockApi.uploadAndTranscribe(file);
      if (result.success) {
        setTranscript(result.transcript);
        setFileName(result.fileName);
        setMetadata({
          duration: result.duration,
          fileSize: result.fileSize,
          audioUrl: result.audioUrl
        });
      }
    } catch (error) {
      console.error('Error transcribing file:', error);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleSendMessage = async (message, transcriptContext) => {
    setIsChatLoading(true);
    try {
      const response = await mockApi.chat(message, transcriptContext);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSelectHistory = (historyItem) => {
    setTranscript(historyItem.content);
    setFileName(historyItem.fileName);
    setMetadata(historyItem.metadata);
  };

  const handleReset = () => {
    setTranscript('');
    setFileName('');
    setMetadata(null);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <Header onSelectHistory={handleSelectHistory} />
      <main className="flex-1 container mx-auto p-4 overflow-hidden">
        {!transcript && !isTranscribing ? (
          <motion.div 
            className="h-full flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center max-w-2xl">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <img 
                  src="https://ai.apc.applicadgroup.com/images/metadata/android-chrome-512x512.png" 
                  alt="App Logo" 
                  className="w-24 h-24 mx-auto mb-6 rounded-2xl shadow-lg"
                />
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  เริ่มต้นใช้งาน
                </h1>
                <p className="text-gray-600 mb-8 text-lg">
                  อัปโหลดไฟล์เสียงหรือวิดีโอเพื่อเริ่มการถอดความ
                </p>
              </motion.div>
              <FileUpload onFileUpload={handleFileUpload} isLoading={isTranscribing} />
            </div>
          </motion.div>
        ) : isTranscribing ? (
          <div className="h-full flex items-center justify-center">
            <LoadingSpinner message="กำลังถอดความจากไฟล์ของคุณ..." />
          </div>
        ) : (
          <motion.div 
            className="h-full grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="lg:col-span-5 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <TranscriptPanel
                transcript={transcript}
                fileName={fileName}
                metadata={metadata}
                onReset={handleReset}
              />
            </div>
            <div className="lg:col-span-7 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <ChatPanel
                transcript={transcript}
                onSendMessage={handleSendMessage}
                isLoading={isChatLoading}
              />
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default App;