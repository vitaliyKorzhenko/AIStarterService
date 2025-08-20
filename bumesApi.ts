
const BASE_URL = process.env.BASE_URL || 'https://main.okk24.com';

// Константы для авторизации
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

const triggerWebhookUrl = process.env.TRIGGER_WEBHOOK_URL || '';

// API endpoints
const TASK_GET_ENDPOINT = process.env.TASK_GET_ENDPOINT || '/bumess/api/task/get_quickly';
const TASK_GET_QUICKLY_ENDPOINT = process.env.TASK_GET_QUICKLY_ENDPOINT || '/bumess/api/task/get_quickly';


interface TokenData {
    token: string;
    token_type: string;
    expires_in: number;
}

interface Credentials {
    email: string;
    password: string;
}

let currentToken: TokenData | null = null;
let credentials: Credentials | null = null;

export const setCredentials = (email: string, password: string): void => {
    credentials = { email, password };
};

export const getCurrentToken = (): TokenData | null => {
    return currentToken;
};

export const setCurrentToken = (token: TokenData): void => {
    currentToken = token;
};

export const clearToken = (): void => {
    currentToken = null;
};



export const loginToAdminPanel = async (
    email: string = ADMIN_EMAIL,
    password: string = ADMIN_PASSWORD
): Promise<{
    success: boolean;
    data?: any;
    error?: string;
}> => {
    try {

        console.log("START loginToAdminPanel");
        console.log('BASE_URL', BASE_URL);
        console.log('ADMIN_EMAIL', ADMIN_EMAIL);
        console.log('ADMIN_PASSWORD', ADMIN_PASSWORD);
        console.log('TASK_GET_ENDPOINT', TASK_GET_ENDPOINT);
        console.log('TASK_GET_QUICKLY_ENDPOINT', TASK_GET_QUICKLY_ENDPOINT);
        console.log('triggerWebhookUrl', triggerWebhookUrl);

        const response = await fetch(`${BASE_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Origin': BASE_URL,
                'Referer': `${BASE_URL}/login`
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (!data.token) {
            return {
                success: false,
                error: data.message || 'Login failed'
            };
        }

        setCurrentToken({
            token: data.token,
            token_type: data.token_type,
            expires_in: data.expires_in
        });
        setCredentials(ADMIN_EMAIL, ADMIN_PASSWORD);

        return {
            success: true,
            data
        };
    } catch (error) {
        console.error('Error during login:', error);
        return {
            success: false,
            error: 'Failed to connect to server'
        };
    }
};

                  

// https://main.okk24.com/bumess/api/task/get

//get Task

export const getTask = async (): Promise<any> => {
    try {
        console.log("START getTask");
        const loginResponse = await loginToAdminPanel();
        if (!loginResponse.success) {
            return null;
        }   

        console.log('ADMIN_EMAIL', ADMIN_EMAIL);
        console.log('ADMIN_PASSWORD', ADMIN_PASSWORD);
        console.log('BASE_URL', BASE_URL);
        console.log('TASK_GET_ENDPOINT', TASK_GET_ENDPOINT);
        console.log('TASK_GET_QUICKLY_ENDPOINT', TASK_GET_QUICKLY_ENDPOINT);
        console.log('triggerWebhookUrl', triggerWebhookUrl);
        const token = getCurrentToken();
        if (!token) {
            return null;
        }

        const response = await fetch(`${BASE_URL}${TASK_GET_ENDPOINT}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Accept': 'application/json',
                'Origin': BASE_URL,
                'Referer': `${BASE_URL}/login`
            }
        });
  
        if (!response) {
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return null;
    }
}

// https://main.okk24.com/bumess/api/task/get_quickly - get Task Quickly
export const getTaskQuickly = async (): Promise<any> => {
    try {
        const loginResponse = await loginToAdminPanel();
        if (!loginResponse.success) {
            return null;
        }
        const token = getCurrentToken();
        if (!token) {
            return null;
        }
        const response = await fetch(`${BASE_URL}${TASK_GET_QUICKLY_ENDPOINT}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Accept': 'application/json',
                'Origin': BASE_URL,
                'Referer': `${BASE_URL}/login`
            }
        });
  
        if (!response) {
            return null;
        }

        const data = await response.json();
        console.log('getTaskQuickly', data);
        return data;
    } catch (error) {
        return null;
    }
}

export const triggerN8nWebhook = async (): Promise<any> => {
    try {
        const response = await fetch(triggerWebhookUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Webhook triggered successfully:', data);
        return data;
    } catch (error) {
        console.error('Error triggering n8n webhook:', error);
        return null;
    }
}


