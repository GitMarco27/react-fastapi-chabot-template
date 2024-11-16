const config = {
  features: {
    fileUpload: true,  // Enable/disable file upload functionality
    chatHistory: true, // Enable/disable chat history saving
    messageEditing: true, // Enable/disable message editing
    themeSwitching: true, // Enable/disable theme switching
    showContext: true, // Enable/disable showing context in chat
    showSuggestionCards: true, // Toggle suggestion cards visibility
  },
  ui: {
    initialTheme: 'light', // 'light' or 'dark'
    sidebarDefaultOpen: false,
    companyName: 'Company Name',
    companyLogo: '/logo512.png',
    authorSignature: '🚀 Marco Sanguineti, 2024',
  },
  chat: {
    initialMessage: "Hello! How can I help you today?",
    maxFileSize: 5 * 1024 * 1024, // 5MB in bytes
    apiEndpoint: 'https://823f-2-34-26-173.ngrok-free.app/stream',
    assistant: {
      name: '⚙️ Chat Assistant',
      avatar: '/logo512.png',
      warningMessage: 'Chat history is not saved yet',
      placeholderText: 'Type your message...',
      editPlaceholderText: 'Edit message...',
    }
  },
  suggestionCards: {
    cards: [
      {
        icon: "lightbulb", // This will be mapped to the SVG in App.js
        title: "Code Analysis",
        question: "Can you review my code for potential improvements?"
      },
      {
        icon: "code",
        title: "Debug Help",
        question: "I'm getting an error in my code. Can you help me fix it?"
      },
      {
        icon: "settings",
        title: "Best Practices",
        question: "What are the best practices for state management in React?"
      },
      {
        icon: "monitor",
        title: "New Features",
        question: "How can I implement authentication in my app?"
      }
    ]
  }
};

export default config;