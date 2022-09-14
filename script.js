'use strict';

// BANKING APP

// Data
const account1 = {
  owner: 'Alessandro Vanischvili',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Maximilian Schwarzmüller',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//*************************************
const updateUI = function (account) {
  displayTransactions(account.movements);
  displayToTalBalance(account);
  calcDisplaySummary(account);
};

const displayTransactions = function (transaction, sort = false) {
  containerMovements.innerHTML = '';

  const tranzs = sort ? transaction.slice().sort((a, b) => a - b) : transaction;

  tranzs.forEach(function (value, index) {
    let type = value > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
    <div class="movements__value">${value}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const displayToTalBalance = function (account) {
  account.balance = account.movements.reduce(
    (total, value) => total + value,
    0
  );
  labelBalance.textContent = `${account.balance}€`;
};

const calcDisplaySummary = function (account) {
  const outcomePositive = Math.floor(
    account.movements
      .filter(trans => trans > 0)
      .reduce((tot, trans) => tot + trans)
  );
  labelSumIn.textContent = `${outcomePositive}€`;
  const outcomeNegative = account.movements
    .filter(trans => trans < 0)
    .reduce((tot, trans) => tot + trans, 0);
  labelSumOut.textContent = `${Math.abs(outcomeNegative)}€`;
  const interestAdded = account.movements
    .filter(trans => trans > 1)
    .map(trans => (trans * account.interestRate) / 100)
    .reduce((tot, trans) => tot + trans);
  labelSumInterest.textContent = `${Math.floor(interestAdded)}€`;
};

const generateUserNames = function (account) {
  account.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(acc => acc[0])
      .join('');
  });
};
generateUserNames(accounts);

let currentAccount;
btnLogin.addEventListener('click', function (event) {
  event.preventDefault();
  currentAccount = accounts.find(
    account => account.userName === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    updateUI(currentAccount);
  }
});
btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
    inputTransferTo.value = inputTransferAmount.value = '';
  }
});

btnClose.addEventListener('click', function (event) {
  event.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  let requested = Number(inputLoanAmount.value);
  if (
    requested > 0 &&
    currentAccount.movements.some(trans => trans >= requested * 0.1)
  ) {
    currentAccount.movements.push(requested);
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

let sorted = false;

btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  displayTransactions(currentAccount.movements, !sorted);
  sorted = !sorted;
});

const emptyArr = [];
emptyArr.fill(15, 0, 15);
