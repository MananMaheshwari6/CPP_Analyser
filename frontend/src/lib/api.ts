// API client for communicating with the backend

interface AnalysisResult {
  timeComplexity: string;
  spaceComplexity: string;
}

interface CodeHistoryItem {
  _id: string;
  code: string;
  timeComplexity: string;
  spaceComplexity: string;
  createdAt: string;
}

// Analyze a C++ code snippet
export async function analyzeCode(code: string): Promise<AnalysisResult> {
  try {
    const response = await fetch('/api/complexity/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze code');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Get code analysis history
export async function getCodeHistory(): Promise<CodeHistoryItem[]> {
  try {
    const response = await fetch('/api/complexity/history');

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch history');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
