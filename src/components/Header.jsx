import React from 'react';
import { motion } from 'framer-motion';
import HistoryMenu from './HistoryMenu';

const Header = ({ onSelectHistory }) => {
  return (
    <motion.header 
      className="bg-white shadow-sm border-b border-gray-200 p-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img 
            src="https://ai.apc.applicadgroup.com/images/metadata/android-chrome-512x512.png" 
            alt="App Logo" 
            className="w-10 h-10 rounded-lg" 
          />
          <div>
            <h1 className="text-xl font-bold text-purple-700">
              Transcript Chat Assistant
            </h1>
            <p className="text-sm text-gray-600">
              อัปโหลด, ถอดความ, และสนทนากับไฟล์เสียงหรือวิดีโอของคุณ
            </p>
          </div>
        </div>
        
        {/* History menu button moved here */}
        <HistoryMenu onSelectHistory={onSelectHistory} />
      </div>
    </motion.header>
  );
};

export default Header;