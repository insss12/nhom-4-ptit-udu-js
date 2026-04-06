function initSidebarAccordion() {
    const dropdownLinks = document.querySelectorAll('.has-sub > a');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); 
            const parentLi = this.parentElement; 
            parentLi.classList.toggle('active'); 
        });
    });
}

const productsData = [
    {
        name: "27-inch 4K UHD Monitor with HDR",
        rating: 5,
        isSale: true,
        imageUrl: "https://via.placeholder.com/200x150/ffffff/000000?text=Monitor",
        oldPrice: 86.00,
        newPrice: 79.00
    },
    {
        name: "Pro Android Tablet 10.4 inch",
        rating: 4,
        isSale: true,
        imageUrl: "https://via.placeholder.com/200x150/ffffff/000000?text=Tablet",
        oldPrice: 76.00,
        newPrice: 69.00
    },
    {
        name: "Smartphone 5G 128GB Storage",
        rating: 5,
        isSale: false,
        imageUrl: "https://via.placeholder.com/200x250/ffffff/000000?text=Phone",
        oldPrice: null,
        newPrice: 80.00
    },
    {
        name: "Gaming Monitor 144Hz 1ms",
        rating: 5,
        isSale: true,
        imageUrl: "https://via.placeholder.com/200x150/ffffff/000000?text=Monitor",
        oldPrice: 150.00,
        newPrice: 120.00
    },
    {
        name: "Ultra-slim Business Tablet",
        rating: 5,
        isSale: true,
        imageUrl: "https://via.placeholder.com/200x150/ffffff/000000?text=Tablet",
        oldPrice: 99.00,
        newPrice: 85.00
    },
    {
        name: "Flagship Smartphone Pro Max",
        rating: 4,
        isSale: true,
        imageUrl: "https://via.placeholder.com/200x250/ffffff/000000?text=Phone",
        oldPrice: 110.00,
        newPrice: 95.00
    },
];

function generateStars(rating) {
    let starsHtml = '';
    for (let i = 0; i < 5; i++) {
        starsHtml += i < rating ? '★' : '☆';
    }
    return starsHtml;
}

function renderProducts() {
    const gridContainer = document.getElementById('product-grid');
    
    if (!gridContainer) return;

    let htmlContent = '';
    
    productsData.forEach(product => {
        const saleBadgeHtml = product.isSale ? `<span class="sale-badge">SALE!</span>` : '';
        
        htmlContent += `
            <article class="product-card">
                <a href="#" class="product-title">${product.name}</a>
                <div class="stars">${generateStars(product.rating)}</div> ${saleBadgeHtml}
                <a href="#" class="product-image">
                    <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
                </a>
                <div class="price-box">
                    ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                    <span class="new-price">$${product.newPrice.toFixed(2)}</span>
                </div>
            </article>
        `;
    });

    gridContainer.innerHTML = htmlContent;
}

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();       
    initSidebarAccordion(); 
});