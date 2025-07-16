// Mock API service for development
class MockApiService {
  constructor() {
    this.mockTranscript = `# Meeting Transcript - Product Planning Session

Date: December 15, 2024
Attendees: Sarah Johnson (PM), Mike Chen (Dev Lead), Lisa Wong (Designer)

## Project Status

Sarah: Good morning everyone. Let's start with our quarterly planning review. Mike, can you give us an update on the current development status?

Mike: Sure, Sarah. We've completed about 80% of the user authentication system. The login and registration flows are working well, but we're still working on the password reset functionality. I estimate we'll need another week to finish that.

Lisa: From the design perspective, I've finished the wireframes for the new dashboard. The user feedback has been really positive about the simplified navigation we proposed. I think we should prioritize the mobile responsive design next.

## Analytics Integration

Sarah: That sounds great. What about the analytics integration we discussed last week?

Mike: I've started the preliminary work on that. We're looking at integrating with Google Analytics and Mixpanel for user behavior tracking. The technical implementation should be straightforward, but we need to ensure we're compliant with privacy regulations.

Lisa: Speaking of privacy, I've been researching GDPR compliance for our European users. We'll need to implement a proper cookie consent system and update our privacy policy.

## Q1 Feature Roadmap

Sarah: Excellent points. Let's also discuss the upcoming feature releases. Our roadmap shows we have three major features planned for Q1:
- The new dashboard
- Advanced search functionality
- Mobile app beta

Mike: The mobile app is progressing well. We're using React Native, and the core functionality is already implemented. We should be ready for beta testing by mid-January.

Lisa: I'll need to create the app store assets and prepare the beta testing documentation. Should we start recruiting beta testers from our existing user base?

Sarah: Yes, let's target our most active users first. They'll provide the most valuable feedback. Mike, what's your timeline for the advanced search feature?

Mike: That's a bit more complex. We need to implement Elasticsearch for better search performance. I'd estimate about 3-4 weeks for the backend implementation and another 2 weeks for the frontend integration.

Lisa: I can start working on the search UI components while Mike handles the backend. We should also consider adding filters and sorting options to make the search more powerful.

## Performance Optimization

Sarah: Perfect. Let's also discuss the performance optimization we've been planning. Our page load times have been increasing, and we need to address that.

Mike: I've identified several bottlenecks. The main issues are with our database queries and some unnecessary API calls. I'm planning to implement caching and optimize our SQL queries. This should improve performance by at least 40%.

Lisa: From the frontend side, I can work on optimizing our images and implementing lazy loading for better user experience.

## Conclusion

Sarah: Great work, everyone. Let's schedule our next check-in for next Friday. Any other concerns or questions?

Mike: Just one thing - we should discuss the deployment strategy for the new features. I suggest we use feature flags to gradually roll out new functionality.

Lisa: That's a good idea. It'll help us monitor user adoption and quickly rollback if needed.

Sarah: Agreed. Let's implement that approach. Thanks everyone for the productive meeting!`;
  }

  async uploadAndTranscribe(file) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Add sample audio URL for playback
    const audioUrl = 'https://file-examples.com/storage/fe1134defc6538ed39b8efa/2017/11/file_example_MP3_1MG.mp3';

    return {
      success: true,
      transcript: this.mockTranscript,
      fileName: file.name,
      duration: '12:34',
      fileSize: this.formatFileSize(file.size),
      audioUrl: audioUrl, // Include audio URL in response
    };
  }

  async chat(message, transcript) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple mock responses based on message content with Markdown
    const responses = {
      'summary': `## Meeting Summary
      
This meeting covered quarterly planning with updates on the following key areas:

- **User Authentication**: 80% complete, password reset feature pending (1 week ETA)
- **Dashboard Design**: Wireframes completed with positive feedback
- **Analytics Integration**: Preliminary work started, privacy compliance needed
- **Q1 Features Roadmap**:
  - New dashboard
  - Advanced search functionality
  - Mobile app beta (mid-January target)
- **Performance Optimization**: Database and frontend improvements planned`,
      
      'timeline': `## Key Project Timelines
      
| Feature | Timeline | Owner |
|---------|----------|-------|
| Password reset | 1 week | Mike |
| Mobile app beta | mid-January | Mike & Lisa |
| Advanced search | 3-4 weeks backend + 2 weeks frontend | Mike & Lisa |
| Performance optimization | ongoing | Team |

The next team check-in is scheduled for next Friday.`,
      
      'participants': `## Meeting Participants

- **Sarah Johnson**: Product Manager
  - Leading the quarterly planning review
  - Managing feature roadmap

- **Mike Chen**: Development Lead
  - Responsible for authentication system
  - Working on analytics integration
  - Leading mobile app development

- **Lisa Wong**: Designer
  - Completed dashboard wireframes
  - Researching GDPR compliance
  - Will create app store assets`,
      
      'action items': `## Action Items

- [ ] Complete password reset functionality (Mike)
- [ ] Finalize mobile responsive design (Lisa)
- [ ] Implement analytics integration with privacy compliance (Mike)
- [ ] Prepare beta testing documentation (Lisa)
- [ ] Optimize database queries and implement caching (Mike)
- [ ] Implement image optimization and lazy loading (Lisa)
- [ ] Define feature flag strategy for deployment (Team)`,
      
      'default': `## Analysis

Based on the meeting transcript, I can help you with information about the product planning session. The team discussed:

1. Development progress on user authentication
2. New dashboard design updates
3. Analytics integration plans
4. Upcoming Q1 features roadmap
5. Performance optimization strategies

Is there a specific aspect you'd like me to elaborate on?`
    };

    // Generate a very long response for long messages to test collapsible functionality
    const longResponse = `## Detailed Meeting Analysis

${this.mockTranscript}

## Additional Notes

The meeting was conducted in a structured manner, with Sarah Johnson leading the discussion. Each team member had an opportunity to share their updates and concerns. The team demonstrated a collaborative approach to problem-solving, particularly when discussing the deployment strategy for new features.

### Authentication System
The authentication system is nearing completion at 80%. The team should focus on completing the password reset functionality within the next week. This is a critical feature for user experience and security.

### Dashboard Design
The new dashboard design has been well-received in initial user feedback. The simplified navigation is a key improvement. The team should prioritize making the dashboard mobile-responsive as this will enhance the user experience across devices.

### Analytics Integration
The team is planning to integrate with Google Analytics and Mixpanel. This will provide valuable insights into user behavior. However, it's crucial to ensure compliance with privacy regulations, particularly GDPR for European users. This includes implementing a proper cookie consent system and updating the privacy policy.

### Q1 Feature Roadmap
The team has three major features planned for Q1:
1. **New Dashboard**: Already in progress with positive initial feedback.
2. **Advanced Search Functionality**: Requires Elasticsearch implementation, estimated at 5-6 weeks total development time.
3. **Mobile App Beta**: Using React Native, targeting mid-January for beta release.

### Performance Optimization
The team has identified several performance bottlenecks:
1. Database queries need optimization
2. Some API calls are unnecessary and can be eliminated
3. Frontend optimizations including image optimization and lazy loading

### Deployment Strategy
The team plans to use feature flags for gradual rollout of new functionality. This approach will allow for monitoring user adoption and quick rollback if issues arise.

## Recommendations

1. **Prioritize Authentication Completion**: Finish the password reset functionality as soon as possible to complete the authentication system.
2. **Start Mobile Responsive Design**: Begin work on making the dashboard mobile-responsive in parallel with other development tasks.
3. **Develop GDPR Compliance Plan**: Create a detailed plan for ensuring GDPR compliance with the analytics integration.
4. **Begin Beta Tester Recruitment**: Start identifying active users who would be good candidates for beta testing the mobile app.
5. **Document Performance Improvements**: Track performance metrics before and after optimization to quantify improvements.
6. **Create Feature Flag Documentation**: Develop clear documentation for the feature flag system to ensure all team members understand how to use it effectively.

## Next Steps

1. Complete password reset functionality (Mike)
2. Begin mobile responsive design (Lisa)
3. Draft GDPR compliance requirements (Lisa)
4. Start Elasticsearch implementation for advanced search (Mike)
5. Identify and fix top database query bottlenecks (Mike)
6. Begin image optimization for frontend (Lisa)
7. Prepare for next check-in meeting on Friday

## Questions for Follow-up

1. What specific metrics will be used to measure the success of the new dashboard?
2. How will beta testers be incentivized to provide feedback?
3. What is the contingency plan if the Elasticsearch implementation takes longer than expected?
4. Are there any regulatory deadlines that might impact the GDPR compliance work?
5. What is the target performance improvement percentage for the optimization work?`;

    // Include the long response in the responses object
    responses['long'] = longResponse;

    const lowerMessage = message.toLowerCase();
    let response = responses.default;

    // Check for keywords in the message to determine which response to send
    for (const [key, value] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        response = value;
        break;
      }
    }

    // For testing collapsible messages, occasionally return the long response
    if (Math.random() > 0.7) {
      response = longResponse;
    }

    return {
      success: true,
      response,
      timestamp: new Date().toISOString(),
    };
  }

  async speechToText(audioBlob) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock speech-to-text responses
    const mockTexts = [
      "What were the main topics discussed in the meeting?",
      "Can you summarize the key action items?",
      "What is the timeline for the mobile app?",
      "Who are the participants in this meeting?",
      "What are the upcoming features for Q1?",
      "Please provide a detailed analysis of the meeting",
    ];

    return {
      success: true,
      text: mockTexts[Math.floor(Math.random() * mockTexts.length)],
    };
  }

  async textToSpeech(text) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return a mock audio blob (empty for now)
    return new Blob([''], { type: 'audio/wav' });
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export default new MockApiService();