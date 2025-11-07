// js/utils.js
const utils = {
    // Форматирование чисел с разделителями тысяч
    formatNumber: function(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    // Анимация изменения числа
    animateValue: function(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = this.formatNumber(value);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    },

    // Инициализация закрытия модальных окон по клику вне области
    initModalClose: function() {
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal-overlay')) {
                e.target.style.display = 'none';
            }
        });
    },

    // Показать уведомление
    showNotification: function(title, message, type = 'normal') {
        const toast = document.getElementById('newMessageToast');
        const toastTitle = document.getElementById('toastTitle');
        const toastMessage = document.getElementById('toastMessage');

        if (!toast || !toastTitle || !toastMessage) return;

        toastTitle.textContent = title;
        toastMessage.textContent = message;

        // Устанавливаем стиль в зависимости от типа
        toast.className = 'notification-toast';
        if (type === 'urgent') {
            toast.classList.add('urgent');
        } else if (type === 'important') {
            toast.classList.add('important');
        }

        toast.style.display = 'block';

        // Автоматическое скрытие через 5 секунд
        setTimeout(() => {
            this.hideNotification();
        }, 5000);
    },

    // Скрыть уведомление
    hideNotification: function() {
        const toast = document.getElementById('newMessageToast');
        if (toast) {
            toast.style.display = 'none';
        }
    },

    // Переход к профилю
    goToProfile: function() {
        alert('Переход к профилю игрока');
        // window.location.href = 'profile.html';
    },

    // Тестовые функции для сообщений
    testNewMessage: function() {
        if (window.mailSystem) {
            mailSystem.addNewMessage(
                "Тестовый отправитель", 
                "Это тестовое сообщение для проверки системы уведомлений", 
                false, 
                false
            );
        }
    },

    testImportantMessage: function() {
        if (window.mailSystem) {
            mailSystem.addNewMessage(
                "⭐ ВАЖНОЕ", 
                "Важное сообщение требующее вашего внимания", 
                true, 
                false
            );
        }
    },

    testUrgentMessage: function() {
        if (window.mailSystem) {
            mailSystem.addNewMessage(
                "🚨 СРОЧНО", 
                "СРОЧНОЕ сообщение! Немедленные действия требуются!", 
                true, 
                true
            );
        }
    },

    // Вспомогательная функция для выбора категорий
    selectCategory: function(categoryType, categoryName, sectionPrefix) {
        // Убираем активный класс у всех категорий
        document.querySelectorAll(`.${categoryType}-category`).forEach(cat => {
            cat.classList.remove('active');
        });
        
        // Добавляем активный класс выбранной категории
        event.target.closest(`.${categoryType}-category`).classList.add('active');
        
        // Скрываем все секции
        document.querySelectorAll(`.${sectionPrefix}-section`).forEach(section => {
            section.classList.remove('active');
        });
        
        // Показываем выбранную секцию
        const targetSection = document.getElementById(`${categoryName}${sectionPrefix}`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    },

    // Установка активной кнопки навигации
    setActiveNav: function(buttonType) {
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        const buttons = document.querySelectorAll('.nav-btn');
        const navTypes = ['rating', 'bank', 'alliance', 'mail', 'inventory', 'settings'];
        const index = navTypes.indexOf(buttonType);
        if (index !== -1 && buttons[index]) {
            buttons[index].classList.add('active');
        }
    },

    // Генератор случайных чисел в диапазоне
    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Проверка, является ли элемент видимым на экране
    isElementInViewport: function(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Дебаунс функция для оптимизации
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Сохранение в localStorage
    saveToStorage: function(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Ошибка сохранения в localStorage:', e);
            return false;
        }
    },

    // Загрузка из localStorage
    loadFromStorage: function(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Ошибка загрузки из localStorage:', e);
            return null;
        }
    },

    // Форматирование времени
    formatTime: function(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now - time;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Только что';
        if (minutes < 60) return `${minutes} мин назад`;
        if (hours < 24) return `${hours} час назад`;
        if (days < 7) return `${days} дн назад`;
        
        return time.toLocaleDateString();
    },

    // Инициализация всех утилит
    init: function() {
        this.initModalClose();
        console.log('Utils initialized');
    }
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    utils.init();
});