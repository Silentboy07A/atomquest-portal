import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function AICoachWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! I am your AtomQuest AI Coach. I can help you set better goals, analyze your performance, or align with company strategy. How can I assist?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { currentUser, goals, activeCycle } = useStore();
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const context = `User: ${currentUser.name}, Role: ${currentUser.role}, Department: ${currentUser.department}. Active Cycle: ${activeCycle?.name}. Goals: ${JSON.stringify(goals.filter(g => g.userId === currentUser.id).map(g => ({ title: g.title, progress: g.progress, status: g.status })))}`;

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: `You are an expert HR Performance Coach for AtomQuest. Keep responses extremely concise (max 3 sentences), encouraging, and actionable. Use this context: ${context}` },
            { role: 'user', content: userMsg }
          ],
          temperature: 0.7,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'ai', text: data.choices[0].message.content }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I'm taking a break. Please try again later!" }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "Network error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-6 w-80 h-[400px] flex flex-col rounded-2xl shadow-2xl z-50 overflow-hidden border border-[var(--color-dark-600)]"
            style={{ background: 'var(--color-dark-800)' }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-[var(--color-dark-700)] flex justify-between items-center bg-[var(--color-dark-900)]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[var(--color-accent-600)] flex items-center justify-center shadow-lg shadow-[var(--color-accent-600)]/20">
                  <Bot size={14} className="text-white" />
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-white leading-tight">AI Coach</h3>
                  <p className="text-[10px] text-[var(--color-dark-300)]">AtomQuest Intelligence</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-[var(--color-dark-400)] hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-[12px] leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[var(--color-accent-600)] text-white rounded-br-sm' 
                      : 'bg-[var(--color-dark-700)] text-[var(--color-dark-100)] rounded-bl-sm border border-[var(--color-dark-600)]'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[var(--color-dark-700)] text-[var(--color-dark-300)] p-3 rounded-2xl rounded-bl-sm border border-[var(--color-dark-600)] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-dark-400)] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-dark-400)] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-dark-400)] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-[var(--color-dark-900)] border-t border-[var(--color-dark-700)]">
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about your performance..."
                  className="flex-1 bg-[var(--color-dark-800)] border border-[var(--color-dark-600)] rounded-xl px-3 py-2 text-[12px] text-white focus:outline-none focus:border-[var(--color-accent-500)]"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="w-8 h-8 rounded-xl bg-[var(--color-accent-600)] flex items-center justify-center text-white disabled:opacity-50 transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[var(--color-accent-600)] shadow-lg shadow-[var(--color-accent-600)]/30 flex items-center justify-center text-white z-50 border-2 border-[var(--color-dark-800)]"
      >
        {isOpen ? <X size={20} /> : <Sparkles size={20} />}
      </motion.button>
    </>
  );
}
