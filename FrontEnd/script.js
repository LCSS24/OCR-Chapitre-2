/* Récupération des catégories*/
async function fetchCategories() {
  const demande = await fetch("http://localhost:5678/api/categories");
  const reponse = await demande.json();
  return reponse;
}

/* Récupération des travaux de Sophie Bluel*/
async function fetchWork() {
  const demande = await fetch("http://localhost:5678/api/works");
  const reponse = await demande.json();
  return reponse;
}

/* Ensuite, génération des éléments HTML des cards*/
fetchWork().then((genFig) => {
  for (let i = 0; i < genFig.length; i++) {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    const texte = document.createElement("figcaption");

    /* Définition des contenus des balises*/
    image.src = genFig[i].imageUrl;
    image.alt = genFig[i].title;
    texte.textContent = genFig[i].title;

    /* Affichage des cards*/
    let gallery = document.querySelector(".gallery");
    gallery.appendChild(figure);
    figure.appendChild(image);
    figure.appendChild(texte);
  }
});

/* Génération des filtres de catégories*/
fetchCategories().then((genCategories) => {
  let portfolioh2 = document.querySelector("#portfolio h2");

  /* Création de la div "menu_filtres" et intégration dans le HTML*/
  const menu_filtres = document.createElement("div");
  portfolioh2.insertAdjacentElement("afterend", menu_filtres);
  menu_filtres.classList.add("menu_filtres");

  /* Ajout du bouton de filtrage "Tous" */
  const filtre_tous = document.createElement("a");
  filtre_tous.href = "#";
  filtre_tous.textContent = "Tous";
  menu_filtres.appendChild(filtre_tous);

  /* Génération des filtres*/
  for (let i = 0; i < genCategories.length; i++) {
    const filtre = document.createElement("a");
    filtre.href = "#";

    /* Définition des contenus des balises*/
    filtre.textContent = genCategories[i].name;

    /* Intégration des cards*/
    menu_filtres.appendChild(filtre);
  }
});

/* Fonction reliant les filtres à leurs catégories en backend*/
