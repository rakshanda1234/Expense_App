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
      console.log("hi");
      if (response.status === 202) {
        document.body.innerHTML +=
          '<div style="color:blue;">Mail Successfuly sent <div>';
      } else {
        throw new Error("Something went wrong!!!");
      }
    })
    .catch((err) => {
      document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    });
}
