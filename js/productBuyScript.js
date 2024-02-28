document.getElementById('buyButton').addEventListener('click', function() {
    const productName = document.getElementById('nazevZbozi').innerText;
    const productImage = document.getElementById('imgZbozi').src;
    const productPrice = document.getElementById('priceZbozi').innerText;
    const buyButton = document.getElementById('buyButton');
    const productId =  buyButton.getAttribute('data-product-id');

    const product = {
        name: productName,
        image: productImage,
        price: productPrice,
        quantity: 1 ,
        productId:productId
    };
    

    addToCart(product);
});

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let existingProduct = cart.find(p => p.productId === product.productId);
    if (existingProduct) {
        existingProduct.quantity += 1; 
    } else {
        cart.push(product); 
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
}