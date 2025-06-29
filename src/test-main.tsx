import { createRoot } from 'react-dom/client'
import SimpleApp from './SimpleApp.tsx'

console.log('test-main.tsx loaded');

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<SimpleApp />);
  console.log('SimpleApp rendered');
} else {
  console.error('No root element found');
}