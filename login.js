function login(e) {
  e.preventDefault();
  console.log(e.target.name);

  const loginDetails = {
    email: e.target.email.value,
    password: e.target.password.value,
  };

  console.log(loginDetails);
  axios
    .post("http://localhost:3000/user/login", loginDetails)
    .then((response) => {
      alert(response.data.message);
      window.location.href = "./ExpenceTracker/index.html";

      console.log(response.data);
    })
    .catch((err) => {
      console.log(JSON.stringify(err));
      document.body.innerHTML += `<div style="color:red;">${err.message} <div>`;
    });
}
