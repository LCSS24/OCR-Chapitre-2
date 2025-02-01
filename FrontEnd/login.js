async function formFetch() {
  const login = {
    email :  document.getElementById("email").value,
    password : document.getElementById("mdp").value
  };
    const reponse = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        email : login.email,
        password : login.password
      })
    })
      if (!reponse.ok) {
        const txterreur = document.getElementById("erreurmdp")
        txterreur.style.display = "block";
    } else{
      console.log(reponse)
      const objetToken = await reponse.json();
      sessionStorage.setItem("token",objetToken.token)
      location = "index.html"
    }
}
  
  //
  const form = document.querySelector("form")
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    formFetch(form);
  });