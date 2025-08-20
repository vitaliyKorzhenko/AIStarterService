"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerN8nWebhook = exports.getTaskQuickly = exports.getTask = exports.loginToAdminPanel = exports.clearToken = exports.setCurrentToken = exports.getCurrentToken = exports.setCredentials = void 0;
const BASE_URL = process.env.BASE_URL || 'https://main.okk24.com';
// Константы для авторизации
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'aleks.evdokimov+ai-bot-lid-dogim@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '1234567';
const triggerWebhookUrl = process.env.TRIGGER_WEBHOOK_URL || 'https://govorikavitaliydev.app.n8n.cloud/webhook/govorikaLead';
// API endpoints
const TASK_GET_ENDPOINT = process.env.TASK_GET_ENDPOINT || '/bumess/api/task/get';
const TASK_GET_QUICKLY_ENDPOINT = process.env.TASK_GET_QUICKLY_ENDPOINT || '/bumess/api/task/get_quickly';
let currentToken = null;
let credentials = null;
const setCredentials = (email, password) => {
    credentials = { email, password };
};
exports.setCredentials = setCredentials;
const getCurrentToken = () => {
    return currentToken;
};
exports.getCurrentToken = getCurrentToken;
const setCurrentToken = (token) => {
    currentToken = token;
};
exports.setCurrentToken = setCurrentToken;
const clearToken = () => {
    currentToken = null;
};
exports.clearToken = clearToken;
const loginToAdminPanel = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (email = ADMIN_EMAIL, password = ADMIN_PASSWORD) {
    try {
        const response = yield fetch(`${BASE_URL}/api/login`, {
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
        const data = yield response.json();
        if (!data.token) {
            return {
                success: false,
                error: data.message || 'Login failed'
            };
        }
        (0, exports.setCurrentToken)({
            token: data.token,
            token_type: data.token_type,
            expires_in: data.expires_in
        });
        (0, exports.setCredentials)(ADMIN_EMAIL, ADMIN_PASSWORD);
        return {
            success: true,
            data
        };
    }
    catch (error) {
        console.error('Error during login:', error);
        return {
            success: false,
            error: 'Failed to connect to server'
        };
    }
});
exports.loginToAdminPanel = loginToAdminPanel;
// https://main.okk24.com/bumess/api/task/get
//get Task
const getTask = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loginResponse = yield (0, exports.loginToAdminPanel)();
        if (!loginResponse.success) {
            return null;
        }
        const token = (0, exports.getCurrentToken)();
        if (!token) {
            return null;
        }
        const response = yield fetch(`${BASE_URL}${TASK_GET_ENDPOINT}`, {
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
        const data = yield response.json();
        return data;
    }
    catch (error) {
        return null;
    }
});
exports.getTask = getTask;
// https://main.okk24.com/bumess/api/task/get_quickly - get Task Quickly
const getTaskQuickly = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loginResponse = yield (0, exports.loginToAdminPanel)();
        if (!loginResponse.success) {
            return null;
        }
        const token = (0, exports.getCurrentToken)();
        if (!token) {
            return null;
        }
        const response = yield fetch(`${BASE_URL}${TASK_GET_QUICKLY_ENDPOINT}`, {
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
        const data = yield response.json();
        console.log('getTaskQuickly', data);
        return data;
    }
    catch (error) {
        return null;
    }
});
exports.getTaskQuickly = getTaskQuickly;
const triggerN8nWebhook = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(triggerWebhookUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = yield response.json();
        console.log('Webhook triggered successfully:', data);
        return data;
    }
    catch (error) {
        console.error('Error triggering n8n webhook:', error);
        return null;
    }
});
exports.triggerN8nWebhook = triggerN8nWebhook;
