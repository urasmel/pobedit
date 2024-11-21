import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from '@/app';


const rootNode = document.getElementById('root') as Element;
const root = createRoot(rootNode);
root.render(
    // <React.StrictMode>
    <BrowserRouter>
        <App />
    </BrowserRouter>
    // </React.StrictMode>
);
