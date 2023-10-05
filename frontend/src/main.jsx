import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { mode } from "@chakra-ui/theme-tools";
import { ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';

// following code helps to switch between light and dark theme. first color is light theme color whereas second one is dark color
const styles = {
  global: (props) => ({
    body: {
      color: mode("grey.800", "whiteAlpha.900")(props),
      bg: mode("grey.100", "#101010")(props)
    }
  })
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: true
};

const colors = {
  gray: {
    light: "#616161",
    dark: "#1e1e1e"
  }
};

const theme = extendTheme({ config, styles, colors });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <App />
      </ChakraProvider>
    </Router>
  </React.StrictMode>,
)
