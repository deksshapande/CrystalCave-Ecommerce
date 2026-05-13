document
.getElementById("signupBtn")
.addEventListener("click", async () => {

  const username =
    document
    .getElementById("signupUsername")
    .value
    .trim();

  const email =
    document
    .getElementById("signupEmail")
    .value
    .trim();

  const password =
    document
    .getElementById("signupPassword")
    .value
    .trim();


  if(
    !username ||
    !email ||
    !password
  ){

    alert("Fill all fields ❌");

    return;

  }

  try {

    const res = await fetch(

      "http://localhost:5000/api/auth/signup",

      {

        method: "POST",

        headers: {

          "Content-Type":
          "application/json"

        },

        body: JSON.stringify({

          username,

          email,

          password

        })

      }

    );

    const data = await res.json();

    if(data.success){

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "username",
        data.username
      );

      alert("Signup successful 🌸");

      window.location.href =
        "index.html";

    }

    else {

      alert(data.message);

    }

  }

  catch(err){

    console.error(err);

    alert("Signup failed ❌");

  }

});