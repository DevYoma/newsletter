import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const RouterLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

export default RouterLayout;