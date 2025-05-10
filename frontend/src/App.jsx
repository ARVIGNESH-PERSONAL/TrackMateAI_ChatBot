import React, { useState } from "react";
import ChatBot from "react-chatbotify";
import './App.css';

const App = () => {
  const [data, setData] = useState({});
  const [projectOptions, setProjectOptions] = useState([
    "APT", "UI Automation", "Heinrishein"
  ]);
  const [statusOptions, setStatusOptions] = useState([
    "Development", "Training", "Testing"
  ]);
  const [projectSelected, setProjectSelected] = useState([{
    projectName: '', projectStatus: '', projectDescription: ''
  }]);

  const flow = {
    start: {
      message: "Hello! Welcome to United Techno Chatbot",
      path: "emailPrompt",
    },
    emailPrompt: {
      message: "Enter your email:",
      user: true,
      path: async (input) => {
  const res = await fetch("http://127.0.0.1:5000/api/check-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: input.userInput }),
  });

  const responseData  = await res.json();
  console.log("data", responseData );

  if (responseData .exists) {
    setData(prev => ({ ...prev, email: input.userInput })); // using React state
    return "askPassword";
  } else {
    return "emailError";
  }
},
    },
    emailError: {
      message: "❌ Incorrect email. Try again.",
      path: "emailPrompt",
    },
    askPassword: {
      message: "Enter your Password:",
      user: true,
      path: async (input) => {
  const res = await fetch("http://127.0.0.1:5000/api/verify-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      email: data.email,  // get from React state
      password: input.userInput 
    }),
  });

  const responseData  = await res.json();
  console.log("verify result", responseData );

  if (responseData .exists) {
    setData(prev => ({
      ...prev,
      password: input.userInput ,
      isAdmin: responseData .isAdmin === "true" ? "Admin" : "User"
    }));

    return responseData .isAdmin === "Admin" ? "adminDashboard" : "userGreetings";
  } else {
    return "askPassword";
  }
      },
    },
    userGreetings: {
      message: "Select the project:",
      options: projectOptions,
      path: async (input) => {
        if (input.userInput) {
          setProjectSelected(prevProjects => {
            const newProject = { projectName: input.userInput, projectStatus: '', projectDescription: '' };
            return [...prevProjects, newProject];
          });

          return "userStatus";
        } else {
          return "userGreetings";  // Retry if no project selected
        }
      },
    },
    userStatus: {
      message: "Enter your project Status:",
      options: statusOptions,
      path: async (input) => {
        if (input.userInput) {
          setProjectSelected(prevProjects => {
            const updatedProjects = prevProjects.map(project => {
              if (project.projectName === prevProjects[prevProjects.length - 1].projectName) {
                return { ...project, projectStatus: input.userInput };
              }
              return project;
            });
            return updatedProjects;
          });

          return "userDescription";
        } else {
          return "userStatus";  // Retry if no status selected
        }
      },
    },
    userDescription: {
      message: "Enter your project Details:",
      path: async (input) => {
        if (input.userInput) {
          setProjectSelected(prevProjects => {
            const updatedProjects = prevProjects.map(project => {
              if (project.projectName === prevProjects[prevProjects.length - 1].projectName) {
                return { ...project, projectDescription: input.userInput };
              }
              return project;
            });
            return updatedProjects;
          });

          return "anyThingElse";
        } else {
          return "userDescription";  // Retry if no description provided
        }
      },
    },
    anyThingElse: {
      message: "Is there anything else I can help you with?",
      options: ["Yes", "No"],
      path: async (input) => {
        if (input.userInput === "Yes") {
          setProjectSelected(prevProjects => [
            ...prevProjects,
            { projectName: "", projectDescription: "", projectStatus: "" },
          ]);
          return "userGreetings";  // Start with a new project
        } else {
          return "End";  // End the conversation
        }
      },
    },
    End: {
      message: "Thanks for updating the Status.",
    },
  };

  return (
    <ChatBot
      flow={flow}
      settings={{
        general: { embedded: true },
        header: {
          visible: false,
          title: "Welcome to United Techno Support",
          style: { color: "red", fontSize: "18px", fontWeight: "bold" },
        },
      }}
    />
  );
};

export default App;
