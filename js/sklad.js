const firebaseConfig = {
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

  
const database = firebase.database();

function createList(productName){
    const list = `
    <div class="product-item">
        <p class="product-name">${productName}</p>
        <p class="product-count">Počet: 1</p>
    </div>
    `;
    return list;
}

function list(){
    const storageList = document.getElementById('storageList');

    database.ref('products').once('value')
    .then(snapshot => {
        snapshot.forEach(childSnapshot => {
            const productData = childSnapshot.val();
            const productName = productData.name;
            const list = createList(productName);
            storageList.insertAdjacentHTML('beforeend', list);
        });
    })
    .catch(error => {
        console.error('Error fetching products:', error);
    });
}

window.onload = list;



