
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";
import CodeEditor from "@/components/CodeEditor";
import { BarChart } from "@/components/ui/bar-chart";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ComplexityResult {
  time: string;
  space: string;
  timeExplanation: string;
  spaceExplanation: string;
  timeValue: number;
  spaceValue: number;
  executionTime: number; // New field for execution time in ms
}

const Analyzer = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [code, setCode] = useState(`// Enter your C++ code here\n#include <iostream>\n\nint main() {\n    std::cout << "Hello World!";\n    return 0;\n}`);
  const [language, setLanguage] = useState("cpp");
  const [result, setResult] = useState<ComplexityResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [fileContent, setFileContent] = useState("");
  const [activeTab, setActiveTab] = useState("time");

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setCode(content);
        setFileContent(content);
      };
      reader.readAsText(file);
    }
  };

  const analyzeComplexity = () => {
    setAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      // This is a simplified mock analysis
      // In a real app, you would send the code to a backend service
      
      let timeComplexity: string;
      let spaceComplexity: string;
      let timeValue: number;
      let spaceValue: number;
      let timeExplanation: string;
      let spaceExplanation: string;
      let executionTime: number;
      
      if (code.includes("for") && code.includes("for", code.indexOf("for") + 3)) {
        timeComplexity = "O(n²)";
        timeValue = 80;
        timeExplanation = "Nested loops detected, resulting in quadratic time complexity";
        executionTime = 250; // Simulated execution time in ms
      } else if (code.includes("for")) {
        timeComplexity = "O(n)";
        timeValue = 40;
        timeExplanation = "Single loop detected, resulting in linear time complexity";
        executionTime = 120; // Simulated execution time in ms
      } else {
        timeComplexity = "O(1)";
        timeValue = 10;
        timeExplanation = "No loops detected, constant time complexity";
        executionTime = 35; // Simulated execution time in ms
      }
      
      if (code.includes("vector") || code.includes("array")) {
        spaceComplexity = "O(n)";
        spaceValue = 40;
        spaceExplanation = "Dynamic data structures detected, linear space complexity";
      } else {
        spaceComplexity = "O(1)";
        spaceValue = 10;
        spaceExplanation = "Only primitive variables detected, constant space complexity";
      }
      
      const complexityResult: ComplexityResult = {
        time: timeComplexity,
        space: spaceComplexity,
        timeExplanation: timeExplanation,
        spaceExplanation: spaceExplanation,
        timeValue: timeValue,
        spaceValue: spaceValue,
        executionTime: executionTime
      };
      
      setResult(complexityResult);
      setAnalyzing(false);
      
      // Update stats in localStorage
      const statsStr = localStorage.getItem("stats");
      const stats = statsStr ? JSON.parse(statsStr) : { 
        totalAnalyzed: 0, 
        complexAlgorithms: 0,
        thisMonth: 0,
        accuracy: "95.2%"
      };
      
      stats.totalAnalyzed += 1;
      stats.thisMonth += 1;
      
      if (timeComplexity !== "O(1)") {
        stats.complexAlgorithms += 1;
      }
      
      localStorage.setItem("stats", JSON.stringify(stats));
      
      toast({
        title: "Analysis Complete",
        description: `Analysis completed with ${timeComplexity} time complexity and ${spaceComplexity} space complexity.`,
      });
    }, 1500);
  };

  if (isLoggedIn === false) {
    return <Navigate to="/" />;
  }

  if (isLoggedIn === null) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6 dark:text-white">Code Complexity Analyzer</h1>
        
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <label className="mr-4 dark:text-gray-300">Upload Code File:</label>
            <input
              type="file"
              accept=".cpp,.c,.h,.hpp"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 dark:text-gray-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-cyan-50 file:text-cyan-700
                dark:file:bg-cyan-900/30 dark:file:text-cyan-300
                hover:file:bg-cyan-100 dark:hover:file:bg-cyan-800/30
              "
            />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium dark:text-gray-300">Language:</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="border rounded p-1 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  disabled
                >
                  <option value="cpp">C++</option>
                </select>
              </div>
            </div>
            
            <CodeEditor code={code} setCode={setCode} language={language} />
          </div>
          
          <Button 
            onClick={analyzeComplexity} 
            className="bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-700"
            disabled={analyzing}
          >
            {analyzing ? "Analyzing..." : "Analyze Complexity"}
          </Button>
        </div>
        
        {result && (
          <div className="space-y-6">
            <Tabs defaultValue="time" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="time">Time Complexity</TabsTrigger>
                <TabsTrigger value="space">Space Complexity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="time">
                <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
                  <h2 className="text-xl font-semibold mb-4 dark:text-white">Time Complexity</h2>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{result.time}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{result.timeExplanation}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2 dark:text-gray-200">Complexity Rating</h3>
                      <div className="h-32">
                        <BarChart 
                          className="mt-4"
                          data={[
                            {
                              name: "Time",
                              value: result.timeValue
                            }
                          ]}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2 dark:text-gray-200">Execution Speed</h3>
                      <div className="h-32">
                        <BarChart 
                          className="mt-4"
                          data={[
                            {
                              name: "ms",
                              value: result.executionTime
                            }
                          ]}
                        />
                      </div>
                      <div className="text-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Estimated execution time: {result.executionTime}ms
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="space">
                <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
                  <h2 className="text-xl font-semibold mb-4 dark:text-white">Space Complexity</h2>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{result.space}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{result.spaceExplanation}</p>
                  <div className="h-32">
                    <BarChart 
                      className="mt-4"
                      data={[
                        {
                          name: "Space",
                          value: result.spaceValue
                        }
                      ]}
                    />
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
            
            <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Analysis Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
                  <div className="text-sm text-gray-600 dark:text-gray-300">Time Complexity</div>
                  <div className="text-lg font-semibold dark:text-white">{result.time}</div>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
                  <div className="text-sm text-gray-600 dark:text-gray-300">Space Complexity</div>
                  <div className="text-lg font-semibold dark:text-white">{result.space}</div>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
                  <div className="text-sm text-gray-600 dark:text-gray-300">Execution Time</div>
                  <div className="text-lg font-semibold dark:text-white">{result.executionTime}ms</div>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
                  <div className="text-sm text-gray-600 dark:text-gray-300">Memory Usage</div>
                  <div className="text-lg font-semibold dark:text-white">
                    {result.spaceValue < 20 ? "Low" : result.spaceValue < 60 ? "Medium" : "High"}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Analyzer;
