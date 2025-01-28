document.addEventListener('DOMContentLoaded', () => {
  const stocksData = JSON.parse(stockContent);
  const userData = JSON.parse(userContent);

  const saveButton = document.querySelector('#saveButton');
  const deleteButton = document.querySelector('#deleteButton');
  const userList = document.querySelector('.user-list');
  const portfolioDetails = document.querySelector('.portfolio-list');
  const stockArea = document.querySelector('.stock-form');

  // Initial render of user list
  generateUserList(userData, stocksData);

  // Event listeners for save and delete
  saveButton.addEventListener('click', (event) => {
    event.preventDefault();
    saveUser(userData, stocksData);
  });

  deleteButton.addEventListener('click', (event) => {
    event.preventDefault();
    deleteUser(userData, stocksData);
  });
});

function generateUserList(users, stocks) {
  const userList = document.querySelector('.user-list');
  userList.innerHTML = ''; // Clear previous list

  users.forEach(({ user, id }) => {
    const listItem = document.createElement('li');
    listItem.innerText = `${user.lastname}, ${user.firstname}`;
    listItem.setAttribute('id', id);
    userList.appendChild(listItem);
  });

  // Register click event using event delegation
  userList.addEventListener('click', (event) => handleUserListClick(event, users, stocks));
}

function handleUserListClick(event, users, stocks) {
  const userId = event.target.id;
  const user = users.find(user => user.id == userId);

  if (user) {
    populateForm(user);
    renderPortfolio(user, stocks);
  }
}

function populateForm(data) {
  const { user, id } = data;
  document.querySelector('#userID').value = id;
  document.querySelector('#firstname').value = user.firstname;
  document.querySelector('#lastname').value = user.lastname;
  document.querySelector('#address').value = user.address;
  document.querySelector('#city').value = user.city;
  document.querySelector('#email').value = user.email;
}

function renderPortfolio(user, stocks) {
  const { portfolio } = user;
  const portfolioDetails = document.querySelector('.portfolio-list');
  portfolioDetails.innerHTML = '';

  portfolio.forEach(({ symbol, owned }) => {
    const row = document.createElement('div');
    row.className = 'portfolio-item';

    const symbolEl = document.createElement('p');
    const sharesEl = document.createElement('p');
    const actionEl = document.createElement('button');

    symbolEl.innerText = symbol;
    sharesEl.innerText = owned;
    actionEl.innerText = 'View';
    actionEl.setAttribute('id', symbol);

    row.appendChild(symbolEl);
    row.appendChild(sharesEl);
    row.appendChild(actionEl);
    portfolioDetails.appendChild(row);
  });

  // Add click handler for View buttons
  portfolioDetails.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      viewStock(event.target.id, stocks);
    }
  });
}

function viewStock(symbol, stocks) {
  const stockArea = document.querySelector('.stock-form');
  if (stockArea) {
    const stock = stocks.find(s => s.symbol === symbol);
    if (stock) {
      document.querySelector('#stockName').textContent = stock.name || 'N/A';
      document.querySelector('#stockSector').textContent = stock.sector || 'N/A';
      document.querySelector('#stockIndustry').textContent = stock.subIndustry || 'N/A';
      document.querySelector('#stockAddress').textContent = stock.address || 'N/A';
      document.querySelector('#logo').src = `logos/${symbol}.svg`;
    } else {
      alert('Stock information not found.');
    }
  }
}

function saveUser(users, stocks) {
  const id = document.querySelector('#userID').value;

  const user = users.find(user => user.id == id);
  if (user) {
    user.user.firstname = document.querySelector('#firstname').value;
    user.user.lastname = document.querySelector('#lastname').value;
    user.user.address = document.querySelector('#address').value;
    user.user.city = document.querySelector('#city').value;
    user.user.email = document.querySelector('#email').value;

    generateUserList(users, stocks);
  }
}

function deleteUser(users, stocks) {
  const userId = document.querySelector('#userID').value;
  const userIndex = users.findIndex(user => user.id == userId);

  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    generateUserList(users, stocks);
    clearForm();
  }
}

function clearForm() {
  document.querySelector('#userID').value = '';
  document.querySelector('#firstname').value = '';
  document.querySelector('#lastname').value = '';
  document.querySelector('#address').value = '';
  document.querySelector('#city').value = '';
  document.querySelector('#email').value = '';
}