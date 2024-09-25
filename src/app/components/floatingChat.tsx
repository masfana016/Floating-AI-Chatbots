'use client';

import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Image from 'next/image';
import img from "./../../../public/robot.jpg";
import img1 from "./../../../public/human.jpg";
import { ChatBubbleLeftIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/outline';

// import { FlowerIcon } from '@heroicons/react/24/outline'; // Optional floral icon

type ChatMessageType = {
    role: string;
    content: string;
  };
  
  export default function FloatingChat() {
    const [userInput, setUserInput] = useState<string>('');
    const [chatHistory, setChatHistory] = useState<ChatMessageType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
  
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY); // Ensure API key is correctly set up
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Define the model here
  
    const toggleChat = () => {
      setIsOpen(!isOpen);
    };
  
    const handleUserInput = async () => {
      setIsLoading(true);
  
      // Add the user input to the chat history
      setChatHistory((prevChat) => [
        ...prevChat,
        { role: 'user', content: userInput },
      ]);
  
      try {
        const prompt = userInput; // Use the user input as the prompt
  
        // Use the AI model to generate a response
        const chatCompletion = await model.generateContent(prompt);
  
        // Add the generated content to the chat history
        setChatHistory((prevChat) => [
          ...prevChat,
          { role: 'assistant', content: chatCompletion.response.text() }, // Ensure to use the right key for the response content
        ]);
      } catch (error) {
        console.error("Error generating content:", error);
      }
  
      setUserInput(''); // Clear the input field
      setIsLoading(false); // Stop loading
    };
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000);
  
      return () => clearTimeout(timer);
    }, []);
  
    return (
      <div className="fixed bottom-6 right-6 z-50">
        {/* Chat Button */}
        <div
          className={`${
            isOpen ? 'hidden' : 'block'
          } bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white p-5 rounded-full cursor-pointer shadow-lg transition duration-300 ease-in-out transform hover:scale-110`}
          onClick={toggleChat}
        >
          <ChatBubbleLeftIcon className="w-8 h-8" />
        </div>
  
        {/* Chat Window */}
        <div
          className={`${
            isOpen ? 'block' : 'hidden'
          } bg-gradient-to-br from-purple-300 via-pink-300 to-yellow-300 rounded-2xl shadow-2xl w-[400px] h-[550px] flex flex-col p-6 transform transition-all duration-500 ease-in-out ${
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <HeartIcon className="w-8 h-8 text-yellow-600 mr-2" /> Chat with Us
            </h2>
            <button
              className="text-gray-500 hover:text-gray-700 transition ease-in-out"
              onClick={toggleChat}
            >
              <XMarkIcon className="w-8 h-8" />
            </button>
          </div>
  
          {/* Messages */}
          <div className='mb-6 overflow-y-auto flex-grow' style={{ maxHeight: "400px" }}>
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={`flex items-start mb-3 text-lg ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Image for User or Assistant */}
                <div className="flex-shrink-0">
                  {message.role === 'user' ? (
                    <Image
                      src={img1} // User Image
                      alt="User"
                      className="h-10 w-10 rounded-full mx-2"
                    />
                  ) : (
                    <Image
                      src={img} // Assistant Image
                      alt="Assistant"
                      className="h-10 w-10 rounded-full mx-2"
                    />
                  )}
                </div>
  
                {/* Message Content */}
                <div
                  className={`inline-block p-4 rounded-md max-w-[75%] transition duration-300 ease-in-out ${
                    message.role === 'user'
                      ? 'bg-[#eb9ceb] text-white shadow-md hover:bg-[#c240c2]'
                      : 'bg-[#d270d2] text-white shadow-md hover:bg-[#c240c2]'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
  
          {/* Input Area of Chatbot */}
          <div className='flex p-4'>
            <input
              type='text'
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className='flex-1 w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-l-lg text-lg'
              placeholder='Ask me anything...'
            />
            {isLoading ? (
              <div className='bg-[#4bb9db] text-white p-3 rounded-sm shadow-l-2xl shadow-[#4bb9db] animate-pulse'>
                Loading...
              </div>
            ) : (
              <button
                disabled={isLoading}
                onClick={handleUserInput}
                className={`px-6 py-3 font-sans ${isLoading ? 'opacity-50 cursor-not-allowed' : 'bg-[#1466a9] hover:bg-cyan-500 hover:duration-300 text-white p-2 border-transparent rounded-r-lg'}`}
              >
                <PaperAirplaneIcon className="w-6 h-6 transform rotate-45" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }