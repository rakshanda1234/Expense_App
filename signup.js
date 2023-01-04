const form = document.getElementById("my-signup");

// form.addEventListener("submit", (e) => {
function signUp(e) {
  e.preventDefault();

  name = e.target.name.value;
  email = e.target.email.value;
  password = e.target.password.value;

  const obj = {
    name,
    email,
    password,
  };

  // if (name == "" || email == "") {
  //   alert("fill all the fields");
  // } else {
  axios
    .post("http://localhost:3000/user/signup", obj)
    .then((response) => {
      console.log(response);
      if (response.status === 201) {
        // window.location.href = "./login.html";
        console.log("sign up complete");
      } else if (response.status === 207) {
        showExistingUser(response.data.message);
        //exist.innerText = '';
        //exist.innerText = `<h2>${response.data.newUserDetail}</h2>`
      } else {
        throw new Error("Error failed to login");
      }

      //showListofRegisteredUser(response.data.newUserDetail)
      //console.log(response)
    })
    .catch((err) => {
      console.log(err);
    });
  // }
  function showExistingUser(user) {
    // console.log(user);
    //   const show = user.newUserDetail;
    const parentNode = document.getElementById("listOfUsers");
    const createNewUserHtml = `<li >${user} 
                                                 </li> `;

    parentNode.innerHTML += createNewUserHtml;
  }
}
