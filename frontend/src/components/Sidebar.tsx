import React from 'react';
import { LayoutGrid, Layout, FileText, Settings, Users, Database, BarChart2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

interface MenuItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

const menuItems: MenuItem[] = [
  { label: 'Dashboard', icon: LayoutGrid, href: '/dashboard' },
  { label: 'Páginas', icon: Layout, href: '/page' },
  { label: 'Analytics', icon: BarChart2, href: '/analytics' },
  { label: 'Leads', icon: Users, href: '/leads' },
  { label: 'Collections', icon: Database, href: '/collections' },
  { label: 'Conteúdo', icon: FileText, href: '/content' },
  { label: 'Configurações', icon: Settings, href: '/settings' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <nav className="w-64 h-full bg-slate-900 text-white p-4 flex flex-col">
      <div className="mb-8 px-4">
        <h1 className="text-xl font-bold text-white">LexOnline</h1>
        <p className="text-xs text-slate-400 mt-1">Builder v9.1-debug</p>
      </div>

      <ul className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <li key={item.label}>
              <Link
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                )}
              >
                <item.icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
