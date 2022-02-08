const totalRevenue = document.querySelector(".total-revenue");
const overViewIncome = document.querySelector(".overview-income");

const overViewExpense = document.querySelector(".overview-expense");
const detailIncome = document.querySelector(".detail__income");

//  tab
const tab1 = document.querySelector(".tab1");
const tab2 = document.querySelector(".tab2");
const tab3 = document.querySelector(".tab3");

//list
const incomeTracker = document.querySelector(".income-tracker");
const listIncomeTracker = document.querySelector(".income-tracker .list");
const expenseTracker = document.querySelector(".expense-tracker");
const listExpenseTracker = document.querySelector(".expense-tracker .list");
const allTracker = document.querySelector(".all-tracker");
const listAll = document.querySelector(".all-tracker .list");
const lists = document.querySelectorAll(".list");

// btn
const inputTitleIncome = document.querySelector("#income-title");
const inputAmountIncome = document.querySelector("#income-cost");
const btnAddIncome = document.querySelector(".add-income");
const inputTitleExpense = document.querySelector("#expense-title");
const inputAmountExpense = document.querySelector("#expense-cost");
const btnAddExpense = document.querySelector(".add-expense");

//--------------------------------------------  initial --------------------------------------------
let ENTRY_LIST = JSON.parse(localStorage.getItem("entry-list")) || [];
let [deleteIcon, editIcon] = ["fas fa-trash", "far fa-edit"];
updateUI();

// -------------------------------------------- when click tab1,2,3 --------------------------------------------
tab1.addEventListener("click", function () {
  show(incomeTracker);
  hide([expenseTracker, allTracker]);
  active(tab1);
  inactive([tab2, tab3]);
});
tab2.addEventListener("click", function () {
  show(expenseTracker);
  hide([incomeTracker, allTracker]);
  active(tab2);
  inactive([tab1, tab3]);
});
tab3.addEventListener("click", function () {
  show(allTracker);
  hide([incomeTracker, expenseTracker]);
  active(tab3);
  inactive([tab1, tab2]);
});

//  -------------------------------------------- function show list --------------------------------------------
function show(element) {
  element.classList.remove("hide");
}

//  -------------------------------------------- function hide list --------------------------------------------
function hide(elements) {
  elements.forEach(function (element) {
    element.classList.add("hide");
  });
}

// -------------------------------------------- function active --------------------------------------------
function active(element) {
  element.classList.add("active");
}
// function inactive
function inactive(elements) {
  elements.forEach(function (element) {
    element.classList.remove("active");
  });
}

// -------------------------------------------- when click btn add --------------------------------------------
btnAddIncome.addEventListener("click", addIncome);
btnAddExpense.addEventListener("click", addExpense);
document.addEventListener("keypress", function (e) {
  if (e.keyCode === 13) {
    addIncome(e);
    addExpense(e);
  }
});

// --------------------------------------------Function add income--------------------------------------------
function addIncome(e) {
  e.preventDefault();
  if (inputAmountIncome.value && inputTitleIncome.value) {
    let income = {
      type: "income",
      title: inputTitleIncome.value,
      amount: parseInt(inputAmountIncome.value),
    };
    ENTRY_LIST.push(income);
    updateUI();
    clearInput([inputTitleIncome, inputAmountIncome]);
  }
}

// -------------------------------------------- Function add expense --------------------------------------------
function addExpense(e) {
  e.preventDefault();
  if (inputAmountExpense.value && inputTitleExpense.value) {
    let expense = {
      type: "expense",
      title: inputTitleExpense.value,
      amount: parseInt(inputAmountExpense.value),
    };
    ENTRY_LIST.push(expense);
    updateUI();
    clearInput([inputTitleExpense, inputAmountExpense]);
  }
}
//  -------------------------------------------- Function update UI --------------------------------------------
function updateUI() {
  let amountIncome = calculator("income", ENTRY_LIST);
  let amountExpense = calculator("expense", ENTRY_LIST);
  let total = Math.abs(calculatorTotal(amountIncome, amountExpense));
  let sign = amountIncome >= amountExpense ? "$" : "-$";

  // -------------------------------------------- update UI --------------------------------------------
  totalRevenue.innerHTML = `<p>${sign}</p><p>${total}</p>`;
  overViewIncome.innerHTML = `<h2>Income</h2><p>$</p><p>${amountIncome}</p>`;
  overViewExpense.innerHTML = `<h2>Expense</h2><p>$</p><p>${amountExpense}</p>`;

  clearElement([listIncomeTracker, listExpenseTracker, listAll]); // xoa phan tu trong list truoc khi in ra man hinh (tranh tinh trang bi lap lai)
  ENTRY_LIST.forEach(function (entry, index) {
    if (entry.type === "income") {
      showList(listIncomeTracker, entry.type, entry.title, entry.amount, index);
    } else if (entry.type === "expense") {
      showList(
        listExpenseTracker,
        entry.type,
        entry.title,
        entry.amount,
        index
      );
    }
    showList(listAll, entry.type, entry.title, entry.amount, index);
    localStorage.setItem("entry-list", JSON.stringify(ENTRY_LIST));
  });

  // -------------------------------------------- Function update Chart --------------------------------------------
  updateChart(amountIncome, amountExpense);
}

// -------------------------------------------- Function showList --------------------------------------------
function showList(list, type, title, amount, id) {
  let entry = `<li id ="${id}"class ="${type}">
    <div>${title} : ${amount}</div>
    <div class ="action">
      <i class="${editIcon}"></i>
      <i class ="${deleteIcon}"></i>
    </div>
  </li>`;
  list.insertAdjacentHTML("afterbegin", entry);
}

// -------------------------------------------- Function calculator --------------------------------------------
function calculator(type, list) {
  let sum = 0;
  list.forEach(function (item) {
    if (item.type === type) {
      sum += item.amount;
    }
  });
  return sum;
}
//  -------------------------------------------- Function calculator total --------------------------------------------
function calculatorTotal(income, expense) {
  return income - expense;
}
// -------------------------------------------- Function clear input --------------------------------------------
function clearInput(inputs) {
  inputs.forEach(function (input) {
    input.value = "";
  });
}

// -------------------------------------------- Function clear element --------------------------------------------
function clearElement(elements) {
  elements.forEach(function (element) {
    element.innerHTML = "";
  });
}

// -------------------------------------------- Handle edit and remove --------------------------------------------
lists.forEach(function (list) {
  list.addEventListener("click", function (e) {
    if (e.target.localName !== "i") return;
    let targetBtn = e.target.className;
    let item = e.target.parentNode.parentNode;
    let targetID = item.attributes.id.value;
    if (targetBtn === "far fa-edit") {
      editEntry(targetID);
    } else if (targetBtn === "fas fa-trash") {
      deleteEntry();
    }
  });
});

// -------------------------------------------- Function Edit Entry --------------------------------------------
function editEntry(targetID) {
  // deleteEntry(targetID);
  let targetType = ENTRY_LIST[targetID].type;
  let targetAmount = ENTRY_LIST[targetID].amount;
  let targetTitle = ENTRY_LIST[targetID].title;

  if (targetType === "income") {
    inputAmountIncome.value = targetAmount;
    inputTitleIncome.value = targetTitle;
  } else if (targetType === "expense") {
    inputAmountExpense.value = targetAmount;
    inputTitleExpense.value = targetTitle;
  }
  deleteEntry(targetID);
}
// -------------------------------------------- Function Remove Entry --------------------------------------------
function deleteEntry(targetID) {
  ENTRY_LIST.splice(targetID, 1);
  updateUI();
}
