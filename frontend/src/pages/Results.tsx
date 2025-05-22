
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/components/ui/bar-chart";

const Results = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [stats, setStats] = useState({
    totalAnalyzed: 0,
    complexAlgorithms: 0,
    thisMonth: 0,
    accuracy: "95.2%"
  });

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
      
      // Get stats from localStorage
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
  
  // Chart data
  const complexityDistribution = [
    { name: "O(1)", value: Math.max(1, stats.totalAnalyzed - stats.complexAlgorithms) },
    { name: "O(n)", value: Math.floor(stats.complexAlgorithms * 0.7) || 0 },
    { name: "O(n²)", value: Math.floor(stats.complexAlgorithms * 0.2) || 0 },
    { name: "O(n³+)", value: Math.floor(stats.complexAlgorithms * 0.1) || 0 }
  ];

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6 dark:text-white">Analysis Results</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Complexity Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BarChart 
                  data={complexityDistribution}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-1 dark:text-gray-200">Total Analyses</h3>
                  <p className="text-3xl font-bold dark:text-white">{stats.totalAnalyzed}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-1 dark:text-gray-200">Complex Algorithms</h3>
                  <p className="text-3xl font-bold dark:text-white">{stats.complexAlgorithms}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stats.totalAnalyzed > 0 
                      ? `${Math.round((stats.complexAlgorithms / stats.totalAnalyzed) * 100)}% of total analyses` 
                      : "No analyses yet"}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-1 dark:text-gray-200">Analyses This Month</h3>
                  <p className="text-3xl font-bold dark:text-white">{stats.thisMonth}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Recent Analyses</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.totalAnalyzed > 0 ? (
              <div className="rounded-md border dark:border-gray-700">
                <div className="grid grid-cols-4 p-3 bg-muted/50 dark:bg-gray-700/50 font-medium dark:text-gray-200">
                  <div>Date</div>
                  <div>File Name</div>
                  <div>Time Complexity</div>
                  <div>Space Complexity</div>
                </div>
                <div className="divide-y dark:divide-gray-700">
                  {/* Mock data for recent analyses */}
                  <div className="grid grid-cols-4 p-3 items-center dark:text-gray-300">
                    <div>{new Date().toLocaleDateString()}</div>
                    <div>main.cpp</div>
                    <div>O(n)</div>
                    <div>O(1)</div>
                  </div>
                  {stats.totalAnalyzed > 1 && (
                    <div className="grid grid-cols-4 p-3 items-center dark:text-gray-300">
                      <div>{new Date(Date.now() - 86400000).toLocaleDateString()}</div>
                      <div>sort_algorithm.cpp</div>
                      <div>O(n²)</div>
                      <div>O(n)</div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">No analyses yet</div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Results;
