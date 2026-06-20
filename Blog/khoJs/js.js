
const categoryHeader = document.querySelector(".category-header");
const categoryList = document.querySelector(".category-list");

if (categoryHeader && categoryList) {
    categoryHeader.addEventListener("click", () => {
        categoryList.classList.toggle("show");
    });
}

const searchInput = document.getElementById("blogSearch");

if (searchInput) {
    searchInput.addEventListener("keyup", () => {

        const keyword = searchInput.value.toLowerCase();

        const blogCards = document.querySelectorAll(".blog-card");

        blogCards.forEach(card => {

            const titleEl = card.querySelector(".blog-title");
            const descEl = card.querySelector(".blog-desc");

            const title = titleEl ? titleEl.textContent.toLowerCase() : "";
            const desc = descEl ? descEl.textContent.toLowerCase() : "";

            if (
                title.includes(keyword) ||
                desc.includes(keyword)
            ){
                card.style.display = "flex";
            }
            else{
                card.style.display = "none";
            }

        });

    });
}

const cards = document.querySelectorAll(".blog-card");

function revealCards(){

    cards.forEach(card => {

        const cardTop = card.getBoundingClientRect().top;

        if(cardTop < window.innerHeight - 100){
            card.classList.add("show");
        }

    });

}

window.addEventListener("scroll", revealCards);

revealCards();

document.addEventListener("click", (e) => {

    if (
        categoryHeader &&
        categoryList &&
        !categoryHeader.contains(e.target) &&
        !categoryList.contains(e.target)
    ) {
        categoryList.classList.remove("show");
    }

});
