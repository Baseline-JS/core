import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import About from './pages/About';
import Home from './pages/Home';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
]);

const App = () => <RouterProvider router={router} />;

export default App;
