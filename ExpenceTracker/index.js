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
                                            <button class="del",onclick="deleteUser('${user.id}')">Delete</button>
                                            <button class="edt", onclick="editUser('${user.id}','${user.description}','${user.expenseamount}','${user.category}')">Edit</button>
                                           
                                         </li>
                                        `;

  parentNode.innerHTML += createNewUserHtml;

  document.getElementById("description").value = "";
  document.getElementById("expenseamount").value = "";
  document.getElementById("category").value = "";
}

// function showPremiumuserMessage() {
//   document.getElementById("premium").style.visibility = "hidden";
//   document.getElementById("message").innerHTML = "You are a premium user ";
// }

// function parseJwt(token) {
//   var base64Url = token.split(".")[1];
//   var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//   var jsonPayload = decodeURIComponent(
//     window
//       .atob(base64)
//       .split("")
//       .map(function (c) {
//         return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
//       })
//       .join("")
//   );

//   return JSON.parse(jsonPayload);
// }

window.addEventListener("DOMContentLoaded", (event) => {
  const token = localStorage.getItem("token");
  // const decodeToken = parseJwt(token);
  // console.log(decodeToken);
  // const ispremiumuser = decodeToken.ispremiumuser;
  // if (ispremiumuser) {
  //   showPremiumuserMessage();
  //   getPremiumLeaderboard();
  // }
  axios
    .get("http://localhost:3000/user/getExpenses", {
      headers: { Authorization: token },
    })
    .then((response) => {
      console.log(response.data.data[0]);

      checkIfPremiumUser();
      for (let i = 0; i < response.data.data.length; i++) {
        showListofRegisteredExpenses(response.data.data[i]);
      }
    })
    .catch((err) => console.log(err));
});

function checkIfPremiumUser() {
  let userType = localStorage.getItem("user");
  if (userType == "true") {
    premiumUser();
    // showPremiumuserMessage;
    getPremiumLeaderboard();
  }
}

function deleteUser(userId) {
  const token = localStorage.getItem("token");

  axios
    // .delete(`http://localhost:3000/user/deleteExpense/${userId}`, {
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

// document.getElementById("rzp-button1").onclick = async function payment(e) {
async function payment(e) {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    "http://localhost:3000/purchase/premiummembership",
    { headers: { Authorization: token } }
  );
  console.log(response);

  var options = {
    key: response.data.key_id, //Enter the key ID generated from the Dashboard

    name: "Test Company",
    order_id: response.data.order.id, //for one time payment
    prefill: {
      name: "Test User",
      email: "test.user@example.com",
      contact: "9823634119",
    },
    theme: {
      color: "#3399cc",
    },
    //This handler function will handle the success payment
    handler: function (response) {
      console.log(response);
      axios
        .post(
          "http://localhost:3000/purchase/updatetransactionstatus",
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          { headers: { Authorization: token } }
        )
        .then(() => {
          localStorage.setItem("user", true);
          premiumUser();
          // showPremiumuserMessage;

          getPremiumLeaderboard();
          alert("You are a Premium User Now");
        })
        .catch(() => {
          alert("Something went wrong. Try Again!!!");
        });
    },
  };

  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on("payment.failed", function (response) {
    alert("Something went wrong");
    alert(response.error.code);
    alert(response.error.description);
    alert(response.error.source);
    alert(response.error.step);
    alert(response.error.reason);
    alert(response.error.metadata.order_id);
    alert(response.error.metadata.payment_id);
  });
}

function premiumUser() {
  const premium = document.getElementById("premium");
  premium.innerHTML = "Its Premium Account";
  document.body.classList.remove("light");
  document.body.classList.add("dark");
  document.getElementsByClassName("center")[0].classList.remove("light");
  document.getElementsByClassName("center")[0].classList.add("dark");
  document.getElementById("left").classList.remove("light");
  document.getElementById("left").classList.add("dark");
  document.getElementsByTagName("input")[0].classList.add("dark");
  document.getElementById("right").style = "display:block";
}
async function getPremiumLeaderboard() {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get("http://localhost:3000/expense/premiums", {
      headers: { Authorization: token },
    });

    if (response.data.success) {
      console.log(response);
      if (response.data.data.length > 0) {
        response.data.data.sort((a, b) => {
          return a.totalExpense - b.totalExpense;
        });
        console.log(response.data.data[0].user.username);
        console.log(response.data.data[0].user);

        response.data.data.map((user, id) => {
          //transform each element of an array and create a new array out of the argument which
          console.log(id); //we are passing
          showLeaderboard(user, id);
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
}

function showLeaderboard(user, id) {
  console.log(id, user);
  // console.log(user);
  const leaderboardDiv = document.getElementById("right");
  let child = `<li class="leaderboardList">
                    <p class="sno">${id + 1} </p>
                    <p class="name" id="user" onclick="openUserExpenses('${
                      user.user.id
                    }')">${user.user.name}</p>
                    <p class="name">${user.totalExpense}</p>
            </li>`;

  leaderboardDiv.innerHTML += child;
}

function openUserExpenses(user) {
  //yet to be completed
  //if clicked gets detailed payment of individual users
  //which makes  a post req to the user id another route
  // let response = await axios.post('http://localhost:3000/expense/leaderboard-user'
}
