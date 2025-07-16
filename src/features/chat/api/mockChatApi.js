class MockChatApi {
  async chat(message, transcript) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const responses = {
      'summary': 'This meeting covered quarterly planning with updates on user authentication (80% complete), new dashboard design, analytics integration, and upcoming Q1 features including mobile app beta and advanced search functionality.',
      'timeline': 'Key timelines: Password reset - 1 week, Mobile app beta - mid-January, Advanced search - 3-4 weeks backend + 2 weeks frontend, Performance optimization - ongoing.',
      'participants': 'Meeting participants: Sarah Johnson (Product Manager), Mike Chen (Development Lead), and Lisa Wong (Designer).',
      'action items': 'Action items: Complete password reset functionality, finalize mobile responsive design, implement analytics integration, prepare beta testing documentation, optimize database queries and implement caching.',
      'default': `Based on the meeting transcript, I can help you with information about the product planning session. The team discussed development progress, design updates, and upcoming features. Is there something specific you'd like to know about?`
    };

    const lowerMessage = message.toLowerCase();
    let response = responses.default;

    for (const [key, value] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        response = value;
        break;
      }
    }

    return {
      success: true,
      response,
      timestamp: new Date().toISOString(),
    };
  }

  async speechToText(audioBlob) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockTexts = [
      "What were the main topics discussed in the meeting?",
      "Can you summarize the key action items?",
      "What is the timeline for the mobile app?",
      "Who are the participants in this meeting?",
      "What are the upcoming features for Q1?",
    ];
    
    return {
      success: true,
      text: mockTexts[Math.floor(Math.random() * mockTexts.length)],
    };
  }
}

export default new MockChatApi();