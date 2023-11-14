# Дистанционное управление химическим технологическим процессом

За основу взят пример: ["Неадиабатический реактор с резервуаром непрерывного перемешивания: моделирование в файле MATLAB с имитациями в Simulink."](https://www.mathworks.com/help/ident/ug/non-adiabatic-continuous-stirred-tank-reactor-matlab-file-modeling-with-simulations-in-simulink.html)  

## Структура файлов
- _idnlgreysim.m_ - скрипт Matlab для симуляции модели _cstr\_sim.slx_ на основе начальных данных. По сути является упрощенной версией модели _idnlgreydemo9.m_;
- _loadModel.m_ - скрипт Matlab для загрузки модели в оперативную память;
- _server.py_ - сервер, запускающий Matlab симуляцию, в ответ на события из веб-интерфейса;
- _web_ - каталог, содержащий исходный код веб интерфейса.

## Визуальное представление модели
![Неадиабатический реактор с резервуаром непрерывного перемешивания](/cstr.png)

## Схема взаимодействия
```mermaid
sequenceDiagram
    participant Админ
    participant Matlab
    participant Сервер
    participant Веб
    participant Пользователь
    Админ->>Сервер: Запустить сервер
    Сервер->>Matlab: Запустить движок Matlab
    Matlab->>Сервер: Движок Matlab запущен
    Сервер->>Matlab: Загрузить модель Matlab
    Matlab->>Сервер: Модель Matlab загружена
    Сервер->>Сервер: Запуск веб-сокетов
    Сервер->>Админ: Сервер запущен
    Админ->>Пользователь: Технологический процесс готов к запуску
    Пользователь->>Веб: Запустить веб-интерфейс
    Веб->>Пользователь: Веб-интерфейс запущен
    Пользователь->>Веб: Ввод начальных значений, запуск технологического процесса и ожидание результатов через веб-сокеты
    Веб->>Сервер: Передача начальных значений и запуск технологического процесса
    loop Симуляция технологического процесса
        Сервер->>Matlab: Симулировать модель Matlab с заданными параметрами и фиксированным временным шагом
        Matlab->>Сервер: Результаты симуляции
        Сервер->>Сервер: Обновить параметры модели для следующей симуляции
        Сервер->>Веб: Передача результатов симуляции через веб-сокеты
        Веб->>Пользователь: Отрисовка результатов симуляции на графиках
    end
    Пользователь->>Веб: Остановить симуляцию технологического процесса
    Веб->>Пользователь: Симуляция технологического процесса остановлена
    Веб->>Сервер: Закрыть веб-сокет соединение
    Сервер->>Сервер: Закрытие веб-сокет соединения и остановка симуляции
    Пользователь->>Админ: Управление технологическим процессом завершено
    Админ->>Сервер: Остановка сервера
    Сервер->>Сервер: Остановка движка Matlab, завершение процессов
    Сервер->>Админ: Сервер остановлен
```

## Локальное использование
Для запуска локальной симуляции процесса необходимо установить [NodeJS v.18](https://nodejs.org/en/download/package-manager)  

1) Открыть первое окно терминала, запустить файл _server.py_ и дождаться загрузки сервера
2) Открыть второе окно терминала, перейти в каталог _web_ выполнив команду `cd web`
3) Во втором терминале выполнить команду `npm install && npm run start`, дождаться установки пакетов и запуска веб-сервера
4) В веб-браузере перейти на `http://localhost:3000`
5) Взаимодействовать с веб-интерфейсом
6) Остановить веб-сервер во втором терминале комбинацией клавиш `ctrl+c`
7) Остановить сервер в первом терминале комбинацией клавиш `ctrl+c`