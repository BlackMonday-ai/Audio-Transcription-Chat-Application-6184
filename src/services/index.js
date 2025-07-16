// Centralize all API services
export { default as api } from './api';
export { default as mockApi } from './mockApi';

// Export specific API functions for easy access
const currentApi = process.env.NODE_ENV === 'development' ? 
  require('./mockApi').default : 
  require('./api').default;

export const {
  uploadAndTranscribe,
  chat,
  speechToText,
  textToSpeech,
  saveTranscript,
  getTranscripts,
  deleteTranscript
} = currentApi;