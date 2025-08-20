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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const bumesApi_1 = require("./bumesApi");
const fs_1 = __importDefault(require("fs"));
// спсбио а дайте его логин пароль
// aleks.evdokimov+ai-bot-client-dogim@gmail.com
// 1234567
// Инициализируем dotenv
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
const CHECK_INTERVAL = parseInt(process.env.CHECK_INTERVAL || '30000'); // 30 секунд по умолчанию
// Флаг для отслеживания процесса
let isChecking = false;
// Подключаем middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Функция для чтения lastTaskId из файла
const readLastTaskId = () => {
    try {
        const data = fs_1.default.readFileSync('task.json', 'utf8');
        const json = JSON.parse(data);
        return json.lastTaskId;
    }
    catch (error) {
        console.error('Error reading lastTaskId:', error);
        return 0;
    }
};
// Функция для обновления lastTaskId в файле
const updateLastTaskId = (taskId) => {
    try {
        const data = JSON.stringify({ lastTaskId: taskId }, null, 2);
        fs_1.default.writeFileSync('task.json', data);
    }
    catch (error) {
        console.error('Error updating lastTaskId:', error);
    }
};
//default get route
app.get('/', (req, res) => {
    res.send('TEST API AI BOT!!!');
});
//ping
app.get('/ping', (req, res) => {
    res.send('PONG');
});
const server = http_1.default.createServer(app);
server.listen(port, () => {
    console.log(`🚀 Сервер запущен на порту ${port}`);
    // Запускаем проверку каждые 10 секунд
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        // Если уже проверяем - пропускаем
        //curernt date with time and seconds
        const currentDate = new Date();
        const currentDateString = currentDate.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        console.log('⏰ Текущая дата и время:', currentDateString);
        if (isChecking) {
            console.log('⏳ Предыдущая проверка еще идет...');
            return;
        }
        try {
            isChecking = true;
            console.log('⏰ Проверяем задачу...=====================>>>>>>>>>>>>>>>>');
            const task = yield (0, bumesApi_1.getTask)();
            console.log('📦 ПОЛУЧЕНА ЗАДАЧА ДЛЯ РАБОТЫ:', task);
            if (task && Object.keys(task).length > 0) {
                let taskId = task.data.id;
                console.log('📝 Задача ID:', taskId);
                const lastTaskId = readLastTaskId();
                console.log('📝 Последний ID:', lastTaskId);
                if (taskId !== lastTaskId) {
                    //update lastTaskId!! 
                    updateLastTaskId(taskId);
                    console.log('✅ Задача найдена, дергаем вебхук');
                    let res = yield (0, bumesApi_1.triggerN8nWebhook)();
                    console.log('🎯 Вебхук сработал', res);
                    console.log('📝 Обновлен lastTaskId:', taskId);
                }
                else {
                    console.log('⏭️ Пропускаем задачу - ID совпадает с последним');
                }
            }
            else {
                console.log('❌ Задача не найдена');
            }
        }
        catch (error) {
            console.error('❌ Ошибка:', error);
        }
        finally {
            isChecking = false;
            console.log('⏳ Проверка завершена');
        }
    }), CHECK_INTERVAL);
});
