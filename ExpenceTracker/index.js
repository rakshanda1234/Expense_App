const expenseForm = document.getElementById("expense_from");

const expense_item_count = document.getElementById("expense_item_count");
let count = 1;
document.addEventListener("DOMContentLoaded", async () => {
  const expense_item_count = document.getElementById("expense_item_count");
  var body = document.getElementsByTagName("BODY")[0];
  const expense = document.getElementById("expense");
  const expense_from = document.getElementById("expense_from");

  console.log("dom loadeed");
  await axios.get("http://localhost:3000/expense/getexpense").then((data) => {
    console.log(data.data);
    data = data.data.expense;
    for (let i = 0; i < data.length; i++) {
      expense_item_count.innerHTML =
        expense_item_count.innerHTML +
        ` <div class="expense_item">
            <p>${count}</p>
            <p>${data[i].expenseamount}</p>
            <p>${data[i].description}</p>
            <p>${data[i].category}</p>
            <p>${data[i].createdAt}</p>
            <button class="delete">Delete</button>

        </div>`;
      count++;
    }
  });
});

expenseForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  expenseamount = e.target.expenseamount.value;
  description = e.target.description.value;
  category = e.target.category.value;
  axios
    .post("http://localhost:3000/expense/addexpense", {
      expenseamount,
      description,
      category,
    })
    .then((data) => {
      console.log(data);
      e.target.expenseamount.value = "";
      e.target.description.value = "";
      e.target.category.value = "";
      console.log(data.data.expense);
      data = data.data.expense;
      console.log(data.description);
      expense_item_count.innerHTML =
        expense_item_count.innerHTML +
        ` <div class="expense_item">
            <p>${count}</p>
            <p>${data.expenseamount}</p>
            <p>${data.description}</p>
            <p>${data.category}</p>
            <p>${data.createdAt}</p>`;
      count = count + 1;
    })
    .catch((err) => {
      console.log(err);
    });
});
