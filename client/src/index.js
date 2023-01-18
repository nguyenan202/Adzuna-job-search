import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'

import store from './redux/store';
import './index.css';
import theme from './theme';
import App from './App';
import { PersistGate } from 'redux-persist/integration/react';
import persistStore from 'redux-persist/es/persistStore';
import { ConfigProvider } from 'antd';

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
    <QueryClientProvider client={queryClient}>
    <PersistGate loading={null} persistor={persistStore(store)}>
      <ConfigProvider theme={theme}>
      <App />
      </ConfigProvider>
      </PersistGate>
    </QueryClientProvider>
    </BrowserRouter>
  </Provider>
  // </React.StrictMode>
);
