import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { RouterProvider } from 'react-router-dom';
import { ApiProvider } from '@reduxjs/toolkit/query/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import { apiSlice } from '@api/apiSlice';
import { WidgetProvider } from '@context/widget';
import { AppProvider } from '@context/app/AppProvider';
import theme from './theme';
import router from './router';

import 'normalize.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.scss';


const ENABLE_NOTIFICATION = false;
const root = ReactDOM.createRoot(document.getElementById('uni-tab-root'));

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ApiProvider api={apiSlice}>
        <WidgetProvider>
          <AppProvider>
            <RouterProvider router={router} />
            <CssBaseline />
            {ENABLE_NOTIFICATION && (
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition: Bounce
              />
            )}
          </AppProvider>
        </WidgetProvider>
      </ApiProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

