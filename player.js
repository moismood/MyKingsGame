// js/modules/player.js
const playerSystem = {
    // Данные игрока
    data: {
        username: "Король Артур",
        level: 5,
        experience: 1250,
        resources: {
            gold: 1250,
            diamonds: 75,
            food: 3250,
            wood: 500,
            stone: 300,
            iron: 150
        },
        stats: {
            population: 100,
            maxPopulation: 200,
            attack: 50,
            defense: 30,
            intelligence: 25
        },
        inventory: [],
        achievements: []
    },

    // Инициализация игрока
    init: function() {
        this.loadFromStorage();
        this.updateDisplay();
        this.startResourceGeneration();
        console.log('Player system initialized');
    },

    // Обновление отображения данных игрока
    updateDisplay: function() {
        // Основная информация
        const playerNameElement = document.getElementById('playerName');
        const playerLevelElement = document.getElementById('playerLevel');
        
        if (playerNameElement) playerNameElement.textContent = this.data.username;
        if (playerLevelElement) playerLevelElement.textContent = this.data.level;

        // Ресурсы
        this.updateResourceDisplay('goldAmount', this.data.resources.gold);
        this.updateResourceDisplay('diamondsAmount', this.data.resources.diamonds);
        this.updateResourceDisplay('foodAmount', this.data.resources.food);
    },

    // Обновление отображения конкретного ресурса
    updateResourceDisplay: function(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            // Анимированное изменение значения
            const currentValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
            if (currentValue !== value) {
                utils.animateValue(element, currentValue, value, 1000);
            } else {
                element.textContent = utils.formatNumber(value);
            }
        }
    },

    // Добавление ресурса
    addResource: function(type, amount) {
        if (this.data.resources[type] !== undefined) {
            this.data.resources[type] += amount;
            this.updateDisplay();
            this.saveToStorage();
            
            // Показываем уведомление о получении ресурсов
            if (amount > 0) {
                utils.showNotification(
                    "💎 Получены ресурсы",
                    `Вы получили ${utils.formatNumber(amount)} ${this.getResourceName(type)}`,
                    'normal'
                );
            }
            
            return true;
        }
        return false;
    },

    // Списание ресурса
    removeResource: function(type, amount) {
        if (this.data.resources[type] !== undefined && this.data.resources[type] >= amount) {
            this.data.resources[type] -= amount;
            this.updateDisplay();
            this.saveToStorage();
            return true;
        }
        return false;
    },

    // Проверка наличия ресурсов
    hasResources: function(costs) {
        for (const [resourceType, amount] of Object.entries(costs)) {
            if (this.data.resources[resourceType] < amount) {
                return false;
            }
        }
        return true;
    },

    // Получение названия ресурса
    getResourceName: function(resourceType) {
        const names = {
            gold: 'золота',
            diamonds: 'алмазов',
            food: 'еды',
            wood: 'дерева',
            stone: 'камня',
            iron: 'железа'
        };
        return names[resourceType] || resourceType;
    },

    // Добавление опыта
    addExperience: function(amount) {
        this.data.experience += amount;
        this.checkLevelUp();
        this.updateDisplay();
        this.saveToStorage();
    },

    // Проверка повышения уровня
    checkLevelUp: function() {
        const expNeeded = this.getExpForNextLevel();
        if (this.data.experience >= expNeeded) {
            this.data.level++;
            this.data.experience -= expNeeded;
            
            utils.showNotification(
                "🎉 Уровень повышен!",
                `Поздравляем! Вы достигли ${this.data.level} уровня!`,
                'important'
            );
            
            // Награда за уровень
            this.addResource('gold', this.data.level * 100);
            this.addResource('diamonds', this.data.level * 5);
        }
    },

    // Получение необходимого опыта для следующего уровня
    getExpForNextLevel: function() {
        return this.data.level * 1000;
    },

    // Автоматическая генерация ресурсов
    startResourceGeneration: function() {
        setInterval(() => {
            this.addResource('food', 10);
            this.addResource('gold', 5);
            this.updateDisplay();
        }, 5000);
    },

    // Покупка предмета
    buyItem: function(item) {
        if (this.hasResources(item.cost)) {
            // Списание ресурсов
            for (const [resourceType, amount] of Object.entries(item.cost)) {
                this.removeResource(resourceType, amount);
            }
            
            // Добавление предмета в инвентарь
            this.addToInventory(item);
            
            utils.showNotification(
                "🛍️ Покупка совершена",
                `Вы купили: ${item.name}`,
                'normal'
            );
            
            return true;
        } else {
            utils.showNotification(
                "❌ Недостаточно ресурсов",
                "Проверьте наличие необходимых ресурсов",
                'important'
            );
            return false;
        }
    },

    // Добавление предмета в инвентарь
    addToInventory: function(item) {
        const existingItem = this.data.inventory.find(invItem => invItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity || 1;
        } else {
            this.data.inventory.push({
                 ...item,
                quantity: item.quantity || 1
            });
        }
        this.saveToStorage();
    },

    // Использование предмета из инвентаря
    useItem: function(itemId) {
        const itemIndex = this.data.inventory.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            const item = this.data.inventory[itemIndex];
            
            // Применение эффектов предмета
            this.applyItemEffects(item);
            
            // Уменьшение количества или удаление
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                this.data.inventory.splice(itemIndex, 1);
            }
            
            this.saveToStorage();
            return true;
        }
        return false;
    },

    // Применение эффектов предмета
    applyItemEffects: function(item) {
        if (item.effects) {
            for (const effect of item.effects) {
                switch (effect.type) {
                    case 'resource':
                        this.addResource(effect.resource, effect.amount);
                        break;
                    case 'stat':
                        this.data.stats[effect.stat] += effect.amount;
                        break;
                    case 'experience':
                        this.addExperience(effect.amount);
                        break;
                }
            }
        }
        
        utils.showNotification(
            "🎯 Предмет использован",
            `Использован: ${item.name}`,
            'normal'
        );
    },

    // Получение информации об игроке для отображения
    getPlayerInfo: function() {
        return {
            name: this.data.username,
            level: this.data.level,
            experience: this.data.experience,
            expNeeded: this.getExpForNextLevel(),
            resources: {  ...this.data.resources },
            stats: {  ...this.data.stats }
        };
    },

    // Сохранение в localStorage
    saveToStorage: function() {
        utils.saveToStorage('playerData', this.data);
    },

    // Загрузка из localStorage
    loadFromStorage: function() {
        const saved = utils.loadFromStorage('playerData');
        if (saved) {
            this.data = {  ...this.data,  ...saved };
        }
    },

    // Сброс данных игрока (для тестирования)
    reset: function() {
        if (confirm('Вы уверены, что хотите сбросить все данные игрока?')) {
            this.data = {
                username: "Король Артур",
                level: 1,
                experience: 0,
                resources: {
                    gold: 100,
                    diamonds: 10,
                    food: 500,
                    wood: 100,
                    stone: 50,
                    iron: 25
                },
                stats: {
                    population: 50,
                    maxPopulation: 100,
                    attack: 10,
                    defense: 5,
                    intelligence: 5
                },
                inventory: [],
                achievements: []
            };
            this.saveToStorage();
            this.updateDisplay();
            
            utils.showNotification(
                "🔄 Данные сброшены",
                "Все данные игрока были сброшены к начальным значениям",
                'important'
            );
        }
    }
};

// Функции для глобального доступа (сохраняем совместимость)
function updateDisplay() {
    playerSystem.updateDisplay();
}

function goToProfile() {
    playerSystem.goToProfile();
}

// Экспортируем глобально
window.playerSystem = playerSystem;
