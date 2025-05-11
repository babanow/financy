document.addEventlistener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.ready();

    // Элементы DOM
    const currentBalanceElement = document.getElementById('currentBalance');
    const totalIncomeElement = document.getElementById('totalIncome');
    const totalExpenseElement = document.getElementById('totalExpense');
    const transactionsListElement = document.getElementById('transactionsList');
    const bottomNavButtons = document.querySelectorAll('.bottom-nav button');
    const screens = document.querySelectorAll('.screen');

    // Кнопки быстрого действия
    const addIncomeBtn = document.getElementById('addIncomeBtn');
    const addExpenseBtn = document.getElementById('addExpenseBtn');

    // Элементы модальных окон добавления записи
    const addRecordModal = document.getElementById('addRecordModal');
    const closeRecordModal = document.getElementById('closeRecordModal');
    const modalTitle = document.getElementById('modalTitle');
    const recordDateInput = document.getElementById('recordDate');
    const recordCategorySelect = document.getElementById('recordCategory');
    const recordAmountInput = document.getElementById('recordAmount');
    const recordDescriptionInput = document.getElementById('recordDescription');
    const saveRecordBtn = document.getElementById('saveRecordBtn');

    const addCategoryModal = document.getElementById('addCategoryModal');
    const closeCategoryModal = document.getElementById('closeCategoryModal');
    const categoryNameInput = document.getElementById('categoryName');
    const categoryTypeSelect = document.getElementById('categoryType');
    const saveCategoryBtn = document.getElementById('saveCategoryBtn');

    // Списки категорий на экране "Категории"
    const incomeCategoriesListElement = document.getElementById('incomeCategoriesList');
    const expenseCategoriesListElement = document.getElementById('expenseCategoriesList');
    const addIncomeCategoryBtnElement = document.getElementById('addIncomeCategoryBtn');
    const addExpenseCategoryBtnElement = document.getElementById('addExpenseCategoryBtn');

    // Экраны доходов и расходов
    const incomeScreenElement = document.getElementById('incomeScreen');
    const expenseScreenElement = document.getElementById('expenseScreen');
    const addIncomeRecordBtnElement = document.getElementById('addIncomeRecordBtn');
    const addExpenseRecordBtnElement = document.getElementById('addExpenseRecordBtn');
    const incomeListElement = document.getElementById('incomeList');
    const expenseListElement = document.getElementById('expenseList');

    // Экран отчетов
    const reportsScreen = document.getElementById('reportsScreen');
    const reportPeriodSelect = document.getElementById('reportPeriod');
    const reportDetailsElement = document.getElementById('reportDetails');

    // Экран настроек
    const settingsScreen = document.getElementById('settingsScreen');
    const currencySelect = document.getElementById('currency');

    // Ключи для локального хранилища
    const STORAGE_KEY_TRANSACTIONS = 'financeAppTransactions';
    const STORAGE_KEY_CATEGORIES = 'financeAppCategories';
    const STORAGE_KEY_CURRENCY = 'financeAppCurrency';

    let transactions = getTransactions();
    let categories = getCategories();
    let currentCurrency = getCurrentCurrency();
    let currentRecordType = null; // Переменная для хранения типа добавляемой записи

    // ------ Функции для работы с локальным хранилищем ------
    function getTransactions() {
        const storedTransactions = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
        return storedTransactions ? JSON.parse(storedTransactions) : [];
    }

    function saveTransactions(transactions) {
        localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
    }

    function getCategories() {
        const storedCategories = localStorage.getItem(STORAGE_KEY_CATEGORIES);
        return storedCategories ? JSON.parse(storedCategories) : { income: ['Зарплата', 'Подработка', 'Проценты'], expense: ['Продукты', 'Транспорт', 'Развлечения'] };
    }

    function saveCategories(categories) {
        localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
    }

    function getCurrentCurrency() {
        return localStorage.getItem(STORAGE_KEY_CURRENCY) || 'USD';
    }

    function saveCurrentCurrency(currency) {
        localStorage.setItem(STORAGE_KEY_CURRENCY, currency);
    }

    // ------ Переключение между экранами ------
    const navButtons = document.querySelectorAll('.bottom-nav button');
    navButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const targetScreen = event.target.dataset.screen;
            switchScreen(targetScreen);
        });
    });

    function switchScreen(screenId) {
        screens.forEach(screen => {
            screen.style.display = 'none';
        });
        navButtons.forEach(button => {
            button.classList.remove('active');
            if (button.dataset.screen === screenId) {
                button.classList.add('active');
            }
        });
        document.getElementById(screenId + 'Screen').style.display = 'block';

        // Обновление списков при переключении на экраны доходов/расходов
        if (screenId === 'income') {
            renderTransactionList('income', incomeListElement);
        } else if (screenId === 'expense') {
            renderTransactionList('expense', expenseListElement);
        }
    }

    // Показать главный экран при загрузке
    switchScreen('dashboard');

    // ------ Работа с модальным окном добавления записи ------
    addIncomeBtn.addEventListener('click', () => {
        openAddRecordModal('income');
    });

    addExpenseBtn.addEventListener('click', () => {
        openAddRecordModal('expense');
    });

    closeRecordModal.addEventListener('click', () => {
        addRecordModal.style.display = 'none';
    });

    function openAddRecordModal(type) {
        modalTitle.textContent = type === 'income' ? 'Добавить доход' : 'Добавить расход';
        recordDateInput.valueAsDate = new Date(); // Устанавливаем текущую дату по умолчанию
        recordAmountInput.value = '';
        recordDescriptionInput.value = '';
        populateCategoryOptions(type);
        addRecordModal.style.display = 'block';
        currentRecordType = type; // Сохраняем тип записи
    }

    function populateCategoryOptions(type) {
        recordCategorySelect.innerHTML = '';
        categories[type].forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            recordCategorySelect.appendChild(option);
        });
    }

    saveRecordBtn.addEventListener('click', () => {
        const date = recordDateInput.value;
        const category = recordCategorySelect.value;
        const amount = parseFloat(recordAmountInput.value);
        const description = recordDescriptionInput.value;

        if (date && category && !isNaN(amount)) {
            const newTransaction = {
                id: Date.now(), // Уникальный ID на основе timestamp
                type: currentRecordType,
                date: date,
                category: category,
                amount: amount,
                description: description
            };

            transactions.push(newTransaction);
            saveTransactions(transactions);
            addRecordModal.style.display = 'none';
            updateDashboard(); // Обновляем главный экран
            if (currentRecordType === 'income') {
                renderTransactionList('income', incomeListElement);
            } else if (currentRecordType === 'expense') {
                renderTransactionList('expense', expenseListElement);
            }
        } else {
            alert('Пожалуйста, заполните все обязательные поля (дата, категория, сумма).');
        }
    });

    // ------ Отображение списка транзакций на экранах "Доходы" и "Расходы" ------
    function renderTransactionList(type, containerElement) {
        containerElement.innerHTML = '';
        const filteredTransactions = transactions.filter(t => t.type === type);
        filteredTransactions.forEach(transaction => {
            const listItem = document.createElement('div');
            listItem.classList.add('transaction-item');
            const sign = type === 'income' ? '+' : '-';
            listItem.textContent = `${formatDate(transaction.date)} - ${transaction.category} ${sign}${transaction.amount.toFixed(2)} ${currentCurrency}${transaction.description ? ` (${transaction.description})` : ''}`;
            containerElement.appendChild(listItem);
        });
    }

    // ------ Обновление главного экрана ------
    function updateDashboard() {
        const currentMonthTransactions = transactions.filter(t => {
            const today = new Date();
            const transactionDate = new Date(t.date);
            return transactionDate.getFullYear() === today.getFullYear() && transactionDate.getMonth() === today.getMonth();
        });
        const income = currentMonthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expense = currentMonthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const balance = income - expense;

        currentBalanceElement.textContent = balance.toFixed(2) + ' ' + currentCurrency;
        totalIncomeElement.textContent = income.toFixed(2) + ' ' + currentCurrency;
        totalExpenseElement.textContent = expense.toFixed(2) + ' ' + currentCurrency;

        const latestTransactions = transactions.slice(-5).reverse();
        renderLatestTransactions(latestTransactions);
    }

    function renderLatestTransactions(list) {
        transactionsListElement.innerHTML = '';
        list.forEach(transaction => {
            const listItem = document.createElement('li');
            const sign = transaction.type === 'income' ? '+' : '-';
            listItem.textContent = `${formatDate(transaction.date)} - ${transaction.category} ${sign}${transaction.amount.toFixed(2)} ${currentCurrency}${transaction.description ? ` (${transaction.description})` : ''}`;
            transactionsListElement.appendChild(listItem);
        });
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }

    // Вызов для первоначального обновления панели
    updateDashboard();
});
