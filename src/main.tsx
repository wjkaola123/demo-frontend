import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import { store } from './lib/redux-store'
import { ThemeProvider } from './lib/theme-provider'
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </Provider>,
);
