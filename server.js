const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Маршрут для главной страницы
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Маршрут для профиля
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'profile.html'));
});

// Маршрут для карты
app.get('/map', (req, res) => {
    res.sendFile(path.join(__dirname, 'map.html'));
});

// API для получения данных игроков
app.get('/api/players', (req, res) => {
    try {
        if (fs.existsSync('players.json')) {
            const playersData = JSON.parse(fs.readFileSync('players.json', 'utf8'));
            res.json(playersData);
        } else {
            // Возвращаем тестовые данные если файла нет
            res.json([
                { id: 1, name: "Король Артур", level: 25, avatar: "👑", score: 3000 },
                { id: 2, name: "Воин Света", level: 23, avatar: "⚔️", score: 2800 },
                { id: 3, name: "Драконоборец", level: 22, avatar: "🐉", score: 2700 },
                { id: 4, name: "Лучник", level: 21, avatar: "🏹", score: 2600 },
                { id: 5, name: "Маг", level: 20, avatar: "🔮", score: 2500 }
            ]);
        }
    } catch (error) {
        console.error('Error reading players data:', error);
        res.status(500).json({ error: 'Ошибка чтения данных игроков' });
    }
});

// API для сохранения данных игрока
app.post('/api/player', (req, res) => {
    try {
        const playerData = req.body;
        
        // Читаем текущие данные
        let players = [];
        if (fs.existsSync('players.json')) {
            players = JSON.parse(fs.readFileSync('players.json', 'utf8'));
        }
        
        // Обновляем или добавляем игрока
        const existingIndex = players.findIndex(p => p.id === playerData.id);
        if (existingIndex >= 0) {
            players[existingIndex] = playerData;
        } else {
            players.push(playerData);
        }
        
        // Сохраняем обратно
        fs.writeFileSync('players.json', JSON.stringify(players, null, 2));
        res.json({ success: true, message: 'Данные сохранены' });
    } catch (error) {
        console.error('Error saving player data:', error);
        res.status(500).json({ error: 'Ошибка сохранения данных' });
    }
});

// Маршрут для получения рейтинга
app.get('/api/rating', async (req, res) => {
    try {
        // Получаем данные игроков и сортируем по очкам
        const playersResponse = await fetch(`http://localhost:${port}/api/players`);
        const playersData = await playersResponse.json();
        
        const ratingData = playersData
            .sort((a, b) => b.score - a.score)
            .slice(0, 10) // Топ-10
            .map((player, index) => ({
                rank: index + 1,
                name: player.name,
                score: formatScore(player.score),
                avatar: player.avatar
            }));
        
        res.json(ratingData);
    } catch (error) {
        console.error('Error getting rating:', error);
        // Возвращаем тестовые данные при ошибке
        res.json([
            { rank: 1, name: "Король Артур", score: "3.0K", avatar: "👑" },
            { rank: 2, name: "Воин Света", score: "2.8K", avatar: "⚔️" },
            { rank: 3, name: "Драконоборец", score: "2.7K", avatar: "🐉" },
            { rank: 4, name: "Лучник", score: "2.6K", avatar: "🏹" },
            { rank: 5, name: "Маг", score: "2.5K", avatar: "🔮" }
        ]);
    }
});

// Функция для форматирования счета
function formatScore(score) {
    if (score >= 1000) {
        return (score / 1000).toFixed(1) + 'K';
    }
    return score.toString();
}

// Запуск сервера
app.listen(port, () => {
    console.log(`🎮 Сервер игры запущен на http://localhost:${port}`);
    console.log(`📊 API рейтинга доступно по адресу: http://localhost:${port}/api/rating`);
    console.log(`👥 API игроков доступно по адресу: http://localhost:${port}/api/players`);
});