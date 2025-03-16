import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SearchPage from '../../pages/SearchPage'
import DashboardPage from '../../pages/DashboardPage';
import HistoryPage from '../../pages/HistoryPage';
import NewsPage from '../../pages/NewsPage';


function AppRoutes() {
  return (
    <Routes>
        <Route path='/' element={<SearchPage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/history' element={<HistoryPage />} />
        <Route path='/news' element={<NewsPage />} />
    </Routes>
  )
}

export default AppRoutes;