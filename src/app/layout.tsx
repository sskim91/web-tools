import type { Metadata } from 'next';
import Header from '@/src/components/Layout/Header';
import '@/src/styles/globals.css';
import '@/src/styles/variables.css';
import '@/src/styles/reset.css';
import '@/src/styles/components/Layout.css';

export const metadata: Metadata = {
  title: 'WebTools - 빠르고 정확한 온라인 도구 모음',
  description:
    '복리 계산기, 글자수 계산기, 주식 물타기 계산기, 할인율 계산기 등 일상에 필요한 다양한 온라인 도구를 제공합니다.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="layout">
          <Header />
          <main className="main">
            <div className="container">{children}</div>
          </main>
          <footer className="footer">
            <div className="container">
              <p>© 2025 WebTools. All Rights Reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
