import { LogOut, User, Trophy, PlusCircle, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  paginaAtual: string;
  mudarPagina: (pagina: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ paginaAtual, mudarPagina }) => {
  const { usuarioAtual, logout } = useAuth();

  const navItems = [
    { id: 'inicio', label: 'Início', icon: null },
    { id: 'ranking', label: 'Ranking', icon: Trophy },
    { id: 'criar-quiz', label: 'Criar Quiz', icon: PlusCircle },
    { id: 'meus-quizes', label: 'Meus Quizes', icon: User },
  ];

  if (usuarioAtual?.tipo === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin', icon: Settings });
  }

  return (
    <header className="bg-gray-900 border-b border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 
              className="text-2xl font-bold text-white cursor-pointer hover:text-blue-400 transition-colors"
              onClick={() => mudarPagina('inicio')}
            >
              QuizMaster
            </h1>
            
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => mudarPagina(item.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                      paginaAtual === item.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {Icon && <Icon size={18} />}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm text-gray-300">Bem-vindo,</p>
              <p className="text-white font-medium">{usuarioAtual?.nome}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title="Sair"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        <div className="md:hidden pb-4">
          <nav className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => mudarPagina(item.id)}
                  className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 whitespace-nowrap ${
                    paginaAtual === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {Icon && <Icon size={16} />}
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};