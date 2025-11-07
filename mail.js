// js/modules/mail.js
const mailSystem = {
    // Данные сообщений
    messages: [
        {
            id: 1,
            sender: "Королева Елизавета",
            preview: "Привет! Хочешь заключить союз против варваров?",
            content: "Уважаемый Король Артур,\n\nЯ, Королева Елизавета, предлагаю вам заключить военный союз против варварских племен, угрожающих нашим землям. Вместе мы сможем защитить наши королевства и расширить влияние.\n\nЖду вашего ответа.\n\nС уважением,\nКоролева Елизавета",
            time: Date.now() - 120000, // 2 минуты назад
            read: false,
            important: false,
            urgent: false,
            category: 'inbox'
        },
        {
            id: 2,
            sender: "Советник Мерлин",
            preview: "Ваше величество, нужны ресурсы для строительства библиотеки",
            content: "Ваше Величество,\n\nДля завершения строительства Великой Библиотеки нам требуется дополнительно 500 единиц дерева и 300 камня. Без этих ресурсов работы будут приостановлены.\n\nПрошу вас выделить необходимые материалы.\n\nС почтением,\nСоветник Мерлин",
            time: Date.now() - 3600000, // 1 час назад
            read: true,
            important: true,
            urgent: false,
            category: 'inbox'
        },
        {
            id: 3,
            sender: "⚔️ Боевой отчет",
            preview: "Победа над варварами! Добыча: 500 золота",
            content: "БОЕВОЙ ОТЧЕТ\n\nДата: Сегодня\nПротивник: Варварские племена\nРезультат: ПОБЕДА\n\nПотери:\n- Воины: 12\n- Лучники: 5\n\nДобыча:\n- Золото: 500\n- Еда: 300\n- Дерево: 150\n\nВаша армия показала отличную боевую подготовку!",
            time: Date.now() - 18000000, // 5 часов назад
            read: false,
            important: false,
            urgent: false,
            category: 'reports'
        },
        {
            id: 4,
            sender: "⚠️ Срочно",
            preview: "Замок под угрозой! Вражеская армия у границ",
            content: "СРОЧНОЕ СООБЩЕНИЕ!\n\nСистема наблюдения обнаружила приближение вражеской армии к вашим границам.\n\nСилы противника:\n- Воины: 150\n- Лучники: 75\n- Кавалерия: 50\n\nРекомендуется:\n1. Укрепить защиту замка\n2. Собрать армию\n3. Отправить просьбы о помощи союзникам\n\nВремя до подхода врага: ~30 минут",
            time: Date.now() - 600000, // 10 минут назад
            read: false,
            important: true,
            urgent: true,
            category: 'notifications'
        }
    ],

    isOpen: false,
    currentCategory: 'inbox',

    // Инициализация системы почты
    init: function() {
        this.loadMessages();
        this.updateBadge();
        this.setupEventListeners();
        console.log('Mail system initialized');
    },

    // Настройка обработчиков событий
    setupEventListeners: function() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMail();
            }
        });
    },

    // Получить количество непрочитанных сообщений
    getUnreadCount: function() {
        return this.messages.filter(msg => !msg.read && msg.category === 'inbox').length;
    },

    // Получить важные сообщения
    getImportantCount: function() {
        return this.messages.filter(msg => msg.important && !msg.read).length;
    },

    // Получить срочные сообщения
    getUrgentCount: function() {
        return this.messages.filter(msg => msg.urgent && !msg.read).length;
    },

    // Добавить новое сообщение
    addNewMessage: function(sender, preview, content = null, important = false, urgent = false, category = 'inbox') {
        const newMessage = {
            id: Date.now(),
            sender,
            preview,
            content: content || preview,
            time: Date.now(),
            read: false,
            important,
            urgent,
            category
        };
        
        this.messages.unshift(newMessage);
        this.updateBadge();
        this.showNewMessageNotification(newMessage);
        this.saveMessages();
        
        // Обновляем отображение если почта открыта
        if (this.isOpen) {
            this.renderMessages();
        }
        
        return newMessage.id;
    },

    // Показать уведомление о новом сообщении
    showNewMessageNotification: function(message) {
        let title = "✉️ Новое сообщение";
        let type = 'normal';
        
        if (message.urgent) {
            title = "🚨 СРОЧНОЕ СООБЩЕНИЕ";
            type = 'urgent';
        } else if (message.important) {
            title = "⚠️ Важное сообщение";
            type = 'important';
        }
        
        utils.showNotification(title, `${message.sender}: ${message.preview}`, type);
    },

    // Скрыть уведомление
    hideToast: function() {
        utils.hideNotification();
    },

    // Открыть почту
    openMail: function() {
        document.getElementById('mailModal').style.display = 'flex';
        this.isOpen = true;
        this.currentCategory = 'inbox';
        this.renderMessages();
        utils.setActiveNav('mail');
    },

    // Закрыть почту
    closeMail: function() {
        document.getElementById('mailModal').style.display = 'none';
        this.isOpen = false;
    },

    // Выбрать категорию почты
    selectMailCategory: function(category) {
        utils.selectCategory('mail', category, 'Mail');
        this.currentCategory = category;
        this.renderMessages();
    },

    // Отрисовать сообщения
    renderMessages: function() {
        const containers = {
            'inbox': document.getElementById('inboxMessages'),
            'reports': document.getElementById('reportsMessages'),
            'notifications': document.getElementById('notificationsMessages')
        };
        
        // Очищаем все контейнеры
        Object.values(containers).forEach(container => {
            if (container) container.innerHTML = '';
        });
        
        // Фильтруем сообщения по текущей категории
        const filteredMessages = this.messages.filter(msg => msg.category === this.currentCategory);
        
        // Добавляем сообщения в соответствующий контейнер
        const currentContainer = containers[this.currentCategory];
        if (currentContainer && filteredMessages.length > 0) {
            filteredMessages.forEach(message => {
                const messageElement = this.createMessageElement(message);
                currentContainer.appendChild(messageElement);
            });
        } else if (currentContainer) {
            currentContainer.innerHTML = '<div style="text-align: center; color: #8b6b2c; padding: 20px;">Нет сообщений</div>';
        }
    },

    // Создать элемент сообщения
    createMessageElement: function(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message-item';
        
        if (!message.read) messageDiv.classList.add('unread');
        if (message.important) messageDiv.classList.add('important');
        if (message.urgent) messageDiv.classList.add('urgent');
        
        messageDiv.onclick = () => this.openMessage(message.id);
        
        const timeText = utils.formatTime(message.time);
        
        messageDiv.innerHTML = `
            <div class="message-sender">${message.sender}</div>
            <div class="message-preview">${message.preview}</div>
            <div class="message-time">${timeText}</div>
        `;
        
        return messageDiv;
    },

    // Открыть сообщение
    openMessage: function(messageId) {
        const message = this.messages.find(msg => msg.id === messageId);
        if (message) {
            this.markAsRead(messageId);
            
            // Показываем модальное окно с полным текстом сообщения
            this.showMessageModal(message);
        }
    },

    // Показать модальное окно с сообщением
    showMessageModal: function(message) {
        // Создаем модальное окно для сообщения
        const modalHtml = `
            <div class="modal-overlay" id="messageDetailModal" style="display: flex;">
                <div class="modal-content animated" style="max-width: 500px;">
                    <div class="modal-header">
                        <h2>${message.sender}</h2>
                        <button class="close-btn" onclick="mailSystem.closeMessageModal()">×</button>
                    </div>
                    <div style="padding: 20px;">
                        <div style="margin-bottom: 15px; color: #8b6b2c; font-size: 12px;">
                            ${utils.formatTime(message.time)}
                            ${message.important ? ' • ⚠️ Важное' : ''}
                            ${message.urgent ? ' • 🚨 Срочное' : ''}
                        </div>
                        <div style="color: #f0c87a; line-height: 1.5; white-space: pre-line;">
                            ${message.content}
                        </div>
                        <div style="margin-top: 20px; display: flex; gap: 10px;">
                            ${!message.read ? `
                                <button class="mail-btn" onclick="mailSystem.markAsRead(${message.id}); mailSystem.closeMessageModal()">
                                    ✓ Прочитано
                                </button>
                            ` : ''}
                            <button class="mail-btn primary" onclick="mailSystem.closeMessageModal()">
                                Закрыть
                            </button>
                            <button class="mail-btn" onclick="mailSystem.deleteMessage(${message.id})" style="background: linear-gradient(135deg, #c41f3b, #ff4757);">
                                Удалить
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Добавляем модальное окно в документ
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer);
        
        // Настраиваем закрытие по клику вне области
        const modal = modalContainer.querySelector('.modal-overlay');
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                mailSystem.closeMessageModal();
            }
        });
    },

    // Закрыть модальное окно сообщения
    closeMessageModal: function() {
        const modal = document.getElementById('messageDetailModal');
        if (modal) {
            modal.remove();
        }
    },

    // Пометить как прочитанное
    markAsRead: function(messageId) {
        const message = this.messages.find(msg => msg.id === messageId);
        if (message && !message.read) {
            message.read = true;
            this.updateBadge();
            this.saveMessages();
            
            // Обновляем отображение если почта открыта
            if (this.isOpen) {
                this.renderMessages();
            }
        }
    },

    // Пометить все как прочитанные
    markAllAsRead: function() {
        let markedCount = 0;
        this.messages.forEach(msg => {
            if (!msg.read) {
                msg.read = true;
                markedCount++;
            }
        });
        
        this.updateBadge();
        this.saveMessages();
        this.renderMessages();
        
        utils.showNotification(
            "📬 Сообщения прочитаны",
            `Помечено как прочитанные: ${markedCount} сообщений`,
            'normal'
        );
    },

    // Удалить сообщение
    deleteMessage: function(messageId) {
        if (confirm('Вы уверены, что хотите удалить это сообщение?')) {
            this.messages = this.messages.filter(msg => msg.id !== messageId);
            this.updateBadge();
            this.saveMessages();
            this.renderMessages();
            this.closeMessageModal();
            
            utils.showNotification(
                "🗑️ Сообщение удалено",
                "Сообщение было успешно удалено",
                'normal'
            );
        }
    },

    // Отправить сообщение
    sendMessage: function() {
        const recipient = document.querySelector('#composeMail input[placeholder="Получатель"]')?.value;
        const subject = document.querySelector('#composeMail input[placeholder="Тема"]')?.value;
        const content = document.querySelector('#composeMail textarea')?.value;
        
        if (!recipient || !subject || !content) {
            utils.showNotification("❌ Ошибка", "Заполните все поля для отправки сообщения", 'important');
            return;
        }
        
        // Здесь будет логика отправки сообщения другому игроку
        utils.showNotification("📤 Сообщение отправлено", `Сообщение отправлено игроку: ${recipient}`, 'normal');
        
        // Очищаем поля формы
        document.querySelector('#composeMail input[placeholder="Получатель"]').value = '';
        document.querySelector('#composeMail input[placeholder="Тема"]').value = '';
        document.querySelector('#composeMail textarea').value = '';
    },

    // Сохранить черновик
    saveDraft: function() {
        utils.showNotification("💾 Черновик сохранен", "Сообщение сохранено в черновиках", 'normal');
    },

    // Обновить бейдж
    updateBadge: function() {
        const badge = document.getElementById('mailBadge');
        const unreadCount = this.getUnreadCount();
        
        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
                badge.style.display = 'flex';
                
                // Добавляем анимацию пульсации для срочных сообщений
                if (this.getUrgentCount() > 0) {
                    badge.style.animation = 'pulse 0.5s ease-in-out infinite';
                } else {
                    badge.style.animation = 'pulse 2s infinite';
                }
            } else {
                badge.style.display = 'none';
            }
        }
    },

    // Сохранить сообщения
    saveMessages: function() {
        utils.saveToStorage('mailMessages', this.messages);
    },

    // Загрузить сообщения
    loadMessages: function() {
        const saved = utils.loadFromStorage('mailMessages');
        if (saved) {
            this.messages = saved;
        }
    },

    // Тестовые функции
    addTestMessage: function() {
        const testMessages = [
            {
                sender: "Система",
                preview: "Добро пожаловать в систему уведомлений!",
                content: "Это тестовое сообщение для демонстрации работы системы почты.",
                important: false,
                urgent: false
            },
            {
                sender: "⚠️ ТРЕВОГА",
                preview: "Ваш замок атакован! Немедленно примите меры!",
                content: "СРОЧНОЕ СООБЩЕНИЕ!\n\nВаш замок подвергся нападению! Вражеские силы прорвали оборону.\n\nТребуется немедленное вмешательство!",
                important: true,
                urgent: true
            },
            {
                sender: "🌾 Ресурсный отчет",
                preview: "Сбор урожая завершен: +1000 еды",
                content: "ОТЧЕТ О СБОРЕ УРОЖАЯ\n\nПоля вашего королевства принесли обильный урожай.\n\nПолучено:\n- Еда: +1000\n\nПоздравляем с успешным сбором!",
                important: false,
                urgent: false
            }
        ];
        
        const randomMessage = testMessages[Math.floor(Math.random() * testMessages.length)];
        this.addNewMessage(
            randomMessage.sender,
            randomMessage.preview,
            randomMessage.content,
            randomMessage.important,
            randomMessage.urgent
        );
    }
};

// Глобальные функции для совместимости
function openMail() {
    mailSystem.openMail();
}

function closeMail() {
    mailSystem.closeMail();
}

function selectMailCategory(category) {
    mailSystem.selectMailCategory(category);
}

function sendMessage() {
    mailSystem.sendMessage();
}

function saveDraft() {
    mailSystem.saveDraft();
}

// Экспортируем глобально
window.mailSystem = mailSystem;
