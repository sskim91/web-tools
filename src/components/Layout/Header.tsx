import Link from 'next/link';
import { Calculator } from 'lucide-react';
import '@/src/styles/components/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Link href="/" className="logo">
            <Calculator size={28} />
            <span>WebTools</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
