// js/modules/settings.js
const settingsSystem = {
    // Данные настроек
    data: {
        currentCategory: 'sound',
        settings: {
            // Настройки звука
            sound: {
                masterVolume: 80,
                musicVolume: 70,
                effectsVolume: 90,
                uiVolume: 85,
                muteAll: false
            },
            
            // Настройки интерфейса
            interface: {
                darkTheme: true,
                showTooltips: true,
                compactMode: false,
                language: 'ru',
                fontSize: 'medium',
                animations: true
            },
            
            // Настройки графики
            graphics: {
                textureQuality: 'high',
                antiAliasing: true,
                shadows: true,
                particles: true,
                renderDistance: 'medium',
                fpsLimit: 60
            },
            
            // Настройки игры
            game: {
                notifications: true,
                combatReports: true,
                tradeNotifications: true,
                allianceMessages: true,
                autoSave: true,
                confirmActions: true
            },
            
            // Настройки управления
            controls: {
                keyBindings: {
                    'inventory': 'I',
                    'map': 'M',
                    'quests': 'Q',
                    'settings': 'Esc'
                },
                mouseSensitivity: 50,
                invertMouse: false,
                quickCast: true
            }
        }
    },

    isOpen: false,

    // Инициализация системы настроек
    init: function() {
        this.loadFromStorage();
        this.applySettings();
        console.log('Settings system initialized');
    },

    // Открыть настройки
    openSettings: function() {
        console.log('Opening settings modal');
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.style.display = 'flex';
            this.isOpen = true;
            this.data.currentCategory = 'sound';
            this.renderSettings();
            console.log('Settings modal opened successfully');
        } else {
            console.error('Settings modal not found!');
        }
    },

    // Закрыть настройки
    closeSettings: function() {
        console.log('Closing settings modal');
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.style.display = 'none';
            this.isOpen = false;
            console.log('Settings modal closed successfully');
        }
    },

    // Простой способ закрыть настройки (альтернатива)
    close: function() {
        this.closeSettings();
    },

    // Выбрать категорию настроек
    selectSettingsCategory: function(category) {
        // Обновляем активные категории
        document.querySelectorAll('.settings-category').forEach(cat => {
            cat.classList.remove('active');
        });
        
        document.querySelectorAll('.settings-section').forEach(section => {
            section.classList.remove('active');
        });

        // Активируем выбранную категорию
        const categoryElement = document.querySelector(`.settings-category:nth-child(${this.getCategoryIndex(category)})`);
        if (categoryElement) {
            categoryElement.classList.add('active');
        }

        // Активируем соответствующую секцию
        const sectionElement = document.getElementById(category + 'Settings');
        if (sectionElement) {
            sectionElement.classList.add('active');
        }

        this.data.currentCategory = category;
        this.renderSettingsContent();
    },

    // Получить индекс категории
    getCategoryIndex: function(category) {
        const categories = ['sound', 'interface', 'graphics', 'game'];
        return categories.indexOf(category) + 1;
    },

    // Отрисовать настройки
    renderSettings: function() {
        this.renderSettingsContent();
    },

    // Отрисовать содержимое настроек
    renderSettingsContent: function() {
        const section = document.getElementById(this.data.currentCategory + 'Settings');
        if (!section) {
            console.error('Settings section not found:', this.data.currentCategory);
            return;
        }

        // Рендерим содержимое в зависимости от категории
        switch (this.data.currentCategory) {
            case 'sound':
                this.renderSoundSettings(section);
                break;
            case 'interface':
                this.renderInterfaceSettings(section);
                break;
            case 'graphics':
                this.renderGraphicsSettings(section);
                break;
            case 'game':
                this.renderGameSettings(section);
                break;
        }
    },

    // Отрисовать настройки звука
    renderSoundSettings: function(container) {
        const soundSettings = this.data.settings.sound;

        container.innerHTML = `
            <h3>🔊 Настройки звука</h3>
            <div class="sound-controls">
                <div class="sound-option">
                    <div class="option-label">
                        <span class="option-icon">🔊</span>
                        Общая громкость
                    </div>
                    <input type="range" class="volume-slider" value="${soundSettings.masterVolume}" 
                           min="0" max="100" onchange="settingsSystem.updateSetting('sound', 'masterVolume', this.value)">
                    <span style="color: #f0c87a; min-width: 30px; text-align: center;">${soundSettings.masterVolume}%</span>
                </div>
                
                <div class="sound-option">
                    <div class="option-label">
                        <span class="option-icon">🎵</span>
                        Музыка
                    </div>
                    <input type="range" class="volume-slider" value="${soundSettings.musicVolume}" 
                           min="0" max="100" onchange="settingsSystem.updateSetting('sound', 'musicVolume', this.value)">
                    <span style="color: #f0c87a; min-width: 30px; text-align: center;">${soundSettings.musicVolume}%</span>
                </div>
                
                <div class="sound-option">
                    <div class="option-label">
                        <span class="option-icon">🎮</span>
                        Эффекты
                    </div>
                    <input type="range" class="volume-slider" value="${soundSettings.effectsVolume}" 
                           min="0" max="100" onchange="settingsSystem.updateSetting('sound', 'effectsVolume', this.value)">
                    <span style="color: #f0c87a; min-width: 30px; text-align: center;">${soundSettings.effectsVolume}%</span>
                </div>
                
                <div class="sound-option">
                    <div class="option-label">
                        <span class="option-icon">💬</span>
                        Интерфейс
                    </div>
                    <input type="range" class="volume-slider" value="${soundSettings.uiVolume}" 
                           min="0" max="100" onchange="settingsSystem.updateSetting('sound', 'uiVolume', this.value)">
                    <span style="color: #f0c87a; min-width: 30px; text-align: center;">${soundSettings.uiVolume}%</span>
                </div>
                
                <div class="sound-option">
                    <div class="option-label">
                        <span class="option-icon">🔇</span>
                        Отключить все звуки
                    </div>
                    <label class="switch">
                        <input type="checkbox" ${soundSettings.muteAll ? 'checked' : ''} 
                               onchange="settingsSystem.toggleMuteAll(this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
            
            <div style="margin-top: 20px; display: flex; gap: 10px;">
                <button class="treasury-btn" onclick="settingsSystem.testSound()">
                    🎵 Тест звука
                </button>
                <button class="treasury-btn" onclick="settingsSystem.resetSoundSettings()">
                    🔄 Сбросить
                </button>
            </div>
        `;

        // Обновляем состояние слайдеров если звук отключен
        this.updateSoundSlidersState();
    },

    // Отрисовать настройки интерфейса
    renderInterfaceSettings: function(container) {
        const interfaceSettings = this.data.settings.interface;

        container.innerHTML = `
            <h3>🎨 Настройки интерфейса</h3>
            <div class="sound-controls">
                <div class="sound-option">
                    <div class="option-label">
                        <span class="option-icon">🌙</span>
                        Темная тема
                    </div>
                    <label class="switch">
                        <input type="checkbox" ${interfaceSettings.darkTheme ? 'checked' : ''} 
                               onchange="settingsSystem.updateSetting('interface', 'darkTheme', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
                
                <div class="sound-option">
                    <div class="option-label">
                        <span class="option-icon">💡</span>
                        Показывать подсказки
                    </div>
                    <label class="switch">
                        <input type="checkbox" ${interfaceSettings.showTooltips ? 'checked' : ''} 
                               onchange="settingsSystem.updateSetting('interface', 'showTooltips', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
                
                <div class="sound-option">
                    <div class="option-label">
                        <span class="option-icon">📱</span>
                        Компактный режим
                    </div>
                    <label class="switch">
                        <input type="checkbox" ${interfaceSettings.compactMode ? 'checked' : ''} 
                               onchange="settingsSystem.updateSetting('interface', 'compactMode', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
                
                <div class="sound-option">
                    <div class="option-label">
                        <span class="option-icon">✨</span>
                        Анимации
                    </div>
                    <label class="switch">
                        <input type="checkbox" ${interfaceSettings.animations ? 'checked' : ''} 
                               onchange="settingsSystem.updateSetting('interface', 'animations', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
                
                <div class="sound-option">
                    <div class="option-label">
                        <span class="option-icon">🌐</span>
                        Язык
                    </div>
                    <select style="background: #2d1f0a; color: #f0c87a; border: 1px solid #8b6b2c; padding: 5px; border-radius: 5px;"
                            onchange="settingsSystem.updateSetting('interface', 'language', this.value)">
                        <option value="ru" ${interfaceSettings.language === 'ru' ? 'selected' : ''}>Русский</option>
                        <option value="en" ${interfaceSettings.language === 'en' ? 'selected' : ''}>English</option>
                    </select>
                </div>
                
                <div class="sound-option">
                    <div class="option-label">
                        <span class="option-icon">🔠</span>
                        Размер текста
                    </div>
                    <select style="background: #2d1f0a; color: #f0c87a; border: 1px solid #8b6b2c; padding: 5px; border-radius: 5px;"
                            onchange="settingsSystem.updateSetting('interface', 'fontSize', this.value)">
                        <option value="small" ${interfaceSettings.fontSize === 'small' ? 'selected' : ''}>Маленький</option>
                        <option value="medium" ${interfaceSettings.fontSize === 'medium' ? 'selected' : ''}>Средний</option>
                        <option value="large" ${interfaceSettings.fontSize === 'large' ? 'selected' : ''}>Большой</option>
                    </select>
                </div>
            </div>
        `;
    },

    // Отрисовать настройки графики
    renderGraphicsSettings: function(container) {
        const graphicsSettings = this.data.settings.graphics;

        container.innerHTML = `
            <h3>🖥️ Настройки графики</h3>
            <div class="sound-controls">
                <div class="sound-option">
                    <div class="option-label">
                        <span class="option-icon">🖼️</span>
                        Качество текстур
                    </div>
                    <select style="background: #2d1f0a; color: #f0c87a; border: 1px solid #8b6b2c; padding: 5px; border-radius: 5px;"
                            onchange="settingsSystem.updateSetting('graphics', 'textureQuality', this.value)">
                        <option value="low" ${graphicsSettings.textureQuality === 'low' ? 'selected' : ''}>Низкое</option>
                        <option value="medium" ${graphicsSettings.textureQuality === 'medium' ? 'selected' : ''}>Среднее</option>
                        <option value="high" ${graphicsSettings.textureQuality === 'high' ? 'selected' : ''}>Высокое</option>
                        <option value="ultra" ${graphicsSettings.textureQuality === 'ultra' ? 'selected' : ''}>Ультра</option>
                    </select>
                </div>
                
                <div class="sound-option">
                    <div class="option-label">
                        <span class="option-icon">🔍</span>
                        Сглаживание
                    </div>
                    <label class="switch">
                        <input type="checkbox" ${graphicsSettings.antiAliasing ? 'checked' : ''} 
                               onchange="settingsSystem.updateSetting('graphics', 'antiAliasing', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
                
                <div class="sound-option">
                    <div class="option-label">
                        <span class="option-icon">🌑</span>
                        Тени
                    </div>
                    <label class="switch">
                        <input type="checkbox" ${graphicsSettings.shadows ? 'checked' : ''} 
                               onchange="settingsSystem.updateSetting('graphics', 'shadows', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
                
                <div class="sound-option">
                    <div class="option-label">
                        <span class="option-icon">✨</span>
                        Частицы
                    </div>
                    <label class="switch">
                        <input type="checkbox" ${graphicsSettings.particles ? 'checked' : ''} 
                               onchange="settingsSystem.updateSetting('graphics', 'particles', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
                
                <div class="sound-option">
                    <div class="option-label">
                        <span class="option-icon">👁️</span>
                        Дальность прорисовки
                    </div>
                    <select style="background: #2d1f0a; color: #f0c87a; border: 1px solid #8b6b2c; padding: 5px; border-radius: 5px;"
                            onchange="settingsSystem.updateSetting('graphics', 'renderDistance', this.value)">
                        <option value="low" ${graphicsSettings.renderDistance === 'low' ? 'selected' : ''}>Низкая</option>
                        <option value="medium" ${graphicsSettings.renderDistance === 'medium' ? 'selected' : ''}>Средняя</option>
                        <option value="high" ${graphicsSettings.renderDistance === 'high' ? 'selected' : ''}>Высокая</option>
                    </select>
                </div>
                
                <div class="sound-option">
                    <div class="option-label">
                        <span class="option-icon">⚡</span>
                        Ограничение FPS
                    </div>
                    <select style="background: #2d1f0a; color: #f0c87a; border: 1px solid #8b6b2c; padding: 5px; border-radius: 5px;"
                            onchange="settingsSystem.updateSetting('graphics', 'fpsLimit', this.value)">
                        <option value="30" ${graphicsSettings.fpsLimit === 30 ? 'selected' : ''}>30 FPS</option>
                        <option value="60" ${graphicsSettings.fpsLimit === 60 ? 'selected' : ''}>60 FPS</option>
                        <option value="120" ${graphicsSettings.fpsLimit === 120 ? 'selected' : ''}>120 FPS</option>
                        <option value="0" ${graphicsSettings.fpsLimit === 0 ? 'selected' : ''}>Без ограничения</option>
                    </select>
                </div>
            </div>
            
            <div style="margin-top: 20px; padding: 10px; background: rgba(139, 107, 44, 0.1); border-radius: 5px;">
                <div style="color: #8b6b2c; font-size: 12px;">
                    💡 <strong>Рекомендуемые настройки:</strong> Средние настройки для оптимальной производительности
                </div>
            </div>
        `;
    },

    // Отрисовать настройки игры
    renderGameSettings: function(container) {
        const gameSettings = this.data.settings.game;

        container.innerHTML = `
            <h3>🎮 Настройки игры</h3>
            <div class="sound-controls">
                <div class="sound-option">
                    <div class="option-label">
                        <span class="option-icon">🔔</span>
                        Уведомления
                    </div>
                    <label class="switch">
                        <input type="checkbox" ${gameSettings.notifications ? 'checked' : ''} 
                               onchange="settingsSystem.updateSetting('game', 'notifications', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
                
                <div class="sound-option">
                    <div class="option-label">
                        <span class="option-icon">⚔️</span>
                        Боевые отчеты
                    </div>
                    <label class="switch">
                        <input type="checkbox" ${gameSettings.combatReports ? 'checked' : ''} 
                               onchange="settingsSystem.updateSetting('game', 'combatReports', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
                
                <div class="sound-option">
                    <div class="option-label">
                        <span class="option-icon">💰</span>
                        Торговые уведомления
                    </div>
                    <label class="switch">
                        <input type="checkbox" ${gameSettings.tradeNotifications ? 'checked' : ''} 
                               onchange="settingsSystem.updateSetting('game', 'tradeNotifications', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
                
                <div class="sound-option">
                    <div class="option-label">
                        <span class="option-icon">🤝</span>
                        Сообщения альянса
                    </div>
                    <label class="switch">
                        <input type="checkbox" ${gameSettings.allianceMessages ? 'checked' : ''} 
                               onchange="settingsSystem.updateSetting('game', 'allianceMessages', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
                
                <div class="sound-option">
                    <div class="option-label">
                        <span class="option-icon">💾</span>
                        Авто-сохранение
                    </div>
                    <label class="switch">
                        <input type="checkbox" ${gameSettings.autoSave ? 'checked' : ''} 
                               onchange="settingsSystem.updateSetting('game', 'autoSave', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
                
                <div class="sound-option">
                    <div class="option-label">
                        <span class="option-icon">⚠️</span>
                        Подтверждение действий
                    </div>
                    <label class="switch">
                        <input type="checkbox" ${gameSettings.confirmActions ? 'checked' : ''} 
                               onchange="settingsSystem.updateSetting('game', 'confirmActions', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
            
            <div style="margin-top: 20px; display: flex; gap: 10px;">
                <button class="treasury-btn" onclick="settingsSystem.exportSettings()">
                    📤 Экспорт настроек
                </button>
                <button class="treasury-btn" onclick="settingsSystem.importSettings()">
                    📥 Импорт настроек
                </button>
                <button class="treasury-btn" onclick="settingsSystem.resetAllSettings()" style="background: linear-gradient(135deg, #c41f3b, #ff4757);">
                    🔄 Сбросить все
                </button>
            </div>
        `;
    },

    // Обновить настройку
    updateSetting: function(category, setting, value) {
        if (this.data.settings[category] && this.data.settings[category][setting] !== undefined) {
            // Преобразуем значение если нужно
            if (typeof this.data.settings[category][setting] === 'number') {
                value = parseInt(value);
            } else if (typeof this.data.settings[category][setting] === 'boolean') {
                value = Boolean(value);
            }
            
            this.data.settings[category][setting] = value;
            this.applySettings();
            this.saveToStorage();
            
            // Обновляем отображение если нужно
            if (this.isOpen && category === this.data.currentCategory) {
                this.renderSettingsContent();
            }
            
            console.log(`Настройка обновлена: ${category}.${setting} = ${value}`);
        }
    },

    // Переключить отключение всех звуков
    toggleMuteAll: function(muted) {
        this.data.settings.sound.muteAll = muted;
        this.applySoundSettings();
        this.saveToStorage();
        this.renderSettingsContent();
    },

    // Обновить состояние слайдеров звука
    updateSoundSlidersState: function() {
        const sliders = document.querySelectorAll('.volume-slider');
        const isMuted = this.data.settings.sound.muteAll;
        
        sliders.forEach(slider => {
            slider.disabled = isMuted;
            slider.style.opacity = isMuted ? '0.5' : '1';
        });
    },

    // Применить все настройки
    applySettings: function() {
        this.applySoundSettings();
        this.applyInterfaceSettings();
        this.applyGraphicsSettings();
        this.applyGameSettings();
    },

    // Применить настройки звука
    applySoundSettings: function() {
        const sound = this.data.settings.sound;
        // Здесь будет логика применения звуковых настроек
        console.log('Применены настройки звука:', sound);
    },

    // Применить настройки интерфейса
    applyInterfaceSettings: function() {
        const interface = this.data.settings.interface;
        // Здесь будет логика применения настроек интерфейса
        console.log('Применены настройки интерфейса:', interface);
    },

    // Применить настройки графики
    applyGraphicsSettings: function() {
        const graphics = this.data.settings.graphics;
        // Здесь будет логика применения графических настроек
        console.log('Применены настройки графики:', graphics);
    },

    // Применить настройки игры
    applyGameSettings: function() {
        const game = this.data.settings.game;
        // Здесь будет логика применения игровых настроек
        console.log('Применены настройки игры:', game);
    },

    // Тестовые функции
    testSound: function() {
        if (window.utils && typeof utils.showNotification === 'function') {
            utils.showNotification(
                "🔊 Тест звука",
                "Воспроизводится тестовый звук",
                'normal'
            );
        } else {
            alert('🔊 Тест звука: Воспроизводится тестовый звук');
        }
    },

    resetSoundSettings: function() {
        this.data.settings.sound = {
            masterVolume: 80,
            musicVolume: 70,
            effectsVolume: 90,
            uiVolume: 85,
            muteAll: false
        };
        this.applySoundSettings();
        this.saveToStorage();
        this.renderSettingsContent();
        
        if (window.utils && typeof utils.showNotification === 'function') {
            utils.showNotification(
                "🔊 Настройки звука сброшены",
                "Звуковые настройки восстановлены по умолчанию",
                'normal'
            );
        }
    },

    exportSettings: function() {
        const settingsJson = JSON.stringify(this.data.settings, null, 2);
        // В реальном приложении здесь был бы экспорт файла
        if (window.utils && typeof utils.showNotification === 'function') {
            utils.showNotification(
                "📤 Настройки экспортированы",
                "Все настройки готовы для экспорта",
                'normal'
            );
        }
        console.log('Экспорт настроек:', settingsJson);
    },

    importSettings: function() {
        // В реальном приложении здесь был бы импорт файла
        if (window.utils && typeof utils.showNotification === 'function') {
            utils.showNotification(
                "📥 Импорт настроек",
                "Функция импорта в разработке",
                'normal'
            );
        }
    },

    resetAllSettings: function() {
        if (confirm('Вы уверены, что хотите сбросить ВСЕ настройки к значениям по умолчанию?')) {
            this.data.settings = {
                sound: {
                    masterVolume: 80,
                    musicVolume: 70,
                    effectsVolume: 90,
                    uiVolume: 85,
                    muteAll: false
                },
                interface: {
                    darkTheme: true,
                    showTooltips: true,
                    compactMode: false,
                    language: 'ru',
                    fontSize: 'medium',
                    animations: true
                },
                graphics: {
                    textureQuality: 'high',
                    antiAliasing: true,
                    shadows: true,
                    particles: true,
                    renderDistance: 'medium',
                    fpsLimit: 60
                },
                game: {
                    notifications: true,
                    combatReports: true,
                    tradeNotifications: true,
                    allianceMessages: true,
                    autoSave: true,
                    confirmActions: true
                },
                controls: {
                    keyBindings: {
                        'inventory': 'I',
                        'map': 'M',
                        'quests': 'Q',
                        'settings': 'Esc'
                    },
                    mouseSensitivity: 50,
                    invertMouse: false,
                    quickCast: true
                }
            };
            
            this.applySettings();
            this.saveToStorage();
            
            if (this.isOpen) {
                this.renderSettingsContent();
            }
            
            if (window.utils && typeof utils.showNotification === 'function') {
                utils.showNotification(
                    "🔄 Все настройки сброшены",
                    "Все настройки восстановлены по умолчанию",
                    'important'
                );
            }
        }
    },

    // Получить текущие настройки
    getSettings: function() {
        return this.data.settings;
    },

    // Сохранение в localStorage
    saveToStorage: function() {
        if (window.utils && typeof utils.saveToStorage === 'function') {
            utils.saveToStorage('gameSettings', this.data.settings);
        }
    },

    // Загрузка из localStorage
    loadFromStorage: function() {
        if (window.utils && typeof utils.loadFromStorage === 'function') {
            const saved = utils.loadFromStorage('gameSettings');
            if (saved) {
                this.data.settings = {  ...this.data.settings,  ...saved };
            }
        }
    }
};

// Глобальные функции для совместимости
function openSettings() {
    if (window.settingsSystem && typeof settingsSystem.openSettings === 'function') {
        settingsSystem.openSettings();
    } else {
        console.error('Settings system not available');
    }
}

function closeSettings() {
    if (window.settingsSystem && typeof settingsSystem.closeSettings === 'function') {
        settingsSystem.closeSettings();
    }
}

function selectSettingsCategory(category) {
    if (window.settingsSystem && typeof settingsSystem.selectSettingsCategory === 'function') {
        settingsSystem.selectSettingsCategory(category);
    }
}

// Экспортируем глобально
window.settingsSystem = settingsSystem;