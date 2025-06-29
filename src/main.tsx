import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('main.tsx loaded');

const rootElement = document.getElementById("root");
console.log('Root element:', rootElement);

if (!rootElement) {
  console.error('Root element not found!');
  document.body.innerHTML = '<h1 style="color: red;">Root element not found!</h1>';
} else {
  console.log('Creating React root...');
  try {
    const root = createRoot(rootElement);
    console.log('React root created, rendering App...');
    root.render(<App />);
    console.log('App rendered successfully');
  } catch (error) {
    console.error('Error rendering app:', error);
    rootElement.innerHTML = `<h1 style="color: red;">Error: ${error.message}</h1>`;
  }
}
