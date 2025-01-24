async function fetchToken() {
    try {
      const demande = await fetch("http://localhost:5678/api/users/login");
      const reponse = await demande.json();
      console.log(reponse);
      return reponse;
    } catch (error) {
      console.error("Erreur lors de la récupération des login : " + error);
    }
  }


  async function main() {
    const token = await fetchToken();
    console.log(token)
  }
  
  // Lancement de la fonction main au chargement de la page
  document.addEventListener("DOMContentLoaded", main);