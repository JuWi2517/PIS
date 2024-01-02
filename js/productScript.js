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
  const storage = firebase.storage().ref();

 
  function addProduct(event) {
    event.preventDefault();

    const productName = document.getElementById('productName').value;
    const productImage = document.getElementById('productImage').files[0];
    const productDescription = document.getElementById('productDescription').value;
    const productPrice = document.getElementById('productPrice').value;

    const newProductRef = database.ref('products').push();
    const productId = newProductRef.key;  
    const uniqueImageName = `${Date.now()}-${productImage.name}`;
    const newImageRef = storage.child(`product_images/${uniqueImageName}`);
    
    newImageRef.put(productImage)
      .then(snapshot => snapshot.ref.getDownloadURL())
      .then(downloadURL => {
        newProductRef.set({
          id: productId,  
          name: productName,
          imageURL: downloadURL,
          description: productDescription,
          price: productPrice,
          imageName: uniqueImageName,
          stockCount: 0
        });

        
        const card = createBootstrapCard(productName, downloadURL, productDescription, productPrice, productId);
        document.getElementById('productList').insertAdjacentHTML('beforeend', card);
       
      })
      .catch(error => {
        console.error('Error uploading image:', error);
      }); 
      
    }
    
    

  function createBootstrapCard(productName, imageURL, productDescription, productPrice, productId) {
    const card = `
      <div id="card-${productId}" class="card" style="width: 18rem; margin: 30px;">
        <img src="${imageURL}" class="card-img-top" alt="Product Image">
        <div class="card-body">
          <h5 class="card-title">${productName}</h5>
          <p class="card-text">${productDescription}</p>
          <p class="card-text">${productPrice}Kč</p>
          <a href="#" class="btn btn-primary">Go somewhere</a>
          <button onclick="deleteProduct('${productId}')" class="btn btn-danger">Odstranit</button>
           
        </div>
      </div>
    `
    return card;
  }

 
  
  function fetchAndDisplayProducts() {
    const productList = document.getElementById('productList');
	console.log("fetch");
    database.ref('products').once('value')
      .then(snapshot => {
        snapshot.forEach(childSnapshot => {
          const productData = childSnapshot.val();
          const productName = productData.name;
          const imageURL = productData.imageURL;
          const productDescription = productData.description;
          const productPrice = productData.price;
          const productId = productData.id;
          const card = createBootstrapCard(productName, imageURL, productDescription, productPrice, productId);
          productList.insertAdjacentHTML('beforeend', card);
        });
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }

  document.getElementById('productForm').addEventListener('submit', addProduct);

  function deleteProduct(productId) {
    const productRef = database.ref('products/' + productId);
  
    productRef.once('value')
      .then(snapshot => {
        const productData = snapshot.val();
        if (!productData) {
          throw new Error('Product not found');
        }
  
        const imageName = productData.imageName;
        if (!imageName) {
          throw new Error('Image name not found');
        }
  
       
        return database.ref('products').orderByChild('imageName').equalTo(imageName).once('value')
          .then(imageSnapshot => {
            if (imageSnapshot.hasChildren() && imageSnapshot.numChildren() > 1) {
              
              return null;
            } else {
              
              const imageRef = storage.child(`product_images/${imageName}`);
              return imageRef.delete();
            }
          })
          .then(() => {
            
            return productRef.remove();
          });
      })
      .then(() => {
        console.log('Product deleted successfully');
  
        
        const productCard = document.getElementById('card-' + productId);
        if (productCard) {
          productCard.remove();
        }
      })
      .catch(error => {
        console.error('Error deleting product:', error);
        alert('Error deleting product: ' + error.message);
      });
  }
  





  


