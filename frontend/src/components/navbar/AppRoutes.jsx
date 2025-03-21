import React from 'react';
import { Routes, Route } from 'react-router-dom';

import SearchPage from '../../pages/SearchPage';
import DashboardPage from '../../pages/DashboardPage';
import HistoryPage from '../../pages/HistoryPage';
import NewsPage from '../../pages/NewsPage';
import WatchlistPage from "../../pages/WatchlistPage";
import SignupPage from '../../pages/SignupPage';
import ProfilePage from "../../pages/ProfilePage";
import LoginPage from '../../pages/LoginPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<SearchPage />} />
      <Route path='/dashboard' element={<DashboardPage />} />
      <Route path='/history' element={<HistoryPage />} />
      <Route path='/news' element={<NewsPage />} />
      <Route path='/watchlist' element={<WatchlistPage />} />
      <Route path='/signup' element={<SignupPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/profile' element={<ProfilePage />} />
    </Routes>
  );
}

export default AppRoutes;
