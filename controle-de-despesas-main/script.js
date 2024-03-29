const transactionsUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')
const title = document.querySelector('#title')

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'))
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID => {
    transactions = transactions.filter(transaction => transaction.id !== ID)
    updateLocalStorage()
    init()
}

const addTransactionIntoDOM = transaction => {
    const operator = transaction.amount < 0 ? '-' : '+'
    const CSSClass = transaction.amount < 0 ? 'minus' : 'plus'
    const amountWithoutOperator = Math.abs(transaction.amount)
    const li = document.createElement('li')

    li.classList.add(CSSClass)
    li.innerHTML = `
        ${transaction.name} 
        <span>${operator} R$ ${amountWithoutOperator}</span>
        <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
            x
        </button>
    `
    transactionsUl.append(li)
}

const getIncome = transactionsAmounts => transactionsAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2)

const getExpenses = transactionsAmounts => Math.abs(transactionsAmounts
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2)

const getTotal = transactionsAmounts => transactionsAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2)

const updateBalanceValues = () => {
    const transactionsAmounts = transactions.map(transaction => transaction.amount)
    const total = getTotal(transactionsAmounts)
    const income = getIncome(transactionsAmounts)
    const expense = getExpenses(transactionsAmounts)

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`
}

const init = () => {
    transactionsUl.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM)
    updateBalanceValues()
}

init()

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000)

const addToTransactionsArray = (transactionName, transactionAmount) => {
    transactions.push({
        id: generateID(),
        name: transactionName,
        amount: Number(transactionAmount)
    })
}

const addToTransactionsArrayDesp = (transactionName, transactionAmount) => {
    transactions.push({
        id: generateID(),
        name: transactionName,
        amount: Number(transactionAmount * -1)
    })
}

const cleanInputs = () => {
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
}

const handleFormSubmitReceita = event => {
    event.preventDefault()

    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()
    const insSomeInputEmpty = transactionName === '' || transactionAmount === ''

    if (insSomeInputEmpty) {
        alert('Por favor, preencha tanto o nome quanto o valor da transação')
        return
    }

    addToTransactionsArray(transactionName, transactionAmount)
    init()
    updateLocalStorage()
    cleanInputs()
}

const handleFormSubmitDespesa = event => {
    event.preventDefault()

    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()
    const insSomeInputEmpty = transactionName === '' || transactionAmount === ''

    if (insSomeInputEmpty) {
        alert('Por favor, preencha tanto o nome quanto o valor da transação')
        return
    }

    addToTransactionsArrayDesp(transactionName, transactionAmount)
    init()
    updateLocalStorage()
    cleanInputs()
}

const buttonReceita = document.querySelector('#receita')
const buttonDespesa = document.querySelector('#despesa')


buttonReceita.addEventListener('click', handleFormSubmitReceita)
buttonDespesa.addEventListener('click', handleFormSubmitDespesa)
const clearTransactions = () => {
    transactions = []
    updateLocalStorage()
    init()
}

const clearTransactionsButton = document.querySelector('#clear-transactions')
clearTransactionsButton.addEventListener('click', clearTransactions)

