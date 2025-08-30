import { Link } from 'react-router-dom';
import { Calculator, Menu, X } from 'lucide-react';
import { useState } from 'react';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Link to="/" className="logo">
            <Calculator size={28} />
            <span>WebTools</span>
          </Link>

          <button className="mobile-menu-btn" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <Link to="/compound-interest" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              복리 계산기
            </Link>
            <Link to="/character-counter" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              글자수 계산기
            </Link>
            <Link to="/stock-average" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              주식 물타기
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
