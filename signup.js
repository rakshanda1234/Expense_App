const form = document.getElementById("my-signup");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  name = e.target.name.value;
  email = e.target.email.value;
  password = e.target.password.value;

  if (name == "" || email == "") {
    alert("fill all the fields");
  } else {
    axios
      .post("http://localhost:3000/user/signup", {
        name: name,
        email: email,
        password: password,
      })
      .then((res) => {
        console.log(res);
        alert(res.data.msg);
      });
  }
});
