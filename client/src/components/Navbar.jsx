import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Calendar, TrendingUp, Compass } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/map', label: 'Map', icon: Map },
    { path: '/map-viewer', label: 'Explore', icon: Compass },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/stats', label: 'Stats', icon: TrendingUp },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
                  active
                    ? 'text-green-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className={`w-6 h-6 mb-1 ${active ? 'stroke-[2.5]' : ''}`} />
                <span className={`text-xs ${active ? 'font-semibold' : 'font-medium'}`}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}