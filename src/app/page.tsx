import Link from 'next/link';
import { TrendingUp, Type, LineChart, Plus, Tag } from 'lucide-react';
import '@/src/styles/pages/Home.css';

const tools = [
  {
    id: 'compound-interest',
    title: '복리 계산기',
    description: '복리 수익률과 미래 가치를 계산합니다',
    icon: TrendingUp,
    color: '#10b981',
    path: '/compound-interest',
  },
  {
    id: 'character-counter',
    title: '글자수 계산기',
    description: '텍스트의 글자수, 단어수, 바이트를 계산합니다',
    icon: Type,
    color: '#6366f1',
    path: '/character-counter',
  },
  {
    id: 'stock-average',
    title: '주식 물타기 계산기',
    description: '평균 매수가와 필요 자금을 계산합니다',
    icon: LineChart,
    color: '#f59e0b',
    path: '/stock-average',
  },
  {
    id: 'discount-calculator',
    title: '할인율 계산기',
    description: '단일 및 다중 할인 가격을 계산합니다',
    icon: Tag,
    color: '#f43f5e',
    path: '/discount-calculator',
  },
];

export default function HomePage() {
  return (
    <div className="home">
      <div className="hero">
        <h1 className="hero-title">
          <span className="gradient-text">Web Tools</span>
        </h1>
        <p className="hero-subtitle">빠르고 정확한 온라인 도구 모음</p>
      </div>

      <div className="tools-grid">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link href={tool.path} key={tool.id} className="tool-card">
              <div className="tool-icon" style={{ background: tool.color }}>
                <Icon size={28} />
              </div>
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
            </Link>
          );
        })}

        <div className="tool-card coming-soon">
          <div className="tool-icon">
            <Plus size={28} />
          </div>
          <h3>더 많은 도구</h3>
          <p>곧 추가될 예정입니다</p>
        </div>
      </div>
    </div>
  );
}
