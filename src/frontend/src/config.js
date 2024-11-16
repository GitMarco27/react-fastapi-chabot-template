const config = {
  features: {
    fileUpload: true,  // Enable/disable file upload functionality
    chatHistory: true, // Enable/disable chat history saving
    messageEditing: true, // Enable/disable message editing
    themeSwitching: true, // Enable/disable theme switching
  },
  ui: {
    initialTheme: 'light', // 'light' or 'dark'
    sidebarDefaultOpen: true,
    companyName: 'Company Name',
    companyLogo: '/logo512.png',
    authorSignature: '🚀 Marco Sanguineti, 2024',
  },
  chat: {
    initialMessage: "Hello! How can I help you today?",
    maxFileSize: 5 * 1024 * 1024, // 5MB in bytes
    apiEndpoint: process.env.REACT_APP_API_ENDPOINT || 'http://0.0.0.0:8000/stream',
    assistant: {
      name: '⚙️ Chat Assistant',
      avatar: '/logo512.png',
      warningMessage: 'Chat history is not saved yet',
      placeholderText: 'Type your message...',
      editPlaceholderText: 'Edit message...',
    }
  }
};

export default config;