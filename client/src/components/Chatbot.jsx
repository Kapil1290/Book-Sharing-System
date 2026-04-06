import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import api from '../api/axios';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm your study assistant. How can I help you today?", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userText = input.trim();
        setMessages(prev => [...prev, { text: userText, sender: 'user' }]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await api.post('/ai/chat', { message: userText });
            const aiReply = res.data.reply;
            setMessages(prev => [...prev, { text: aiReply, sender: 'ai' }]);
        } catch (error) {
            console.error("Chat API Error details:", error.response?.data || error.message);
            const errorMessage = error.response?.data?.error || "Sorry, I am facing a network issue right now. Please try again later.";
            setMessages(prev => [...prev, { text: errorMessage, sender: 'error' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            {isOpen && (
                <div className="chatbot-window glass">
                    <div className="chatbot-header">
                        <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MessageSquare size={18} /> AI Assistant
                        </span>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className="chatbot-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-bubble ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="chat-bubble ai">
                                <div className="typing-indicator">
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} className="chatbot-input-area">
                        <input
                            type="text"
                            className="chatbot-input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            disabled={isLoading}
                        />
                        <button type="submit" className="chatbot-send-btn" disabled={!input.trim() || isLoading}>
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}

            {!isOpen && (
                <button className="chatbot-button" onClick={() => setIsOpen(true)}>
                    <MessageSquare size={28} />
                </button>
            )}
        </div>
    );
};

export default Chatbot;
