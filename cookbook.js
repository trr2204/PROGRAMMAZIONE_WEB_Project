/*
    Gestisce il ricettario, le varie note salvate, i preferiti,
    attraverso le varie pagine web.
*/

const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");
//page è definito in auth
//--- RECIPE --
if (page.includes("recipe.html")) {
    const noteInput = document.getElementById("privateNoteInput");
    const saveNoteButton = document.getElementById("saveNoteButton");
    const difficultySlider = document.getElementById("difficultySlider");
    const tasteSlider = document.getElementById("tasteSlider");
    const preparationDate = document.getElementById("preparationDate");
    const userRecipes = JSON.parse(localStorage.getItem("userRecipes")) || [];
    const loggedUser = localStorage.getItem("loggedUser");
    const favoritesButton = document.getElementById("favoritesButton");



    //All'apertura della pagina, posiziona la barra sulla media dei voti
    let difficulty = 0.0;
    let difficultyCounter = 0;
    let taste = 0.0;
    let tasteCounter = 0;    

    //Per farlo, recupera dal database tutti i movimenti di questa ricetta
    const thisRecipe = userRecipes.filter((recipe) => {
        return recipeId == recipe.recipeId;
    });
    /*Calcola la media: ottiene somma del valore dei voti, e il numero di voti
        non vuoti*/
    thisRecipe.forEach((recipe) => {
        if (recipe.difficulty != null) {
            difficulty += Number(recipe.difficulty);
            difficultyCounter++;
        }
        if (recipe.taste != null) {
            taste += Number(recipe.taste);
            tasteCounter++;
        }
    })

    //Ottengo le medie delle recensioni
    if (difficultyCounter > 0) {
        difficulty /= difficultyCounter;
    }
    if (tasteCounter > 0) {
        taste /= tasteCounter;
    }

    //Imposta gli slider con il valore della media
    difficultySlider.value = difficulty;
    tasteSlider.value = taste;
    document.getElementById("reviewCounter").textContent = difficultyCounter;


    //Imposta le label per riflettere sempre il valore della barra
    const difficultyLabel =
        document.getElementById("difficultyLabel");
    difficultyLabel.textContent = difficultySlider.value;

    difficultySlider.addEventListener("input", function() {
        difficultyLabel.textContent = difficultySlider.value;
    });

    const tasteLabel = document.getElementById("tasteLabel");
    tasteLabel.textContent = tasteSlider.value;


    tasteSlider.addEventListener("input", function() {
        tasteLabel.textContent = tasteSlider.value;
    });    

    //Imposta il campo della data con la data di preparazione:
    const existingRecipe =
        userRecipes.find(recipe =>
        recipe.username == loggedUser &&
        recipe.recipeId == recipeId
    );
    preparationDate.value = existingRecipe?.date || "";

    /* All'apertura della pagina, controlla se la ricetta fa parte dei preferiti.
        Se si: il cuore è pieno. Se no: il cuore è vuoto.
    */

    function changeHeart() {
        const userRecipes = JSON.parse(localStorage.getItem("userRecipes")) || [];
        const thisRecipe = userRecipes.filter((recipe) => {
            return recipeId == recipe.recipeId;
        });
        //Se user non esiste nel database, automaticamente è falso
        const isFavourite = thisRecipe.find(recipe => {
            return recipe.username == loggedUser;
        })?.favorite ?? false;

        if (isFavourite) {
            document.getElementById("favoritesButton").innerHTML = `<i class="fa-solid fa-heart"></i>`;
            console.log(isFavourite);
        } else {
            document.getElementById("favoritesButton").innerHTML = `<i class="fa-regular fa-heart"></i>`;
            console.log(isFavourite);

        }
    }
    changeHeart();


    //Tasto "Lascia una recensione"
    const leaveReviewButton = document.getElementById("leaveReviewButton");
    leaveReviewButton.addEventListener("click", function() {
        if ((difficultySlider.value != "0.0") && (tasteSlider.value != "0.0") && (preparationDate.value != "")) {
            const existingRecipe =
                userRecipes.find(recipe =>
                recipe.username == loggedUser &&
                recipe.recipeId == recipeId
            );

            if (existingRecipe) {
                existingRecipe.difficulty = difficultySlider.value;
                existingRecipe.taste = tasteSlider.value
                existingRecipe.date = preparationDate.value;
            } else {
                userRecipes.push({
                    username: loggedUser,
                    recipeId: recipeId,
                    recipeName: strMeal.innerHTML,    //dichiarato in api.js
                    recipeThumb: strMealThumb.src, //dichiarato in api.js
                    difficulty: difficultySlider.value,
                    taste: tasteSlider.value,
                    privateNote: null,
                    favorite: false,
                    date: preparationDate.value
                });
            }

            localStorage.setItem(
                "userRecipes",
                JSON.stringify(userRecipes)
            );
            //ricarica la pagina per aggiornare il numero di voti
            location.reload();
        } else {
            const reviewError = document.getElementById("reviewError");
            reviewError.innerHTML = "DEVI COMPILARE TUTTI I CAMPI"
        }
    });
    
    //Se c'è una recensione, compare il tasto per rimuoverla
    if (existingRecipe) {
        //Costante vera se esiste la recensione, falsa altrimenti
        const existingReview =
            existingRecipe.difficulty != null &&
            existingRecipe.taste != null &&
            existingRecipe.date != "";

        //Se la recesione esiste...
        if (existingReview) {
            leaveReviewButton.textContent = "Modifica recensione";
            leaveReviewButton.disabled = true;  //Disabilitato: si attiva se l'utente cambia uno dei parametri
        
            //Se esiste, crea il tasto per eliminare la recensione e lo inserisce
            const removeReviewButton = document.createElement("button");
            removeReviewButton.id = "removeReviewButton";
            removeReviewButton.classList.add("redButton");
            removeReviewButton.innerHTML = `<i class="fa-solid fa-xmark"></i> Elimina recensione`;
            removeReviewButton.addEventListener("click", function() {
                existingRecipe.difficulty = null;
                existingRecipe.taste = null;
                existingRecipe.date = "";
                localStorage.setItem("userRecipes", JSON.stringify(userRecipes));
                //Ricarica la pagina per aggiornare il numero di voti
                location.reload();
            })

            //Se l'utente modifica i campi, il tasto modifica si deve abilitare
            document.getElementById("difficultySlider").addEventListener("change", function() {
                leaveReviewButton.disabled=false;
            });
            document.getElementById("tasteSlider").addEventListener("change", function() {
                leaveReviewButton.disabled=false;
            })
            document.getElementById("preparationDate").addEventListener("change", function() {
                leaveReviewButton.disabled=false;
            })

            leaveReviewButton.after(removeReviewButton) //Aggiunge il tasto elimina dopo quello per modificarla 

        } else {
            //Se non esiste la recensione, il tasto si chiama "aggiungi" e, rimuove quello per eliminarla 
            leaveReviewButton.textContent = "Aggiungi una recensione";
            if (document.getElementById("removeReviewButton")) {
                document.getElementById("removeReviewButton").remove();
            }
        }

    } else {
        //Se l'utente non ha mai interagito con la ricetta
        leaveReviewButton.textContent = "Aggiungi una recensione";
        if (document.getElementById("removeReviewButton")) {
            document.getElementById("removeReviewButton").remove();
        }
    }

    //All'apertura della pagina, se l'utente ha lasciato una nota, la riempie
    if (existingRecipe) {
        noteInput.value = existingRecipe.privateNote;
    }
    //Il tasto è disabilitato finché l'utente non scrive una nota
    //e notifica che si può salvare di nuovo
    saveNoteButton.disabled = true;
    noteInput.addEventListener("keydown", function() {
        saveNoteButton.disabled = false;
        saveNoteButton.innerHTML = "Salva nota"
    })


    //Tasto che salva la nota nel database, se esiste già la sovrascrive
    saveNoteButton.addEventListener("click", function() {
        const userRecipes = JSON.parse(localStorage.getItem("userRecipes")) || [];
        const loggedUser = localStorage.getItem("loggedUser");
        const note = noteInput.value;
        const existingRecipe =
            userRecipes.find(recipe =>
                recipe.username == loggedUser &&
                recipe.recipeId == recipeId
            );
        
        //Se la nota esiste già, la aggiorna
        if (existingRecipe) {
            existingRecipe.privateNote = note;

        //Se non esiste, la inserisce
        } else {
            userRecipes.push({
                username: loggedUser,
                recipeId: recipeId,
                recipeName: strMeal.innerHTML,    //dichiarato in api.js
                recipeThumb: strMealThumb.src, //dichiarato in api.js
                difficulty: null,
                taste: null,
                privateNote: note,
                favorite: false,
                date: ""
            });

        }

        localStorage.setItem(
            "userRecipes",
            JSON.stringify(userRecipes)
        );
        //Disabilita il tasto e notifica che la nota è stata salvata
        saveNoteButton.disabled = true;
        saveNoteButton.innerHTML = "Salvato"


    });

//    --GESTISCE L'AGGIUNTA AL RICETTARIO--
    favoritesButton.addEventListener("click", function() {
        const userRecipes = JSON.parse(localStorage.getItem("userRecipes")) || [];
        const loggedUser = localStorage.getItem("loggedUser");

        const existingRecipe =
        userRecipes.find(recipe =>
            recipe.username == loggedUser &&
            recipe.recipeId == recipeId
        );

        if (existingRecipe) {
            existingRecipe.favorite = !existingRecipe.favorite;
        } else {
            userRecipes.push({
                username: loggedUser,
                recipeId: recipeId,
                recipeName: strMeal.innerHTML,    //dichiarato in api.js
                recipeThumb: strMealThumb.src, //dichiarato in api.js
                difficulty: null,
                taste: null,
                privateNote: "",
                favorite: true,
                date: ""
            });
        }

        localStorage.setItem(
            "userRecipes",
            JSON.stringify(userRecipes)
        );
        changeHeart();
    });
    
} else if (page.includes("cookbook.html")) {

    const userRecipes = JSON.parse(localStorage.getItem("userRecipes")) || [];

    const loggedUser = localStorage.getItem("loggedUser");

    const favorites = userRecipes.filter(
        e => (e.username == loggedUser) && (e.favorite == true)
    )
    
    const favoritesTable = document.getElementById("favoritesTable");

    if (favorites.length > 0) {
        favoritesTable.innerHTML = "";    
    }


    favorites.forEach(e => {
        const card = document.createElement("div");
        const imageTd = document.createElement("div");
        const dataTd = document.createElement("div");

        card.classList.add("card");


        //aggiunge l'immagine in tabella
        const img = document.createElement("img");
        img.src = e.recipeThumb;
        imageTd.appendChild(img);
        card.appendChild(imageTd);

        //aggiunge un campo descrizione con nome ricetta, nota aggiunta,
        //il tasto per rimuovere dai preferiti, eventuale voto dato
        dataTd.innerHTML = `<h1>${e.recipeName}</h1><br>`
        if (e.privateNote) {
            dataTd.innerHTML += `<b>NOTE</b><br><span>${e.privateNote}</span><br><br>`
        }

            //se esiste una recensione fatta da te, mostra le barre
            if ((e.difficulty != null) && (e.date != "") && (e.taste != null)) {
                
                dataTd.innerHTML += `
                    <b>Hai recensito</b><br><br>
                    <div class="infoCard difficultyBg">

                        <div class="iconBox difficulty"><i class="fa-solid fa-fire"></i></div>
                        <div class="infoText">
                            <b>Difficoltà</b>
                        </div>

                        <input type="range" min="1" max="5" step="0.1" disabled value="${e.difficulty}">
                        <b class="vote">${e.difficulty}</b>

                    </div>

                    

                    <div class="infoCard tasteBg">

                        <div class="iconBox taste"><i class="fa-solid fa-star"></i></div>

                        <div class="infoText">
                            <b>Gusto</b>
                        </div>

                        <input type="range" min="1" max="5" step="0.1" disabled value="${e.taste}">

                        <b class="vote">${e.taste}</b>

                    </div>

                    <div class="infoCard dateBg">

                        <div class="iconBox date"><i class="fa-solid fa-calendar"></i></div>

                        <div class="infoText">
                            <b>Preparato il</b>
                            <b>${e.date}</b>
                        </div>

                    </div>
                `;
            }

        //Tasto rimuovi dai preferiti del ricettario
        const removeFavoritesButton = document.createElement("button");
        removeFavoritesButton.id = "removeFavoritesButton";
        removeFavoritesButton.classList.add("button");
        removeFavoritesButton.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
        removeFavoritesButton.addEventListener("click", function(event) {
            event.stopPropagation();
            event.preventDefault(); //previene su mobile lo zoom della card
            e.favorite = false;
            localStorage.setItem(
                "userRecipes",
                JSON.stringify(userRecipes)
            );
            card.remove();
            if (favoritesTable.childElementCount == 0) {
                const text = document.createElement("h1");
                text.innerHTML = "Nessuna ricetta salvata";
                favoritesTable.appendChild(text);
            }
        });
        imageTd.appendChild(removeFavoritesButton);

        card.appendChild(dataTd);

        card.addEventListener("click", function() {
            window.location.href =
                `recipe.html?id=${e.recipeId}`;
            
        })
        favoritesTable.appendChild(card);
    });

}