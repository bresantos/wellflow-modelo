import React, { useState, useContext, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext, API } from '../App';
import { IconHome, IconFileText, IconWind, IconBulb, IconBell, IconLogout, IconMenu2, IconX } from '@tabler/icons-react';
import axios from 'axios';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

const FuncionarioLayout = () => {
  const { user, logout, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);

  const menuItems = [
    { icon: IconHome, path: '/funcionario', label: 'Home' },
    { icon: IconFileText, path: '/funcionario/form', label: 'Formulário' },
    { icon: IconWind, path: '/funcionario/environment', label: 'Ambiente' },
    { icon: IconBulb, path: '/funcionario/tips', label: 'Dicas' }
  ];

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${API}/notifications`, { headers: { Authorization: `Bearer ${token}` } });
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, [token]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id) => {
    try {
      await axios.put(`${API}/notifications/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Error marking notification:', error);
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#f5f2e7' }}>
      {/* Sidebar Desktop */}
      <div className="hidden md:flex flex-col items-center py-6 px-2" style={{ width: '60px', background: 'white', borderRight: '1px solid rgba(178, 63, 230, 0.1)' }}>
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              className="mb-4 p-3 rounded-xl"
              style={{
                background: isActive ? 'rgba(178, 63, 230, 0.1)' : 'transparent',
                color: isActive ? '#B23FE6' : '#2e2e2e'
              }}
              title={item.label}
              data-testid={`sidebar-${item.label.toLowerCase()}`}
            >
              <Icon size={24} stroke={2} />
            </button>
          );
        })}
        <button
          onClick={logout}
          className="mt-auto p-3 rounded-xl"
          style={{ color: '#2e2e2e' }}
          title="Sair"
          data-testid="sidebar-logout"
        >
          <IconLogout size={24} stroke={2} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-3 rounded-xl"
          style={{ background: 'white', color: '#B23FE6' }}
          data-testid="mobile-menu-toggle"
        >
          {mobileMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-40 p-6">
          <div className="mt-16 space-y-4">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full p-4 rounded-xl"
                  style={{ background: 'rgba(178, 63, 230, 0.05)' }}
                >
                  <Icon size={24} stroke={2} style={{ color: '#B23FE6' }} />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full p-4 rounded-xl"
              style={{ background: 'rgba(178, 63, 230, 0.05)' }}
            >
              <IconLogout size={24} stroke={2} style={{ color: '#B23FE6' }} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-30 px-6 py-4" style={{ background: 'white', borderBottom: '1px solid rgba(178, 63, 230, 0.1)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={user?.photo}
                alt={user?.full_name}
                className="rounded-full"
                style={{ width: '48px', height: '48px', border: '1px solid rgba(178, 63, 230, 0.1)' }}
                data-testid="header-user-photo"
              />
              <div>
                <div className="font-semibold" style={{ color: '#2e2e2e' }} data-testid="header-user-name">{user?.full_name}</div>
                <div className="text-sm font-inter" style={{ color: '#2e2e2e' }} data-testid="header-user-position">{user?.position}</div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* My Stress Levels */}
              <div className="hidden md:flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-inter" style={{ color: '#2e2e2e' }}>Estresse Profissional</span>
                  <div className="w-32 h-2 rounded-full" style={{ background: 'rgba(178, 63, 230, 0.1)' }}>
                    <div className="h-full rounded-full" style={{ width: `${((user?.stress_professional || 0) / 5) * 100}%`, background: '#B23FE6' }}></div>
                  </div>
                  <span className="text-xs font-bold" style={{ color: '#B23FE6' }} data-testid="header-professional-stress">{user?.stress_professional || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-inter" style={{ color: '#2e2e2e' }}>Estresse Pessoal</span>
                  <div className="w-32 h-2 rounded-full" style={{ background: 'rgba(178, 63, 230, 0.1)' }}>
                    <div className="h-full rounded-full" style={{ width: `${((user?.stress_personal || 0) / 5) * 100}%`, background: 'rgba(178, 63, 230, 0.6)' }}></div>
                  </div>
                  <span className="text-xs font-bold" style={{ color: 'rgba(178, 63, 230, 0.6)' }} data-testid="header-personal-stress">{user?.stress_personal || 0}</span>
                </div>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="p-2 rounded-xl relative"
                  style={{ background: 'rgba(178, 63, 230, 0.05)' }}
                  data-testid="header-notifications-button"
                >
                  <IconBell size={24} stroke={2} style={{ color: '#B23FE6' }} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" data-testid="header-notifications-count">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-xl shadow-lg" style={{ background: 'white', border: '1px solid rgba(178, 63, 230, 0.1)' }}>
                    <Accordion type="single" collapsible className="w-full">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center font-inter" style={{ color: '#2e2e2e' }}>Nenhuma notificação</div>
                      ) : (
                        notifications.map((notif, idx) => (
                          <AccordionItem key={notif.id} value={`item-${idx}`}>
                            <AccordionTrigger
                              className="px-4 py-3 hover:bg-purple-50"
                              onClick={() => !notif.read && markAsRead(notif.id)}
                            >
                              <div className="flex items-center gap-3 w-full">
                                <div className={`text-sm ${notif.read ? 'font-normal' : 'font-bold'}`} style={{ color: '#2e2e2e' }}>
                                  {notif.title}
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-3">
                              <p className="text-sm font-inter" style={{ color: '#2e2e2e' }}>{notif.description}</p>
                            </AccordionContent>
                          </AccordionItem>
                        ))
                      )}
                    </Accordion>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6" data-testid="main-content">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="py-8 px-6 mt-auto" style={{ background: 'white', borderTop: '1px solid rgba(178, 63, 230, 0.1)' }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center">
              <img src="https://i.pravatar.cc/100?img=60" alt="Dev 1" className="w-16 h-16 rounded-full mb-2" style={{ border: '1px solid rgba(178, 63, 230, 0.1)' }} />
              <div className="font-medium" style={{ color: '#2e2e2e' }}>João Silva</div>
              <div className="flex gap-2 mt-2">
                <a href="#" className="text-purple-600"><IconBell size={18} stroke={2} /></a>
                <a href="#" className="text-purple-600"><IconBell size={18} stroke={2} /></a>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <img src="https://i.pravatar.cc/100?img=47" alt="Dev 2" className="w-16 h-16 rounded-full mb-2" style={{ border: '1px solid rgba(178, 63, 230, 0.1)' }} />
              <div className="font-medium" style={{ color: '#2e2e2e' }}>Maria Santos</div>
              <div className="flex gap-2 mt-2">
                <a href="#" className="text-purple-600"><IconBell size={18} stroke={2} /></a>
                <a href="#" className="text-purple-600"><IconBell size={18} stroke={2} /></a>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <img src="https://i.pravatar.cc/100?img=33" alt="Dev 3" className="w-16 h-16 rounded-full mb-2" style={{ border: '1px solid rgba(178, 63, 230, 0.1)' }} />
              <div className="font-medium" style={{ color: '#2e2e2e' }}>Pedro Costa</div>
              <div className="flex gap-2 mt-2">
                <a href="#" className="text-purple-600"><IconBell size={18} stroke={2} /></a>
                <a href="#" className="text-purple-600"><IconBell size={18} stroke={2} /></a>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="text-sm font-inter text-center" style={{ color: '#2e2e2e' }}>
                Desenvolvido por<br/>
                <strong>Equipe WellFlow</strong><br/>
                2025
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default FuncionarioLayout;
