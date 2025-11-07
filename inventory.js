// js/modules/inventory.js
const inventorySystem = {
    // Данные инвентаря
    data: {
        currentCategory: 'equipment',
        items: {
            // Снаряжение
            equipment: [
                {
                    id: 1,
                    name: "Меч рыцаря",
                    type: "weapon",
                    icon: "⚔️",
                    quantity: 1,
                    rarity: "rare",
                    description: "Острый меч, украшенный драгоценными камнями",
                    stats: { attack: 15, defense: 5 },
                    effects: [{ type: 'stat', stat: 'attack', amount: 15 }]
                },
                {
                    id: 2,
                    name: "Щит дракона",
                    type: "shield",
                    icon: "🛡️",
                    quantity: 1,
                    rarity: "epic",
                    description: "Щит из чешуи древнего дракона",
                    stats: { defense: 25, attack: 2 },
                    effects: [{ type: 'stat', stat: 'defense', amount: 25 }]
                },
                {
                    id: 3,
                    name: "Шлем короля",
                    type: "helmet",
                    icon: "⛑️",
                    quantity: 1,
                    rarity: "rare",
                    description: "Золотой шлем королевской гвардии",
                    stats: { defense: 12, intelligence: 5 },
                    effects: [{ type: 'stat', stat: 'defense', amount: 12 }]
                },
                {
                    id: 4,
                    name: "Кольчуга чемпиона",
                    type: "armor",
                    icon: "🥋",
                    quantity: 1,
                    rarity: "rare",
                    description: "Прочная кольчуга, выдержавшая множество битв",
                    stats: { defense: 18, attack: 3 },
                    effects: [{ type: 'stat', stat: 'defense', amount: 18 }]
                }
            ],
            
            // Ресурсы
            resources: [
                {
                    id: 101,
                    name: "Мешок зерна",
                    type: "food",
                    icon: "🌾",
                    quantity: 25,
                    rarity: "common",
                    description: "Основной источник питания для армии",
                    value: 2,
                    effects: [{ type: 'resource', resource: 'food', amount: 100 }]
                },
                {
                    id: 102,
                    name: "Древесина",
                    type: "wood",
                    icon: "🌳",
                    quantity: 50,
                    rarity: "common",
                    description: "Качественная древесина для строительства",
                    value: 1,
                    effects: [{ type: 'resource', resource: 'wood', amount: 50 }]
                },
                {
                    id: 103,
                    name: "Каменные блоки",
                    type: "stone",
                    icon: "🪨",
                    quantity: 30,
                    rarity: "common",
                    description: "Прочные каменные блоки для укреплений",
                    value: 3,
                    effects: [{ type: 'resource', resource: 'stone', amount: 30 }]
                },
                {
                    id: 104,
                    name: "Железные слитки",
                    type: "iron",
                    icon: "🔩",
                    quantity: 15,
                    rarity: "common",
                    description: "Чистое железо для оружия и доспехов",
                    value: 5,
                    effects: [{ type: 'resource', resource: 'iron', amount: 15 }]
                }
            ],
            
            // Артефакты
            artifacts: [
                {
                    id: 201,
                    name: "Корона предков",
                    type: "artifact",
                    icon: "👑",
                    quantity: 1,
                    rarity: "epic",
                    description: "Древняя корона, дарующая мудрость предков",
                    stats: { intelligence: 20, defense: 5 },
                    effects: [
                        { type: 'stat', stat: 'intelligence', amount: 20 },
                        { type: 'experience', amount: 500 }
                    ]
                },
                {
                    id: 202,
                    name: "Древний свиток",
                    type: "scroll",
                    icon: "📜",
                    quantity: 3,
                    rarity: "rare",
                    description: "Магический свиток с забытыми знаниями",
                    stats: { intelligence: 10 },
                    effects: [
                        { type: 'stat', stat: 'intelligence', amount: 10 },
                        { type: 'experience', amount: 200 }
                    ]
                },
                {
                    id: 203,
                    name: "Магический амулет",
                    type: "amulet",
                    icon: "🔮",
                    quantity: 1,
                    rarity: "epic",
                    description: "Амулет, усиливающий магические способности",
                    stats: { intelligence: 15, attack: 5 },
                    effects: [
                        { type: 'stat', stat: 'intelligence', amount: 15 },
                        { type: 'resource', resource: 'diamonds', amount: 10 }
                    ]
                },
                {
                    id: 204,
                    name: "Карта сокровищ",
                    type: "map",
                    icon: "🗺️",
                    quantity: 1,
                    rarity: "rare",
                    description: "Старая карта, ведущая к скрытым сокровищам",
                    stats: { intelligence: 8 },
                    effects: [
                        { type: 'resource', resource: 'gold', amount: 300 },
                        { type: 'experience', amount: 150 }
                    ]
                }
            ]
        }
    },

    isOpen: false,

    // Инициализация системы инвентаря
    init: function() {
        this.loadFromStorage();
        console.log('Inventory system initialized');
    },

    // Открыть инвентарь
    openInventory: function() {
        document.getElementById('inventoryModal').style.display = 'flex';
        this.isOpen = true;
        this.data.currentCategory = 'equipment';
        this.renderInventory();
        utils.setActiveNav('inventory');
    },

    // Закрыть инвентарь
    closeInventory: function() {
        document.getElementById('inventoryModal').style.display = 'none';
        this.isOpen = false;
    },

    // Выбрать категорию инвентаря
    selectInventoryCategory: function(category) {
        utils.selectCategory('inventory', category, 'Inventory');
        this.data.currentCategory = category;
        this.renderInventory();
    },

    // Отрисовать инвентарь
    renderInventory: function() {
        const sections = {
            'equipment': document.getElementById('equipmentInventory'),
            'resources': document.getElementById('resourcesInventory'),
            'artifacts': document.getElementById('artifactsInventory')
        };

        // Очищаем все секции
        Object.values(sections).forEach(section => {
            if (section) section.innerHTML = '';
        });

        // Получаем текущую категорию
        const currentSection = sections[this.data.currentCategory];
        if (!currentSection) return;

        // Получаем предметы текущей категории
        const items = this.data.items[this.data.currentCategory];
        if (!items || items.length === 0) {
            currentSection.innerHTML = '<div style="text-align: center; color: #8b6b2c; padding: 20px;">Инвентарь пуст</div>';
            return;
        }

        // Создаем заголовок
        const title = document.createElement('h3');
        title.textContent = this.getCategoryTitle(this.data.currentCategory);
        currentSection.appendChild(title);

        // Создаем сетку предметов
        const grid = document.createElement('div');
        grid.className = 'items-grid';
        
        items.forEach(item => {
            const itemElement = this.createItemElement(item);
            grid.appendChild(itemElement);
        });

        currentSection.appendChild(grid);
    },

    // Получить заголовок категории
    getCategoryTitle: function(category) {
        const titles = {
            'equipment': '⚔️ Снаряжение',
            'resources': '📦 Ресурсы',
            'artifacts': '🏺 Артефакты'
        };
        return titles[category] || category;
    },

    // Создать элемент предмета
    createItemElement: function(item) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'inventory-item';
        itemDiv.onclick = () => this.useItem(item.id);

        // Определяем класс редкости
        const rarityClass = item.rarity ? `item-rarity ${item.rarity}` : 'item-rarity common';

        itemDiv.innerHTML = `
            <div class="item-icon">${item.icon}</div>
            <div class="item-name">${item.name}</div>
            ${item.quantity > 1 ? `<div class="item-count">x${item.quantity}</div>` : ''}
            ${item.rarity ? `<div class="${rarityClass}">${this.getRarityName(item.rarity)}</div>` : ''}
        `;

        // Добавляем подсказку при наведении
        itemDiv.title = this.getItemTooltip(item);

        return itemDiv;
    },

    // Получить название редкости
    getRarityName: function(rarity) {
        const names = {
            'common': 'Обычный',
            'rare': 'Редкий',
            'epic': 'Эпический',
            'legendary': 'Легендарный'
        };
        return names[rarity] || rarity;
    },

    // Получить подсказку для предмета
    getItemTooltip: function(item) {
        let tooltip = `${item.name}\n${item.description}\n\n`;
        
        if (item.stats) {
            tooltip += "Характеристики:\n";
            Object.entries(item.stats).forEach(([stat, value]) => {
                const statNames = {
                    'attack': '⚔️ Атака',
                    'defense': '🛡️ Защита',
                    'intelligence': '🧠 Интеллект'
                };
                tooltip += `${statNames[stat] || stat}: +${value}\n`;
            });
        }
        
        if (item.quantity) {
            tooltip += `\nКоличество: ${item.quantity}`;
        }
        
        return tooltip;
    },

    // Использовать предмет
    useItem: function(itemId) {
        const item = this.findItemById(itemId);
        if (!item) {
            utils.showNotification("❌ Ошибка", "Предмет не найден", 'important');
            return;
        }

        // Проверяем можно ли использовать предмет
        if (!this.canUseItem(item)) {
            utils.showNotification("❌ Нельзя использовать", "Этот предмет нельзя использовать напрямую", 'important');
            return;
        }

        // Применяем эффекты предмета
        if (this.applyItemEffects(item)) {
            // Уменьшаем количество или удаляем предмет
            this.decreaseItemQuantity(itemId);
            
            utils.showNotification(
                "🎯 Предмет использован",
                `Использован: ${item.name}`,
                'normal'
            );
            
            // Обновляем отображение
            this.renderInventory();
        }
    },

    // Найти предмет по ID
    findItemById: function(itemId) {
        for (const category of Object.values(this.data.items)) {
            const item = category.find(item => item.id === itemId);
            if (item) return item;
        }
        return null;
    },

    // Проверить можно ли использовать предмет
    canUseItem: function(item) {
        // Ресурсы и некоторые артефакты можно использовать напрямую
        const usableTypes = ['food', 'wood', 'stone', 'iron', 'scroll', 'artifact', 'amulet', 'map'];
        return usableTypes.includes(item.type);
    },

    // Применить эффекты предмета
    applyItemEffects: function(item) {
        if (!item.effects || !Array.isArray(item.effects)) {
            return false;
        }

        let success = true;
        
        item.effects.forEach(effect => {
            switch (effect.type) {
                case 'resource':
                    if (window.playerSystem) {
                        playerSystem.addResource(effect.resource, effect.amount);
                    }
                    break;
                    
                case 'stat':
                    if (window.playerSystem) {
                        // Здесь можно добавить логику для применения статов
                        console.log(`Применен стат: ${effect.stat} +${effect.amount}`);
                    }
                    break;
                    
                case 'experience':
                    if (window.playerSystem) {
                        playerSystem.addExperience(effect.amount);
                    }
                    break;
                    
                default:
                    console.warn(`Неизвестный тип эффекта: ${effect.type}`);
                    success = false;
            }
        });

        return success;
    },

    // Уменьшить количество предмета
    decreaseItemQuantity: function(itemId) {
        for (const category of Object.keys(this.data.items)) {
            const itemIndex = this.data.items[category].findIndex(item => item.id === itemId);
            if (itemIndex !== -1) {
                const item = this.data.items[category][itemIndex];
                
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    this.data.items[category].splice(itemIndex, 1);
                }
                
                this.saveToStorage();
                return true;
            }
        }
        return false;
    },

    // Добавить предмет в инвентарь
    addItem: function(newItem, category = 'resources') {
        if (!this.data.items[category]) {
            this.data.items[category] = [];
        }

        // Проверяем есть ли уже такой предмет
        const existingItem = this.data.items[category].find(item => 
            item.id === newItem.id || 
            (item.name === newItem.name && item.type === newItem.type)
        );

        if (existingItem) {
            // Увеличиваем количество
            existingItem.quantity += newItem.quantity || 1;
        } else {
            // Добавляем новый предмет
            this.data.items[category].push({
                 ...newItem,
                quantity: newItem.quantity || 1
            });
        }

        this.saveToStorage();
        
        // Показываем уведомление о получении предмета
        utils.showNotification(
            "🎁 Новый предмет",
            `Получен: ${newItem.name}`,
            'normal'
        );

        // Обновляем отображение если инвентарь открыт
        if (this.isOpen) {
            this.renderInventory();
        }
    },

    // Удалить предмет из инвентаря
    removeItem: function(itemId, quantity = 1) {
        for (const category of Object.keys(this.data.items)) {
            const itemIndex = this.data.items[category].findIndex(item => item.id === itemId);
            if (itemIndex !== -1) {
                const item = this.data.items[category][itemIndex];
                
                if (item.quantity > quantity) {
                    item.quantity -= quantity;
                } else {
                    this.data.items[category].splice(itemIndex, 1);
                }
                
                this.saveToStorage();
                
                // Обновляем отображение если инвентарь открыт
                if (this.isOpen) {
                    this.renderInventory();
                }
                
                return true;
            }
        }
        return false;
    },

    // Получить количество определенного предмета
    getItemQuantity: function(itemId) {
        const item = this.findItemById(itemId);
        return item ? item.quantity : 0;
    },

    // Получить все предметы определенного типа
    getItemsByType: function(type) {
        const result = [];
        for (const category of Object.values(this.data.items)) {
            const itemsOfType = category.filter(item => item.type === type);
            result.push(...itemsOfType);
        }
        return result;
    },

    // Экипировать предмет (для снаряжения)
    equipItem: function(itemId) {
        const item = this.findItemById(itemId);
        if (!item || !this.isEquipment(item)) {
            utils.showNotification("❌ Ошибка", "Этот предмет нельзя экипировать", 'important');
            return false;
        }

        // Здесь будет логика экипировки предмета
        utils.showNotification(
            "⚔️ Предмет экипирован",
            `Экипирован: ${item.name}`,
            'normal'
        );

        return true;
    },

    // Проверить является ли предмет снаряжением
    isEquipment: function(item) {
        const equipmentTypes = ['weapon', 'shield', 'helmet', 'armor'];
        return equipmentTypes.includes(item.type);
    },

    // Получить общее количество предметов
    getTotalItemsCount: function() {
        let total = 0;
        for (const category of Object.values(this.data.items)) {
            for (const item of category) {
                total += item.quantity || 1;
            }
        }
        return total;
    },

    // Тестовые функции
    addTestItems: function() {
        const testItems = [
            {
                id: 999,
                name: "Тестовый артефакт",
                type: "artifact",
                icon: "💎",
                quantity: 1,
                rarity: "epic",
                description: "Тестовый артефакт для проверки системы",
                effects: [
                    { type: 'resource', resource: 'gold', amount: 1000 },
                    { type: 'experience', amount: 500 }
                ]
            },
            {
                id: 998,
                name: "Тестовые ресурсы",
                type: "resource",
                icon: "📦",
                quantity: 10,
                rarity: "common",
                description: "Тестовые ресурсы",
                effects: [{ type: 'resource', resource: 'food', amount: 500 }]
            }
        ];

        testItems.forEach(item => {
            this.addItem(item, item.type === 'artifact' ? 'artifacts' : 'resources');
        });
    },

    // Сохранение в localStorage
    saveToStorage: function() {
        utils.saveToStorage('inventoryData', this.data);
    },

    // Загрузка из localStorage
    loadFromStorage: function() {
        const saved = utils.loadFromStorage('inventoryData');
        if (saved) {
            this.data = {  ...this.data,  ...saved };
        }
    }
};

// Глобальные функции для совместимости
function openInventory() {
    inventorySystem.openInventory();
}

function closeInventory() {
    inventorySystem.closeInventory();
}

function selectInventoryCategory(category) {
    inventorySystem.selectInventoryCategory(category);
}

function useItem(itemName) {
    // Для совместимости со старым кодом
    utils.showNotification("🎯 Использование предмета", `Использован: ${itemName}`, 'normal');
}

// Экспортируем глобально
window.inventorySystem = inventorySystem;
