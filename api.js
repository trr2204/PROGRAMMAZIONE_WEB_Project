/*
    Scarica tutto il materiale da TheMealDB e riempie le varie pagine
    con quello che ha ottenuto.
    Gestisce anche le funzionalità di ricerca
*/

let address = "https://www.themealdb.com/api/json/v1/1/search.php?s="

// ----HOMEPAGE----
//Page è definito in auth
if (page.includes("home.html")) {
        const recipeContainer = document.getElementById("recipeContainer"); //La tabella con tutte le ricette
        
        //Esegue fetch dell'API
        async function loadRecipes(addressToFetch) {
            const response = await fetch(
                addressToFetch
            );
            const data = await response.json();

            //Svuota la tabella nel caso contenga qualcosa poi la riempie.
            //Ogni ricetta è una card con nome e immagine
            recipeContainer.innerHTML = "";
            //meals è stato scaricato dalla api
            data.meals.forEach(recipe => {
                const cell = document.createElement("div");
                cell.classList.add("card");
                cell.innerHTML =  `
                <h1>${recipe.strMeal}</h1>
                <img src="${recipe.strMealThumb}">
                `;

                cell.addEventListener("click", function(event) {
                    window.location.href = `recipe.html?id=${recipe.idMeal}`;
                })
                
                recipeContainer.appendChild(cell);
                
            });
            
        }
        loadRecipes(address);   //chiama la funzione all'apertura della pagina

        //RICERCA PER LETTERA
        const lettersContainerDrawer = document.getElementById("lettersContainerDrawer");
        const lettersContainer = document.getElementById("lettersContainer");
        lettersContainerDrawer.addEventListener("click", function(e) {
            e.stopPropagation(); //premere le lettere non deve attivare eventuali contenuti sotto il div
            lettersContainer.classList.toggle("visible");
        });
        //Cliccare in qualsiasi punto della pagina chiude il div
        document.addEventListener("click", function() {
            lettersContainer.classList.remove("visible");
        })

        //Se il cursore sta per troppo tempo fuori dal div, questo si chiude
        let timer;
        lettersContainer.addEventListener("mouseleave", function(e) {
            e.stopPropagation();
            timer = setTimeout(function (e) {
                lettersContainer.classList.remove("visible");
            }, 500)
        });
        //Se rientro nel div, resetta il timer e rimane aperto
        lettersContainer.addEventListener("mouseover", function() {
            clearTimeout(timer);
        })

        //Viene generato l'elenco delle lettere e ad ognuna è aggiunta l'azione
        for (let i = 65; i <= 90; i++) {
            const button = document.createElement("button");

            button.textContent = String.fromCharCode(i);

            button.addEventListener("click", function() {
                const letter = button.textContent;
                lettersContainer.classList.toggle("visible");
                loadRecipes(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
            });

            lettersContainer.appendChild(button);
        }

        //RICERCA PER ALTRO
        const searchbar = document.getElementById("searchbar");
        document.getElementById("searchName").addEventListener("click", function() {
            loadRecipes(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchbar.value}`)
        });
        document.getElementById("searchIngredient").addEventListener("click", function() {
            loadRecipes(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchbar.value}`)
        });
        document.getElementById("searchCategory").addEventListener("click", function() {
            loadRecipes(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchbar.value}`)
        });
        document.getElementById("searchArea").addEventListener("click", function() {
            loadRecipes(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${searchbar.value}`)
        });



// ---- pagina della SINGOLA RICETTA----
} else if (page.includes("recipe.html")) {
    async function loadRecipe() {
        //Legge l'ID dalle query dell'URL: ottenuto l'id, recupera i dati di quella singola ricetta
        const params = new URLSearchParams(window.location.search);
        const recipeId = params.get("id");
        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
        const data = await response.json();


        const recipe = data.meals.find(recipe => recipe.idMeal == recipeId);

        //Da qui inizia a compilare i campi della pagina
        document.title = recipe.strMeal;
        document.getElementById("strMeal").innerHTML = recipe.strMeal;
        document.getElementById("strMealThumb").src = recipe.strMealThumb;
        document.getElementById("strCategory").innerHTML = `<i class="fa-solid fa-cookie-bite"></i>` + recipe.strCategory;
        document.getElementById("strInstructions").innerHTML = recipe.strInstructions;
        document.getElementById("strArea").innerHTML = `<i class="fa-solid fa-globe"></i>` + recipe.strArea;
        document.getElementById("strSource").addEventListener("click", function() {
            window.open(recipe.strSource, "_blank");
        })


        //Inserisce gli ingredienti e le dosi fetchate in una tabella
        const strIngredient = document.getElementById("strIngredient");
        for (let i = 1; ; i++) {

            const ingredient = recipe[`strIngredient${i}`];
            const measure = recipe[`strMeasure${i}`];

            //La exit condition: esce dal ciclo quando non ci sono più ingredienti da leggere
            if (ingredient == "" || ingredient == null) {
                break;
            }
            //ogni riga è un ingrediente e la sua misura
            const tr = document.createElement("tr");
            tr.classList.add("ingredientTr");
            const tdIngredient = document.createElement("td");
            tdIngredient.classList.add("ingredientTd")
            const tdMeasure = document.createElement("td");
            tdMeasure.classList.add("measureTd")

            tdIngredient.innerHTML = ingredient;
            tdMeasure.innerHTML = measure;

            tr.appendChild(tdIngredient);
            tr.appendChild(tdMeasure);
            strIngredient.appendChild(tr);

        }
    
    }
    loadRecipe();

}
