function saveToStorage(e) {
  e.preventDefault();
  const expenseamount = e.target.expenseamount.value;
  const description = e.target.description.value;
  const category = e.target.category.value;

  const token = localStorage.getItem("token");

  const obj = {
    expenseamount,
    description,
    category,
  };
  axios
    .post("http://localhost:3000/expense/addExpense", obj, {
      headers: { Authorization: token },
    })
    .then((response) => {
      console.log(response);

      showListofRegisteredExpenses(response.data.newExpenseDetail);
    })
    .catch((err) => {
      console.log(err);
    });

  //clear inout fields
  document.getElementById("description").value = "";
  document.getElementById("expenseamount").value = "";
  document.getElementById("category").value = "";
}
function showListofRegisteredExpenses(user) {
  const parentNode = document.getElementById("listofExpenses");
  const createNewUserHtml = `<li id=${user.id}>${user.expenseamount} - ${user.description} - ${user.category} 
                                            <button onclick="deleteUser('${user.id}')">Delete</button>
                                            <button onclick="editUser('${user.id}','${user.description}','${user.expenseamount}','${user.category}')">Edit</button>
                                           
                                         </li>
                                        `;

  parentNode.innerHTML += createNewUserHtml;

  document.getElementById("description").value = "";
  document.getElementById("expenseamount").value = "";
  document.getElementById("category").value = "";
}

window.addEventListener("DOMContentLoaded", (event) => {
  const token = localStorage.getItem("token");
  axios
    .get("http://localhost:3000/expense/getExpenses", {
      headers: { Authorization: token },
    })
    .then((response) => {
      console.log(response.data.data[0]);
      for (let i = 0; i < response.data.data.length; i++) {
        showListofRegisteredExpenses(response.data.data[i]);
      }
    })
    .catch((err) => console.log(err));
});
function deleteUser(userId) {
  const token = localStorage.getItem("token");

  axios
    .delete(`http://localhost:3000/expense/deleteExpense/${userId}`, {
      headers: { Authorization: token },
    })
    .then((response) => {
      removeItemFromScreen(userId);
    })
    .catch((err) => {
      console.log(err);
    });
}
function editUser(userId, expenseDescription, expenseAmount, expenseCategory) {
  document.getElementById("description").value = expenseDescription;
  document.getElementById("expenseamount").value = expenseAmount;
  document.getElementById("category").value = expenseCategory;
  deleteUser(userId);
}

function removeItemFromScreen(userId) {
  const parentNode = document.getElementById("listOfExpenses");
  const elem = document.getElementById(userId);
  parentNode.removeChild(elem);
}
