import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { format } from 'date-fns';

const { FiMenu, FiX, FiTrash2, FiClock, FiSearch, FiChevronRight } = FiIcons;

const HistoryMenu = ({ onSelectHistory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  // Load history from localStorage
  useEffect(() => {
    const loadHistory = () => {
      try {
        const savedHistory = JSON.parse(localStorage.getItem('savedTranscripts') || '[]');
        setHistory(savedHistory);
      } catch (error) {
        console.error('Error loading history:', error);
        setHistory([]);
      }
    };

    loadHistory();
    
    // Add event listener for storage changes
    window.addEventListener('storage', loadHistory);
    return () => window.removeEventListener('storage', loadHistory);
  }, []);

  const handleSelectHistory = (item) => {
    setSelectedId(item.id);
    onSelectHistory(item);
    setIsOpen(false);
  };

  const handleDeleteHistory = (id, e) => {
    e.stopPropagation();
    try {
      const updatedHistory = history.filter(item => item.id !== id);
      localStorage.setItem('savedTranscripts', JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  };

  const filteredHistory = history.filter(item => 
    (item.fileName && item.fileName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.content && item.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-full shadow-md transition-colors ${
          isOpen ? 'bg-[#954eda] text-white' : 'bg-white text-[#954eda]'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle history menu"
      >
        <SafeIcon icon={isOpen ? FiX : FiMenu} className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 z-50 h-full w-full md:w-80 bg-white shadow-lg border-l border-gray-200 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-gray-800">ประวัติการถอดความ</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-gray-500 hover:text-gray-700 rounded-md"
                  >
                    <SafeIcon icon={FiX} className="w-5 h-5" />
                  </button>
                </div>
                <div className="relative">
                  <SafeIcon
                    icon={FiSearch}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                  />
                  <input
                    type="text"
                    placeholder="ค้นหาประวัติ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#954eda] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
                    <SafeIcon icon={FiClock} className="w-12 h-12 mb-4 text-gray-300" />
                    {searchTerm ? (
                      <p>ไม่พบประวัติที่ตรงกับการค้นหา</p>
                    ) : (
                      <p>ยังไม่มีประวัติการถอดความ</p>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredHistory.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                          selectedId === item.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                        }`}
                        onClick={() => handleSelectHistory(item)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-800 truncate">
                              {item.fileName || 'Untitled Transcript'}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              {item.savedAt ? format(new Date(item.savedAt), 'dd MMM yyyy, HH:mm') : 'Unknown date'}
                            </p>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {item.content?.substring(0, 100)}...
                            </p>
                          </div>
                          <div className="flex items-center ml-2">
                            <button
                              onClick={(e) => handleDeleteHistory(item.id, e)}
                              className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors"
                              title="Delete"
                            >
                              <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                            </button>
                            <SafeIcon
                              icon={FiChevronRight}
                              className="w-5 h-5 text-gray-400 ml-1"
                            />
                          </div>
                        </div>
                        {item.metadata && (
                          <div className="flex gap-2 mt-1">
                            {item.metadata.duration && (
                              <span className="text-xs text-gray-500">{item.metadata.duration}</span>
                            )}
                            {item.metadata.fileSize && (
                              <span className="text-xs text-gray-500">{item.metadata.fileSize}</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default HistoryMenu;