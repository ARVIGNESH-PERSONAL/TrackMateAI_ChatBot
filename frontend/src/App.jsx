import React from "react";
import ChatBot from "react-chatbotify";

const flow = {
  start: {
    message: "Hi,\nEnter your email:",
    path: "emailInput",
  },
  emailInput: {
    user: true,
    path: async (input, { setState }) => {
      console.log("Test", input); // Log the input email

      const res = await fetch("http://127.0.0.1:5000/api/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: input }),
      });
      const data = await res.json();
      console.log("Email check response:", data);

      if (data.exists) {
        setState({ email: input }); // Save the email to state
        return "askPassword"; // Move to the next step
      } else {
        return {
          message: "Incorrect email.",
          path: "emailInput", // Stay in the current step if email is incorrect
        };
      }
    },
  },
  askPassword: {
    message: "Enter your password:",
    path: "passwordInput",
  },
  passwordInput: {
    user: true,
    path: async (input, { getState }) => {
      const email = getState().email; // Get the email from state

      const res = await fetch("http://127.0.0.1:5000/api/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: input }),
      });
      const data = await res.json();
      if (data.valid) {
        return {
          message: "Login successful!",
        };
      } else {
        return {
          message: "Incorrect password.",
          path: "passwordInput", // Stay in the current step if password is incorrect
        };
      }
    },
  },
};

const App = () => {
  return <ChatBot flow={flow} settings={{ general: { embedded: true } }} />;
};

export default App;
