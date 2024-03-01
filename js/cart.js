function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContents = document.getElementById('cartContents');
    cartContents.innerHTML = '';

    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.innerHTML = `
            <h3>${item.name}</h3>
            <p>Quantity: <span id="quantity-${index}">${item.quantity}</span></p>
            <img src="${item.image}" alt="${item.name}" style="width: 100px;">
            <button onclick="changeQuantity(${index}, 1)">+</button>
            <button onclick="changeQuantity(${index}, -1)">-</button>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartContents.appendChild(itemElement);
    });
}

// Call displayCart when the page loads
if (document.getElementById('cartContents')) {
    displayCart();
}


function changeQuantity(index, delta) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    if (cart[index]) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
            removeFromCart(index);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            document.getElementById(`quantity-${index}`).innerText = cart[index].quantity;
        }
    }
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart.splice(index, 1); 
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}


if (document.getElementById('cartContents')) {
    displayCart();
}
function toOrder(){
    window.location.href = 'ordering.html'
}