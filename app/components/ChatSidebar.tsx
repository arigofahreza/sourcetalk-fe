'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

interface ChatSidebarProps {
  onNewChat: () => void;
  chatHistory: ChatHistory[];
  currentChatId?: string;
  onSelectChat: (chatId: string) => void;
}

export default function ChatSidebar({ 
  onNewChat, 
  chatHistory, 
  currentChatId,
  onSelectChat 
}: ChatSidebarProps) {
  const [activeSection, setActiveSection] = useState('chat');
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Set active section based on current path
  useEffect(() => {
    if (pathname === '/') {
      setActiveSection('home');
    } else if (pathname === '/materials') {
      setActiveSection('materials');
    } else if (pathname === '/suppliers') {
      setActiveSection('suppliers');
    } else if (pathname === '/chat') {
      setActiveSection('chat');
    }
  }, [pathname]);

  const navigationItems = [
    {
      id: 'home',
      name: 'Home',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      action: () => router.push('/')
    },
    {
      id: 'materials',
      name: 'Materials',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      action: () => router.push('/materials')
    },
    {
      id: 'suppliers',
      name: 'Suppliers',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      action: () => router.push('/suppliers')
    },
    {
      id: 'chat',
      name: 'Chat',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      action: () => setActiveSection('chat')
    }
  ];

  const suggestions = [
    "What's something you've learned...",
    "If you could teleport anywhere...",
    "What's one goal you want to ac...",
    "Ask me anything weird or ran...",
    "How are you feeling today, reall...",
    "What's one habit you wish you..."
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">B</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">SourceTalk</h1>
        </div>
        
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <kbd className="absolute right-3 top-2 px-1.5 py-0.5 text-xs bg-gray-100 border border-gray-200 rounded text-gray-500">⌘</kbd>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-4 py-2">
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                item.action();
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                activeSection === item.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
        
        {/* New Chat Button - hanya tampil di chat section */}
        {activeSection === 'chat' && (
          <button
            onClick={onNewChat}
            className="w-full mt-3 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Chat</span>
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 px-4 py-2 overflow-y-auto">
        {activeSection === 'chat' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Suggestions</h3>
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1.5 px-2 rounded hover:bg-gray-50 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.username.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900">
              {user?.username || 'User'}
            </div>
            <div className="text-xs text-gray-500 truncate">Logged in user</div>
          </div>
          <button 
            onClick={logout}
            className="text-gray-400 hover:text-gray-600 p-1"
            title="Logout"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}