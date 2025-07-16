# Transcript Chat Assistant

A modern web application that allows users to upload audio/video files, generate transcripts, and chat with the content using AI assistance.

## Features

- **File Upload**: Support for multiple audio/video formats (MP3, MP4, M4A, WAV, WebM)
- **Transcription**: Automatic transcription of uploaded media files
- **Interactive Chat**: RAG-style chat interface using transcript as context
- **Voice Input**: Voice-to-text functionality for hands-free interaction
- **Search**: Search functionality within transcripts
- **Responsive Design**: Modern, mobile-friendly interface
- **Export Options**: Copy and download transcript functionality

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, Framer Motion
- **Icons**: React Icons
- **Build Tool**: Vite
- **API**: Mock API service (ready for real API integration)

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd transcript-chat-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## API Integration

The application is structured to easily integrate with real APIs:

### Mock API Service
Currently uses `src/services/mockApi.js` for development. Replace with real API calls in `src/services/api.js`.

### Required API Endpoints

1. **POST /api/transcribe** - Upload and transcribe audio/video files
2. **POST /api/chat** - Chat with transcript context
3. **POST /api/speech-to-text** - Convert speech to text
4. **POST /api/text-to-speech** - Convert text to speech

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## Project Structure

```
src/
├── components/          # React components
│   ├── FileUpload.jsx   # File upload component
│   ├── TranscriptPanel.jsx # Transcript display
│   ├── ChatPanel.jsx    # Chat interface
│   ├── VoiceInput.jsx   # Voice input component
│   ├── Header.jsx       # App header
│   └── LoadingSpinner.jsx # Loading component
├── services/           # API services
│   ├── api.js          # Real API service
│   └── mockApi.js      # Mock API for development
├── hooks/              # Custom React hooks
│   └── useVoiceRecording.js # Voice recording hook
├── common/             # Shared components
│   └── SafeIcon.jsx    # Safe icon component
├── App.jsx             # Main application component
├── App.css             # Custom styles
├── index.css           # Global styles
└── main.jsx            # Application entry point
```

## Features in Detail

### File Upload
- Drag and drop interface
- Support for multiple file formats
- File validation and size display
- Progress indication during upload

### Transcript Panel
- Scrollable transcript display
- Search functionality with highlighting
- Copy and download options
- File metadata display

### Chat Interface
- Suggested questions
- Message history
- Voice input support
- Loading states and error handling

### Voice Features
- Voice recording with visual feedback
- Speech-to-text conversion
- Hands-free interaction

## Customization

### Styling
- Tailwind CSS for utility-first styling
- Custom CSS in `App.css` for specific components
- Responsive design with mobile-first approach

### Icons
- React Icons library
- SafeIcon component for error handling
- Consistent icon usage throughout the app

### Animations
- Framer Motion for smooth transitions
- Loading states and micro-interactions
- Responsive hover effects

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Preview the build:
```bash
npm run preview
```

3. Deploy the `dist` folder to your hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.