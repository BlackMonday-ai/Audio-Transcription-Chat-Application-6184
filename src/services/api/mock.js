// Move all mock implementations here
import { mockTranscript } from './mockData';

class MockApiService {
  async uploadAndTranscribe(file) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      success: true,
      transcript: mockTranscript,
      fileName: file.name,
      duration: '12:34',
      fileSize: this.formatFileSize(file.size),
      audioUrl: 'https://file-examples.com/storage/fe1134defc6538ed39b8efa/2017/11/file_example_MP3_1MG.mp3',
    };
  }

  // ... rest of mock implementations ...
}

export default new MockApiService();