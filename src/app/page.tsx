'use client'

import React, { useState } from 'react'
import { GoogleGenerativeAI } from "@google/generative-ai"
import Image from 'next/image';
import img from "./../../public/robot.jpg"
import img1 from "./../../public/human.jpg"


type ChatMessageType = {
  role: string;
  content: string;
}



// export async function POST(req: Request): Promise<NextResponse> {
//   try {
//     const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
//     const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     return NextResponse.json({
//       success: true,
//       data: model,
//     });
//   } catch (error) {
//     return NextResponse.json({
//       success: false,
//       error: error.message,
//     });
//   }
// }


export default function page() {
  const [userInput, setUserInput] = useState<string>('')
  const [chatHistory, setChatHistory] = useState<ChatMessageType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY); // Ensure API key is correctly set up
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Define the model here

  const handleUserInput = async () => {
    setIsLoading(true);

    // Add the user input to the chat history
    setChatHistory((prevChat) => [
      ...prevChat,
      { role: 'user', content: userInput },
    ]);

    try {
      const prompt = "Write a story about a magic backpack.";

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

  return (
    <div className='bg-gray-100 min-h-screen flex flex-col justify-center items-center'>

      <div className='w-full max-w-screen-md bg-white rounded-t-xl rounded-b-2xl shadow-xl shadow-sky-800'>
        <div className='flex items-center justify-between mb-4'>
          {/* Header */}
          <div className='w-full p-3 bg-gradient-to-r from-[#7671db] via-[#918de0] to-[#b9b2fb] rounded-t-xl'>
            {/* <div className='text-2xl font-bold px-1 m-2 text-violet-600 mb-4'>AI Chatbot</div> */}
            <div>
              <div className="flex justify-end space-x-6">
                <div className="w-4 h-4 bg-violet-50 rounded-full"></div>
                <div className="w-4 h-4 bg-violet-50 rounded-full"></div>
                <div className="w-4 h-4 bg-[#7671db] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        {/* Messages */}
        <div className='mb-4' style={{ height: "400px", overflow: 'auto' }}>
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`flex items-start mb-2 text-sm text-gray-600 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
            >
              {/* Image for User or Assistant */}
              <div className="flex-shrink-0">
                {message.role === 'user' ? (
                  <Image
                    src= {img1} // Replace with the actual human image path
                    alt="User"
                    className="h-8 w-8 rounded-full mx-2"
                  />
                ) : (
                  <Image
                    src={img} // Replace with the actual robot image path
                    alt="Assistant"
                    className="h-8 w-8 rounded-full mx-2"
                  />
                )}
              </div>

              {/* Message Content */}
              <div
                className={`inline-block p-2 rounded-md max-w-md ${message.role === 'user'
                    ? 'bg-gradient-to-r from-[#7671db] to-[#4f65d2] text-white'
                    : 'bg-gradient-to-r from-[#b9c3e8] to-[#697bd2] text-gray-800'
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
            className='flex-1 w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-l-lg'
            placeholder='Ask me anything...'
          />
          {isLoading ? (
            <div className='bg-[#4bb9db] text-white p-2 rounded-sm shadow-l-2xl shadow-[#4bb9db] animate-pulse'>
              Loading...
            </div>
          ) : (
            <button
              disabled={isLoading}
              onClick={handleUserInput}
              className={`px-4 py-2 font-sans ${isLoading ? 'opacity-50 cursor-not-allowed' : 'bg-[#1466a9] hover:bg-cyan-500 hover:duration-300 text-white p-2 border-transparent rounded-r-lg'}`}
            >
              Send
            </button>
          )}

        </div>
        <div className=' bg-[#99bfda] py-3 rounded-b-2xl shadow-xl shadow-[#a2c0d7]'>

        </div>
      </div>
    </div>
  )
}
