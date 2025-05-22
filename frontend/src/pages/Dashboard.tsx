
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { ArrowRight } from "lucide-react";

const Dashboard = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [stats, setStats] = useState({
    totalAnalyzed: 0,
    complexAlgorithms: 0,
    thisMonth: 0,
    accuracy: "95.2%"
  });
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    const loggedIn = localStorage.getItem("isLoggedIn");
    
    if (user && loggedIn === "true") {
      setUsername(user);
      setIsLoggedIn(true);
      
      // In a real app, you would fetch statistics from a backend
      const savedStats = localStorage.getItem("stats");
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  if (isLoggedIn === false) {
    return <Navigate to="/" />;
  }

  if (isLoggedIn === null) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const handleGetStarted = () => {
    navigate("/analyzer");
  };

  return (
    <Layout>
      <div className="p-6">
        {/* Welcome Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold mb-2 dark:text-white">Welcome back, {username}</h1>
            <p className="text-gray-600 dark:text-gray-300">Here's an overview of your code analysis statistics</p>
          </div>
          <Button 
            onClick={() => navigate("/analyzer")}
            className="bg-cyan-500 hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-700"
          >
            Analyze New Code
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-start space-x-4">
              <div className="bg-cyan-100 dark:bg-cyan-900/50 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Analyses</p>
                <h3 className="text-2xl font-bold dark:text-white">{stats.totalAnalyzed}</h3>
                <p className="text-green-500 dark:text-green-400 text-sm">+12% from last month</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-start space-x-4">
              <div className="bg-amber-100 dark:bg-amber-900/50 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Complex Algorithms</p>
                <h3 className="text-2xl font-bold dark:text-white">{stats.complexAlgorithms}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">22% detection rate</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">This Month</p>
                <h3 className="text-2xl font-bold dark:text-white">{stats.thisMonth}</h3>
                <p className="text-green-500 dark:text-green-400 text-sm">+8 from last month</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Analysis Accuracy</p>
                <h3 className="text-2xl font-bold dark:text-white">{stats.accuracy}</h3>
                <p className="text-green-500 dark:text-green-400 text-sm">+2.3% improvement</p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Get Started Section */}
        <div className="mt-8 text-center">
          <Button 
            onClick={handleGetStarted} 
            className="bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-700"
            size="lg"
          >
            Get Started With Analysis
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
