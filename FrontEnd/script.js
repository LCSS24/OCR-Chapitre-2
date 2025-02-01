/* Récupération des catégories*/
async function fetchCategories() {
  try {

    const demande = await fetch("http://localhost:5678/api/categories");
    const reponse = await demande.json();
    return reponse;
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories : " + error);
  }
}

/* Récupération des travaux de Sophie Bluel*/
async function fetchWork() {
  try {
    const demande = await fetch("http://localhost:5678/api/works");
    const reponse = await demande.json();
    return reponse;
  } catch (error) {
    console.error("Erreur lors de la récupération des travaux : " + error);
  }
}

/* Ensuite, génération des éléments HTML des cards*/
function generateCards(items) {
  const gallery = document.querySelector(".gallery");
  // Création des éléments HTML
  items.forEach((item) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    const texte = document.createElement("figcaption");

    /* Définition des contenus des balises*/
    image.src = item.imageUrl;
    image.alt = item.title;
    texte.textContent = item.title;
    figure.id = item.categoryId;

    /* Affichage des cards*/
    gallery.appendChild(figure);
    figure.appendChild(image);
    figure.appendChild(texte);
  });
}

/* Génération des filtres de catégories*/
function generateCategories(categories) {
  let divmodifier = document.querySelector(".modifier");

  /* Création de la div "menu_filtres" et intégration dans le HTML*/
  const menu_filtres = document.createElement("div");
  divmodifier.insertAdjacentElement("afterend", menu_filtres);
  menu_filtres.classList.add("menu_filtres");

  /* Ajout du bouton de filtrage "Tous" */
  const filtre_tous = document.createElement("button");
  filtre_tous.textContent = "Tous";
  filtre_tous.id = "tous";
  menu_filtres.appendChild(filtre_tous);

  /* Génération des filtres*/
  categories.forEach((categorie) => {
    const filtre = document.createElement("button");

    /* Définition des contenus des balises*/
    filtre.textContent = categorie.name;
    filtre.id = categorie.id;

    /* Intégration des cards*/
    menu_filtres.appendChild(filtre);
  });
}

// Filtrage des travaux par catégorie
function filterWorks() {
  const menu_filtres = document.querySelector(".menu_filtres");
  const gallery = document.querySelector(".gallery")
  const figures = gallery.querySelectorAll("figure");

  menu_filtres.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const categoryId = button.id;
      
      figures.forEach(figure => {
        if (categoryId === "tous") {
          figure.style.display = "block";
        } else {
          figure.style.display = figure.id === categoryId
            ? "block" 
            : "none";
        }
      });
    });
  });
}

// MODE ADMINISTRATEUR //
// Fonction qui gère l'affichage des éléments disponibles seulement pour l'admin
function affichageAdmin() {
    document.querySelector(".modeedition").style.display = "flex"
    document.querySelector(".menu_filtres").style.display = "none"
    document.querySelector(".modifprojet").style.display = "block"

    // Changement du mot login en logout
    const logintxt = document.querySelector("li:nth-child(3) a")
    logintxt.textContent = "logout"

    // Deconnexion lors du logout
    logintxt.addEventListener("click", (event) => {
      event.preventDefault();
      sessionStorage.removeItem("token");
      window.location.href = "index.html"
    })
}

function affichageModale() {
  const modale = document.querySelector(".modale_fond")
  const btnmodale1 = document.querySelector(".modeedition p")
  const btnmodale2 = document.querySelector(".modifprojet")
  const btnsahah = [btnmodale1,btnmodale2]
  const gallery = document.querySelector(".gallerymodale")

  // Pour chaque bouton ("mode édition" et "modifier" a coté de Mes Projets), lors du click, afficher la modale
  btnsahah.forEach((bouton) => bouton.addEventListener("click", (event) => {
    modale.style.display = "flex"
  }))

  // Au click de la croix, la modale se ferme
  document.querySelector(".modale i").addEventListener("click", (event) => modale.style.display = "none")



}



/* Fonction main qui exécute toute les fonctions*/
async function main() {
  const works = await fetchWork();
  const categories = await fetchCategories();
  generateCards(works);
  generateCategories(categories);
  filterWorks();
  if (sessionStorage.getItem("token")) {
  affichageAdmin();
  affichageModale();
  }

}

// Lancement de la fonction main au chargement de la page
document.addEventListener("DOMContentLoaded", main);
