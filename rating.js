// js/modules/rating.js
const ratingSystem = {
    currentScreen: 'main',
    currentPage: 1,
    totalPages: 3,

    init: function() {
        console.log('🏆 Rating system initialized');
        return true;
    },

    openRating: function() {
        const modal = document.getElementById('ratingModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            this.currentScreen = 'main';
            this.showMainScreen();
            
            // Анимация появления
            const content = modal.querySelector('.modal-content');
            if (content) {
                content.style.transform = 'scale(0.9)';
                content.style.opacity = '0';
                setTimeout(() => {
                    content.style.transition = 'all 0.3s ease';
                    content.style.transform = 'scale(1)';
                    content.style.opacity = '1';
                }, 10);
            }
        }
        utils.setActiveNav('rating');
    },

    closeRating: function() {
        const modal = document.getElementById('ratingModal');
        if (modal) {
            // Анимация исчезновения
            const content = modal.querySelector('.modal-content');
            if (content) {
                content.style.transition = 'all 0.2s ease';
                content.style.transform = 'scale(0.9)';
                content.style.opacity = '0';
            }
            
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
                this.currentScreen = 'main';
            }, 200);
        }
    },

    showRatingScreen: function(screenId) {
        // Скрыть все экраны
        document.querySelectorAll('.rating-screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Скрыть главный экран
        document.getElementById('mainScreen').style.display = 'none';
        
        // Показать кнопку назад
        document.getElementById('globalBackButton').style.display = 'block';
        
        // Обновить заголовок
        document.getElementById('headerTitle').textContent = this.getScreenTitle(screenId);
        
        // Показать выбранный экран
        const targetScreen = document.getElementById(screenId + 'Screen');
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
            this.renderRatingScreen(screenId);
        }
    },

    showMainScreen: function() {
        // Скрыть все экраны рейтинга
        document.querySelectorAll('.rating-screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Скрыть кнопку назад
        document.getElementById('globalBackButton').style.display = 'none';
        
        // Показать главный экран
        document.getElementById('mainScreen').style.display = 'grid';
        document.getElementById('headerTitle').textContent = 'РЕЙТИНГ';
        this.currentScreen = 'main';
    },

    getScreenTitle: function(screenId) {
        const titles = {
            'hallOfFame': 'ЗАЛ СЛАВЫ',
            'player': 'ИГРОКИ',
            'castle': 'ЗАМКИ',
            'alliance': 'АЛЬЯНСЫ',
            'celebrity': 'ЗНАМЕНИТОСТИ',
            'authority': 'АВТОРИТЕТ',
            'archeology': 'АРХЕОЛОГИЯ'
        };
        return titles[screenId] || 'РЕЙТИНГ';
    },

    renderRatingScreen: function(screenId) {
        const screen = document.getElementById(screenId + 'Screen');
        if (!screen) return;

        let html = '';
        
        switch(screenId) {
            case 'hallOfFame':
                html = this.renderHallOfFame();
                break;
            case 'player':
                html = this.renderPlayerRating();
                break;
            case 'castle':
                html = this.renderCastleRating();
                break;
            case 'alliance':
                html = this.renderAllianceRating();
                break;
            case 'celebrity':
                html = this.renderCelebrityRating();
                break;
            case 'authority':
                html = this.renderAuthorityRating();
                break;
            case 'archeology':
                html = this.renderArcheologyRating();
                break;
            default:
                html = '<div style="text-align: center; color: #8b6b2c; padding: 50px;">Рейтинг в разработке</div>';
        }

        screen.innerHTML = html;
    },

    // 🏆 ЗАЛ СЛАВЫ
    renderHallOfFame: function() {
        const categories = this.getHallOfFameCategories(this.currentPage);

        return `
            <div style="padding: 10px;">
                <h3 class="rating-title">🏆 ЗАЛ СЛАВЫ</h3>
                <div style="margin-bottom: 20px;">
                    ${categories.map((category, index) => `
                        <div class="rating-category" onclick="ratingSystem.showCategoryDetail(${index})">
                            <div class="category-left">
                                <div class="category-name">${category.name}</div>
                                <div class="category-subtitle">${category.subtitle}</div>
                            </div>
                            <div class="category-score">${category.score}</div>
                        </div>
                    `).join('')}
                </div>
                ${this.renderPagination()}
            </div>
        `;
    },

    getHallOfFameCategories: function(page) {
        const allCategories = [
            // Страница 1
            {
                name: "⚔️ Величайший Воитель",
                subtitle: "За наибольшее количество побед в битвах",
                score: "1,247 побед"
            },
            {
                name: "🏰 Неприступная Крепость",
                subtitle: "За самую мощную оборону замка",
                score: "8,542 защиты"
            },
            {
                name: "💰 Король Богатств",
                subtitle: "За крупнейшую казну в истории",
                score: "2.5M золота"
            },
            {
                name: "🤝 Легенда Альянсов",
                subtitle: "За величайший вклад в гильдии",
                score: "50,000 вклад"
            },
            {
                name: "🔮 Магистр Артефактов",
                subtitle: "За коллекцию редчайших артефактов",
                score: "47 артефактов"
            },
            // Страница 2
            {
                name: "🌾 Владыка Урожая",
                subtitle: "За крупнейшие запасы продовольствия",
                score: "150K еды"
            },
            {
                name: "⚡ Мастер Скорости",
                subtitle: "За самое быстрое развитие",
                score: "72 часа"
            },
            {
                name: "🎯 Снайпер",
                subtitle: "За точнейшие атаки",
                score: "98% точность"
            },
            {
                name: "🛡️ Непробиваемый",
                subtitle: "За нулевые потери в защите",
                score: "0 потерь"
            },
            {
                name: "🌟 Первооткрыватель",
                subtitle: "За исследование всех земель",
                score: "100% карта"
            },
            // Страница 3
            {
                name: "🎪 Мастер Событий",
                subtitle: "За участие во всех событиях",
                score: "256 событий"
            },
            {
                name: "🤝 Дипломат",
                subtitle: "За создание союзов",
                score: "24 альянса"
            },
            {
                name: "💎 Коллекционер",
                subtitle: "За редчайшие предметы",
                score: "89 предметов"
            },
            {
                name: "🏆 Чемпион Турниров",
                subtitle: "За победы в турнирах",
                score: "15 турниров"
            },
            {
                name: "👑 Император Сервера",
                subtitle: "За абсолютное лидерство",
                score: "1 место"
            }
        ];

        const itemsPerPage = 5;
        const startIndex = (page - 1) * itemsPerPage;
        return allCategories.slice(startIndex, startIndex + itemsPerPage);
    },

    // 👤 РЕЙТИНГ ИГРОКОВ
    renderPlayerRating: function() {
        const players = [
            { rank: 1, name: "Король Артур", score: "3.0K", avatar: "👑" },
            { rank: 2, name: "Воин Света", score: "2.8K", avatar: "⚔️" },
            { rank: 3, name: "Драконоборец", score: "2.7K", avatar: "🐉" },
            { rank: 4, name: "Лучник", score: "2.6K", avatar: "🏹" },
            { rank: 5, name: "Маг", score: "2.5K", avatar: "🔮" },
            { rank: 6, name: "Рыцарь Тьмы", score: "2.4K", avatar: "♠️" },
            { rank: 7, name: "Воительница", score: "2.3K", avatar: "♀️" },
            { rank: 8, name: "Хранитель", score: "2.2K", avatar: "🛡️" },
            { rank: 9, name: "Странник", score: "2.1K", avatar: "🚶" },
            { rank: 10, name: "Новичок Удачи", score: "2.0K", avatar: "🍀" }
        ];

        return `
            <div style="padding: 10px;">
                <h3 class="rating-title">👤 РЕЙТИНГ ИГРОКОВ</h3>
                <div class="messages-list">
                    ${players.map(player => `
                        <div class="player-rank-item">
                            <div class="rank-number">${player.rank}</div>
                            <div class="rank-medal">${this.getRankMedal(player.rank)}</div>
                            <div class="player-info">
                                <div class="player-name">${player.avatar} ${player.name}</div>
                                <div class="player-score">${player.score}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // 🏰 РЕЙТИНГ ЗАМКОВ
    renderCastleRating: function() {
        const castles = [
            { rank: 1, name: "Замок Дракона", level: 25, power: "15.8K", owner: "Король Артур" },
            { rank: 2, name: "Крепость Света", level: 24, power: "14.2K", owner: "Воин Света" },
            { rank: 3, name: "Цитадель Тьмы", level: 23, power: "13.5K", owner: "Рыцарь Тьмы" },
            { rank: 4, name: "Башня Магов", level: 22, power: "12.8K", owner: "Маг" },
            { rank: 5, name: "Форт Странников", level: 21, power: "12.1K", owner: "Странник" },
            { rank: 6, name: "Цитадель Чести", level: 20, power: "11.4K", owner: "Хранитель" },
            { rank: 7, name: "Крепость Валькирий", level: 19, power: "10.7K", owner: "Воительница" },
            { rank: 8, name: "Замок Удачи", level: 18, power: "10.0K", owner: "Новичок Удачи" },
            { rank: 9, name: "Бастион Дракона", level: 17, power: "9.3K", owner: "Драконоборец" },
            { rank: 10, name: "Форт Лучников", level: 16, power: "8.6K", owner: "Лучник" }
        ];

        return `
            <div style="padding: 10px;">
                <h3 class="rating-title">🏰 РЕЙТИНГ ЗАМКОВ</h3>
                <div class="messages-list">
                    ${castles.map(castle => `
                        <div class="player-rank-item">
                            <div class="rank-number">${castle.rank}</div>
                            <div style="font-size: 24px;">🏰</div>
                            <div style="flex: 1;">
                                <div style="color: #f0c87a; font-weight: bold;">${castle.name}</div>
                                <div style="color: #8b6b2c; font-size: 12px;">
                                    Ур. ${castle.level} • ${castle.power} • ${castle.owner}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // 🤝 РЕЙТИНГ АЛЬЯНСОВ
    renderAllianceRating: function() {
        const alliances = [
            { rank: 1, name: "⚔️ Гильдия Воинов", power: "45.2K", members: "48/50", leader: "Король Артур" },
            { rank: 2, name: "🔮 Орден Магов", power: "42.8K", members: "45/50", leader: "Маг" },
            { rank: 3, name: "🏹 Союз Лучников", power: "39.5K", members: "42/50", leader: "Лучник" },
            { rank: 4, name: "🛡️ Братство Защиты", power: "36.1K", members: "40/50", leader: "Хранитель" },
            { rank: 5, name: "⚫ Клан Тени", power: "33.7K", members: "38/50", leader: "Рыцарь Тьмы" },
            { rank: 6, name: "🌟 Орден Звезд", power: "31.4K", members: "36/50", leader: "Воительница" },
            { rank: 7, name: "🌙 Гвардия Луны", power: "29.8K", members: "35/50", leader: "Странник" },
            { rank: 8, name: "☀️ Легион Солнца", power: "28.2K", members: "34/50", leader: "Драконоборец" },
            { rank: 9, name: "💎 Хранители Кристалла", power: "26.7K", members: "32/50", leader: "Новичок Удачи" },
            { rank: 10, name: "🌪️ Ураганные Воины", power: "25.1K", members: "30/50", leader: "Воин Света" }
        ];

        return `
            <div style="padding: 10px;">
                <h3 class="rating-title">🤝 РЕЙТИНГ АЛЬЯНСОВ</h3>
                <div class="messages-list">
                    ${alliances.map(alliance => `
                        <div class="player-rank-item">
                            <div class="rank-number">${alliance.rank}</div>
                            <div style="font-size: 24px;">🤝</div>
                            <div style="flex: 1;">
                                <div style="color: #f0c87a; font-weight: bold;">${alliance.name}</div>
                                <div style="color: #8b6b2c; font-size: 12px;">
                                    Мощь: ${alliance.power} • ${alliance.members} • Лидер: ${alliance.leader}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // ⭐ ЗНАМЕНИТОСТИ
    renderCelebrityRating: function() {
        return `
            <div style="padding: 10px;">
                <h3 class="rating-title">⭐ ЗНАМЕНИТОСТИ</h3>
                <div style="text-align: center; color: #8b6b2c; padding: 50px;">
                    🎭 Система знаменитостей в разработке
                </div>
            </div>
        `;
    },

    // 💪 АВТОРИТЕТ
    renderAuthorityRating: function() {
        return `
            <div style="padding: 10px;">
                <h3 class="rating-title">💪 АВТОРИТЕТ</h3>
                <div style="text-align: center; color: #8b6b2c; padding: 50px;">
                    🏛️ Система авторитета в разработке
                </div>
            </div>
        `;
    },

    // 🔍 АРХЕОЛОГИЯ
    renderArcheologyRating: function() {
        return `
            <div style="padding: 10px;">
                <h3 class="rating-title">🔍 АРХЕОЛОГИЯ</h3>
                <div style="text-align: center; color: #8b6b2c; padding: 50px;">
                    🏺 Археологический рейтинг в разработке
                </div>
            </div>
        `;
    },

    // 🎖️ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
    getRankMedal: function(rank) {
        if (rank === 1) return "🥇";
        if (rank === 2) return "🥈";
        if (rank === 3) return "🥉";
        return "🎖️";
    },

    renderPagination: function() {
        return `
            <div class="advanced-pagination">
                <div class="quick-nav">
                    <button class="nav-btn-rating" onclick="ratingSystem.previousPage()" ${this.currentPage === 1 ? 'disabled' : ''}>
                        ◀ Назад
                    </button>
                    <div class="current-page">Стр. ${this.currentPage} из ${this.totalPages}</div>
                    <button class="nav-btn-rating" onclick="ratingSystem.nextPage()" ${this.currentPage === this.totalPages ? 'disabled' : ''}>
                        Вперед ▶
                    </button>
                </div>
                <div class="page-jump">
                    <input type="number" id="pageInput" placeholder="Стр." min="1" max="${this.totalPages}">
                    <button class="go-btn" onclick="ratingSystem.jumpToPage()">Перейти</button>
                </div>
                <div class="total-info">Всего достижений: 15</div>
            </div>
        `;
    },

    previousPage: function() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderRatingScreen(this.currentScreen);
        }
    },

    nextPage: function() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.renderRatingScreen(this.currentScreen);
        }
    },

    jumpToPage: function() {
        const input = document.getElementById('pageInput');
        if (input && input.value) {
            const page = parseInt(input.value);
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                this.renderRatingScreen(this.currentScreen);
                input.value = '';
            }
        }
    },

    showCategoryDetail: function(categoryIndex) {
        const categories = this.getHallOfFameCategories(this.currentPage);
        const category = categories[categoryIndex];
        
        if (category) {
            utils.showNotification(
                "🏆 " + category.name,
                category.subtitle + "\n\nРезультат: " + category.score,
                'normal'
            );
        }
    }
};

// Глобальные функции для совместимости
function openRating() {
    if (window.ratingSystem && typeof ratingSystem.openRating === 'function') {
        ratingSystem.openRating();
    } else {
        console.error('Rating system not available');
    }
}

function closeRating() {
    if (window.ratingSystem && typeof ratingSystem.closeRating === 'function') {
        ratingSystem.closeRating();
    }
}

function showRatingScreen(screenId) {
    if (window.ratingSystem && typeof ratingSystem.showRatingScreen === 'function') {
        ratingSystem.showRatingScreen(screenId);
    }
}

// Экспортируем глобально
window.ratingSystem = ratingSystem;
