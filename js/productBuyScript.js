document.getElementById('buyButton').addEventListener('click', function() {
    const productName = document.getElementById('nazevZbozi').innerText;
    const productImage = document.getElementById('imgZbozi').src;
    const productPrice = document.getElementById('priceZbozi').innerText;

    const product = {
        name: productName,
        image: productImage,
        price: productPrice,
        quantity: 1 // Default quantity is set to 1 when added to cart
    };

    addToCart(product);
});

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let existingProduct = cart.find(p => p.name === product.name);
    
    if (existingProduct) {
        existingProduct.quantity += 1; // If product exists, increment quantity
    } else {
        cart.push(product); // If new, add to cart
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
}