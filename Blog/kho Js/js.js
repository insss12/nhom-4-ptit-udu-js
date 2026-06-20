// ======================
// CATEGORY DROPDOWN
// ======================

const categoryHeader = document.querySelector(".category-header");
const categoryList = document.querySelector(".category-list");

categoryHeader.addEventListener("click", () => {
    categoryList.classList.toggle("show");
});


// ======================
// CART DROPDOWN
// ======================

const cartHeader = document.querySelector(".cart-header");
const cartDropdown = document.querySelector(".cart-dropdown");

cartHeader.addEventListener("click", () => {
    cartDropdown.classList.toggle("show");
});


// ======================
// SEARCH BLOG
// ======================

const searchInput = document.getElementById("blogSearch");

searchInput.addEventListener("keyup", () => {

    const keyword = searchInput.value.toLowerCase();

    const blogCards = document.querySelectorAll(".blog-card");

    blogCards.forEach(card => {

        const title = card.querySelector(".blog-title")
                          .textContent
                          .toLowerCase();

        const desc = card.querySelector(".blog-desc")
                         .textContent
                         .toLowerCase();

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


// ======================
// BACK TO TOP
// ======================

const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {

    if(window.scrollY > 300){
        topBtn.style.display = "block";
    }
    else{
        topBtn.style.display = "none";
    }

});

topBtn.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


// ======================
// SCROLL ANIMATION
// ======================

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


// ======================
// CLICK OUTSIDE CLOSE
// ======================

document.addEventListener("click", (e) => {

    if(!categoryHeader.contains(e.target) &&
       !categoryList.contains(e.target))
    {
        categoryList.classList.remove("show");
    }

    if(!cartHeader.contains(e.target) &&
       !cartDropdown.contains(e.target))
    {
        cartDropdown.classList.remove("show");
    }

});
