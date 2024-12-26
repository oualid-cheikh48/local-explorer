import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Chat.css';

function Chat({ updateActivities }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    // Fonction pour envoyer un message
    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages((prev) => [...prev, userMessage]);

        setInput(''); 

        try {
            const response = await axios.post('http://localhost:5000/chatbot', {
                message: input,
                location: 'Lyon',
                weather: 'Clair',
            });

            const activities = response.data.activities || [];

            if (activities.length > 0) {
                const botMessage = {
                    text: "Voici quelques suggestions d'activités supplémentaires.",
                    sender: 'bot',
                };
                setMessages((prev) => [...prev, botMessage]);
                updateActivities(activities);
            } else {
                const botMessage = {
                    text: "Je n'ai trouvé aucune activité correspondante.",
                    sender: 'bot',
                };
                setMessages((prev) => [...prev, botMessage]);
            }
        } catch (error) {
            console.error('Erreur lors de la recherche des activités :', error);
            setMessages((prev) => [
                ...prev,
                { text: 'Erreur lors de la recherche des activités.', sender: 'bot' },
            ]);
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">Chat - Activités</div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-container">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Posez une question..."
                />
                <button onClick={sendMessage}>➤</button>
            </div>
        </div>
    );
}

export default Chat;
