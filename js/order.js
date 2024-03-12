
	var firebaseConfig = {
		apiKey: "AIzaSyAUI9U-zSLCS-MfqF4_lYo6abwWSKuoa2s",
		authDomain: "projectinfosystem-c7a40.firebaseapp.com",
		projectId: "projectinfosystem-c7a40",
		storageBucket: "projectinfosystem-c7a40.appspot.com",
		messagingSenderId: "141548851105",
		appId: "1:141548851105:web:6b154365af8a97b75b05e0",
		measurementId: "G-4YZFYKRD9Z",
		databaseURL: "https://projectinfosystem-c7a40-default-rtdb.europe-west1.firebasedatabase.app/",
	};
    if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
} else {
	firebase.app(); // if already initialized, use that one
}




document.getElementById('submitOrder').addEventListener('click', function() {
    const user = firebase.auth().currentUser; 
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    if (!user) {
        alert('You must be logged in to place an order!');
        return; 
    }

    const orderItems = cart.map(cartItem => ({
        productId: cartItem.productId,
        quantity: cartItem.quantity
    }));

    const ordersRef = firebase.database().ref('orders');
    const newOrderRef = ordersRef.push();

    newOrderRef.set({
        supId: user.uid,
	subId: "",
        items: orderItems,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        paid: false
    }).then(() => {
        localStorage.setItem('currentOrderId', newOrderRef.key);
        alert('Order submitted successfully!');
        localStorage.removeItem('cart');
        window.location.href = 'orderConfirmation.html';
    }).catch(error => {
        console.error("Error submitting order: ", error);
        alert('There was a problem submitting your order. Please try again.');
    });
});

    
    const ordersRef = firebase.database().ref('orders');
    
    const newOrderRef = ordersRef.push();

    
    newOrderRef.set({
        items: orderItems,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        paid: false
    }).then(() => {
        localStorage.setItem('currentOrderId', newOrderRef.key); 
        alert('Order submitted successfully!');
        localStorage.removeItem('cart'); 
        window.location.href = 'orderConfirmation.html'; 
    }).catch(error => {
        console.error("Error submitting order: ", error);
        alert('There was a problem submitting your order. Please try again.');
    });

