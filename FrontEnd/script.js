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
  let portfolioh2 = document.querySelector("#portfolio h2");

  /* Création de la div "menu_filtres" et intégration dans le HTML*/
  const menu_filtres = document.createElement("div");
  portfolioh2.insertAdjacentElement("afterend", menu_filtres);
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
function filterWorks(travaux) {
  const menu_filtres = document.querySelector(".menu_filtres");
  const gallery = document.querySelector(".gallery");
  const figures = document.querySelectorAll("figure");

  menu_filtres.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.id;

      //Filtrage des travaux en fonction de la catégorie
      const filteredWorks = category === "tous"
        ? travaux
        : travaux.filter((travail) => travail.categoryId == category);

      //Efface la gallery et la recrée
      gallery.innerHTML = "";
      generateCards(filteredWorks);

    })
  })
}

/* Fonction main qui exécute toute les fonctions*/
async function main() {
  const works = await fetchWork();
  const categories = await fetchCategories();
  generateCards(works);
  generateCategories(categories);
  filterWorks(works);
}

// Lancement de la fonction main au chargement de la page
document.addEventListener("DOMContentLoaded", main);
