document.addEventListener('DOMContentLoaded', () => {
    renderCart();

    const updateBtn = document.getElementById('updateCartBtn');
    if (updateBtn) {
        updateBtn.addEventListener('click', updateCart);
    }
});

function getCart() {
    const data = localStorage.getItem('cartData');
    return data ? JSON.parse(data) : [];
}

function saveCart(cart) {
    localStorage.setItem('cartData', JSON.stringify(cart));
}

function renderCart() {
    const cart = getCart();
    const tbody = document.getElementById('cart-body');
    const table = document.getElementById('cartTable');
    const actions = document.getElementById('cartActions');
    const emptyMsg = document.getElementById('emptyCartMessage');

    if (cart.length === 0) {
        table.style.display = 'none';
        actions.style.display = 'none';
        emptyMsg.style.display = 'block';
        return;
    }

    table.style.display = 'table';
    actions.style.display = 'block';
    emptyMsg.style.display = 'none';

    let html = '';
    cart.forEach((item, i) => {
        const total = (item.newPrice * item.quantity).toFixed(2);
        html += `
            <tr>
                <td>
                    <button class="cart-delete-btn" onclick="deleteItem(${i})">🗑️</button>
                </td>
                <td>
                    <img src="../${item.imageUrl}" alt="${item.name}" class="cart-product-img">
                </td>
                <td>
                    <a href="#" class="cart-product-name">${item.name}</a>
                </td>
                <td class="cart-price">£${item.newPrice.toFixed(2)}</td>
                <td>
                    Quantity <input type="number" class="cart-qty-input" data-index="${i}" value="${item.quantity}" min="1">
                </td>
                <td class="cart-total" id="total-${i}">£${total}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

function deleteItem(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
}

function updateCart() {
    const cart = getCart();
    const inputs = document.querySelectorAll('.cart-qty-input');
    
    inputs.forEach(input => {
        const index = parseInt(input.getAttribute('data-index'));
        const qty = parseInt(input.value) || 1;
        if (cart[index]) {
            cart[index].quantity = qty;
        }
    });
    
    saveCart(cart);
    renderCart();
}
