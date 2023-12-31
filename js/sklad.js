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

function fetchProducts(id){
    //console.log("fetch");
    const products = new Array();
    var table = document.getElementById(id);
    var selectList = document.getElementById("skladInsertSelect");
    
    

	console.log("fetch");	
    
    database.ref('products').once('value')
    .then(snapshot => {
      snapshot.forEach(childSnapshot => {
          const productData = childSnapshot.val();
          
          var row = table.insertRow();
          
          var cellId = row.insertCell(0);
          var cellOBR = row.insertCell(1);
          var cellNazev = row.insertCell(2);
          var cellPopis = row.insertCell(3);
          var cellPocetKusu = row.insertCell(4);

          cellOBR.innerHTML = '<img src="' + productData.imageURL + '" style="width:100px;height:100px;">' ;
          cellNazev.innerHTML = productData.name;
          cellPopis.innerHTML = productData.description;
          cellPocetKusu.innerHTML = productData.stockCount;
          cellId.innerHTML = childSnapshot.key;
          
          products.push(productData);
          selectList.innerHTML += '<option value="' + childSnapshot.key + '">' + productData.name + '</option>';
       
          
       });
    })
    .catch(error => {
      console.error('Error fetching products:', error);
    });
    
    //console.log(products);
    return products;
}
function addPocetSklad() {
  var productId = document.getElementById("skladInsertSelect").value;
  var newCount = parseInt(document.getElementById("addCountProduct").value); 
  //console.log(productId)
 
  
  if (!isNaN(newCount) && newCount >= 0) {
      
      var productRef = database.ref('products/' + productId); 

      productRef.transaction((product) => {
          if (product) {
              product.stockCount = newCount; 
          }
          return product; 
      }, (error, committed, snapshot) => {
          if (error) {
              console.error('Transaction failed abnormally!', error);
          } else if (!committed) {
              console.error('We aborted the transaction (because product does not exist).');
          } else {
              console.log('Stock count updated!');
          }
          console.log("Snapshot of data: ", snapshot.val());
      });
  } else {
      console.error("Invalid count value");
      // Handle invalid input (e.g., not a number or negative number)
  }
}


document.getElementById('updateStockButton').addEventListener('click', addPocetSklad);

document.getElementById('productForm').addEventListener('submit', addProduct);
