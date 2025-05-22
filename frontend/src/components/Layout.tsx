
import { useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home,
  Code,
  LogOut,
  BarChart2,
  Menu,
  X,
  Moon,
  Sun
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/use-theme";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const username = localStorage.getItem("user") || "User";
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div 
        className={`bg-white dark:bg-gray-800 shadow-md transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen ? (
            <div className="text-xl font-bold text-cyan-600 dark:text-cyan-400">
              Code<span className="text-gray-800 dark:text-gray-200">Analyzer</span>
            </div>
          ) : (
            <div className="text-xl font-bold text-cyan-600 dark:text-cyan-400">C</div>
          )}
          
          <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Button
                variant="ghost"
                className={`w-full justify-start ${sidebarOpen ? '' : 'justify-center'} dark:text-gray-200 dark:hover:bg-gray-700`}
                onClick={() => navigate("/dashboard")}
              >
                <Home className="h-5 w-5 mr-2" />
                {sidebarOpen && "Dashboard"}
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className={`w-full justify-start ${sidebarOpen ? '' : 'justify-center'} dark:text-gray-200 dark:hover:bg-gray-700`}
                onClick={() => navigate("/analyzer")}
              >
                <Code className="h-5 w-5 mr-2" />
                {sidebarOpen && "Analyzer"}
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className={`w-full justify-start ${sidebarOpen ? '' : 'justify-center'} dark:text-gray-200 dark:hover:bg-gray-700`}
                onClick={() => navigate("/results")}
              >
                <BarChart2 className="h-5 w-5 mr-2" />
                {sidebarOpen && "Results"}
              </Button>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t dark:border-gray-700">
          <Button
            variant="ghost"
            className={`w-full justify-start ${sidebarOpen ? '' : 'justify-center'} text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30`}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            {sidebarOpen && "Logout"}
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="flex justify-between items-center px-6 py-4">
            <h1 className="text-xl font-semibold dark:text-white">Time & Space Complexity Analyzer</h1>
            
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <div className="flex items-center space-x-2">
                <Moon className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                <Switch 
                  checked={theme === 'dark'}
                  onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                />
                <Sun className="h-4 w-4 text-gray-500 dark:text-gray-300" />
              </div>
              
              <div>
                <span className="font-medium dark:text-white">{username}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-700 dark:text-gray-200 font-medium">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-y-auto dark:text-white">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
