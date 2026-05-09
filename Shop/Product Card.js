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

const ITEMS_PER_PAGE = 12;
let currentPage = 1;

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

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedProducts = productsData.slice(startIndex, endIndex);

    let htmlContent = '';
    
    paginatedProducts.forEach(product => {
        const saleBadgeHtml = product.isSale ? `<span class="sale-badge">SALE!</span>` : '';
        
        htmlContent += `
            <article class="product-card">
                <a href="#" class="product-title">${product.name}</a>
                <div class="stars">${generateStars(product.rating)}</div>
                ${saleBadgeHtml}
                <a href="#" class="product-image">
                    <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
                </a>
                <div class="price-box">
                    ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                    <span class="new-price">$${product.newPrice.toFixed(2)}</span>
                </div>
                <div class="product-actions">
                    <button class="add-to-cart-btn">Add to cart</button>
                </div>
                <div class="product-overlay">
                    <button class="quick-view-btn">Quick View</button>
                </div>
            </article>
        `;
    });

    gridContainer.innerHTML = htmlContent;
    renderPagination();
}

function renderPagination() {
    const paginationContainer = document.getElementById('pagination-container');
    
    if (!paginationContainer) return;

    const totalPages = Math.ceil(productsData.length / ITEMS_PER_PAGE);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHtml = '<div class="pagination">';
    
    paginationHtml += `<button class="pagination-btn pagination-first" onclick="goToPage(1)" ${currentPage === 1 ? 'disabled' : ''}>«</button>`;
    
    paginationHtml += `<button class="pagination-btn pagination-prev" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>‹</button>`;
    
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const isActive = i === currentPage;
        paginationHtml += `<button class="pagination-btn pagination-number ${isActive ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    
    paginationHtml += `<button class="pagination-btn pagination-next" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>›</button>`;
    
    paginationHtml += `<button class="pagination-btn pagination-last" onclick="goToPage(${totalPages})" ${currentPage === totalPages ? 'disabled' : ''}>»</button>`;
    
    paginationHtml += '</div>';
    
    paginationContainer.innerHTML = paginationHtml;
}

function goToPage(pageNumber) {
    const totalPages = Math.ceil(productsData.length / ITEMS_PER_PAGE);
    
    if (pageNumber < 1 || pageNumber > totalPages) {
        return;
    }
    
    currentPage = pageNumber;
    renderProducts();
    
    document.getElementById('product-grid').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();       
    initSidebarAccordion(); 
});

