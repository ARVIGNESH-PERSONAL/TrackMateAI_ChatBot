import React, { useState } from "react";
import ChatBot, { useMessages }from "react-chatbotify";
import './App.css';
import logo from '../src/assets/ut_logo.png'
import burger from './assets/align-justify.svg'
import backImg from'./assets/pictu.webp'
import robot from'../public/robot_logo.png'
import 'primeflex/primeflex.css';
import BotIcon from './assets/robot.png'
import UserIcon from './assets/man.png'


const App = () => {
  const [data, setData] = useState({});
    const { clearMessages  } = useMessages();

  const [projectOptions, setProjectOptions] = useState([
    "APT", "UI Automation", "Heinrishein"
  ]);
  const [statusOptions, setStatusOptions] = useState([
    "Development", "Training", "Testing"
  ]);
  const [projectSelected, setProjectSelected] = useState([{
    projectName: '', projectStatus: '', projectDescription: ''
  }]);
  const[count , setCount] = useState(0)
  const[responseData , setResponseData] = useState(0)
  

    const settings = {
    general: { embedded: true },
    header: {
      visible: false,
      title: "Track Bot",
      style: { color: "red", fontSize: "18px", fontWeight: "bold" }
    },
    botBubble: {
    showAvatar: true,
    avatar: BotIcon,  // Path to your bot icon
  },
  userBubble: {
    showAvatar: true,
    avatar: UserIcon, // Path to your user icon
  },
  audio:{
    disabled:false
  },
  voice: {disabled: false},
  device:{
    desktopEnabled:true,
    mobileEnabled:true,
    applyMobileOptimizations:true
  }
  };


  const flow = {
    start: {
      message: "Hello! Welcome to United Techno Chatbot",
      path: "emailPrompt",
      user:true,
      transition: {duration: 1000}
    },
    emailPrompt: {
      message: " May I have your Email please?",
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
      message: "❌ The Email provided was not matching with our records. Try again.",
      path: "emailPrompt",
      transition: {duration: 2000}   
    },
    askPassword: {
      message: "Let’s verify—could you enter your password?",
      user: false,
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
  console.log("verify result", responseData.isValid[0] );

  if(responseData.isValid[0]  !== "Admin"){
  const projectRes = await fetch("http://127.0.0.1:5000/api/getall-projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      email: data.email,  // get from React state
    }),
  });
  const projectResData  = await projectRes.json();
  console.log("verify result", projectResData );
  setProjectOptions(projectResData.projects)
  }
  



  if (responseData .isValid[0]) {
    setData(prev => ({
      ...prev,
      password: input.userInput ,
      isAdmin: responseData.isValid[0]  === "Admin" ? "Admin" : "User"
    }));

    return responseData.isValid[0] === "Admin" ? "adminDashboard" : "userGreetings";
  } else {
    return "PasswordError";
  }
      },
    },
     PasswordError: {
      message: "❌ Incorrect Password. Try again.",
      path: "askPassword",
      transition: {duration: 2000}   
    },
    userGreetings: {
      message: "Please choose a project from the list below",
      options: projectOptions,
      chatDisabled: true,
      path: async (input) => {
        if (input.userInput) {
          
          setProjectSelected(projectSelected.map((projectSelected, index) => {
            if (index === count) {
              return {
                ...projectSelected,
                projectName: input.userInput 
              };
            } else {
              return projectSelected;
            }
          }));

          return "userStatus";
        } else {
          return "userGreetings";  // Retry if no project selected
        }
      },
    },
    userStatus: {
      message: "Enter your project Status:",
      options: statusOptions,
      chatDisabled: true,
      path: async (input) => {
        if (input.userInput) {
          setProjectSelected(projectSelected.map((projectSelected, index) => {
            if (index === count) {
              return {
                ...projectSelected,
                projectStatus: input.userInput 
              };
            } else {
              return projectSelected;
            }
          }));

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
          setProjectSelected(projectSelected.map((projectSelected, index) => {
            if (index === count) {
              return {
                ...projectSelected,
                projectDescription: input.userInput 
              };
            } else {
              return projectSelected;
            }
          }));

          return "anyThingElse";
        } else {
          return "userDescription";  // Retry if no description provided
        }
      },
    },
    anyThingElse: {
      message: "Is there anything else I can help you with?",
      options: ["Yes", "No"],
      chatDisabled: true,
      path: async (input) => {
        if (input.userInput === "Yes") {
          setCount(count+1)
          setProjectSelected(prevProjects => [
            ...prevProjects,
            { projectName: "", projectDescription: "", projectStatus: "" },
          ]);
          return "userGreetings";  // Start with a new project
        } else {
          const res = await fetch("http://127.0.0.1:5000/api/add-task", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              email: data.email,  // get from React state
              projectDetails: projectSelected
            }),
          });

          return "End";  // End the conversation
        }
      },
    },
    adminDashboard:{
      message: "How can I help you today",
      path: async (input) => {
        if (input.userInput) {
          const res = await fetch("http://127.0.0.1:5000/api/admin/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              question: input.userInput 
            }),
          });
          const responseData  = await res.json();
          console.log("verify result", responseData);
          setResponseData(responseData)

          return "responseLoader";
        } else {
          return "adminDashboard";  // Retry if no project selected
        }
      },
    },
    responseLoader:{
      message: `yes I can help you with that '${responseData.response}'`,
      path: async (input) => {
        if(input.userInput){
        return "adminElseStatement"
        }
        else{
          return "adminElseStatement"
        }
      },
    },
    adminElseStatement:{
      message: "Hope my answer helps you is there any thing else I can help you with",
      options:["Yes", "No"],
      chatDisabled: true,
      path: async (input) => {
        if (input.userInput === "Yes") {
          
          return "adminDashboard";  // Start with a new project
        } else {
          
          return "End";  // End the conversation
        }
      
      }

    },
    End: {
      message: "Thank you for using United Techno Support. If you need anything else, feel free to reach out. Have a great day!" ,
      path:  async (input, { }) => {
    await new Promise(resolve => setTimeout(resolve, 3000)); 
    clearMessages () 
    return 'start'; 
  },
      transition: {duration: 10000}
    },
  };

  console.log('project details' , projectSelected , count)
  return (
    <div>
      <div class="md-col-5 lg-col-6 sm-col-10">
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 9999 }}>
    <ChatBot
        flow={flow}
        settings={settings}
    />
    </div>
    </div>
    <div>
      <div class="header_section">
      <img src={logo} class="ut-logo" >
      </img>
      {/* <img src ={burger} class="burger-icon">
      </img> */}
      </div>
      {/* <div class="Section">
      <img src={backImg} class="back-image">
      </img>
      </div> */}
      <div class="div_section">
         <div class="glow mt-24 ml-24 d-flex md-col-4 lg-col-4 sm-col-12 ">Track your team's Progress with us</div>
         <div class="  para mt-16 ml-16 d-flex md-col-6 lg-col-4 sm-col-12 ">TrackBot is an intelligent assistant designed to collect task progress from users and assist administrators with real-time insights, streamlining project monitoring and communication</div>
      </div>
    </div>

    </div>

  );
};

export default App;
