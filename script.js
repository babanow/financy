document.addEventListener('DOMContentLoaded', () => {
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

    // Элементы модальных окон
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
        return storedCategories ? JSON.parse(storedCategories) : { income: ['Зарплата',