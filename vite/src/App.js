import React, { useState, useEffect } from 'react';
import Register from './Register';
import Perfil from './Perfil';
import CrearHistoria from './CrearHistoria';
import StoriesPage from './pages/StoriesPage';
import NoticiasPage from './pages/NoticiasPage';
import StoryDetailPage from './pages/StoryDetailPage';
import { setCookie, getCookie, deleteCookie } from './cookieUtils';
import { useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';
import Sidebar from './Sidebar';
import './App.css';
// ...resto del código original copiado fielmente del frontend
