const API_BASE_URL = 'http://localhost:8000/api/v1';

export const api = {
  getFigmaFiles: async () => {
    const response = await fetch(`${API_BASE_URL}/figma-files`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  getFigmaElements: async (fileId: string) => {
    const response = await fetch(`${API_BASE_URL}/figma-elements?file_id=${fileId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  parseFigmaFile: async (figmaUrl: string, figmaToken: string) => {
    const response = await fetch(`${API_BASE_URL}/parse-figma`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ figma_url: figmaUrl, figma_token: figmaToken }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  deleteFigmaFile: async (fileId: string) => {
    const response = await fetch(`${API_BASE_URL}/figma-files/${fileId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
};
