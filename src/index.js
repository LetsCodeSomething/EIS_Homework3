import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import './index.css';
import dataset from './dataset/Dataset';
import {Table} from "./components/Table";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

root.render(<>
    <h3>Данные по продажам в Walmart</h3>
    <Table dataset={dataset} rowsPerPage="25" selectedPage="0"/>
</>);