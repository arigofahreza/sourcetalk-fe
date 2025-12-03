'use client';

import Link from 'next/link';
import { Headers } from './components/Headers';

export default function Home() {
  const menuItems = [
    {
      title: 'Materials',
      description: 'Browse and manage material inventory',
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      href: '/materials',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-indigo-50',
      hoverColor: 'hover:from-blue-100 hover:to-indigo-100'
    },
    {
      title: 'Suppliers',
      description: 'View and manage supplier information',
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      href: '/suppliers',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-pink-50',
      hoverColor: 'hover:from-purple-100 hover:to-pink-100'
    },
    {
      title: 'AI Assistant',
      description: 'Chat with AI to help you find information',
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      href: '/chat',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-emerald-50',
      hoverColor: 'hover:from-green-100 hover:to-emerald-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Headers />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-white text-3xl font-bold">SS</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to SourceTalk
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your complete solution for managing materials, suppliers, and getting AI-powered assistance
          </p>
        </div>

        {/* Menu Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={`bg-gradient-to-br ${item.bgColor} rounded-2xl p-8 border-2 border-transparent hover:border-gray-300 transition-all duration-300 ${item.hoverColor} cursor-pointer group h-full`}>
                <div className="flex flex-col items-center text-center h-full">
                  {/* Icon */}
                  <div className={`text-transparent bg-clip-text bg-gradient-to-r ${item.color} mb-4`}>
                    {item.icon}
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h2>
                  
                  {/* Description */}
                  <p className="text-gray-600 mb-6 flex-grow">
                    {item.description}
                  </p>
                  
                  {/* Button */}
                  <div className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${item.color} text-white font-medium rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105`}>
                    <span>Open {item.title}</span>
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-white rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Real-time Data</h4>
              <p className="text-sm text-gray-600">Access up-to-date information from Strapi CMS</p>
            </div>
            
            <div className="p-6 bg-white rounded-xl shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Advanced Filtering</h4>
              <p className="text-sm text-gray-600">Sort and filter data by multiple criteria</p>
            </div>
            
            <div className="p-6 bg-white rounded-xl shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">AI-Powered</h4>
              <p className="text-sm text-gray-600">Get instant answers with our chatbot assistant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}