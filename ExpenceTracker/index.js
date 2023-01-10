function saveToStorage(event) {
  event.preventDefault();
  const expenseamount = event.target.expenseamount.value;
  const description = event.target.description.value;
  const category = event.target.category.value;

  const token = localStorage.getItem("token");

  const obj = {
    expenseamount,
    description,
    category,
  };
  axios
    // .post("http://localhost:3000/expense/addExpense", obj, {
    //   headers: { Authorization: token },
    .post("http://localhost:3000/user/addExpense", obj, {
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
    // .get("http://localhost:3000/expense/getExpenses", {
    //   headers: { Authorization: token },
    .get("http://localhost:3000/user/getExpenses", {
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
    // .delete(`http://localhost:3000/expense/deleteExpense/${userId}`, {
    //   headers: { Authorization: token },
    .delete(`http://localhost:3000/user/deleteExpense/${userId}`, {
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

document.getElementById("rzp-button1").onclick = async function payment(event) {
  // async function payment(e) {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    "http://localhost:3000/purchase/premiummembership",
    { headers: { Authorization: token } }
  );
  console.log(response);

  var options = {
    key: response.data.key_id, //Enter the key ID generated from the Dashboard

    name: "Test Company",
    order_id: response.data.order.id,
    prefill: {
      name: "Test User",
      email: "test.user@example.com",
      contact: "9823634119",
    },
    theme: {
      color: "#3399cc",
    },
    //This handle function will handle the success payment
    " handler": function (response) {
      console.log(response);
      axios
        .post(
          "http://localhost:3000/purchase/updatetransactionstatus",
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          {
            headers: { Authorization: token },
          }
        )
        .then(() => {
          alert("You are a Premium User Now");
        })
        .catch(() => {
          alert("Something went wrong.Try Again!!!");
        });
    },
  };

  const rzp1 = new Razorpay(options);
  rzp1.open();
  event.preventDefault();

  rzp1.on("payment.failed", function (response) {
    alert(response.error.code);
    alert(response.error.description);
    alert(response.error.source);
    alert(response.error.step);
    alert(response.error.reason);
    alert(response.error.metadata.order_id);
    alert(response.error.metadata.payment_id);
  });
};
