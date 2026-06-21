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

let productsData = [];

async function loadProducts() {
    try {
        const res = await fetch('/api/products');
        if (res.ok) {
            const data = await res.json();
            productsData = data.map(p => ({
                id: p.id,
                name: p.name,
                rating: p.rating,
                isSale: p.is_sale,
                imageUrl: p.image_url,
                oldPrice: p.old_price ? parseFloat(p.old_price) : null,
                newPrice: parseFloat(p.new_price)
            }));
            renderProducts();
        }
    } catch (e) {
        console.error("Lỗi lấy sản phẩm", e);
    }
}

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
    
    paginatedProducts.forEach((product, idx) => {
        const globalIndex = startIndex + idx;
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
                    <button class="add-to-cart-btn" data-index="${globalIndex}">Add to cart</button>
                    <button class="remove-from-cart-btn" data-index="${globalIndex}">Remove</button>
                </div>
                <div class="product-overlay">
                    <button class="quick-view-btn" data-index="${globalIndex}">Quick View</button>
                </div>
            </article>
        `;
    });

    gridContainer.innerHTML = htmlContent;
    renderPagination();
    attachAddToCartListeners();
    attachQuickViewListeners();
}

function attachAddToCartListeners() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const removeFromCartButtons = document.querySelectorAll('.remove-from-cart-btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            const index = this.getAttribute('data-index');
            const product = productsData[index];
            if (product) {
                try {
                    await fetch('/api/cart', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: 1, productId: product.id, quantity: 1 })
                    });
                    await updateCartDisplay();
                } catch(e) {
                    console.error(e);
                }
            }
        });
    });
    
    removeFromCartButtons.forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            const index = this.getAttribute('data-index');
            const product = productsData[index];
            if (product) {
                try {
                    await fetch(`/api/cart/1/${product.id}`, { method: 'DELETE' });
                    await updateCartDisplay();
                } catch(e) {
                    console.error(e);
                }
            }
        });
    });
}

async function updateCartDisplay() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        try {
            const res = await fetch('/api/cart/1');
            if (res.ok) {
                const cart = await res.json();
                const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                cartCountElement.textContent = totalItems + ' items';
            }
        } catch(e) {
            console.error(e);
        }
    }
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
    updateCartDisplay();
    loadProducts();       
    initSidebarAccordion(); 

    const headerCartBtn = document.getElementById('headerCartBtn');
    const headerCartDropdown = document.getElementById('headerCartDropdown');
    
    if (headerCartBtn && headerCartDropdown) {
        headerCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            headerCartDropdown.classList.toggle('show');
        });
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.cart-dropdown-container')) {
            if (headerCartDropdown) headerCartDropdown.classList.remove('show');
        }
    });
});

function attachQuickViewListeners() {
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const index = btn.getAttribute('data-index');
            openQuickView(index);
        });
    });
}

function openQuickView(index) {
    const product = productsData[index];
    if (!product) return;

    closeQuickView(); 

    const overlayHtml = `
        <div class="quickview-overlay" id="quickviewOverlay">
            <div class="quickview-modal">
                <button class="quickview-close" id="quickviewClose">&times;</button>
                <div class="quickview-image">
                    <img src="${product.imageUrl}" alt="${product.name}">
                </div>
                <div class="quickview-info">
                    <h2 class="quickview-name">${product.name}</h2>
                    <div class="quickview-price-row">
                        <span class="new-price">$${product.newPrice.toFixed(2)}</span>
                        ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <div class="quickview-stars">${generateStars(product.rating)}</div>
                    
                    <div class="quickview-cart-row">
                        <input type="number" class="quickview-qty" id="quickviewQty" value="1" min="1">
                        <button class="quickview-add-btn" id="quickviewAddBtn">ADD TO CART</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', overlayHtml);

    const overlay = document.getElementById('quickviewOverlay');
    const closeBtn = document.getElementById('quickviewClose');
    const addBtn = document.getElementById('quickviewAddBtn');
    const qtyInput = document.getElementById('quickviewQty');

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeQuickView();
        }
    });

    closeBtn.addEventListener('click', closeQuickView);

    addBtn.addEventListener('click', async () => {
        const qty = parseInt(qtyInput.value) || 1;
        try {
            await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: 1, productId: product.id, quantity: qty })
            });
            await updateCartDisplay();
            closeQuickView();
        } catch(e) {
            console.error(e);
        }
    });
}

function closeQuickView() {
    const overlay = document.getElementById('quickviewOverlay');
    if (overlay) {
        overlay.remove();
    }
}
