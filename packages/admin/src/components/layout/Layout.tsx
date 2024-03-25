import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';

const Layout = () => (
  <>
    <Sidebar />
    <Outlet />
  </>
);

export default Layout;
