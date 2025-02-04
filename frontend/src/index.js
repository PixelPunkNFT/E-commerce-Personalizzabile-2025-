import React from "react";
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import { positions, transitions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import store from "./store";
import App from "./App";
import WhatsAppWidget from './component/components/chat/chat.component';
import { ChatProvider } from './component/contexts/chat.context';

const theme = createTheme();
const alertOptions = {
  timeout: 5000,
  position: positions.BOTTOM_CENTER,
  transition: transitions.SCALE,
  template: AlertTemplate
};

const root = createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <AlertProvider {...alertOptions}>
        <ChatProvider>
          <App />
          <WhatsAppWidget />
        </ChatProvider>
      </AlertProvider>
    </ThemeProvider>
  </Provider>
);
