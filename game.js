// js/modules/game.js
const gameSystem = {
    // Основное состояние игры
    state: {
        isInitialized: false,
        isPaused: false,
        gameTime: 0,
        lastSaveTime: 0,
        autoSaveInterval: 30000, // 30 секунд
        version: "1.0.0",
        sessionStart: null
    },

    // Статистика игры
    stats: {
        totalPlayTime: 0,
        sessionsCount: 0,
        actionsPerformed: 0,
        resourcesCollected: 0,
        battlesFought: 0
    },

    // Инициализация игры
    init: function() {
        if (this.state.isInitialized) {
            console.warn('Game already initialized');
            return;
        }

        console.log('🎮 Initializing My Kings Game');
        
        // Показываем загрузку
        if (window.uiSystem) {
            uiSystem.showLoading('Загрузка игры');
        }

        // Запускаем инициализацию всех систем
        this.initializeSystems();
        
        // Настраиваем игровой цикл
        this.setupGameLoop();
        
        // Запускаем авто-сохранение
        this.startAutoSave();
        
        // Записываем время начала сессии
        this.state.sessionStart = Date.now();
        this.stats.sessionsCount++;
        
        this.state.isInitialized = true;
        
        console.log('✅ Game initialized successfully!');
        
        // Скрываем загрузку
        setTimeout(() => {
            if (window.uiSystem) {
                uiSystem.hideLoading();
            }
            
            // Показываем приветственное сообщение
            this.showWelcomeMessage();
        }, 1000);
    },

    // Инициализация всех систем игры
    initializeSystems: function() {
        const systems = [
            { name: 'Utils', system: utils, required: true },
            { name: 'UI', system: uiSystem, required: true },
            { name: 'Player', system: playerSystem, required: true },
            { name: 'Mail', system: mailSystem, required: false },
            { name: 'Rating', system: ratingSystem, required: false },
            { name: 'Inventory', system: inventorySystem, required: false },
            { name: 'Bank', system: bankSystem, required: false },
            { name: 'Alliance', system: allianceSystem, required: false },
            { name: 'Settings', system: settingsSystem, required: false }
        ];

        systems.forEach(({ name, system, required }) => {
            try {
                if (system && typeof system.init === 'function') {
                    system.init();
                    console.log(`✅ ${name} system initialized`);
                } else if (required) {
                    throw new Error(`${name} system not found or missing init method`);
                }
            } catch (error) {
                console.error(`❌ Failed to initialize ${name} system:`, error);
                if (required) {
                    throw error;
                }
            }
        });
    },

    // Настройка игрового цикла
    setupGameLoop: function() {
        let lastTime = 0;
        const gameLoop = (currentTime) => {
            if (!this.state.isPaused) {
                const deltaTime = lastTime ? (currentTime - lastTime) / 1000 : 0;
                this.state.gameTime += deltaTime;
                
                // Обновление игровой логики
                this.update(deltaTime);
                
                lastTime = currentTime;
            }
            
            requestAnimationFrame(gameLoop);
        };
        
        requestAnimationFrame(gameLoop);
        console.log('🔄 Game loop started');
    },

    // Обновление игрового состояния
    update: function(deltaTime) {
        // Обновление статистики игрового времени
        this.stats.totalPlayTime += deltaTime;
        
        // Проверка событий и триггеров
        this.checkGameEvents();
        
        // Обновление визуальных элементов
        this.updateVisuals();
    },

    // Проверка игровых событий
    checkGameEvents: function() {
        const currentTime = Date.now();
        
        // Проверка ежедневных бонусов
        if (window.bankSystem && currentTime - this.state.lastSaveTime > 60000) { // Каждую минуту
            bankSystem.updateDailyBonuses();
        }
        
        // Проверка новых сообщений (раз в 30 секунд)
        if (window.mailSystem && currentTime % 30000 < 1000) {
            this.checkForNewMessages();
        }
        
        // Авто-сохранение
        if (currentTime - this.state.lastSaveTime > this.state.autoSaveInterval) {
            this.autoSave();
        }
    },

    // Проверка новых сообщений
    checkForNewMessages: function() {
        // В реальной игре здесь была бы проверка сервера
        // Сейчас просто случайные тестовые сообщения
        if (Math.random() < 0.1) { // 10% шанс
            const testMessages = [
                {
                    sender: "🌾 Фермер Джон",
                    preview: "Урожай собран! Получите свою долю.",
                    important: false
                },
                {
                    sender: "⚔️ Командир стражи",
                    preview: "Границы королевства в безопасности.",
                    important: false
                },
                {
                    sender: "💰 Казначей",
                    preview: "Налоги собраны. Казна пополнена!",
                    important: true
                }
            ];
            
            const randomMessage = testMessages[Math.floor(Math.random() * testMessages.length)];
            if (window.mailSystem) {
                mailSystem.addNewMessage(
                    randomMessage.sender,
                    randomMessage.preview,
                    null,
                    randomMessage.important,
                    false,
                    'notifications'
                );
            }
        }
    },

    // Обновление визуальных элементов
    updateVisuals: function() {
        // Обновление времени в игре
        this.updateGameTimeDisplay();
        
        // Обновление анимаций ресурсов
        this.updateResourceAnimations();
    },

    // Обновление отображения игрового времени
    updateGameTimeDisplay: function() {
        // Можно добавить отображение игрового времени где-нибудь в интерфейсе
    },

    // Обновление анимаций ресурсов
    updateResourceAnimations: function() {
        // Анимации для активных ресурсов
    },

    // Авто-сохранение
    startAutoSave: function() {
        setInterval(() => {
            if (!this.state.isPaused) {
                this.autoSave();
            }
        }, this.state.autoSaveInterval);
        
        console.log('💾 Auto-save enabled');
    },

    // Авто-сохранение игры
    autoSave: function() {
        if (window.settingsSystem) {
            const settings = settingsSystem.getSettings();
            if (!settings.game.autoSave) {
                return; // Авто-сохранение отключено в настройках
            }
        }

        try {
            this.saveGame();
            this.state.lastSaveTime = Date.now();
            console.log('💾 Game auto-saved');
        } catch (error) {
            console.error('❌ Auto-save failed:', error);
        }
    },

    // Сохранение игры
    saveGame: function() {
        const gameData = {
            state: this.state,
            stats: this.stats,
            timestamp: Date.now(),
            version: this.state.version
        };

        // Сохраняем данные основной игры
        utils.saveToStorage('gameData', gameData);
        
        // Сохраняем данные всех систем
        this.saveAllSystems();
        
        this.stats.actionsPerformed++;
    },

    // Сохранение всех систем
    saveAllSystems: function() {
        const systems = [
            { key: 'playerData', system: playerSystem },
            { key: 'mailData', system: mailSystem },
            { key: 'ratingData', system: ratingSystem },
            { key: 'inventoryData', system: inventorySystem },
            { key: 'bankData', system: bankSystem },
            { key: 'allianceData', system: allianceSystem },
            { key: 'settingsData', system: settingsSystem }
        ];

        systems.forEach(({ key, system }) => {
            if (system && typeof system.saveToStorage === 'function') {
                system.saveToStorage();
            }
        });
    },

    // Загрузка игры
    loadGame: function() {
        try {
            console.log('📂 Loading game');
            
            // Загружаем основные данные игры
            const gameData = utils.loadFromStorage('gameData');
            if (gameData) {
                this.state = {  ...this.state,  ...gameData.state };
                this.stats = {  ...this.stats,  ...gameData.stats };
                console.log('✅ Game data loaded');
            }
            
            // Загружаем все системы
            this.loadAllSystems();
            
            // Обновляем отображение
            this.updateAllDisplays();
            
            console.log('🎮 Game loaded successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to load game:', error);
            return false;
        }
    },

    // Загрузка всех систем
    loadAllSystems: function() {
        const systems = [
            { system: playerSystem, method: 'loadFromStorage' },
            { system: mailSystem, method: 'loadFromStorage' },
            { system: ratingSystem, method: 'loadFromStorage' },
            { system: inventorySystem, method: 'loadFromStorage' },
            { system: bankSystem, method: 'loadFromStorage' },
            { system: allianceSystem, method: 'loadFromStorage' },
            { system: settingsSystem, method: 'loadFromStorage' }
        ];

        systems.forEach(({ system, method }) => {
            if (system && typeof system[method] === 'function') {
                system[method]();
            }
        });
    },

    // Обновление всех отображений
    updateAllDisplays: function() {
        if (window.playerSystem) {
            playerSystem.updateDisplay();
        }
        if (window.mailSystem) {
            mailSystem.updateBadge();
        }
    },

    // Показать приветственное сообщение
    showWelcomeMessage: function() {
        if (window.uiSystem) {
            uiSystem.showNotification(
                "👑 Добро пожаловать в Мои Короли!",
                "Ваше королевство ждет вашего правления!",
                'success',
                5000
            );
        }
        
        // Первое сообщение в почту
        setTimeout(() => {
            if (window.mailSystem) {
                mailSystem.addNewMessage(
                    "👋 Система",
                    "Добро пожаловать в игру! Проверьте свою почту для получения начальных заданий.",
                    "Уважаемый правитель!\n\nДобро пожаловать в ваше новое королевство! Как новый король, вы должны:\n\n1. Построить первые здания\n2. Нанять армию\n3. Наладить экономику\n4. Защищать границы\n\nУдачи в правлении!\n\nС уважением,\nСовет королевства",
                    true,
                    false,
                    'notifications'
                );
            }
        }, 2000);
    },

    // Пауза игры
    pauseGame: function() {
        this.state.isPaused = true;
        console.log('⏸️ Game paused');
        
        if (window.uiSystem) {
            uiSystem.showNotification("⏸️ Игра на паузе", "Все процессы приостановлены", 'warning');
        }
    },

    // Возобновление игры
    resumeGame: function() {
        this.state.isPaused = false;
        console.log('▶️ Game resumed');
        
        if (window.uiSystem) {
            uiSystem.showNotification("▶️ Игра продолжена", "Все процессы возобновлены", 'success');
        }
    },

    // Перезапуск игры
    restartGame: function() {
        if (confirm('Вы уверены, что хотите перезапустить игру? Все несохраненные данные будут потеряны.')) {
            localStorage.clear();
            location.reload();
        }
    },

    // Сброс игры
    resetGame: function() {
        if (confirm('ВНИМАНИЕ! Это удалит ВСЕ ваши данные и начнет игру заново. Вы уверены?')) {
            if (confirm('Это действие нельзя отменить. Все ваши достижения, ресурсы и прогресс будут потеряны. Продолжить?')) {
                localStorage.clear();
                location.reload();
            }
        }
    },

    // Получить статистику игры
    getGameStats: function() {
        return {
             ...this.stats,
            currentSession: Date.now() - this.state.sessionStart,
            version: this.state.version,
            isPaused: this.state.isPaused
        };
    },

    // Показать информацию о игре
    showGameInfo: function() {
        const stats = this.getGameStats();
        const playTime = Math.floor(stats.totalPlayTime / 60); // в минутах
        
        const info = `
Версия игры: ${stats.version}
Общее время игры: ${playTime} минут
Количество сессий: ${stats.sessionsCount}
Выполнено действий: ${stats.actionsPerformed}
Собрано ресурсов: ${stats.resourcesCollected}
Проведено битв: ${stats.battlesFought}
Текущая сессия: ${Math.floor(stats.currentSession / 1000 / 60)} минут
        `.trim();

        if (window.uiSystem) {
            uiSystem.showConfirm(info, null, null);
        } else {
            alert(info);
        }
    },

    // Обработка ошибок игры
    handleError: function(error, context = 'Unknown') {
        console.error(`🎮 Game error in ${context}:`, error);
        
        // Показываем пользователю сообщение об ошибке
        if (window.uiSystem) {
            uiSystem.showNotification(
                "❌ Ошибка игры",
                `Произошла ошибка: ${error.message}. Игра продолжена.`,
                'error',
                10000
            );
        }
        
        // Сохраняем информацию об ошибке
        this.logError(error, context);
    },

    // Логирование ошибок
    logError: function(error, context) {
        const errorLog = {
            timestamp: Date.now(),
            context: context,
            message: error.message,
            stack: error.stack,
            gameState: this.state,
            gameStats: this.stats
        };
        
        // Сохраняем последние 10 ошибок
        const existingLogs = utils.loadFromStorage('errorLogs') || [];
        existingLogs.unshift(errorLog);
        existingLogs.splice(10); // Оставляем только 10 последних ошибок
        
        utils.saveToStorage('errorLogs', existingLogs);
    },

    // Экспорт данных игры
    exportGameData: function() {
        const exportData = {
            game: {
                state: this.state,
                stats: this.stats
            },
            systems: {
                player: utils.loadFromStorage('playerData'),
                mail: utils.loadFromStorage('mailData'),
                inventory: utils.loadFromStorage('inventoryData'),
                bank: utils.loadFromStorage('bankData')
            },
            exportTime: Date.now(),
            version: this.state.version
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        // В реальном приложении здесь был бы экспорт файла
        console.log('📤 Game data exported:', exportData);
        
        if (window.uiSystem) {
            uiSystem.showNotification("📤 Данные экспортированы", "Готово для скачивания", 'success');
        }
        
        return dataStr;
    },

    // Завершение игры (при закрытии страницы)
    cleanup: function() {
        console.log('🛑 Game cleanup started');
        
        // Сохраняем игру перед закрытием
        this.saveGame();
        
        // Обновляем общее время игры
        if (this.state.sessionStart) {
            const sessionTime = Date.now() - this.state.sessionStart;
            this.stats.totalPlayTime += sessionTime / 1000; // в секундах
        }
        
        console.log('🎮 Game session ended');
    }
};

// Глобальные функции для совместимости
function initGame() {
    gameSystem.init();
}

function openSettings() {
    if (window.settingsSystem) {
        settingsSystem.openSettings();
    }
}

function closeSettings() {
    if (window.settingsSystem) {
        settingsSystem.closeSettings();
    }
}

function openRating() {
    if (window.ratingSystem) {
        ratingSystem.openRating();
    }
}

// Обработка закрытия страницы
window.addEventListener('beforeunload', (event) => {
    if (gameSystem.state.isInitialized) {
        gameSystem.cleanup();
    }
});

// Обработка ошибок
window.addEventListener('error', (event) => {
    gameSystem.handleError(event.error, 'Global');
});

// Инициализация при полной загрузке страницы
window.addEventListener('load', function() {
    setTimeout(() => {
        gameSystem.init();
    }, 100);
});