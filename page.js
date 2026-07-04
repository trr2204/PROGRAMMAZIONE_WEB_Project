const profileButton = document.getElementById("profileButton");
const homeButton = document.getElementById("homeButton");
const cookbookButton = document.getElementById("cookbookButton");



if (profileButton) profileButton.addEventListener("click", function(event) {
    window.location.href = "profile.html";
});

if (homeButton) homeButton.addEventListener("click", function(event) {
    window.location.href = "home.html";
});

if (cookbookButton) cookbookButton.addEventListener("click", function(event) {
    window.location.href = "cookbook.html";
});
