import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Transcription APIs
  async uploadAndTranscribe(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await this.client.post('/transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Chat APIs
  async chat(message, transcript) {
    const response = await this.client.post('/chat', {
      message,
      transcript,
    });
    return response.data;
  }

  // Voice APIs
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

  async textToSpeech(text) {
    const response = await this.client.post('/text-to-speech', {
      text,
    }, {
      responseType: 'blob',
    });
    return response.data;
  }

  // History APIs
  async saveTranscript(transcript) {
    const response = await this.client.post('/transcripts', transcript);
    return response.data;
  }

  async getTranscripts() {
    const response = await this.client.get('/transcripts');
    return response.data;
  }

  async deleteTranscript(id) {
    const response = await this.client.delete(`/transcripts/${id}`);
    return response.data;
  }
}

export default new ApiService();