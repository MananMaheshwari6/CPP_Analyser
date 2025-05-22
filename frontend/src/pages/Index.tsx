
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const loggedIn = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(loggedIn === "true");
    setCheckingAuth(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      // In a real app, you would validate credentials against a backend
      localStorage.setItem("user", username);
      localStorage.setItem("isLoggedIn", "true");
      
      // Initialize stats in localStorage if they don't exist
      const statsStr = localStorage.getItem("stats");
      if (!statsStr) {
        localStorage.setItem("stats", JSON.stringify({
          totalAnalyzed: 0,
          complexAlgorithms: 0,
          thisMonth: 0,
          accuracy: "95.2%"
        }));
      }
      
      setIsLoggedIn(true);
      toast({
        title: "Login Successful",
        description: `Welcome, ${username}!`,
      });
    } else {
      setError("Please enter both username and password");
    }
  };

  if (checkingAuth) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (isLoggedIn) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
          Code<span className="text-gray-800 dark:text-gray-200">Analyzer</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Time & Space Complexity Analyzer for C++</p>
      </div>

      <Card className="w-full max-w-md p-8 shadow-lg dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-2xl font-semibold mb-6 text-center dark:text-white">Login</h2>
        
        {error && <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-700">
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Index;
