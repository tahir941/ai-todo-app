import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App.jsx'; // Your main App component
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // ✅ Enables collapse

import 'bootstrap-icons/font/bootstrap-icons.css';

//import './index.css'; // Optional: Your global styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App /> {/* Now App has access to Redux state */}
    </Provider>
  </React.StrictMode>
);