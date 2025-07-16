import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ChatApi {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async chat(message, transcript) {
    const response = await this.client.post('/chat', {
      message,
      transcript,
    });
    return response.data;
  }

  async speechToText(audioBlob) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'speech.wav');
    
    const response = await this.client.post('/speech-to-text', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export default new ChatApi();