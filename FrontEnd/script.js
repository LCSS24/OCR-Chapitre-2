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
    figure.dataset.pbid = item.id;

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

function genGalleryModale(datas) {
  //Récupération de la galerie de la modale
  const gallerymodale = document.querySelector(".gallerymodale")

  //Génération des images et attribution des id à chaque work
  datas.forEach((data) => {
    const figure = document.createElement("figure")
    const image = document.createElement("img")
    const i = document.createElement("i")
 
    figure.classList.add("figimg")
    figure.id = data.id
    image.src = data.imageUrl
    i.classList.add("fa-solid", "fa-trash-can")
    i.dataset.poubelleid = data.id

    gallerymodale.appendChild(figure)
    figure.appendChild(image)
    figure.appendChild(i)

    //Au click sur la poubelle, stocker la valeur de l'id du work, la figure de la modale et celle de la section "mes projets"
    i.addEventListener("click", (e) => {
      const elementclicked = e.target.dataset.poubelleid
      const figure =e.target.closest("figure")
      const figurepage = document.querySelector(`.gallery figure[data-pbid="${elementclicked}"]`)

      //Appel de la fonction de suppression avec comme arguments les 3 données ci-dessus
      fetchDelete(elementclicked,figure,figurepage)
    })
  }
)

}

function affichageModale1(travaux) {
  const modalefond = document.querySelector(".modale_fond")
  const modale = document.querySelector(".modale")
  const btnmodale1 = document.querySelector(".modeedition p")
  const btnmodale2 = document.querySelector(".modifprojet")
  const btnslist = [btnmodale1,btnmodale2]


  // Pour chaque bouton ("mode édition" et "modifier" a coté de Mes Projets), lors du click, afficher la modale
  btnslist.forEach((bouton) => bouton.addEventListener("click", () => {
    modalefond.style.display = "flex"
  }))

  // Au click de la croix, la modale se ferme
  document.querySelector(".croix i").addEventListener("click", () => modalefond.style.display = "none")
  
  //Au click sur le fond, la modale se ferme
  modalefond.addEventListener("click", (e) => {
    if (e.target === modalefond & e.target !== modale) {
      modalefond.style.display = "none"
    }
  })

  //Appel de la fonction de génération des travaux dans la gallery modale
  genGalleryModale(travaux)

}

// Fonction de suppression des figures
async function fetchDelete(id,figmodale,figpage) {
  const reponse = await fetch("http://localhost:5678/api/works/"+id, {
    method: "DELETE",
    headers : {
      "Accept" : "*/*",
      "Authorization": `Bearer ${sessionStorage.getItem("token")}`
      }
  })

  if (!reponse.ok) {
    console.log("ca marche pas")
} else {
    figmodale.remove()
    figpage.remove()
}

}

function affichageModale2() {
  const boutonadd = document.getElementById("addphoto")
  const modale1 = document.getElementById("modale1")
  const modale2 = document.getElementById("modale2")
  const btnretour = document.getElementById("arrowback")
  const modalefond = document.querySelector(".modale_fond")

  // Au click de la croix, la modale se ferme
  document.getElementById("close").addEventListener("click", () => modalefond.style.display = "none")

  btnretour.addEventListener("click", () => {
    modale2.style.display = "none"
    modale1.style.display = "flex"
  })
  boutonadd.addEventListener("click",() => {
    // Modale 2 qui apparait
    modale1.style.display = "none"
    modale2.style.display = "flex"
    })

    ajouterPhoto()
}

function ajouterPhoto() {
  const inputfichier = document.getElementById("file")
  inputfichier.addEventListener("change", (file) => {
    let image = file.target.files[0]
    if (image.size > 4e+6) {
      console.log("Non")
    } else {
      let zoneadd = document.querySelector(".zoneadd")
      const img = document.createElement("img")
      zoneadd.appendChild(img)
    }
  })
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
    affichageModale1(works);
    affichageModale2()
  }

}

// Lancement de la fonction main au chargement de la page
document.addEventListener("DOMContentLoaded", main);
