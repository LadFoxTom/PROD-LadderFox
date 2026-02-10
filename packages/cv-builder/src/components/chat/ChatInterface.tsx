'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  apiUrl: string;
  companyId: string;
  cvData: Record<string, unknown>;
  language?: string;
  primaryColor?: string;
  onCVUpdate: (updates: Record<string, unknown>) => void;
}

export function ChatInterface({
  apiUrl,
  companyId,
  cvData,
  language = 'en',
  primaryColor = '#4F46E5',
  onCVUpdate,
}: ChatInterfaceProps) {
  const OPENING_MESSAGE = "Hi! I'm your AI CV assistant. I'll help you build a professional CV step by step.\n\nLet's start with the basics — what's your full name?";

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'assistant-greeting',
      role: 'assistant',
      content: OPENING_MESSAGE,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);
    setStreamingContent('');

    try {
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch(`${apiUrl}/v1/cv-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Company-ID': companyId,
        },
        body: JSON.stringify({
          message: text.trim(),
          cvData,
          conversationHistory,
          language,
        }),
      });

      if (!response.ok) throw new Error('Chat request failed');
      if (!response.body) throw new Error('No response stream');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));

            if (data.type === 'cv_update' && data.updates) {
              onCVUpdate(data.updates);
            } else if (data.type === 'token' && data.content) {
              accumulated += data.content;
              setStreamingContent(accumulated);
            } else if (data.type === 'done') {
              const finalContent = data.response || accumulated;
              const assistantMsg: ChatMessage = {
                id: `assistant-${Date.now()}`,
                role: 'assistant',
                content: finalContent,
                timestamp: new Date(),
              };
              setMessages(prev => [...prev, assistantMsg]);
              setStreamingContent('');
              accumulated = '';
            } else if (data.type === 'error') {
              const errorMsg: ChatMessage = {
                id: `error-${Date.now()}`,
                role: 'assistant',
                content: data.message || 'Something went wrong. Please try again.',
                timestamp: new Date(),
              };
              setMessages(prev => [...prev, errorMsg]);
              setStreamingContent('');
            }
          } catch {
            // Skip malformed SSE lines
          }
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Connection error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
      setStreamingContent('');
    } finally {
      setIsStreaming(false);
    }
  }, [apiUrl, companyId, cvData, language, messages, onCVUpdate, isStreaming]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div style={{
              maxWidth: '85%',
              padding: '12px 16px',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              backgroundColor: msg.role === 'user' ? primaryColor : '#F1F5F9',
              color: msg.role === 'user' ? '#FFFFFF' : '#1E293B',
              fontSize: '14px',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Streaming message */}
        {(streamingContent || isStreaming) && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              maxWidth: '85%',
              padding: '12px 16px',
              borderRadius: '16px 16px 16px 4px',
              backgroundColor: '#F1F5F9',
              color: '#1E293B',
              fontSize: '14px',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {streamingContent || (
                <span style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#94A3B8', animation: 'hk-dot1 1.4s infinite' }} />
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#94A3B8', animation: 'hk-dot2 1.4s infinite' }} />
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#94A3B8', animation: 'hk-dot3 1.4s infinite' }} />
                  <style>{`
                    @keyframes hk-dot1 { 0%, 80%, 100% { opacity: 0.3; } 40% { opacity: 1; } }
                    @keyframes hk-dot2 { 0%, 80%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
                    @keyframes hk-dot3 { 0%, 80%, 100% { opacity: 0.3; } 60% { opacity: 1; } }
                  `}</style>
                </span>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '16px 20px',
          borderTop: '1px solid #E2E8F0',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-end',
        }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tell me about your experience..."
          disabled={isStreaming}
          rows={1}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            fontSize: '14px',
            fontFamily: 'inherit',
            lineHeight: '1.5',
            resize: 'none',
            outline: 'none',
            color: '#1E293B',
            backgroundColor: isStreaming ? '#F8FAFC' : '#FFFFFF',
            minHeight: '42px',
            maxHeight: '120px',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = primaryColor; e.currentTarget.style.boxShadow = `0 0 0 3px ${primaryColor}20`; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = 'none'; }}
        />
        <button
          type="submit"
          disabled={isStreaming || !input.trim()}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: isStreaming || !input.trim() ? '#CBD5E1' : primaryColor,
            color: '#FFFFFF',
            cursor: isStreaming || !input.trim() ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.2s',
          }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
          </svg>
        </button>
      </form>
    </div>
  );
}
