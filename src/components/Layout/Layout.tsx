import { Outlet } from 'react-router-dom';
import Header from './Header';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout">
      <Header />
      <main className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <footer className="footer">
        <div className="container">
          <p>© 2024 WebTools. 모든 계산은 브라우저에서 실행됩니다.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;