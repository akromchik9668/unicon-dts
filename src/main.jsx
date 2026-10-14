/** @jsx h */
import React from 'react';
import {createRoot} from 'react-dom/client';
import {h} from './i18n';
import Atlas from './Atlas';
import './light.css';
createRoot(document.getElementById('root')).render(<Atlas/>);
