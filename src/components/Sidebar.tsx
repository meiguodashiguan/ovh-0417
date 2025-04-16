
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAPI } from "@/context/APIContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  onToggle: () => void;
  isOpen: boolean;
}

const Sidebar = ({ onToggle, isOpen }: SidebarProps) => {
  const location = useLocation();
  const { isAuthenticated } = useAPI();
  const isMobile = useIsMobile();
  
  const menuItems = [
    { path: "/", icon: "bar-chart-2", label: "仪表盘" },
    { path: "/servers", icon: "server", label: "服务器列表" },
    { path: "/queue", icon: "clipboard-list", label: "抢购队列" },
    { path: "/history", icon: "clock", label: "抢购历史" },
    { path: "/logs", icon: "file-text", label: "详细日志" },
    { path: "/settings", icon: "settings", label: "API设置" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="w-72 h-full bg-sidebar border-r border-cyber-accent/10 flex flex-col shadow-lg">
      <div className="p-4 border-b border-cyber-accent/20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyber-accent">
              <path d="M12 22s8-4 8-10V4l-8-2-8 2v8c0 6 8 10 8 10z"></path>
              <circle cx="12" cy="8" r="2" />
            </svg>
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-cyber-accent">幻影狙击手</h1>
            <div className="text-xs text-cyber-muted">OVH服务器抢购平台</div>
          </div>
        </Link>
        <button 
          onClick={onToggle}
          className="text-cyber-muted hover:text-cyber-accent p-1 rounded-full transition-colors"
          aria-label={isOpen ? "关闭菜单" : "打开菜单"}
          title={isOpen ? "关闭菜单" : "打开菜单"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isOpen ? (
              <path d="M15 18l-6-6 6-6"/>
            ) : (
              <path d="m9 18 6-6-6-6"/>
            )}
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 mx-2 rounded-md transition-all relative group ${
              isActive(item.path)
                ? "text-cyber-accent bg-cyber-accent/10 shadow-neon-inner font-medium"
                : "text-cyber-muted hover:text-cyber-text hover:bg-cyber-accent/5"
            }`}
            onClick={isMobile ? onToggle : undefined}
          >
            {isActive(item.path) && (
              <motion.div
                layoutId="active-pill"
                className="absolute left-0 w-1 h-6 bg-cyber-accent rounded-full shadow-neon"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              className={`mr-3 ${isActive(item.path) ? "text-cyber-accent" : "text-cyber-muted group-hover:text-cyber-text"}`}
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              {item.icon === "bar-chart-2" && (
                <>
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </>
              )}
              {item.icon === "server" && (
                <>
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                  <line x1="6" y1="6" x2="6.01" y2="6"></line>
                  <line x1="6" y1="18" x2="6.01" y2="18"></line>
                </>
              )}
              {item.icon === "clipboard-list" && (
                <>
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  <path d="M9 12h6"></path>
                  <path d="M9 16h6"></path>
                  <path d="M9 8h6"></path>
                </>
              )}
              {item.icon === "clock" && (
                <>
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </>
              )}
              {item.icon === "file-text" && (
                <>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </>
              )}
              {item.icon === "settings" && (
                <>
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </>
              )}
            </svg>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="border-t border-cyber-accent/20 p-4">
        <div className="flex items-center justify-between">
          <div className="text-xs">
            <div className={`flex items-center ${isAuthenticated ? 'text-green-400' : 'text-cyber-muted'}`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${isAuthenticated ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
              <span>{isAuthenticated ? 'API已连接' : 'API未连接'}</span>
            </div>
          </div>
          <div className="text-cyber-muted text-xs">v1.0.0</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
