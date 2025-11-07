// js/modules/bank.js
const bankSystem = {
    // Данные банка
    data: {
        currentCategory: 'gold',
        goldPackages: [
            { amount: 1000, price: 99, currency: 'RUB', bonus: 0 },
            { amount: 5000, price: 399, currency: 'RUB', bonus: 100 },
            { amount: 10000, price: 699, currency: 'RUB', bonus: 300 },
            { amount: 25000, price: 1499, currency: 'RUB', bonus: 1000 }
        ],
        resourcePackages: [
            { type: 'food', amount: 5000, cost: 50, currency: 'gold' },
            { type: 'wood', amount: 3000, cost: 50, currency: 'gold' },
            { type: 'stone', amount: 2000, cost: 75, currency: 'gold' },
            { type: 'iron', amount: 1000, cost: 100, currency: 'gold' }
        ],
        premiumPackages: [
            { type: 'weekly', duration: '7 дней', price: 299, currency: 'gold', benefits: ['+20% к доходу', 'Ускорение строительства', 'Особый значок'] },
            { type: 'monthly', duration: '30 дней', price: 999, currency: 'gold', benefits: ['+50% к доходу', 'Ускорение исследований', 'Эксклюзивные предметы', 'Приоритетная поддержка'] },
            { type: 'yearly', duration: '365 дней', price: 8999, currency: 'gold', benefits: ['+100% к доходу', 'Все бонусы премиума', 'Личный менеджер', 'Уникальные артефакты'] }
        ],
        transactions: [],
        dailyBonuses: [
            { day: 1, reward: { gold: 100, diamonds: 5 }, claimed: false },
            { day: 2, reward: { gold: 150, food: 500 }, claimed: false },
            { day: 3, reward: { gold: 200, wood: 300 }, claimed: false },
            { day: 4, reward: { gold: 250, diamonds: 10 }, claimed: false },
            { day: 5, reward: { gold: 300, stone: 200 }, claimed: false },
            { day: 6, reward: { gold: 400, iron: 100 }, claimed: false },
            { day: 7, reward: { gold: 500, diamonds: 20, food: 1000 }, claimed: false }
        ]
    },

    isOpen: false,

    // Инициализация системы банка
    init: function() {
        this.loadFromStorage();
        this.updateDailyBonuses();
        console.log('Bank system initialized');
    },

    // Открыть банк
    openBank: function() {
        document.getElementById('bankModal').style.display = 'flex';
        this.isOpen = true;
        this.data.currentCategory = 'gold';
        this.renderBankContent();
        utils.setActiveNav('bank');
    },

    // Закрыть банк
    closeBank: function() {
        document.getElementById('bankModal').style.display = 'none';
        this.isOpen = false;
    },

    // Выбрать категорию банка
    selectTreasuryCategory: function(category) {
        utils.selectCategory('treasury', category, 'Treasury');
        this.data.currentCategory = category;
        this.renderBankContent();
    },

    // Отрисовать содержимое банка
    renderBankContent: function() {
        const sections = {
            'gold': document.getElementById('goldTreasury'),
            'resources': document.getElementById('resourcesTreasury'),
            'premium': document.getElementById('premiumTreasury')
        };

        // Очищаем все секции
        Object.values(sections).forEach(section => {
            if (section) section.innerHTML = '';
        });

        // Получаем текущую секцию
        const currentSection = sections[this.data.currentCategory];
        if (!currentSection) return;

        // Рендерим содержимое в зависимости от категории
        switch (this.data.currentCategory) {
            case 'gold':
                this.renderGoldSection(currentSection);
                break;
            case 'resources':
                this.renderResourcesSection(currentSection);
                break;
            case 'premium':
                this.renderPremiumSection(currentSection);
                break;
        }
    },

    // Отрисовать секцию золота
    renderGoldSection: function(container) {
        const title = document.createElement('h3');
        title.textContent = '💰 Покупка золота';
        container.appendChild(title);

        const packagesContainer = document.createElement('div');
        packagesContainer.className = 'gold-packages';

        this.data.goldPackages.forEach(package => {
            const packageElement = this.createGoldPackageElement(package);
            packagesContainer.appendChild(packageElement);
        });

        container.appendChild(packagesContainer);

        // Добавляем секцию ежедневных бонусов
        this.renderDailyBonuses(container);
    },

    // Создать элемент пакета золота
    createGoldPackageElement: function(package) {
        const packageDiv = document.createElement('div');
        packageDiv.className = 'gold-package';
        packageDiv.onclick = () => this.buyGold(package.amount, package.price);

        let bonusText = '';
        if (package.bonus > 0) {
            bonusText = `<div style="font-size: 10px; color: #ffd700; margin-top: 3px;">+${package.bonus} бонус!</div>`;
        }

        packageDiv.innerHTML = `
            <div class="package-amount">${utils.formatNumber(package.amount)} золота</div>
            <div class="package-price">${package.price} ${package.currency}</div>
            ${bonusText}
        `;

        return packageDiv;
    },

    // Отрисовать секцию ресурсов
    renderResourcesSection: function(container) {
        const title = document.createElement('h3');
        title.textContent = '📦 Покупка ресурсов';
        container.appendChild(title);

        const packagesContainer = document.createElement('div');
        packagesContainer.className = 'gold-packages';

        this.data.resourcePackages.forEach(package => {
            const packageElement = this.createResourcePackageElement(package);
            packagesContainer.appendChild(packageElement);
        });

        container.appendChild(packagesContainer);
    },

    // Создать элемент пакета ресурсов
    createResourcePackageElement: function(package) {
        const packageDiv = document.createElement('div');
        packageDiv.className = 'gold-package';
        packageDiv.onclick = () => this.buyResources(package.type, package.amount, package.cost);

        const resourceIcons = {
            'food': '🌾',
            'wood': '🌳',
            'stone': '🪨',
            'iron': '🔩'
        };

        const resourceNames = {
            'food': 'еды',
            'wood': 'дерева',
            'stone': 'камня',
            'iron': 'железа'
        };

        packageDiv.innerHTML = `
            <div class="package-amount">${utils.formatNumber(package.amount)} ${resourceNames[package.type]}</div>
            <div class="package-price">${package.cost} ${package.currency}</div>
            <div style="font-size: 20px; margin-top: 5px;">${resourceIcons[package.type]}</div>
        `;

        return packageDiv;
    },

    // Отрисовать секцию премиума
    renderPremiumSection: function(container) {
        const title = document.createElement('h3');
        title.textContent = '⭐ Премиум статусы';
        container.appendChild(title);

        const packagesContainer = document.createElement('div');
        packagesContainer.className = 'gold-packages';

        this.data.premiumPackages.forEach(package => {
            const packageElement = this.createPremiumPackageElement(package);
            packagesContainer.appendChild(packageElement);
        });

        container.appendChild(packagesContainer);
    },

    // Создать элемент премиум пакета
    createPremiumPackageElement: function(package) {
        const packageDiv = document.createElement('div');
        packageDiv.className = 'gold-package';
        packageDiv.onclick = () => this.buyPremium(package.type);

        packageDiv.innerHTML = `
            <div class="package-amount">${package.duration} премиума</div>
            <div class="package-price">${package.price} ${package.currency}</div>
            <div style="font-size: 10px; color: #8b6b2c; margin-top: 5px;">
                ${package.benefits.slice(0, 2).join(' • ')}
            </div>
        `;

        return packageDiv;
    },

    // Отрисовать ежедневные бонусы
    renderDailyBonuses: function(container) {
        const bonusesSection = document.createElement('div');
        bonusesSection.style.marginTop = '20px';
        bonusesSection.style.padding = '15px';
        bonusesSection.style.background = 'linear-gradient(135deg, #2d1f0a 0%, #1a1408 100%)';
        bonusesSection.style.borderRadius = '8px';
        bonusesSection.style.border = '1px solid #8b6b2c';

        const bonusesTitle = document.createElement('h4');
        bonusesTitle.textContent = '🎁 Ежедневные бонусы';
        bonusesTitle.style.color = '#f0c87a';
        bonusesTitle.style.marginBottom = '10px';
        bonusesSection.appendChild(bonusesTitle);

        const bonusesList = document.createElement('div');
        bonusesList.className = 'gifts-list';

        this.data.dailyBonuses.forEach(bonus => {
            const bonusElement = this.createDailyBonusElement(bonus);
            bonusesList.appendChild(bonusElement);
        });

        bonusesSection.appendChild(bonusesList);
        container.appendChild(bonusesSection);
    },

    // Создать элемент ежедневного бонуса
    createDailyBonusElement: function(bonus) {
        const bonusDiv = document.createElement('div');
        bonusDiv.className = 'gift-item';

        const rewardText = Object.entries(bonus.reward)
            .map(([resource, amount]) => `${utils.formatNumber(amount)} ${this.getResourceName(resource)}`)
            .join(', ');

        bonusDiv.innerHTML = `
            <div class="gift-icon">🎁</div>
            <div class="gift-info">
                <div class="gift-name">День ${bonus.day}</div>
                <div class="gift-desc">${rewardText}</div>
            </div>
            <button class="gift-claim" onclick="bankSystem.claimDailyBonus(${bonus.day})" 
                    ${bonus.claimed ? 'disabled style="opacity: 0.5;"' : ''}>
                ${bonus.claimed ? '✅ Получено' : 'Забрать'}
            </button>
        `;

        return bonusDiv;
    },

    // Получить название ресурса
    getResourceName: function(resourceType) {
        const names = {
            'gold': 'золота',
            'diamonds': 'алмазов',
            'food': 'еды',
            'wood': 'дерева',
            'stone': 'камня',
            'iron': 'железа'
        };
        return names[resourceType] || resourceType;
    },

    // Покупка золота
    buyGold: function(amount, price) {
        // В реальном приложении здесь была бы интеграция с платежной системой
        const transaction = {
            id: Date.now(),
            type: 'gold_purchase',
            amount: amount,
            price: price,
            currency: 'RUB',
            timestamp: new Date().toISOString(),
            status: 'completed'
        };

        this.data.transactions.push(transaction);
        
        // Добавляем золото игроку
        if (window.playerSystem) {
            playerSystem.addResource('gold', amount);
        }

        utils.showNotification(
            "💰 Покупка совершена",
            `Вы купили ${utils.formatNumber(amount)} золота!`,
            'normal'
        );

        this.saveToStorage();
    },

    // Покупка ресурсов
    buyResources: function(type, amount, cost) {
        if (!window.playerSystem) {
            utils.showNotification("❌ Ошибка", "Система игрока не доступна", 'important');
            return;
        }

        // Проверяем достаточно ли золота
        if (!playerSystem.removeResource('gold', cost)) {
            utils.showNotification("❌ Недостаточно золота", `Нужно: ${cost} золота`, 'important');
            return;
        }

        // Добавляем ресурсы
        playerSystem.addResource(type, amount);

        const transaction = {
            id: Date.now(),
            type: 'resource_purchase',
            resource: type,
            amount: amount,
            cost: cost,
            currency: 'gold',
            timestamp: new Date().toISOString(),
            status: 'completed'
        };

        this.data.transactions.push(transaction);

        utils.showNotification(
            "📦 Ресурсы куплены",
            `Куплено ${utils.formatNumber(amount)} ${this.getResourceName(type)}!`,
            'normal'
        );

        this.saveToStorage();
    },

    // Покупка премиума
    buyPremium: function(type) {
        if (!window.playerSystem) {
            utils.showNotification("❌ Ошибка", "Система игрока не доступна", 'important');
            return;
        }

        const package = this.data.premiumPackages.find(p => p.type === type);
        if (!package) {
            utils.showNotification("❌ Ошибка", "Пакет не найден", 'important');
            return;
        }

        // Проверяем достаточно ли золота
        if (!playerSystem.removeResource('gold', package.price)) {
            utils.showNotification("❌ Недостаточно золота", `Нужно: ${package.price} золота`, 'important');
            return;
        }

        const transaction = {
            id: Date.now(),
            type: 'premium_purchase',
            package: type,
            duration: package.duration,
            price: package.price,
            currency: 'gold',
            timestamp: new Date().toISOString(),
            status: 'completed'
        };

        this.data.transactions.push(transaction);

        utils.showNotification(
            "⭐ Премиум активирован",
            `Активирован премиум на ${package.duration.toLowerCase()}!`,
            'important'
        );

        this.saveToStorage();
    },

    // Забрать ежедневный бонус
    claimDailyBonus: function(day) {
        const bonus = this.data.dailyBonuses.find(b => b.day === day);
        if (!bonus) {
            utils.showNotification("❌ Ошибка", "Бонус не найден", 'important');
            return;
        }

        if (bonus.claimed) {
            utils.showNotification("ℹ️ Информация", "Бонус уже получен", 'normal');
            return;
        }

        // Выдаем награды
        if (window.playerSystem) {
            Object.entries(bonus.reward).forEach(([resource, amount]) => {
                playerSystem.addResource(resource, amount);
            });
        }

        // Помечаем как полученный
        bonus.claimed = true;

        utils.showNotification(
            "🎁 Бонус получен",
            `Вы получили ежедневный бонус за ${day} день!`,
            'normal'
        );

        // Обновляем отображение
        if (this.isOpen && this.data.currentCategory === 'gold') {
            this.renderBankContent();
        }

        this.saveToStorage();
    },

    // Обновить ежедневные бонусы
    updateDailyBonuses: function() {
        const lastClaimDate = utils.loadFromStorage('lastBonusClaimDate');
        const today = new Date().toDateString();

        if (lastClaimDate !== today) {
            // Сбрасываем бонусы если прошел день
            this.data.dailyBonuses.forEach(bonus => {
                bonus.claimed = false;
            });
            utils.saveToStorage('lastBonusClaimDate', today);
            this.saveToStorage();
        }
    },

    // Получить историю транзакций
    getTransactionHistory: function(limit = 10) {
        return this.data.transactions
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
    },

    // Получить общую сумму потраченную в банке
    getTotalSpent: function() {
        return this.data.transactions.reduce((total, transaction) => {
            if (transaction.currency === 'RUB') {
                return total + transaction.price;
            }
            return total;
        }, 0);
    },

    // Тестовые функции
    addTestGold: function(amount = 1000) {
        if (window.playerSystem) {
            playerSystem.addResource('gold', amount);
            utils.showNotification(
                "💰 Тестовое золото",
                `Добавлено ${utils.formatNumber(amount)} золота`,
                'normal'
            );
        }
    },

    // Сброс данных банка
    reset: function() {
        if (confirm('Вы уверены, что хотите сбросить все данные банка?')) {
            this.data.transactions = [];
            this.data.dailyBonuses.forEach(bonus => {
                bonus.claimed = false;
            });
            this.saveToStorage();
            
            if (this.isOpen) {
                this.renderBankContent();
            }
            
            utils.showNotification(
                "🔄 Данные сброшены",
                "Все данные банка были сброшены",
                'normal'
            );
        }
    },

    // Сохранение в localStorage
    saveToStorage: function() {
        utils.saveToStorage('bankData', this.data);
    },

    // Загрузка из localStorage
    loadFromStorage: function() {
        const saved = utils.loadFromStorage('bankData');
        if (saved) {
            this.data = {  ...this.data,  ...saved };
        }
    }
};

// Глобальные функции для совместимости
function openBank() {
    bankSystem.openBank();
}

function closeBank() {
    bankSystem.closeBank();
}

function selectTreasuryCategory(category) {
    bankSystem.selectTreasuryCategory(category);
}

function buyGold(amount, price) {
    bankSystem.buyGold(amount, price);
}

function buyResources(type, amount, cost) {
    bankSystem.buyResources(type, amount, cost);
}

function buyPremium(type) {
    bankSystem.buyPremium(type);
}

// Экспортируем глобально
window.bankSystem = bankSystem;
