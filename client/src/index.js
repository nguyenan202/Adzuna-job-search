import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';

import store from './redux/store';
import './index.css';
import theme from './theme';
import App from './App';
import { PersistGate } from 'redux-persist/integration/react';
import persistStore from 'redux-persist/es/persistStore';
import { ConfigProvider } from 'antd';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
    <PersistGate loading={null} persistor={persistStore(store)}>
      <ConfigProvider theme={theme}>
      <App />
      </ConfigProvider>
      </PersistGate>
    </BrowserRouter>
  </Provider>
  // </React.StrictMode>
);
