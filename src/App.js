import { HelmetProvider } from 'react-helmet-async';
import ThemeProvider from './theme';
import React from 'react';
import AppRouter from './AppRouter';
import { StyledChart } from './components/chart';
import 'simplebar-react/dist/simplebar.min.css';


function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <StyledChart />
        <div className="App">
          <AppRouter />
        </div>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
