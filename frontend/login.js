document
.getElementById("loginBtn")
.addEventListener("click", async () => {

  const email =
    document
    .getElementById("loginEmail")
    .value
    .trim();

  const password =
    document
    .getElementById("loginPassword")
    .value
    .trim();

  if(
    !email ||
    !password
  ){

    alert("Fill all fields ❌");

    return;

  }

  try {

    const res = await fetch(

      "https://crystalcave-backend.onrender.com/api/auth/login",

      {

        method: "POST",

        headers: {

          "Content-Type":
          "application/json"

        },

        body: JSON.stringify({

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

      localStorage.setItem(
        "role",
        data.role
      );

      alert("Login successful 🌸");

      window.location.href =
        "index.html";

    }

    else {

      alert(data.message);

    }

  }

  catch(err){

    console.error(err);

    alert("Login failed ❌");

  }

});