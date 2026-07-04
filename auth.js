// ===== VERIFICA SE SEI LOGGATO ===== 
const page = window.location.pathname;
//Se sono loggato permette di vedere la page, altrimenti
//reindirizza alla schermata di login.
//La sessione scade automaticamente dopo 10 minuti.
const loggedIn =
    localStorage.getItem("loggedIn") == "true" &&
    Date.now() <
    (
        Number(localStorage.getItem("LogInDate"))
        + (10 * 60 * 1000)
    );

if(page.includes("register.html") || page.includes("index.html")){
        if (loggedIn) {
                window.location.replace("home.html");
        }
}
else {
        if (!loggedIn) {
                window.location.replace("index.html");
        }
}

// ===== REGISTRAZIONE =====

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

if(registerForm) {

    document.getElementById("registerButton").addEventListener("click", function(event) {

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const username = document.getElementById("username").value;
        const birthdate = document.getElementById("birthdate").value;


        // Prende il valore di users. Con parse lo trasforma da stringa a json. Così
        // users è diventata un elenco di users. Se non esiste, invece users diventa un
        // array vuoto.
        let users = JSON.parse(localStorage.getItem("users")) || [];

        // Cerca nel database se l'user esiste già
        const userExists = users.find(
                user => user.email == email
        );
        //controlla che tutti i campi siano stati riempiti
        const filledBoxes = (email != "" && password != "" && username != "" && birthdate != "")
            
        // Se non esiste e i campi sono stati riempiti lo aggiunge nel database
        if (!filledBoxes) {
                console.log(filledBoxes)
                document.getElementById("emailError").innerHTML = "devi compilare tutti i campi";
        } else if(userExists) {
                document.getElementById("emailError").innerHTML = "user già esistente";
        } else if (!userExists && filledBoxes) {
                // Nuovo user
                const newUser = {
                    email: email,
                    password: password,
                    username: username,
                    birthdate: birthdate
                
                };
                
                // Aggiunge user
                users.push(newUser);
        
                // Salva tutto
                localStorage.setItem("users", JSON.stringify(users));
                alert("Registrazione effettuata con successo!");
                window.location.replace("index.html");
        }

    });


    
    //===== LOGIN =====
} else if (loginForm) {
    document.getElementById("loginButton").addEventListener("click", function(event) {

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (!email || !password) return;


        let users = JSON.parse(localStorage.getItem("users")) || []; 

        const userTrovato = users.find(user => (
                user.email == email
        ));

        if (userTrovato) {
                if (userTrovato.password == password) {
                        localStorage.setItem("loggedIn", true);
                        localStorage.setItem("LogInDate", Date.now());
                        localStorage.setItem("loggedMail", email)
                        localStorage.setItem("loggedUser", userTrovato.username)
                        window.location.replace("home.html");
                } else {
                        document.getElementById("loginError").innerHTML = "User e/o passord errata";
                }
        } else {
                document.getElementById("loginError").innerHTML = "Account inesistente";
        }
        
    })
} else {
        
  // ===== LOGOUT =====
        const logoutButton = document.getElementById("logoutButton");
        if (logoutButton) {
                document.getElementById("logoutButton").addEventListener("click", function(event) {
                        localStorage.removeItem("loggedIn");
                        localStorage.removeItem("loggedMail");
                        localStorage.removeItem("loggedUser");
                        localStorage.removeItem("LogInDate");
                        window.location.replace("index.html");
                
                })                        
        }

}

  // ===== CANCELLAZIONE ACCOUNT =====
//Cancella l'account, ed effettua la disconnessione

if (document.getElementById("deleteAccountButton")) {
        document.getElementById("deleteAccountButton").addEventListener("click", function (event) {
                if (confirm("Sei davvero sicuro di voler cancellare il tuo " +
                "account? Questo eliminerà permanentemente i dati" +
                "dal sito!")) {
                        const users = JSON.parse(localStorage.getItem("users")) || [];
                        const newUsers = users.filter(
                                user => user.email != localStorage.getItem("loggedMail")
                        );
                        localStorage.setItem("users", JSON.stringify(newUsers));
                        localStorage.removeItem("loggedIn");
                        localStorage.removeItem("loggedMail");
                        localStorage.removeItem("loggedUser");
                        localStorage.removeItem("LogInDate");
                        window.location.replace("index.html");

                }

        });
}

  // ===== PAGINA IMPOSTAZIONI PROFILO =====
//Questa sezione riempie i campi della pagina Impostazioni profilo
if (page.includes("profile.html")) {
        const mailField = document.getElementById("email");
        const usernameField = document.getElementById("username");
        const birthdateField = document.getElementById("birthdate");
        mailField.value = localStorage.getItem("loggedMail");
        usernameField.value = localStorage.getItem("loggedUser");
        birthdate.value = JSON.parse(localStorage.getItem("users")).find(user => user.email == localStorage.getItem("loggedMail")).birthdate
        


          // ===== MODIFICA DATI ACCOUNT =====
        //Permette di cambiare nome utente e mail, soltanto se non ci sono altri account che le usano;
        //la password può sempre essere cambiata
        
        //CAMBIO EMAIL
        const changeMail = document.getElementById("changeMail");
        const confirmEmailChange = document.getElementById("confirmEmailChange");
        const cancelEmailChange = document.getElementById("cancelEmailChange");
        const emailBox = document.getElementById("email");
        const errorText = document.getElementById("errorText");
        
        if (changeMail) {
                changeMail.addEventListener("click", function (event) {
                        //stile dei tasti                        
                        emailBox.readOnly = false;
                        emailBox.disabled = false;
                        confirmEmailChange.style.display = "block";
                        cancelEmailChange.style.display = "block";
                        mailField.style.border = "";
                        mailField.style.outline = "";
                        mailField.style.background = "";
                        changeMail.disabled = true;
                        emailBox.focus();
                })
        }
        if (cancelEmailChange) {
                cancelEmailChange.addEventListener("click", function (event) {
                        emailBox.readOnly = true;
                        emailBox.disabled = true;
                        emailBox.style.border = "none";
                        emailBox.style.outline = "none";
                        emailBox.style.background = "transparent";
                        confirmEmailChange.style.display = "none";
                        cancelEmailChange.style.display = "none";
                        mailField.value = localStorage.getItem("loggedMail");
                        changeMail.disabled = false;

    
                });
         
        }
        if (confirmEmailChange) {
                confirmEmailChange.addEventListener("click", function (event) {
                        //cambia la mail
                        
                        let users = JSON.parse(localStorage.getItem("users")) || [];
                        //se nessun altro ha quella mail, questa casella sarà vuota. se è vuota effettua il cambio mail
                        const alreadyExist = users.find(user => 
                                user.email == mailField.value &&
                                user.email !== localStorage.getItem("loggedMail")
                        )
                        //user attuale a cui cambiare il dato
                        const currentUser = users.find(user => {
                                return user.username == localStorage.getItem("loggedUser");
                        })

                        
                        if (!alreadyExist) {
                                currentUser.email = mailField.value;
                                localStorage.setItem("users", JSON.stringify(users));
                                localStorage.setItem("loggedMail", mailField.value);
                        } else {
                                changeMail.after(errorText);
                                errorText.innerHTML = "Email già assegnata ad altro utente!";
                        }
                        

                        
                        //ripristina i campi
                        cancelEmailChange.click();
                })
        }
        
        
        //CAMBIO USERNAME
        const changeUsername = document.getElementById("changeUsername");
        const confirmUserChange = document.getElementById("confirmUserChange");
        const cancelUserChange = document.getElementById("cancelUserChange");
        const usernameBox =  document.getElementById("username");
                
        if (changeUsername) {
                changeUsername.addEventListener("click", function (event) {
                        //stile dei tasti                        
                        usernameBox.readOnly = false;
                        usernameBox.disabled = false;
                        confirmUserChange.style.display = "block";
                        cancelUserChange.style.display = "block";
                        usernameField.style.border = "";
                        usernameField.style.outline = "";
                        usernameField.style.background = "";
                        changeUsername.disabled = true;
                        usernameBox.focus();
                })
        }
        if (cancelUserChange) {
                cancelUserChange.addEventListener("click", function (event) {
                        usernameBox.readOnly = true;
                        usernameBox.disabled = true;
                        usernameBox.style.border = "none";
                        usernameBox.style.outline = "none";
                        usernameBox.style.background = "transparent";
                        confirmUserChange.style.display = "none";
                        cancelUserChange.style.display = "none";
                        usernameField.value = localStorage.getItem("loggedUser");
                        changeUsername.disabled = false;

    
                });
         
        }
        if (confirmUserChange) {
                confirmUserChange.addEventListener("click", function (event) {
                        
                        let users = JSON.parse(localStorage.getItem("users")) || [];
                        //verifica se qualcun altro ha quell'user: se il campo diventa diverso dal vuoto, non effettua il cambio di user
                        const alreadyExist = users.find(user => 
                            user.username === usernameField.value &&
                            user.username !== localStorage.getItem("loggedUser")
                        )
                        //restituisce user corrente: per cambiargli il dato
                        const currentUser = users.find(user => {
                                return user.username == localStorage.getItem("loggedUser");
                        })

                        //se non è giù assegnato a qualcun altro, effettua il cambio di user
                        if (!alreadyExist) {
                                currentUser.username = usernameField.value;
                                localStorage.setItem("users", JSON.stringify(users));
                                localStorage.setItem("loggedUser", usernameField.value);
                        } else {
                                changeUsername.after(errorText);
                                errorText.innerHTML = "Username già esistente!";
                        }
                        

                        
                        //ripristina i campi
                        cancelUserChange.click();
                })
        }
        
        //CAMBIO PASSWORD
        const changePasswordInput = document.getElementById("changePasswordInput");
        const changepassword = document.getElementById("changePassword");
        const confirmPasswordChange = document.getElementById("confirmPasswordChange");
        const cancelPasswordChange = document.getElementById("cancelPasswordChange");
        if (changePassword) {
                changePassword.addEventListener("click", function(event) {
                        changePasswordInput.style.display = "block";
                        confirmPasswordChange.style.display = "block";
                        cancelPasswordChange.style.display = "block";
                        changePasswordInput.focus();
                });
        }
        if (cancelPasswordChange) {
                cancelPasswordChange.addEventListener("click", function(event) {
                        changePasswordInput.innerHTML = "";
                        changePasswordInput.style.display = "none";
                        cancelPasswordChange.style.display = "none";
                        confirmPasswordChange.style.display = "none";
                })          
        }
        if (confirmPasswordChange) {
                confirmPasswordChange.addEventListener("click", function(event) {
                        const users = JSON.parse(localStorage.getItem("users"));
                        const userToChange = users.find(user => user.email == localStorage.getItem("loggedMail"));
                        console.log(userToChange)
                        if (changePasswordInput.value != "") {
                                userToChange.password = changePasswordInput.value;
                                localStorage.setItem("users", JSON.stringify(users));
                                cancelPasswordChange.click();
                        } else {
                               errorText.innerHTML = "Devi inserire qualcosa nel campo password!"; 
                        }
                })
        }
}