document.addEventListener('DOMContentLoaded', () => {
    renderCart();

    const updateBtn = document.getElementById('updateCartBtn');
    if (updateBtn) {
        updateBtn.addEventListener('click', updateCart);
    }
});

async function getCart() {
    try {
        const res = await fetch('/api/cart/1');
        if (res.ok) {
            return await res.json();
        }
        return [];
    } catch(e) {
        console.error(e);
        return [];
    }
}

async function renderCart() {
    const cart = await getCart();
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
    cart.forEach((item) => {
        const total = (item.newPrice * item.quantity).toFixed(2);
        html += `
            <tr>
                <td>
                    <button class="cart-delete-btn" onclick="deleteItem(${item.id})">🗑️</button>
                </td>
                <td>
                    <img src="../${item.imageUrl}" alt="${item.name}" class="cart-product-img">
                </td>
                <td>
                    <a href="#" class="cart-product-name">${item.name}</a>
                </td>
                <td class="cart-price">$${Number(item.newPrice).toFixed(2)}</td>
                <td>
                    Quantity <input type="number" class="cart-qty-input" data-id="${item.id}" value="${item.quantity}" min="1">
                </td>
                <td class="cart-total" id="total-${item.id}">$${total}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

async function deleteItem(productId) {
    try {
        await fetch(`/api/cart/1/${productId}`, { method: 'DELETE' });
        await renderCart();
    } catch (e) {
        console.error(e);
    }
}

async function updateCart() {
    const inputs = document.querySelectorAll('.cart-qty-input');
    const items = [];
    
    inputs.forEach(input => {
        const productId = parseInt(input.getAttribute('data-id'));
        const qty = parseInt(input.value) || 1;
        items.push({ productId, quantity: qty });
    });
    
    try {
        await fetch('/api/cart', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 1, items })
        });
        await renderCart();
    } catch(e) {
        console.error(e);
    }
}
