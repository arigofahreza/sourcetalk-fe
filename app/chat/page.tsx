'use client';

import { useState, useCallback } from 'react';
import { ChatMessage, ChatState } from '../types/chat';
import { ChatService } from '../services/chatService';
import ChatHeader from '../components/ChatHeader';
import ChatContainer from '../components/ChatContainer';
import ChatInput from '../components/ChatInput';
import ChatSidebar from '../components/ChatSidebar';

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

export default function ChatPage() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isTyping: false,
    error: undefined,
  });

  const [currentChatId, setCurrentChatId] = useState<string>('default');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatHistory] = useState<ChatHistory[]>([
    {
      id: '1',
      title: 'What\'s something you\'ve learned...',
      lastMessage: 'I learned that...',
      timestamp: '2 hours ago'
    },
    {
      id: '2', 
      title: 'How are you feeling today...',
      lastMessage: 'Today I feel...',
      timestamp: 'Yesterday'
    }
  ]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addMessage = useCallback((content: string, role: 'user' | 'assistant', isLoading = false) => {
    const newMessage: ChatMessage = {
      id: generateId(),
      content,
      role,
      timestamp: new Date(),
      isLoading,
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      error: undefined,
    }));

    return newMessage.id;
  }, []);

  const updateMessage = useCallback((messageId: string, content: string, isLoading = false) => {
    setChatState(prev => ({
      ...prev,
      messages: prev.messages.map(msg =>
        msg.id === messageId
          ? { ...msg, content, isLoading }
          : msg
      ),
    }));
  }, []);

  const removeMessage = useCallback((messageId: string) => {
    setChatState(prev => ({
      ...prev,
      messages: prev.messages.filter(msg => msg.id !== messageId),
    }));
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    // Add user message
    addMessage(message, 'user');

    // Add loading assistant message
    const assistantMessageId = addMessage('', 'assistant', true);

    setChatState(prev => ({ ...prev, isTyping: true }));

    try {
      // Call webhook API
      const response = await ChatService.sendMessage(message);
      console.log('Chat response:', response);

      if (response.success && response.message && response.message.trim()) {
        // Update assistant message with response
        updateMessage(assistantMessageId, response.message, false);
      } else {
        // Show error message for empty or failed response
        const errorMessage = response.error || 
          (!response.message || !response.message.trim() ? 
            'Sorry, I received an empty response. Please try again.' : 
            'Sorry, I encountered an error. Please try again.');
        
        updateMessage(assistantMessageId, errorMessage, false);
        setChatState(prev => ({ ...prev, error: response.error }));
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      // Handle unexpected errors
      updateMessage(
        assistantMessageId,
        'Sorry, I\'m having trouble connecting. Please check your connection and try again.',
        false
      );
      setChatState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }));
    } finally {
      setChatState(prev => ({ ...prev, isTyping: false }));
    }
  }, [addMessage, updateMessage]);

  const handleNewChat = useCallback(() => {
    setChatState({
      messages: [],
      isTyping: false,
      error: undefined,
    });
    setCurrentChatId('new-' + Date.now());
  }, []);

  const handleSelectChat = useCallback((chatId: string) => {
    setCurrentChatId(chatId);
    // In a real app, load chat history for this ID
  }, []);

  return (
    <div className="h-screen flex bg-gray-50 relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed lg:relative lg:translate-x-0 inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out lg:z-auto`}>
        <ChatSidebar
          onNewChat={handleNewChat}
          chatHistory={chatHistory}
          currentChatId={currentChatId}
          onSelectChat={handleSelectChat}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader
          onNewChat={handleNewChat}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <ChatContainer
          messages={chatState.messages}
          isLoading={chatState.isTyping}
        />

        {chatState.error && (
          <div className="mx-4 mb-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-red-700">
                Error: {chatState.error}
              </span>
              <button
                onClick={() => setChatState(prev => ({ ...prev, error: undefined }))}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={chatState.isTyping}
          placeholder={chatState.isTyping ? "AI is thinking..." : "Type your message..."}
        />
      </div>
    </div>
  );
}