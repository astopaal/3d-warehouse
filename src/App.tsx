import { LanguageProvider } from './contexts/LanguageContext';
import { ApiProvider } from './contexts/ApiContext';
import { ProductionScene } from './components/production/ProductionScene';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <ApiProvider>
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
          <ProductionScene />
        </div>
      </ApiProvider>
    </LanguageProvider>
  );
}

export default App;
