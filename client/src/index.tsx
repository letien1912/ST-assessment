import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}></Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </BrowserRouter>
);
