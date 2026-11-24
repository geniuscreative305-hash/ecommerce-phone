'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User as UserIcon,
  HelpCircle,
  ShieldCheck,
  RotateCcw,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { askGeminiBrandAssistant } from '@/app/api/ai-assistant/actions';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_PROMPTS = [
  'Bandingkan iPhone 16 Pro vs Galaxy S24 Ultra',
  'HP Kamera Terbaik di rentang 5-8 Juta?',
  'Perbedaan Garansi Resmi iBox, SEIN, dan TAM?',
  'HP Terbaik untuk Gaming Berat & Baterai Awet?',
  'Xiaomi vs Samsung di kelas menengah, pilih mana?',
];

export default function AiBrandAssistantModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Halo! Saya **Asisten AI Jaya Cell**. 📱✨\n\nBingung memilih brand atau tipe smartphone yang tepat? Saya siap membantu membandingkan spesifikasi, kelebihan, kekurangan, chipset, kamera, hingga jenis garansi resmi (iBox, SEIN, TAM) sebelum Anda membeli!\n\nAda yang ingin Anda tanyakan?',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: textToSend.trim() };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await askGeminiBrandAssistant(userMsg.content, messages);
      if (res.success && res.answer) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: res.answer },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              res.error ||
              'Maaf, terjadi kendala saat memproses jawaban. Silakan coba lagi sebentar.',
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Maaf, koneksi ke asisten AI sedang bermasalah. Silakan periksa koneksi internet Anda.',
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: 'assistant',
        content:
          'Riwayat konsultasi telah dibersihkan. Silakan tanyakan hal lain seputar perbandingan smartphone dan brand!',
      },
    ]);
  };

  // Simple formatting helper for markdown bold and bullet points
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-1.5 text-sm leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) {
            return <div key={idx} className="h-1" />;
          }

          // Bullet list items
          if (line.startsWith('* ') || line.startsWith('- ')) {
            const rawText = line.replace(/^[\*\-]\s+/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-blue-500 font-bold mt-0.5">•</span>
                <span>{renderBoldSpans(rawText)}</span>
              </div>
            );
          }

          // Numbered list items
          if (/^\d+\.\s+/.test(line)) {
            const match = line.match(/^(\d+\.)\s+(.*)/);
            if (match) {
              return (
                <div key={idx} className="flex items-start gap-2 pl-2">
                  <span className="text-blue-600 font-semibold">{match[1]}</span>
                  <span>{renderBoldSpans(match[2])}</span>
                </div>
              );
            }
          }

          return <p key={idx}>{renderBoldSpans(line)}</p>;
        })}
      </div>
    );
  };

  const renderBoldSpans = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <>
      {/* Floating Launcher Button (Bottom-Left) */}
      {!isOpen && (
        <div className="fixed bottom-6 left-6 z-40">
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Tanya AI Asisten Brand Jaya Cell"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-medium text-blue-100 uppercase tracking-wider">Konsultasi Brand</div>
              <div className="text-sm font-bold leading-none">✨ Tanya AI Jaya Cell</div>
            </div>
            <span className="sm:hidden text-xs font-bold">✨ Tanya AI</span>
          </button>
        </div>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden ${
            isExpanded
              ? 'bottom-4 left-4 right-4 top-4 sm:left-auto sm:right-6 sm:bottom-6 sm:top-auto sm:w-[540px] sm:h-[680px]'
              : 'bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:w-[420px] h-[580px] max-h-[90vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white px-4 py-3.5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-amber-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white">AI Brand Advisor</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30 font-medium">
                    Gemini AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Konsultasi Spek & Brand Jaya Cell
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-300">
              <button
                onClick={handleReset}
                title="Bersihkan Percakapan"
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Kecilkan' : 'Perbesar'}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition hidden sm:block"
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Tutup"
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompts (Horizontal Scroll) */}
          <div className="bg-slate-50 border-b border-slate-100 px-3 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0">
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              Cepat:
            </span>
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                disabled={loading}
                onClick={() => handleSend(prompt)}
                className="shrink-0 px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-full text-slate-700 hover:text-blue-700 text-[11px] font-medium transition"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    renderFormattedContent(msg.content)
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-slate-500 ml-1">Menganalisis perbandingan smartphone...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Privacy Notice Badge */}
          <div className="px-3 py-1 bg-slate-100/80 border-t border-slate-200/60 flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Privasi aman: Pertanyaan diproses server-side tanpa membagikan data identitas Anda.</span>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanyakan tipe HP, chipset, kamera, garansi..."
              disabled={loading}
              className="flex-1 bg-slate-100 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition shadow-sm"
              title="Kirim Pertanyaan"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

