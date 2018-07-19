import React from 'react';
import ReactDOM from 'react-dom';

import 'element-theme-default';
import "@/assets/css/bootstrap-reboot.min.css"
import "@/assets/css/bootstrap-grid.min.css"
import "@/assets/css/lib.css"

import App from './App';
import registerServiceWorker from './registerServiceWorker';



ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
