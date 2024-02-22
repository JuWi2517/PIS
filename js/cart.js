

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Assume product does not have a unique ID and use a combination of name and price as a unique identifier
    let productIdentifier = `${product.name}-${product.price}`;
    let found = cart.find(p => `${p.name}-${p.price}` === productIdentifier);
    if (found) {
        found.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
}

function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContents = document.getElementById('cartContents');
    cartContents.innerHTML = '';

    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.innerHTML = `
            <h3>${item.name}</h3>
            
            <img src="${item.image}" alt="${item.name}" style="width: 100px;">
            <p>Quantity: <span id="quantity-${index}">${item.quantity}</span></p>
            <button onclick="changeQuantity(${index}, 1)">+</button>
            <button onclick="changeQuantity(${index}, -1)">-</button>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartContents.appendChild(itemElement);
    });
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
