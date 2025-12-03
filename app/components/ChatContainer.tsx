'use client';

import { useEffect, useRef } from 'react';
import { ChatMessage as ChatMessageType } from '../types/chat';
import ChatMessage from './ChatMessage';

interface ChatContainerProps {
  messages: ChatMessageType[];
  isLoading?: boolean;
}

export default function ChatContainer({ messages, isLoading }: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <span className="text-white text-2xl">SS</span>
          </div>
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">
            Welcome to SourceTalk!
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            I'm your catalogue assistant! Ready to help you explore and find what you're looking for.
          </p>
          
          <div className="text-sm text-gray-500 flex items-center justify-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Initiate a query or send a command to the AI...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}