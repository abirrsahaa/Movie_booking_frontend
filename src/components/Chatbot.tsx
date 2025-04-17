import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Styled Components
const ChatbotIcon = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`;

const ChatbotContainer = styled.div`
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 320px;
  max-height: 500px;
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Arial', sans-serif;
  z-index: 1000;

  @media (max-width: 480px) {
    width: 90%;
    right: 5%;
    bottom: 70px;
  }
`;

const ChatHeader = styled.div`
  background: #007bff;
  color: white;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
`;

const ChatArea = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 300px; /* Add minimum height */

  /* Add these properties for better message wrapping */
  & > div {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }
`;

// Update the Message styled component
const Message = styled.div`
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
  /* Update margin and align-self properties */
  margin-left: ${(props) => (props.$isBot ? '0' : 'auto')};
  margin-right: ${(props) => (props.$isBot ? 'auto' : '0')};
  align-self: ${(props) => (props.$isBot ? 'flex-start' : 'flex-end')};
  background: ${(props) => (props.$isBot ? '#e9ecef' : '#007bff')};
  color: ${(props) => (props.$isBot ? '#333' : 'white')};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.2s ease-in;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const OptionButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  margin: 5px 10px 5px 0;
  transition: background 0.2s ease;

  &:hover {
    background: #0056b3;
  }
`;

const InputArea = styled.div`
  display: flex;
  border-top: 1px solid #dee2e6;
  background: #ffffff;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  padding: 12px 16px;
  font-size: 14px;
  outline: none;
  background: transparent;

  &::placeholder {
    color: #6c757d;
  }
`;

const SendButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 0 16px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 0.2s ease;

  &:hover {
    background: #0056b3;
  }
`;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Welcome to Wissen Entertainments ! How can I assist you?', isBot: true },
    { text: 'Movie Suggestions', isBot: true, isButton: true },
    { text: 'Theaters Nearby', isBot: true, isButton: true },
  ]);
  const [input, setInput] = useState('');

  const handleButtonClick = async (option) => {
    setMessages([...messages, { text: option, isBot: false }]);

    if (option === 'Movie Suggestions') {
      setMessages((prev) => [
        ...prev,
        { text: 'Want to see the latest movies or pick a genre?', isBot: true },
        { text: 'Latest Movies', isBot: true, isButton: true },
        { text: 'ComingSoon Movies', isBot: true, isButton: true },
        { text: 'By Genre', isBot: true, isButton: true },
      ]);
    } // Update in handleButtonClick function
    else if (option === 'Theaters Nearby') {
      setMessages((prev) => [
        ...prev,
        { text: 'Let me show you all our theaters.', isBot: true },
      ]);
      // Trigger the theater fetch immediately
      const response = await axios.get(`http://localhost:9090/theatres`);
      const theatres = response.data;
      
      if (theatres && theatres.length > 0) {
        setMessages((prev) => [
          ...prev,
          ...theatres.map(theatre => ({
            text: `🎬 ${theatre.name}\n📍 ${theatre.distance}`,
            isBot: true
          })),
          {
            text: 'Would you like to know about anything else?',
            isBot: true
          }
        ]);
      }
    } else if (option === 'Latest Movies') {
      handleLatestMovies();
    } 
    else if (option === 'ComingSoon Movies') {
      handleComingSoonMovies();
    } else if (option === 'By Genre') {
      setMessages((prev) => [
        ...prev,
        { text: 'Which genre? (e.g., Action, Comedy, Drama)', isBot: true },
      ]);
    }
  };

  const handleLatestMovies = async () => {
    setMessages([...messages, { text: 'Latest Movies', isBot: false }]);
    try {
      const nowShowing = await axios.get('http://localhost:9090/nowShowing');
      //const comingSoon = await axios.get('http://localhost:9090/comingSoon');
      setMessages((prev) => [
        ...prev,
        {
          text: `Latest Movies: ${nowShowing.data.map((m) => m.title).join(', ')}`,
          isBot: true,
        },
        { text: 'Anything else I can help with?', isBot: true },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: 'Sorry, something went wrong. Try again!', isBot: true },
      ]);
    }
  };

  const handleComingSoonMovies = async () => {
    setMessages([...messages, { text: 'ComingSoon Movies', isBot: false }]);
    try {
      //const nowShowing = await axios.get('http://localhost:9090/nowShowing');
      const comingSoon = await axios.get('http://localhost:9090/comingSoon');
      setMessages((prev) => [
        ...prev,
        {
          text: `Coming Soon: ${comingSoon.data.map((m) => m.title).join(', ')}`,
          isBot: true,
        },
        { text: 'Anything else I can help with?', isBot: true },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: 'Sorry, something went wrong. Try again!', isBot: true },
      ]);
    }
  };
const handleInputSubmit = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, isBot: false }]);
    setInput('');
  
    // Find the last bot message that isn't a button
    const lastBotMessage = [...messages]
      .reverse()
      .find(msg => msg.isBot && !msg.isButton)?.text || '';
  
    try {
      if (lastBotMessage.includes('Which genre?')) {  // Changed this condition
        const response = await axios.get(`http://localhost:9090/moviesByGenre/${input}`);
        const movies = response.data;
        setMessages((prev) => [
          ...prev,
          {
            text: movies.length
              ? `Here are some ${input} movies: ${movies.map((m) => m.title).join(', ')}`
              : `No ${input} movies found.`,
            isBot: true,
          },
          { text: 'Anything else I can help with?', isBot: true },
        ]);
      } else if (lastBotMessage.includes('enter a city')) {
        // ...existing city code...
        const response = await axios.get(`http://localhost:9090/api/theatres`);
        const theatres = response.data;
        
        if (theatres && theatres.length > 0) {
            setMessages(prev => [
              ...prev,
              {
                text: 'Here are all our theaters:',
                isBot: true
              },
              ...theatres.map(theatre => ({
                text: `🎬 ${theatre.name}\n📍 ${theatre.distance}`,
                isBot: true
              })),
              {
                text: 'Would you like to know about anything else?',
                isBot: true
              }
            ]);
          }
      else {
        setMessages(prev => [
          ...prev,
          {
            text: `Sorry, I couldn't find any theaters in ${input}. Please try another city.`,
            isBot: true
          }
        ]);
      }
    }else {
        setMessages((prev) => [
          ...prev,
          { text: "Sorry, I didn't get that. Try again!", isBot: true },
        ]);
      }
    } catch (error) {
      console.error('API Error:', error);  // Add error logging
      setMessages((prev) => [
        ...prev,
        { text: 'Sorry, something went wrong. Try again!', isBot: true },
      ]);
    }
  };
  return (
    <>
      {!isOpen && (
        <ChatbotIcon onClick={() => setIsOpen(true)}>💬</ChatbotIcon>
      )}
      {isOpen && (
        <ChatbotContainer>
          <ChatHeader>
        Wissen Chatbot
            <CloseButton onClick={() => setIsOpen(false)}>&times;</CloseButton>
          </ChatHeader>
          <ChatArea>
            {messages.map((msg, index) => (
              <div key={index}>
                {msg.isButton ? (
                  <OptionButton onClick={() => handleButtonClick(msg.text)}>
                    {msg.text}
                  </OptionButton>
                ) : (
                  <Message $isBot={msg.isBot}>{msg.text}</Message>
                )}
              </div>
            ))}
          </ChatArea>
          <InputArea>
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleInputSubmit()}
              placeholder="Type here..."
            />
            <SendButton onClick={handleInputSubmit}>&rarr;</SendButton>
          </InputArea>
        </ChatbotContainer>
      )}
    </>
  );
};

export default Chatbot;