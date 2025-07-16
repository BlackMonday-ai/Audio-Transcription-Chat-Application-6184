class MockTranscriptionApi {
  constructor() {
    this.mockTranscript = `Meeting Transcript - Product Planning Session...`; // Same mock data as before
  }

  async uploadAndTranscribe(file) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      transcript: this.mockTranscript,
      fileName: file.name,
      duration: '12:34',
      fileSize: this.formatFileSize(file.size),
    };
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export default new MockTranscriptionApi();