import M from "materialize-css/dist/js/materialize.min.js";
import reportWebVitals from './config/reportWebVitals';
import ReactDOM from 'react-dom';
import React from 'react';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';
import 'materialize-css/dist/css/materialize.min.css'
import 'material-icons/iconfont/filled.css';
import 'material-icons/iconfont/outlined.css';
import './styles/index.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

document.addEventListener('DomContentLoaded', function () {
  M.AutoInit();
});

reportWebVitals();
