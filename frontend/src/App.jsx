import React from 'react';
import ChatBot from 'react-chatbotify';

const flow = {
  start: {
    message: "Hello, how can I assist you today?",
    path: "askForTask"
  },
  askForTask: {
    message: "Please describe your task for the day.",
    path: "end"
  },
  end: {
    message: "Thank you for your update!",
  }
};

function App() {
  return (
    <div>
      <h1>Employee Daily Logs</h1>
      <ChatBot
        id="chatbot"
        settings={{
          general: {
            embedded: true // The chatbot is embedded on the page
          },
          voice: {
            disabled: false // Enabling voice for both input and output
          },
          chatHistory: {
            storageKey: "example_voice" // Key to store chat history in local storage
          }
        }}
        flow={flow}
      />
    </div>
  );
}

export default App;
