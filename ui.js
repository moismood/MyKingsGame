// js/modules/ui.js
const uiSystem = {
    // Инициализация UI системы
    init: function() {
        console.log('🎨 UI system initialized');
        this.initModals();
        this.initAnimations();
        this.initEventListeners();
        return true;
    },
    
    // Инициализация модальных окон
    initModals: function() {
        console.log('🪟 Modal system ready');
        // Закрытие модальных окон по клику вне области
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal-overlay')) {
                e.target.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
        
        // Закрытие по ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                uiSystem.closeAllModals();
            }
        });
    },
    
    // Инициализация анимаций
    initAnimations: function() {
        console.log('✨ Animation system ready');
        // Добавляем анимации для интерактивных элементов
        this.initHoverAnimations();
        this.initClickAnimations();
    },
    
    // Инициализация обработчиков событий
    initEventListeners: function() {
        console.log('🎯 Event listeners ready');
    },
    
    // Анимации при наведении
    initHoverAnimations: function() {
        const animatedElements = document.querySelectorAll('.animated');
        animatedElements.forEach(el => {
            el.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.02)';
                this.style.transition = 'all 0.3s ease';
            });
            
            el.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    },
    
    // Анимации при клике
    initClickAnimations: function() {
        const buttons = document.querySelectorAll('button, .nav-btn, .mail-btn, .treasury-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        });
    },
    
    // Показать уведомление
    showNotification: function(title, message, type = 'normal') {
        if (window.utils && typeof utils.showNotification === 'function') {
            utils.showNotification(title, message, type);
        } else {
            const toast = document.getElementById('newMessageToast');
            if (toast) {
                const titleEl = toast.querySelector('#toastTitle');
                const messageEl = toast.querySelector('#toastMessage');
                if (titleEl) titleEl.textContent = title;
                if (messageEl) messageEl.textContent = message;
                toast.style.display = 'block';
                
                setTimeout(() => {
                    toast.style.display = 'none';
                }, 3000);
            } else {
                console.log('📢', title + ':', message);
            }
        }
    },
    
    // Показать модальное окно
    showModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            const content = modal.querySelector('.modal-content');
            if (content) {
                content.style.animation = 'modalAppear 0.3s ease-out';
            }
        }
    },
    
    // Скрыть модальное окно
    hideModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    },
    
    // Закрыть все модальные окна
    closeAllModals: function() {
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = '';
    },
    
    // Обновить прогресс-бар
    updateProgressBar: function(barId, percentage) {
        const bar = document.getElementById(barId);
        if (bar) {
            bar.style.width = Math.min(100, Math.max(0, percentage)) + '%';
        }
    },
    
    // Переключить видимость элемента
    toggleElement: function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = element.style.display === 'none' ? 'block' : 'none';
        }
    },
    
    // Добавить анимацию пульсации
    addPulseAnimation: function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.animation = 'pulse 2s infinite';
        }
    },
    
    // Убрать анимацию
    removeAnimation: function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.animation = 'none';
        }
    },
    
    // Показать/скрыть лоадер
    showLoader: function() {
        let loader = document.getElementById('globalLoader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'globalLoader';
            loader.innerHTML = '🔄 Загрузка';
            loader.style.cssText = `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.8); color: #f0c87a; padding: 20px; border-radius: 10px;
                z-index: 9999; border: 2px solid #8b6b2c;
            `;
            document.body.appendChild(loader);
        }
        loader.style.display = 'block';
    },
    
    hideLoader: function() {
        const loader = document.getElementById('globalLoader');
        if (loader) {
            loader.style.display = 'none';
        }
    },
    
    // Обновить текст элемента
    updateText: function(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
        }
    },
    
    // Обновить HTML содержимое
    updateHTML: function(elementId, html) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        }
    },
    
    // Добавить класс
    addClass: function(elementId, className) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add(className);
        }
    },
    
    // Удалить класс
    removeClass: function(elementId, className) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove(className);
        }
    },
    
    // Переключить класс
    toggleClass: function(elementId, className) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.toggle(className);
        }
    },
    
    // Создать элемент
    createElement: function(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        Object.keys(attributes).forEach(key => {
            element.setAttribute(key, attributes[key]);
        });
        if (content) {
            element.innerHTML = content;
        }
        return element;
    },
    
    // Добавить элемент в DOM
    appendElement: function(parentId, element) {
        const parent = document.getElementById(parentId);
        if (parent) {
            parent.appendChild(element);
        }
    },
    
    // Удалить элемент
    removeElement: function(elementId) {
        const element = document.getElementById(elementId);
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    },
    
    // Показать временное сообщение
    showTempMessage: function(message, duration = 2000, type = 'info') {
        const tempMsg = document.createElement('div');
        const bgColor = type === 'error' ? '#c41f3b' : type === 'success' ? '#27ae60' : '#8b6b2c';
        
        tempMsg.textContent = message;
        tempMsg.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background: ${bgColor}; color: white; padding: 10px 20px; border-radius: 5px;
            z-index: 10000; font-family: 'Cinzel', serif; font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(tempMsg);
        
        setTimeout(() => {
            if (tempMsg.parentNode) {
                tempMsg.parentNode.removeChild(tempMsg);
            }
        }, duration);
    },

    // --- Прокси-методы для совместимости с game.js ---
    showLoading: function(message = "Loading...") {
        let loader = document.getElementById('globalLoader');
        if (loader) {
            loader.innerText = message;
        }
        this.showLoader();
    },

    hideLoading: function() {
        this.hideLoader();
    }
};

// Автоматическая инициализация при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        uiSystem.init();
    });
} else {
    uiSystem.init();
}

// Глобальная доступность
window.uiSystem = uiSystem;
