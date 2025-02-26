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
  gallery.innerHTML = "";
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
    figure.dataset.pbid = item.id;

    /* Affichage des cards*/
    gallery.appendChild(figure);
    figure.appendChild(image);
    figure.appendChild(texte);
  });
}

/* Génération des filtres de catégories*/
function generateCategories(categories) {
  const divmodifier = document.querySelector(".modifier");

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
  const gallery = document.querySelector(".gallery");
  const figures = gallery.querySelectorAll("figure");

  // Pour chaque boutons filtre
  menu_filtres.querySelectorAll("button").forEach((button) => {
    //Ecouter le click
    button.addEventListener("click", () => {
      //Récuper l'id du bouton clické
      const categoryId = button.id;
      //Et pour chaque figure, comparer l'id à celui du bouton
      figures.forEach((figure) => {
        if (categoryId === "tous") {
          figure.style.display = "block";
        } else {
          figure.style.display = figure.id === categoryId ? "block" : "none";
        }
      });
    });
  });
}

// MODE ADMINISTRATEUR //
async function fetchPhoto(photo, titre, categorie) {
  const token = sessionStorage.getItem("token");
  const formData = new FormData();
  formData.append("image", photo);
  formData.append("title", titre);
  formData.append("category", categorie);
  const reponse = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + token,
    },
    body: formData,
  });
  const data = await reponse.json();

  if (reponse.ok) {
    const works = await fetchWork();
    const categorie = await fetchCategories();
    const modale2 = document.getElementById("modale2");

    genGalleryModale(works);
    generateCards(works);
    modale2.innerHTML = htmlmodale2;
    affichageModale2(categorie);
  }
}

// Fonction qui gère l'affichage des éléments disponibles seulement pour l'admin
function affichageAdmin() {
  document.querySelector(".modeedition").style.display = "flex";
  document.querySelector(".menu_filtres").style.display = "none";
  document.querySelector(".modifprojet").style.display = "block";

  // Changement du mot login en logout
  const logintxt = document.querySelector("li:nth-child(3) a");
  logintxt.textContent = "logout";

  // Deconnexion lors du logout
  logintxt.addEventListener("click", (event) => {
    event.preventDefault();
    sessionStorage.removeItem("token");
    window.location.href = "index.html";
  });
}

function genGalleryModale(datas) {
  //Récupération de la galerie de la modale
  const gallerymodale = document.querySelector(".gallerymodale");
  gallerymodale.innerHTML = "";
  //Génération des images et attribution des id à chaque work
  datas.forEach((data) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    const i = document.createElement("i");

    figure.classList.add("figimg");
    figure.id = data.id;
    image.src = data.imageUrl;
    i.classList.add("fa-solid", "fa-trash-can");
    i.dataset.poubelleid = data.id;

    gallerymodale.appendChild(figure);
    figure.appendChild(image);
    figure.appendChild(i);

    //Au click sur la poubelle, stocker la valeur de l'id du work, la figure de la modale et celle de la section "mes projets"
    i.addEventListener("click", (e) => {
      const elementclicked = e.target.dataset.poubelleid;
      const figure = e.target.closest("figure");
      const figurepage = document.querySelector(
        `.gallery figure[data-pbid="${elementclicked}"]`
      );

      //Appel de la fonction de suppression avec comme arguments les 3 données ci-dessus
      fetchDelete(elementclicked, figure, figurepage);
    });
  });
}

function affichageModale1(travaux) {
  const modalefond = document.querySelector(".modale_fond");
  const modale = document.querySelector("modale");
  const btnmodale1 = document.querySelector(".modeedition p");
  const btnmodale2 = document.querySelector(".modifprojet");
  const btnslist = [btnmodale1, btnmodale2];

  // Pour chaque bouton ("mode édition" et "modifier" a coté de Mes Projets), lors du click, afficher la modale
  btnslist.forEach((bouton) =>
    bouton.addEventListener("click", () => {
      modalefond.style.display = "flex";
    })
  );

  // Au click de la croix, la modale se ferme
  document
    .querySelector(".croix i")
    .addEventListener("click", () => (modalefond.style.display = "none"));

  //Au click sur le fond, la modale se ferme
  modalefond.addEventListener("click", (e) => {
    if ((e.target === modalefond) & (e.target !== modale)) {
      modalefond.style.display = "none";
    }
  });

  //Appel de la fonction de génération des travaux dans la gallery modale
  genGalleryModale(travaux);
}
// Fonction de suppression des figures
async function fetchDelete(id, figmodale, figpage) {
  const reponse = await fetch("http://localhost:5678/api/works/" + id, {
    method: "DELETE",
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  });

  if (reponse.ok) {
    figmodale.remove();
    figpage.remove();
  }
}

function affichageModale2(categories) {
  const boutonadd = document.getElementById("addphoto");
  const modale1 = document.getElementById("modale1");
  const modale2 = document.getElementById("modale2");
  const btnretour = document.getElementById("arrowback");
  const modalefond = document.querySelector(".modale_fond");
  // modale2.innerHTML = ""
  // Au click de la croix, la modale se ferme
  document
    .getElementById("close")
    .addEventListener("click", () => (modalefond.style.display = "none"));

  btnretour.addEventListener("click", () => {
    modale2.style.display = "none";
    modale1.style.display = "flex";
  });

  boutonadd.addEventListener("click", () => {
    // Modale 2 qui apparait
    modale1.style.display = "none";
    modale2.style.display = "flex";
  });

  categories.forEach((categorie) => {
    const option = document.createElement("option");
    const listeselection = document.getElementById("categories");

    option.value = categorie.id;
    option.text = categorie.name;

    listeselection.appendChild(option);
  });
  ajouterPhoto();
  formchecker();
}

function ajouterPhoto() {
  const inputfichier = document.getElementById("file");

  //Ecouter l'input, si un fichier est chargé...
  inputfichier.addEventListener("change", () => {
    //Récupération du fichier
    const image = inputfichier.files[0];
    //Création d'un url temporaire
    const imageURL = URL.createObjectURL(image);
    //Création de l'image et récupération de la zone où celle ci sera affichée
    const zoneadd = document.querySelector(".zoneadd");
    const img = document.createElement("img");
    //Définition des formats valides
    const typeOk = ["image/jpeg", "image/png", "image/jpg"];
    //Récupération du message d'erreur
    const erreurfile = document.querySelector(".zoneadd p");

    //Si l'image n'est pas trop lourde (+ de 4mo)
    if (image.size >= 4 * 1024 * 1024) {
      erreurfile.textContent = "Le fichier est trop lourd (4mo)";
      erreurfile.style.color = "rgb(255, 91, 91)";
      zoneadd.appendChild(erreurfile);
      //Si l'image n'est pas au format demandé
    } else if (!typeOk.includes(image.type)) {
      erreurfile.textContent =
        "Le type de fichier n'est pas valide (png,jpg,jpeg)";
      erreurfile.style.color = "rgb(255, 91, 91)";
      //Vidage de la zoneadd et affichage de l'image
    } else {
      zoneadd.innerHTML = "";
      img.src = imageURL;
      img.classList.add("imgload");
      zoneadd.appendChild(img);
    }
  });
}

function formchecker() {
  const btnvalider = document.getElementById("valider");
  const erreurform = document.querySelector(".erreurslctn");
  const fileInput = document.getElementById("file");
  const champTitre = document.getElementById("titre");
  const champCategorie = document.getElementById("categories");

  //Fonction modifiant l'apparence du bouton d'envoi selon la complétion du formulaire
  function checkForm() {
    const file = fileInput.files[0];
    const titre = champTitre.value;
    const categorie = champCategorie.value;

    //Si le fichier est chargé, que le titre n'est pas vide et qu'une des catégorie est selectionnée alors true
    const isFormValid = !!(file && titre.trim() && categorie !== "");
    if (isFormValid) {
      btnvalider.style.backgroundColor = "#1d6154";
      erreurform.style.display = "none";
    } else {
      btnvalider.style.backgroundColor = "#a7a7a7";
    }
    return isFormValid;
  }

  //Ecoute des champs du formulaire, à chaque changement, appelle la fonction de vérification
  champTitre.addEventListener("input", checkForm);
  champCategorie.addEventListener("change", checkForm);
  fileInput.addEventListener("change", checkForm);

  //Au click sur le bouton valider...
  btnvalider.addEventListener("click", () => {
    //Si true, alors envoi des données via la fonction fetchPhoto
    if (checkForm()) {
      const photo = document.getElementById("file").files[0];
      const titre = champTitre.value;
      const categorie = champCategorie.value;
      fetchPhoto(photo, titre, categorie);
      //Sinon, message d'erreur
    } else {
      erreurform.style.display = "block";
    }
  });
}

/* Fonction main qui exécute toute les fonctions*/
async function main() {
  //Vide la modale 2, puis la copie au chargement de la page, utile pour recharger la modale lors de l'upload d'une photo
  htmlmodale2 = "";
  htmlmodale2 = document.getElementById("modale2").innerHTML;
  const works = await fetchWork();
  const categories = await fetchCategories();
  generateCards(works);
  generateCategories(categories);
  filterWorks();
  if (sessionStorage.getItem("token")) {
    affichageAdmin();
    affichageModale1(works);
    affichageModale2(categories);
  }
}

// Lancement de la fonction main au chargement de la page
document.addEventListener("DOMContentLoaded", main);
