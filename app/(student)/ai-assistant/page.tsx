'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Trash2,
  Copy,
  Check,
  Loader2,
  MessageSquare,
  BookOpen,
  Code,
  Lightbulb
} from 'lucide-react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Xin chào! 👋 Mình là AI Learning Assistant của LearnHub. Mình có thể giúp bạn:\n\n• Giải thích các khái niệm khó\n• Review code và debug\n• Suggest learning path\n• Trả lời câu hỏi về khóa học\n\nBạn muốn hỏi gì không? 😊',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau! 😔',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Xin chào! 👋 Mình là AI Learning Assistant của LearnHub. Bạn muốn hỏi gì không? 😊',
      timestamp: new Date()
    }]);
  };

  const quickActions = [
    { 
      icon: BookOpen, 
      title: 'Giải thích',
      description: 'Hỏi về bất kỳ khái niệm nào bạn chưa rõ',
      prompt: 'Giải thích cho tôi về ',
      color: 'blue' 
    },
    { 
      icon: Code, 
      title: 'Code Review',
      description: 'Paste code và nhận feedback chi tiết',
      prompt: 'Hãy review đoạn code này và cho tôi feedback:\n\n',
      color: 'purple' 
    },
    { 
      icon: Lightbulb, 
      title: 'Gợi ý',
      description: 'Nhận lộ trình học tập phù hợp',
      prompt: 'Tôi muốn trở thành Full-stack Developer. Hãy gợi ý lộ trình học cho tôi.',
      color: 'green' 
    }
  ];

  const quickQuestions = [
    { icon: BookOpen, text: 'Giải thích React Hooks', color: 'blue' },
    { icon: Code, text: 'Review đoạn code này', color: 'purple' },
    { icon: Lightbulb, text: 'Nên học gì tiếp theo?', color: 'green' },
    { icon: MessageSquare, text: 'Làm sao để debug?', color: 'orange' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="p-8 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="mb-2 text-3xl font-bold">AI Learning Assistant</h1>
                  <p className="text-blue-100">Trợ lý học tập thông minh của bạn</p>
                </div>
              </div>
              <button
                onClick={clearChat}
                className="flex items-center gap-2 px-4 py-2 transition-all rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm hover:scale-105"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Xóa chat</span>
              </button>
            </div>
          </div>

          {/* Chat Container */}
          <div className="bg-white border-b border-gray-200 shadow-xl rounded-b-2xl border-x">
            {/* Messages */}
            <div className="h-[600px] overflow-y-auto p-6 space-y-6">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex gap-4 animate-fade-in ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      message.role === 'user'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-5 h-5" />
                    ) : (
                      <Bot className="w-5 h-5" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div
                    className={`flex-1 ${
                      message.role === 'user' ? 'text-right' : ''
                    }`}
                  >
                    <div
                      className={`inline-block max-w-[80%] rounded-2xl px-6 py-4 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="break-words whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>

                    {/* Timestamp & Actions */}
                    <div
                      className={`flex items-center gap-2 mt-2 text-xs text-gray-500 ${
                        message.role === 'user' ? 'justify-end' : ''
                      }`}
                    >
                      <span>
                        {message.timestamp.toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {message.role === 'assistant' && (
                        <button
                          onClick={() => copyToClipboard(message.content, message.id)}
                          className="p-1 transition-colors rounded hover:bg-gray-200"
                          title="Copy"
                        >
                          {copiedId === message.id ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex gap-4 animate-fade-in">
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block px-6 py-4 bg-gray-100 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                        <span className="text-gray-600">Đang suy nghĩ...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions (show when no messages) */}
            {messages.length === 1 && (
              <div className="px-6 pb-6">
                <p className="mb-3 text-sm font-semibold text-gray-700">
                  💡 Câu hỏi gợi ý:
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {quickQuestions.map((q, index) => {
                    const Icon = q.icon;
                    const colors = {
                      blue: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
                      purple: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
                      green: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
                      orange: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
                    };

                    return (
                      <button
                        key={index}
                        onClick={() => setInput(q.text)}
                        className={`p-3 border-2 rounded-xl transition-all hover:scale-105 text-left flex items-center gap-3 ${
                          colors[q.color as keyof typeof colors]
                        }`}
                      >
                        <Icon className="flex-shrink-0 w-5 h-5" />
                        <span className="text-sm font-medium">{q.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-3">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập câu hỏi của bạn... (Enter để gửi, Shift+Enter để xuống dòng)"
                  className="flex-1 px-4 py-3 border-2 border-gray-300 resize-none rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span className="hidden sm:inline">Gửi</span>
                    </>
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-center text-gray-500">
                AI có thể sai. Hãy kiểm chứng thông tin quan trọng.
              </p>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid gap-4 mt-6 md:grid-cols-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const colors = {
                blue: 'bg-blue-100 hover:bg-blue-200 border-blue-200',
                purple: 'bg-purple-100 hover:bg-purple-200 border-purple-200',
                green: 'bg-green-100 hover:bg-green-200 border-green-200'
              };
              const iconColors = {
                blue: 'text-blue-600',
                purple: 'text-purple-600',
                green: 'text-green-600'
              };

              return (
                <button
                  key={index}
                  onClick={() => setInput(action.prompt)}
                  className={`text-left rounded-xl p-4 border-2 transition-all hover:scale-105 ${colors[action.color as keyof typeof colors]}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 bg-white rounded-lg flex items-center justify-center ${iconColors[action.color as keyof typeof iconColors]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{action.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    {action.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}