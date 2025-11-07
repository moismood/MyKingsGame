// js/modules/alliance.js
const allianceSystem = {
    // Данные альянса
    data: {
        currentAlliance: {
            id: 1,
            name: "⚔️ Гильдия Воинов Света",
            tag: "GVS",
            level: 5,
            experience: 12500,
            members: 24,
            maxMembers: 30,
            totalPower: 15842,
            description: "Сильнейшая гильдия, объединяющая лучших воинов королевства. Мы защищаем слабых и сражаемся за справедливость!",
            leader: "Король_Артур",
            officers: ["Сэр_Ланселот", "Леди_Гвиневра"],
            joinType: "approval", // approval, open, closed
            requirements: {
                minLevel: 3,
                minPower: 500
            },
            treasury: {
                gold: 15000,
                food: 25000,
                wood: 12000,
                stone: 8000,
                iron: 3000
            },
            technologies: {
                attack: 3,
                defense: 2,
                economy: 4,
                research: 1
            },
            announcements: [
                {
                    id: 1,
                    title: "⚔️ Подготовка к войне",
                    content: "Готовимся к крупному сражению с ордой варваров. Все члены альянса должны подготовить армии.",
                    author: "Король_Артур",
                    timestamp: Date.now() - 3600000,
                    important: true
                },
                {
                    id: 2,
                    title: "🏗️ Строительство укреплений",
                    content: "Начинаем строительство новых укреплений на границах. Нужны ресурсы и рабочие.",
                    author: "Сэр_Ланселот",
                    timestamp: Date.now() - 86400000,
                    important: false
                }
            ]
        },
        members: [
            {
                id: 1,
                name: "Король_Артур",
                rank: "leader",
                level: 5,
                power: 1842,
                joinDate: "2024-01-15",
                lastActive: "2024-01-20",
                contribution: 2500,
                status: "online"
            },
            {
                id: 2,
                name: "Сэр_Ланселот",
                rank: "officer",
                level: 4,
                power: 1520,
                joinDate: "2024-01-16",
                lastActive: "2024-01-20",
                contribution: 1800,
                status: "online"
            },
            {
                id: 3,
                name: "Леди_Гвиневра",
                rank: "officer",
                level: 4,
                power: 1480,
                joinDate: "2024-01-16",
                lastActive: "2024-01-19",
                contribution: 1700,
                status: "offline"
            },
            {
                id: 4,
                name: "Рыцарь_Галахад",
                rank: "veteran",
                level: 3,
                power: 980,
                joinDate: "2024-01-17",
                lastActive: "2024-01-20",
                contribution: 1200,
                status: "online"
            }
            // ... остальные участники
        ],
        applications: [
            {
                id: 101,
                playerName: "Новичок_Силы",
                level: 3,
                power: 520,
                applyDate: "2024-01-20",
                message: "Хочу присоединиться к сильнейшей гильдии!"
            }
        ],
        wars: [
            {
                id: 1,
                opponent: "Орда Варваров",
                status: "preparing",
                startTime: Date.now() + 86400000,
                ourPower: 15842,
                enemyPower: 14200,
                objectives: ["Захват крепости", "Уничтожение армии"],
                rewards: { gold: 5000, experience: 2000 }
            }
        ]
    },

    isOpen: false,

    // Инициализация системы альянса
    init: function() {
        this.loadFromStorage();
        console.log('Alliance system initialized');
    },

    // Открыть альянс
    openAlliance: function() {
        document.getElementById('allianceModal').style.display = 'flex';
        this.isOpen = true;
        this.renderAllianceInfo();
        utils.setActiveNav('alliance');
    },

    // Закрыть альянс
    closeAlliance: function() {
        document.getElementById('allianceModal').style.display = 'none';
        this.isOpen = false;
    },

    // Отрисовать информацию об альянсе
    renderAllianceInfo: function() {
        const container = document.getElementById('allianceModal');
        if (!container) return;

        const alliance = this.data.currentAlliance;

        let html = `
            <div class="modal-content animated">
                <div class="modal-header">
                    <h2>🤝 АЛЬЯНС</h2>
                    <button class="close-btn" onclick="closeAlliance()">×</button>
                </div>
                <div style="padding: 20px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h3 style="color: #f0c87a; margin-bottom: 15px;">${alliance.name}</h3>
                        <div style="background: linear-gradient(135deg, #2d1f0a 0%, #1a1408 100%); padding: 15px; border-radius: 10px; border: 1px solid #8b6b2c; margin-bottom: 15px;">
                            <p style="color: #8b6b2c; font-size: 14px;">Уровень гильдии: <span style="color: #f0c87a;">${alliance.level}</span></p>
                            <p style="color: #8b6b2c; font-size: 14px;">Участников: <span style="color: #f0c87a;">${alliance.members}/${alliance.maxMembers}</span></p>
                            <p style="color: #8b6b2c; font-size: 14px;">Общая мощь: <span style="color: #f0c87a;">${utils.formatNumber(alliance.totalPower)}</span></p>
                        </div>
                    </div>

                    <div class="treasury-categories">
                        <div class="treasury-category active" onclick="allianceSystem.showSection('info')">
                            <div class="category-icon">ℹ️</div>
                            <div class="category-name">Инфо</div>
                        </div>
                        <div class="treasury-category" onclick="allianceSystem.showSection('members')">
                            <div class="category-icon">👥</div>
                            <div class="category-name">Участники</div>
                        </div>
                        <div class="treasury-category" onclick="allianceSystem.showSection('treasury')">
                            <div class="category-icon">💰</div>
                            <div class="category-name">Казна</div>
                        </div>
                        <div class="treasury-category" onclick="allianceSystem.showSection('wars')">
                            <div class="category-icon">⚔️</div>
                            <div class="category-name">Войны</div>
                        </div>
                    </div>

                    <div class="treasury-content">
                        <div id="allianceInfo" class="treasury-section active">
                            ${this.renderAllianceInfoSection()}
                        </div>
                        <div id="allianceMembers" class="treasury-section">
                            ${this.renderMembersSection()}
                        </div>
                        <div id="allianceTreasury" class="treasury-section">
                            ${this.renderTreasurySection()}
                        </div>
                        <div id="allianceWars" class="treasury-section">
                            ${this.renderWarsSection()}
                        </div>
                    </div>
                </div>
            </div>
        `;

        const content = container.querySelector('.modal-content') || container;
        content.innerHTML = html;
    },

    // Показать секцию альянса
    showSection: function(section) {
        // Убираем активный класс у всех категорий
        document.querySelectorAll('.treasury-category').forEach(cat => {
            cat.classList.remove('active');
        });
        
        // Добавляем активный класс выбранной категории
        event.target.closest('.treasury-category').classList.add('active');
        
        // Скрываем все секции
        document.querySelectorAll('.treasury-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Показываем выбранную секцию
        document.getElementById('alliance' + section.charAt(0).toUpperCase() + section.slice(1)).classList.add('active');
    },

    // Отрисовать секцию информации
    renderAllianceInfoSection: function() {
        const alliance = this.data.currentAlliance;

        return `
            <h3>ℹ️ Информация об альянсе</h3>
            <div style="margin-bottom: 15px;">
                <p style="color: #8b6b2c; line-height: 1.5;">${alliance.description}</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <div style="background: linear-gradient(135deg, #2d1f0a 0%, #1a1408 100%); padding: 10px; border-radius: 8px; border: 1px solid #8b6b2c;">
                    <div style="color: #8b6b2c; font-size: 12px;">Лидер</div>
                    <div style="color: #f0c87a; font-size: 14px;">${alliance.leader}</div>
                </div>
                <div style="background: linear-gradient(135deg, #2d1f0a 0%, #1a1408 100%); padding: 10px; border-radius: 8px; border: 1px solid #8b6b2c;">
                    <div style="color: #8b6b2c; font-size: 12px;">Тип вступления</div>
                    <div style="color: #f0c87a; font-size: 14px;">${this.getJoinTypeText(alliance.joinType)}</div>
                </div>
            </div>

            <h4 style="color: #f0c87a; margin: 15px 0 10px 0;">📢 Объявления</h4>
            <div class="messages-list">
                ${alliance.announcements.map(announcement => `
                    <div class="message-item ${announcement.important ? 'important' : ''}">
                        <div class="message-sender">${announcement.author}</div>
                        <div class="message-preview">${announcement.title}</div>
                        <div class="message-time">${utils.formatTime(announcement.timestamp)}</div>
                    </div>
                `).join('')}
            </div>

            ${this.data.applications.length > 0 ? `
                <h4 style="color: #f0c87a; margin: 15px 0 10px 0;">📝 Заявки на вступление</h4>
                <div style="background: linear-gradient(135deg, #2d1f0a 0%, #1a1408 100%); padding: 10px; border-radius: 8px; border: 1px solid #8b6b2c;">
                    <p style="color: #8b6b2c; text-align: center;">Есть ${this.data.applications.length} заявок на рассмотрении</p>
                </div>
            ` : ''}
        `;
    },

    // Отрисовать секцию участников
    renderMembersSection: function() {
        return `
            <h3>👥 Участники альянса</h3>
            <div style="margin-bottom: 10px;">
                <input type="text" placeholder="Поиск участников" style="width: 100%; padding: 8px; background: #2d1f0a; border: 1px solid #8b6b2c; border-radius: 6px; color: #f0c87a;">
            </div>
            <div class="messages-list">
                ${this.data.members.map(member => `
                    <div class="message-item">
                        <div class="message-sender">
                            <span style="color: ${this.getRankColor(member.rank)}">${this.getRankIcon(member.rank)}</span>
                            ${member.name}
                        </div>
                        <div class="message-preview">
                            Ур. ${member.level} • Сила: ${utils.formatNumber(member.power)}
                        </div>
                        <div class="message-time">
                            <span style="color: ${member.status === 'online' ? '#4ecdc4' : '#8b6b2c'}">
                                ${member.status === 'online' ? '🟢' : '⚫'}
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    // Отрисовать секцию казны
    renderTreasurySection: function() {
        const treasury = this.data.currentAlliance.treasury;

        return `
            <h3>💰 Казна альянса</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                ${Object.entries(treasury).map(([resource, amount]) => `
                    <div style="background: linear-gradient(135deg, #2d1f0a 0%, #1a1408 100%); padding: 10px; border-radius: 8px; border: 1px solid #8b6b2c; text-align: center;">
                        <div style="font-size: 20px; margin-bottom: 5px;">${this.getResourceIcon(resource)}</div>
                        <div style="color: #f0c87a; font-size: 14px; font-weight: bold;">${utils.formatNumber(amount)}</div>
                        <div style="color: #8b6b2c; font-size: 10px;">${this.getResourceName(resource)}</div>
                    </div>
                `).join('')}
            </div>

            <h4 style="color: #f0c87a; margin: 15px 0 10px 0;">📊 Технологии</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                ${Object.entries(this.data.currentAlliance.technologies).map(([tech, level]) => `
                    <div style="background: linear-gradient(135deg, #2d1f0a 0%, #1a1408 100%); padding: 10px; border-radius: 8px; border: 1px solid #8b6b2c;">
                        <div style="color: #f0c87a; font-size: 12px; margin-bottom: 5px;">${this.getTechName(tech)}</div>
                        <div style="display: flex; align-items: center; gap: 5px;">
                            ${Array.from({length: 5}, (_, i) => `
                                <div style="width: 8px; height: 8px; border-radius: 50%; background: ${i < level ? '#d4af37' : '#8b6b2c'};"></div>
                            `).join('')}
                            <span style="color: #8b6b2c; font-size: 10px;">Ур. ${level}</span>
                        </div>
                    </div>
                `).join('')}
            </div>

            <button class="treasury-btn" style="margin-top: 15px;" onclick="allianceSystem.donateResources()">
                💎 Пожертвовать ресурсы
            </button>
        `;
    },

    // Отрисовать секцию войн
    renderWarsSection: function() {
        return `
            <h3>⚔️ Войны и сражения</h3>
            ${this.data.wars.map(war => `
                <div style="background: linear-gradient(135deg, #2d1f0a 0%, #1a1408 100%); padding: 15px; border-radius: 8px; border: 2px solid #c41f3b; margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div style="color: #f0c87a; font-weight: bold;">${war.opponent}</div>
                        <div style="color: ${this.getWarStatusColor(war.status)}; font-size: 12px;">
                            ${this.getWarStatusText(war.status)}
                        </div>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <div style="text-align: center;">
                            <div style="color: #8b6b2c; font-size: 10px;">Наша сила</div>
                            <div style="color: #f0c87a; font-size: 14px; font-weight: bold;">${utils.formatNumber(war.ourPower)}</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="color: #8b6b2c; font-size: 10px;">Их сила</div>
                            <div style="color: #ff4757; font-size: 14px; font-weight: bold;">${utils.formatNumber(war.enemyPower)}</div>
                        </div>
                    </div>

                    <div style="color: #8b6b2c; font-size: 12px; margin-bottom: 10px;">
                        <strong>Цели:</strong> ${war.objectives.join(', ')}
                    </div>

                    <button class="treasury-btn" onclick="allianceSystem.joinWar(${war.id})">
                        ⚔️ Присоединиться к битве
                    </button>
                </div>
            `).join('')}

            ${this.data.wars.length === 0 ? `
                <div style="text-align: center; color: #8b6b2c; padding: 20px;">
                    Сейчас нет активных войн
                </div>
            ` : ''}
        `;
    },

    // Вспомогательные методы
    getJoinTypeText: function(joinType) {
        const types = {
            'approval': 'По одобрению',
            'open': 'Открытый',
            'closed': 'Закрытый'
        };
        return types[joinType] || joinType;
    },

    getRankIcon: function(rank) {
        const icons = {
            'leader': '👑',
            'officer': '⭐',
            'veteran': '🛡️',
            'member': '⚔️'
        };
        return icons[rank] || '👤';
    },

    getRankColor: function(rank) {
        const colors = {
            'leader': '#ffd700',
            'officer': '#4ecdc4',
            'veteran': '#d4af37',
            'member': '#f0c87a'
        };
        return colors[rank] || '#f0c87a';
    },

    getResourceIcon: function(resource) {
        const icons = {
            'gold': '💰',
            'food': '🌾',
            'wood': '🌳',
            'stone': '🪨',
            'iron': '🔩'
        };
        return icons[resource] || '📦';
    },

    getResourceName: function(resource) {
        const names = {
            'gold': 'Золото',
            'food': 'Еда',
            'wood': 'Дерево',
            'stone': 'Камень',
            'iron': 'Железо'
        };
        return names[resource] || resource;
    },

    getTechName: function(tech) {
        const names = {
            'attack': '⚔️ Атака',
            'defense': '🛡️ Защита',
            'economy': '💰 Экономика',
            'research': '🔬 Исследования'
        };
        return names[tech] || tech;
    },

    getWarStatusColor: function(status) {
        const colors = {
            'preparing': '#d4af37',
            'active': '#ff4757',
            'won': '#4ecdc4',
            'lost': '#8b6b2c'
        };
        return colors[status] || '#8b6b2c';
    },

    getWarStatusText: function(status) {
        const texts = {
            'preparing': 'Подготовка',
            'active': 'Активная',
            'won': 'Победа',
            'lost': 'Поражение'
        };
        return texts[status] || status;
    },

    // Методы взаимодействия
    donateResources: function() {
        utils.showNotification(
            "💎 Пожертвование",
            "Функция пожертвования ресурсов в разработке",
            'normal'
        );
    },

    joinWar: function(warId) {
        const war = this.data.wars.find(w => w.id === warId);
        if (war) {
            utils.showNotification(
                "⚔️ Присоединение к битве",
                `Вы присоединились к войне против ${war.opponent}`,
                'important'
            );
        }
    },

    // Создать объявление
    createAnnouncement: function(title, content, important = false) {
        const announcement = {
            id: Date.now(),
            title,
            content,
            author: "Король_Артур", // В реальном приложении - имя текущего игрока
            timestamp: Date.now(),
            important
        };

        this.data.currentAlliance.announcements.unshift(announcement);
        this.saveToStorage();

        if (this.isOpen) {
            this.renderAllianceInfo();
        }

        utils.showNotification(
            "📢 Объявление создано",
            "Новое объявление опубликовано в альянсе",
            'normal'
        );
    },

    // Получить статистику альянса
    getAllianceStats: function() {
        return {
            totalMembers: this.data.members.length,
            onlineMembers: this.data.members.filter(m => m.status === 'online').length,
            averageLevel: Math.round(this.data.members.reduce((sum, m) => sum + m.level, 0) / this.data.members.length),
            totalPower: this.data.currentAlliance.totalPower
        };
    },

    // Сохранение в localStorage
    saveToStorage: function() {
        utils.saveToStorage('allianceData', this.data);
    },

    // Загрузка из localStorage
    loadFromStorage: function() {
        const saved = utils.loadFromStorage('allianceData');
        if (saved) {
            this.data = {  ...this.data,  ...saved };
        }
    }
};

// Глобальные функции для совместимости
function openAlliance() {
    allianceSystem.openAlliance();
}

function closeAlliance() {
    allianceSystem.closeAlliance();
}

// Экспортируем глобально
window.allianceSystem = allianceSystem;
