import dotenv from 'dotenv';

// Инициализируем dotenv ПЕРЕД всеми импортами
dotenv.config();

import express from 'express';
import http from 'http';
import cors from 'cors';
import { getTask, getTaskQuickly, triggerN8nWebhook } from './bumesApi';
import fs from 'fs';


// спсбио а дайте его логин пароль


// aleks.evdokimov+ai-bot-client-dogim@gmail.com
// 1234567

const app = express();
const port = process.env.PORT || 4000;
const CHECK_INTERVAL = parseInt(process.env.CHECK_INTERVAL || '30000'); // 30 секунд по умолчанию

// Флаг для отслеживания процесса
let isChecking = false;

// Подключаем middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Функция для чтения lastTaskId из файла
const readLastTaskId = (): number => {
  try {
    const data = fs.readFileSync('task.json', 'utf8');
    const json = JSON.parse(data);
    return json.lastTaskId;
  } catch (error) {
    console.error('Error reading lastTaskId:', error);
    return 0;
  }
};

// Функция для обновления lastTaskId в файле
const updateLastTaskId = (taskId: number): void => {
  try {
    const data = JSON.stringify({ lastTaskId: taskId }, null, 2);
    fs.writeFileSync('task.json', data);
  } catch (error) {
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

const server = http.createServer(app);


server.listen(port, () => {
  console.log(`🚀 Сервер запущен на порту ${port}`);
  
  // Запускаем проверку каждые 10 секунд
  setInterval(async () => {
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
      const task = await getTask();
      console.log('📦 ПОЛУЧЕНА ЗАДАЧА ДЛЯ РАБОТЫ:', task);
      
      if (task && Object.keys(task).length > 0 ) {
        let taskId = task.data.id;
        console.log('📝 Задача ID:', taskId);
        const lastTaskId = readLastTaskId();
        console.log('📝 Последний ID:', lastTaskId);
        if (taskId !== lastTaskId) {
          //update lastTaskId!! 
          updateLastTaskId(taskId);
          console.log('✅ Задача найдена, дергаем вебхук');
          let res = await triggerN8nWebhook();
          console.log('🎯 Вебхук сработал', res);
          
          console.log('📝 Обновлен lastTaskId:', taskId);
        } else {
          console.log('⏭️ Пропускаем задачу - ID совпадает с последним');
        }
      } else {
        console.log('❌ Задача не найдена');
      }
    } catch (error) {
      console.error('❌ Ошибка:', error);
    } finally {
      isChecking = false;
      console.log('⏳ Проверка завершена');
    }
  }, CHECK_INTERVAL);


});


