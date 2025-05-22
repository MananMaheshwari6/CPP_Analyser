import { analyzeCode, getCodeHistory } from './api';

// Mock fetch globally
global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    // Reset the mock before each test
    (global.fetch as jest.Mock).mockReset();
  });

  describe('analyzeCode', () => {
    it('should make a POST request to /api/complexity/analyze', async () => {
      const mockCode = 'int main() { return 0; }';
      const mockResponse = {
        timeComplexity: 'O(1)',
        spaceComplexity: 'O(1)'
      };

      // Mock successful response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await analyzeCode(mockCode);

      // Check that fetch was called with the right arguments
      expect(global.fetch).toHaveBeenCalledWith('/api/complexity/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: mockCode }),
      });

      // Check the returned data
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error when the API call fails', async () => {
      const mockCode = 'int main() { return 0; }';
      const errorMessage = 'Failed to analyze code';

      // Mock failed response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: errorMessage })
      });

      // The API call should throw an error
      await expect(analyzeCode(mockCode)).rejects.toThrow(errorMessage);
    });
  });

  describe('getCodeHistory', () => {
    it('should make a GET request to /api/complexity/history', async () => {
      const mockHistory = [
        {
          _id: '1',
          code: 'int main() { return 0; }',
          timeComplexity: 'O(1)',
          spaceComplexity: 'O(1)',
          createdAt: '2023-01-01T00:00:00.000Z'
        }
      ];

      // Mock successful response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockHistory
      });

      const result = await getCodeHistory();

      // Check that fetch was called with the right URL
      expect(global.fetch).toHaveBeenCalledWith('/api/complexity/history');

      // Check the returned data
      expect(result).toEqual(mockHistory);
    });

    it('should throw an error when the API call fails', async () => {
      const errorMessage = 'Failed to fetch history';

      // Mock failed response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: errorMessage })
      });

      // The API call should throw an error
      await expect(getCodeHistory()).rejects.toThrow(errorMessage);
    });
  });
});
