function forgotPass(event) {
  event.preventDefault();
  const email = event.target.email.value;

  const obj = {
    email,
  };
  console.log("1255");

  axios
    .post("http://localhost:3000/password/forgotpassword", obj)
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
}
