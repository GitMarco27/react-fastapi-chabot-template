import { useState, useEffect, useRef } from "react";
import { useTheme } from "./contexts/ThemeContext";
import ReactMarkdown from 'react-markdown';
import config from './config';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SuggestionCard = ({ icon, title, question, onClick, isDarkMode }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center p-4 rounded-lg transition-all transform hover:scale-105 w-full max-w-[240px] ${
      isDarkMode
        ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
    }`}
  >
    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
    }`}>
      {icon}
    </div>
    <h3 className="font-medium text-sm mb-1">{title}</h3>
    <p className={`text-xs text-center ${
      isDarkMode ? 'text-gray-400' : 'text-gray-600'
    }`}>{question}</p>
  </button>
);

const SuggestionIcon = ({ icon }) => {
  const icons = {
    lightbulb: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    ),
    code: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    ),
    settings: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    ),
    monitor: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    )
  };

  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {icons[icon] || icons.lightbulb}
    </svg>
  );
};

const MessageFeedback = ({ isDarkMode, onFeedback, existingFeedback }) => {
  const [feedback, setFeedback] = useState(existingFeedback?.type || null);

  const handleFeedback = async (isPositive) => {
    if (feedback === (isPositive ? 'positive' : 'negative')) {
      setFeedback(null);
      onFeedback(null);
    } else {
      const newFeedback = isPositive ? 'positive' : 'negative';
      setFeedback(newFeedback);
      onFeedback(newFeedback);
    }
  };

  return (
    <div className="mt-2">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleFeedback(true)}
          className={`p-1 rounded ${
            feedback === 'positive'
              ? isDarkMode
                ? 'bg-green-900/30 text-green-400'
                : 'bg-green-100 text-green-600'
              : isDarkMode
              ? 'text-gray-400 hover:text-gray-300'
              : 'text-gray-500 hover:text-gray-600'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
        </button>
        <button
          onClick={() => handleFeedback(false)}
          className={`p-1 rounded ${
            feedback === 'negative'
              ? isDarkMode
                ? 'bg-red-900/30 text-red-400'
                : 'bg-red-100 text-red-600'
              : isDarkMode
              ? 'text-gray-400 hover:text-gray-300'
              : 'text-gray-500 hover:text-gray-600'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5 0h2a2 2 0 002-2v-6a2 2 0 00-2-2h-2.5" />
          </svg>
        </button>
      </div>
    </div>
  );
};

function App() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [
      { text: config.chat.initialMessage, sender: "bot" },
    ];
  });
  const [newMessage, setNewMessage] = useState("");
  const [isWaitingForBot, setIsWaitingForBot] = useState(false);
  const [editingMessageIndex, setEditingMessageIndex] = useState(null);
  const messagesEndRef = useRef(null);
  const [loadedFiles, setLoadedFiles] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [messageFeedbacks, setMessageFeedbacks] = useState(() => {
    const savedFeedbacks = localStorage.getItem('messageFeedbacks');
    return savedFeedbacks ? JSON.parse(savedFeedbacks) : {};
  });

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('messageFeedbacks', JSON.stringify(messageFeedbacks));
  }, [messageFeedbacks]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (newMessage.trim() && !isWaitingForBot) {
      const textarea = document.querySelector('textarea');
      if (textarea) textarea.style.height = 'auto';

      setIsWaitingForBot(true);
      const userMessage = newMessage;
      setMessages(prev => [...prev, { text: userMessage, sender: "user" }]);
      setNewMessage("");

      try {
        const tempMessageIndex = messages.length + 1;
        setMessages(prev => [...prev, { text: "", sender: "bot" }]);

        const conversationHistory = messages.map(msg => ({
          text: msg.text,
          sender: msg.sender
        }));

        const response = await fetch(config.chat.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: userMessage,
            files: loadedFiles.map(file => ({
              name: file.name,
              content: file.content,
              type: file.type
            })),
            history: conversationHistory
          }),
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let botResponse = "";

        const processLine = (line, tempMessageIndex, currentResponse) => {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'context') {
                setMessages(prev => prev.map((msg, index) =>
                  index === tempMessageIndex ? { ...msg, context: data.data } : msg
                ));
              } else {
                const updatedResponse = currentResponse + data.content;
                setMessages(prev => prev.map((msg, index) =>
                  index === tempMessageIndex ? { ...msg, text: updatedResponse } : msg
                ));
                return updatedResponse;
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
          return currentResponse;
        };

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            botResponse = processLine(line, tempMessageIndex, botResponse);
          }
        }
      } catch (error) {
        console.error('Error:', error);
        setMessages(prev => [...prev, {
          text: "Sorry, there was an error processing your request.",
          sender: "bot"
        }]);
      } finally {
        setIsWaitingForBot(false);
      }
    }
  };

  const handleEditMessage = (index) => {
    const message = messages[index];
    if (message.sender === "user") {
      setEditingMessageIndex(index);
      setNewMessage(message.text);
      setTimeout(() => {
        const textarea = document.querySelector('textarea');
        if (textarea) {
          textarea.style.height = 'auto';
          textarea.style.height = `${textarea.scrollHeight}px`;
        }
      }, 0);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editingMessageIndex !== null && newMessage.trim() && !isWaitingForBot) {
      setIsWaitingForBot(true);

      // Keep messages up to the edited message
      const updatedMessages = messages.slice(0, editingMessageIndex);

      // Add the edited message
      updatedMessages.push({ text: newMessage, sender: "user" });
      setMessages(updatedMessages);

      // Clear message and reset textarea immediately after sending
      setEditingMessageIndex(null);
      setNewMessage("");
      const textarea = document.querySelector('textarea');
      if (textarea) textarea.style.height = 'auto';

      try {
        // Add temporary bot message
        setMessages(prev => [...prev, { text: "", sender: "bot" }]);
        const tempMessageIndex = updatedMessages.length;

        const conversationHistory = updatedMessages.map(msg => ({
          text: msg.text,
          sender: msg.sender
        }));

        const response = await fetch(config.chat.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: newMessage,
            files: loadedFiles.map(file => ({
              name: file.name,
              content: file.content,
              type: file.type
            })),
            history: conversationHistory
          }),
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let botResponse = "";

        const processLine = (line, tempMessageIndex, currentResponse) => {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'context') {
                setMessages(prev => prev.map((msg, index) =>
                  index === tempMessageIndex ? { ...msg, context: data.data } : msg
                ));
              } else {
                const updatedResponse = currentResponse + data.content;
                setMessages(prev => prev.map((msg, index) =>
                  index === tempMessageIndex ? { ...msg, text: updatedResponse } : msg
                ));
                return updatedResponse;
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
          return currentResponse;
        };

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            botResponse = processLine(line, tempMessageIndex, botResponse);
          }
        }
      } catch (error) {
        console.error('Error:', error);
        setMessages(prev => [...prev, {
          text: "Sorry, there was an error processing your request.",
          sender: "bot"
        }]);
      } finally {
        setIsWaitingForBot(false);
      }
    }
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    let skippedFiles = [];

    for (const file of files) {
      if (loadedFiles.some(existingFile => existingFile.name === file.name)) {
        skippedFiles.push(file.name);
        continue;
      }

      try {
        const content = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target.result);
          reader.onerror = (error) => reject(error);
          reader.readAsText(file);
        });

        setLoadedFiles(prev => [...prev, {
          name: file.name,
          content: content,
          size: file.size,
          type: file.type
        }]);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }

  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat history and loaded files?")) {
      const initialMessage = [
        { text: config.chat.initialMessage, sender: "bot" }
      ];
      setMessages(initialMessage);
      setLoadedFiles([]);
      setShowSuggestions(true);
      setMessageFeedbacks({});
      localStorage.setItem('chatMessages', JSON.stringify(initialMessage));
      localStorage.removeItem('messageFeedbacks');
    }
  };

  const handleSuggestionClick = (question) => {
    setShowSuggestions(false);

    // Directly send the message
    const userMessage = question;
    setMessages(prev => [...prev, { text: userMessage, sender: "user" }]);

    // Start the bot response process
    setIsWaitingForBot(true);

    const sendQuestion = async () => {
      try {
        const tempMessageIndex = messages.length + 1;
        setMessages(prev => [...prev, { text: "", sender: "bot" }]);

        const conversationHistory = messages.map(msg => ({
          text: msg.text,
          sender: msg.sender
        }));

        const response = await fetch(config.chat.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: userMessage,
            files: loadedFiles.map(file => ({
              name: file.name,
              content: file.content,
              type: file.type
            })),
            history: conversationHistory
          }),
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let botResponse = "";

        const processLine = (line, tempMessageIndex, currentResponse) => {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'context') {
                setMessages(prev => prev.map((msg, index) =>
                  index === tempMessageIndex ? { ...msg, context: data.data } : msg
                ));
              } else {
                const updatedResponse = currentResponse + data.content;
                setMessages(prev => prev.map((msg, index) =>
                  index === tempMessageIndex ? { ...msg, text: updatedResponse } : msg
                ));
                return updatedResponse;
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
          return currentResponse;
        };

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            botResponse = processLine(line, tempMessageIndex, botResponse);
          }
        }
      } catch (error) {
        console.error('Error:', error);
        setMessages(prev => [...prev, {
          text: "Sorry, there was an error processing your request.",
          sender: "bot"
        }]);
      } finally {
        setIsWaitingForBot(false);
      }
    };

    sendQuestion();
  };

  const MessageContext = ({ context }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { isDarkMode } = useTheme();

    if (!context || !config.features.showContext) return null;

    return (
      <div className="mt-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center space-x-1 text-sm ${
            isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <svg
            className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <span>Show context</span>
        </button>

        {isOpen && (
          <div className={`mt-2 p-3 rounded-lg text-sm ${
            isDarkMode
              ? 'bg-gray-800 text-gray-200 border border-gray-700'
              : 'bg-gray-100 text-gray-800 border border-gray-200'
          }`}>
            <div className="space-y-2">
              {Object.entries(context).map(([key, value]) => (
                <div key={key}>
                  <span className="font-medium">{key}: </span>
                  {Array.isArray(value)
                    ? value.join(', ')
                    : typeof value === 'number'
                      ? value.toFixed(2)
                      : value}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleMessageFeedback = (messageIndex, feedbackType) => {
    setMessageFeedbacks(prev => ({
      ...prev,
      [messageIndex]: { type: feedbackType, timestamp: new Date().toISOString() }
    }));
  };

  return (
    <>
      {/* Fixed background */}
      <div className={`fixed inset-0 ${isDarkMode ? 'bg-[#212121]' : 'bg-white'}`}></div>

      {/* Main container - added relative and z-10 to appear above background */}
      <div className={`relative z-10 flex h-screen overflow-hidden ${isDarkMode ? 'bg-[#212121]' : 'bg-white'}`}>
        {/* Sidebar */}
        <div
          className={`${isSidebarOpen ? "w-[50%] md:w-[20%]" : "w-0"
            } ${isDarkMode ? 'bg-[#171717]' : 'bg-[#F9F9F9]'} shadow-lg transition-all duration-300 overflow-hidden flex-shrink-0 flex flex-col relative`}
        >
          {/* Logo section - fixed at top */}
          <div className={`fixed top-0 z-10
            ${isSidebarOpen ? 'w-[50%] md:w-[20%]' : 'w-0'}
            ${isDarkMode ? 'bg-[#171717] border-gray-700' : 'bg-[#F9F9F9] border-gray-200'}
            border-b`}
          >
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <img
                  src="/logo512.png"
                  alt="Company Name"
                  className="w-8 h-8 rounded-lg"
                />
                <span className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Company Name</span>
              </div>
            </div>
          </div>

          {/* Scrollable content area - with padding to account for fixed header and footer */}
          <div className="flex-1 overflow-y-auto pt-[72px] pb-[60px]">
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h4 className={`text-m font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Today</h4>
              </div>

              {/* Warning banner */}
              <div className={`p-3 rounded-lg mb-4 ${isDarkMode
                  ? 'bg-yellow-900/30 text-yellow-200 border border-yellow-900/50'
                  : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                }`}>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span className="text-sm">{config.chat.assistant.warningMessage}</span>
                </div>
              </div>

              {loadedFiles.length > 0 && (
                <div className={`p-3 rounded-lg mb-4 ${isDarkMode
                    ? 'bg-gray-800 text-gray-200 border border-gray-700'
                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}>
                  <h5 className="font-medium mb-2">Loaded Files:</h5>
                  <div className="space-y-2">
                    {loadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between gap-2">
                        <div className="flex items-center min-w-0 flex-1">
                          <svg className="w-4 h-4 flex-shrink-0 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span className="text-sm truncate" title={file.name}>{file.name}</span>
                        </div>
                        <button
                          onClick={() => {
                            setLoadedFiles(prev => prev.filter((_, i) => i !== index));
                          }}
                          className="p-1 hover:bg-gray-700 rounded flex-shrink-0"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Author signature - fixed at bottom */}
          <div className={`fixed bottom-0 z-10 overflow-hidden
            ${isSidebarOpen ? 'w-[50%] md:w-[20%] visible' : 'w-0 invisible'}
            ${isDarkMode ? 'bg-[#171717] text-gray-400' : 'bg-[#F9F9F9] text-gray-500'}`}
          >
            <div className="p-4 text-sm text-center whitespace-nowrap">
              Marco Sanguineti, 2024
            </div>
          </div>
        </div>

        {/* Main content - modified for chat */}
        <div className={`flex-1 flex flex-col min-w-0 relative ${isDarkMode ? 'bg-[#212121]' : 'bg-white'}`}>
          {/* Toggle button and title - modified with fixed positioning */}
          <div
            className={`fixed top-0 right-0 z-10
              ${isSidebarOpen ? 'left-[50%] md:left-[20%]' : 'left-0'}
              ${isDarkMode ? 'bg-[#212121]' : 'bg-white'}`}
          >
            <div className="flex items-center justify-between m-4">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(!isSidebarOpen)}
                  className={`p-2 rounded-md ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-[#ECECEC] text-gray-900'}`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <h1 className={`ml-4 text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {config.chat.assistant.name}
                </h1>
              </div>

              {/* Add clear chat button and theme toggle */}
              <div className="flex items-center space-x-2">
                <label className={`p-2 rounded-md cursor-pointer ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-[#ECECEC] text-gray-900'
                  }`}>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    title="Load files"
                    multiple
                  />
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </label>

                <button
                  onClick={clearChat}
                  className={`p-2 rounded-md ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-[#ECECEC] text-gray-900'}`}
                  title="Clear chat"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>

                {/* Existing theme toggle button */}
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-md ${isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-[#ECECEC] text-gray-900'}`}
                >
                  {isDarkMode ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Chat messages area */}
          <div className="flex-1 overflow-y-auto p-4 pt-[80px] pb-[100px] space-y-4">
            {showSuggestions && messages.length === 1 && config.features.showSuggestionCards ? (
              <div className="h-full flex items-center justify-center p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-3xl">
                  {config.suggestionCards.cards.map((suggestion, index) => (
                    <SuggestionCard
                      key={index}
                      icon={<SuggestionIcon icon={suggestion.icon} />}
                      title={suggestion.title}
                      question={suggestion.question}
                      onClick={() => handleSuggestionClick(suggestion.question)}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.sender === "bot" && (
                      <img
                        src={config.chat.assistant.avatar}
                        alt="Assistant Avatar"
                        className="w-8 h-8 rounded-lg mr-2 self-start mt-4"
                      />
                    )}
                    <div className={`relative group max-w-[70%]`}>
                      {message.sender === "user" && (
                        <button
                          onClick={() => handleEditMessage(index)}
                          className={`absolute -left-8 top-1/2 transform -translate-y-1/2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${isDarkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'
                            }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                      <div
                        className={`p-4 rounded-2xl break-words ${message.sender === "user"
                            ? isDarkMode
                              ? "bg-[#2F2F2F] text-white"
                              : "bg-[#F3F3F3] text-gray-800"
                            : isDarkMode
                              ? "text-white"
                              : "text-gray-800"
                        } ${index === editingMessageIndex ? 'ring-2 ring-blue-500' : ''}`}
                      >
                        {message.sender === "bot" ? (
                          <>
                            <ReactMarkdown
                              className={`prose ${isDarkMode ? 'prose-invert' : ''} max-w-none [&_pre]:bg-transparent [&_pre]:p-0`}
                              remarkPlugins={[remarkGfm]}
                              components={{
                                code: ({ node, inline, className, children, ...props }) => {
                                  if (inline) {
                                    return (
                                      <code
                                        className={`font-mono text-sm px-1 rounded inline-block ${
                                          isDarkMode
                                            ? 'bg-gray-800 text-gray-200'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}
                                        style={{ whiteSpace: 'pre-wrap', display: 'inline' }}
                                        {...props}
                                      >
                                        {children}
                                      </code>
                                    );
                                  }

                                  const match = /language-(\w+)/.exec(className || '');
                                  const language = match ? match[1] : '';

                                  const [lang, ...pathParts] = language.split(':');
                                  const filePath = pathParts.join(':');

                                  return (
                                    <div className={`rounded-lg overflow-hidden my-4`}>
                                      {filePath && (
                                        <div className={`px-4 py-2 text-sm border-b ${
                                          isDarkMode
                                            ? 'bg-gray-700 border-gray-600 text-gray-200'
                                            : 'bg-gray-200 border-gray-300 text-gray-700'
                                        }`}>
                                          {filePath}
                                        </div>
                                      )}
                                      <SyntaxHighlighter
                                        language={lang || 'text'}
                                        style={isDarkMode ? oneDark : oneLight}
                                        customStyle={{
                                          margin: 0,
                                          padding: '1rem',
                                        }}
                                        {...props}
                                      >
                                        {String(children).replace(/\n$/, '')}
                                      </SyntaxHighlighter>
                                    </div>
                                  );
                                },
                                a: ({ node, className, children, ...props }) => (
                                  <a
                                    className={`text-blue-500 hover:underline ${className || ''}`}
                                    {...props}
                                  >
                                    {children}
                                  </a>
                                ),
                                table: ({node, ...props}) => (
                                  <table className={`border-collapse my-4 w-full ${
                                    isDarkMode
                                      ? 'border-gray-700 text-gray-200'
                                      : 'border-gray-200 text-gray-800'
                                  }`} {...props} />
                                ),
                                th: ({node, ...props}) => (
                                  <th className={`border p-2 font-semibold ${
                                    isDarkMode
                                      ? 'border-gray-700 bg-gray-800'
                                      : 'border-gray-200 bg-gray-100'
                                  }`} {...props} />
                                ),
                                td: ({node, ...props}) => (
                                  <td className={`border p-2 ${
                                    isDarkMode
                                      ? 'border-gray-700 bg-gray-900/50'
                                      : 'border-gray-200 bg-white'
                                  }`} {...props} />
                                ),
                              }}
                            >
                              {message.text}
                            </ReactMarkdown>
                            {message.context && <MessageContext context={message.context} />}
                            <MessageFeedback
                              isDarkMode={isDarkMode}
                              onFeedback={(feedbackType) => handleMessageFeedback(index, feedbackType)}
                              existingFeedback={messageFeedbacks[index]}
                            />
                          </>
                        ) : (
                          <span className="whitespace-pre-wrap">{message.text}</span>
                        )}
                        {index === editingMessageIndex && (
                          <span className="ml-2 text-xs text-blue-500 font-medium">
                            (editing...)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Message input form - modified with fixed positioning */}
          <div
            className={`fixed bottom-0 right-0
              ${isSidebarOpen ? 'left-[50%] md:left-[20%]' : 'left-0'}
              ${isDarkMode ? 'bg-[#212121]' : 'bg-white'}`}
          >
            <form
              onSubmit={editingMessageIndex !== null ? handleEditSubmit : handleSendMessage}
              className="p-4"
            >
              <div className="flex space-x-4">
                <textarea
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    e.target.style.height = 'auto';
                    const maxHeight = 200; // Maximum height in pixels
                    const scrollHeight = Math.min(e.target.scrollHeight, maxHeight);
                    e.target.style.height = `${scrollHeight}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (editingMessageIndex !== null) {
                        handleEditSubmit(e);
                      } else {
                        handleSendMessage(e);
                      }
                    }
                  }}
                  placeholder={editingMessageIndex !== null ? config.chat.assistant.editPlaceholderText : config.chat.assistant.placeholderText}
                  rows="1"
                  className={`flex-1 px-4 py-3 border rounded-3xl focus:outline-none resize-none overflow-y-auto h-[40px] max-h-[200px] ${isDarkMode
                    ? 'bg-[#2F2F2F] border-gray-600 text-white placeholder-gray-400 focus:border-gray-500'
                    : 'bg-[#F3F3F3] border-gray-300 text-gray-900 focus:border-gray-400'
                  } ${editingMessageIndex !== null ? 'ring-2 ring-blue-500' : ''}`}
                />
                {editingMessageIndex !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMessageIndex(null);
                      setNewMessage("");
                      // Reset textarea height
                      const textarea = document.querySelector('textarea');
                      if (textarea) textarea.style.height = 'auto';
                    }}
                    className={`px-3 py-2 rounded-full self-end ${isDarkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      }`}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isWaitingForBot || !newMessage.trim()}
                  className={`w-10 h-10 rounded-full flex items-center justify-center focus:outline-none self-end
                    ${isWaitingForBot || !newMessage.trim()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : isDarkMode
                        ? 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                        : 'bg-[#F3F3F3] hover:bg-gray-200 text-gray-800'}`}
                >
                  {isWaitingForBot ? (
                    <div className="w-5 h-5 border-t-2 border-gray-600 rounded-full animate-spin" />
                  ) : (
                    <svg
                      className={`w-5 h-5 transform ${editingMessageIndex !== null ? '' : 'rotate-90'} ${isDarkMode ? 'text-gray-900' : 'text-gray-800'
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {editingMessageIndex !== null ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      )}
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
