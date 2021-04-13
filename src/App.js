import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom';

import Routes from './Routes';

function App() {
  return (
    <BrowserRouter>
      <main className="m-4">
        <Routes />
      </main>
    </BrowserRouter>
  );
}

export default App;
