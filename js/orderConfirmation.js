if (!firebase.apps.length) {
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
  
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app(); // if already initialized, use that one
  }


const orderId = localStorage.getItem('currentOrderId'); 

document.getElementById('payNow').addEventListener('click', function() {
    if (orderId) {
        const orderRef = firebase.database().ref(`orders/${orderId}`);
        orderRef.update({ paid: true }).then(() => {
            window.location.href = 'index.html'; 
        }).catch((error) => {
            console.error("Error updating order: ", error);
            alert('There was a problem processing your payment. Please try again.');
        });
    }
});

document.getElementById('payLater').addEventListener('click', function() {
    window.location.href = 'index.html'; 
});
