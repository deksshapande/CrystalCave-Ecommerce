const authSection =
  document.getElementById("auth-section");

const username =
  localStorage.getItem("username");


if(authSection){

  if(username){

    authSection.innerHTML = `

      <span class="user-name">
        Hi, ${username} 🌸
      </span>

      <button
        class="logout-btn"
        onclick="logoutUser()"
      >
        Logout
      </button>

    `;

  }

  else {

    authSection.innerHTML = `

      <a href="login.html">
        Login
      </a>

      <a href="signup.html">
        Signup
      </a>

    `;

  }

}


function logoutUser(){

  localStorage.removeItem("token");

  localStorage.removeItem("username");

  window.location.href =
    "login.html";

}