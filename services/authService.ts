

interface LoginResponse {
  status: 'success' | 'error';
  message?: string;
}

const login = async (username: string, password?: string, scriptUrl?: string): Promise<string> => {
    if (!scriptUrl) {
        throw new Error("Authentication script URL is not configured.");
    }

    const url = new URL(scriptUrl);
    
    const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
        },
        body: JSON.stringify({ email: username || '', password: password || '' }),
        redirect: 'follow',
    });

    if (!response.ok) {
        throw new Error(`Authentication failed. Network error: ${response.status} ${response.statusText}`);
    }
    
    const text = await response.text();

    if (text.trim().startsWith('<!DOCTYPE html>')) {
        console.error("Received HTML instead of JSON from auth script:", text);
        throw new Error('Authentication failed. The server returned an unexpected response.');
    }

    let result: LoginResponse;
    try {
        // More robust parsing: handle potential garbage/BOM characters around the JSON object.
        const jsonStartIndex = text.indexOf('{');
        const jsonEndIndex = text.lastIndexOf('}');

        if (jsonStartIndex === -1 || jsonEndIndex === -1 || jsonEndIndex < jsonStartIndex) {
            throw new Error('Response did not contain a valid JSON object.');
        }
        
        const jsonString = text.substring(jsonStartIndex, jsonEndIndex + 1);
        result = JSON.parse(jsonString);
    } catch (error) {
        console.error("Invalid JSON response from auth script. Raw text:", text);
        throw new Error("An unexpected response was received from the server. Please check the console for details.");
    }
    
    // Handle the logic of the parsed result
    if (result.status === 'success') {
        return username;
    } else {
        // Throw the specific error message from the server (e.g., in Arabic).
        // This will be caught by the UI and displayed to the user.
        throw new Error(result.message || 'Invalid username or password.');
    }
};

export const authService = {
    login,
};