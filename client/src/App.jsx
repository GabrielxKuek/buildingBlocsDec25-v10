import TestPage from './pages/TestPage'
import ErrorPage from './pages/ErrorPage'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Evolve from './components/pokemon.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/test" element={<TestPage />} />
        <Route path="/pokemon" element={<Evolve foodSaved={120}/>} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
