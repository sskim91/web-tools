import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import CompoundInterest from './pages/CompoundInterest';
import CharacterCounter from './pages/CharacterCounter';
import StockAverage from './pages/StockAverage';
import DiscountCalculator from './pages/DiscountCalculator';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="compound-interest" element={<CompoundInterest />} />
          <Route path="character-counter" element={<CharacterCounter />} />
          <Route path="stock-average" element={<StockAverage />} />
          <Route path="discount-calculator" element={<DiscountCalculator />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
