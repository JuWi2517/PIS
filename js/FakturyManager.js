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

const database = firebase.database();
const storage = firebase.storage().ref();
 
function createFaktura(id) {
	const materialName = document.getElementById('mName').value;
	const materialDescription = document.getElementById('mDescription').value;
	const materialPrice = document.getElementById('sPrice').value;
	const materialUnit = document.getElementById('sUnit').value;
	const materialSupplier = document.getElementById('sSupplier').value;

	const newMaterialRef = database.ref('materials').push();
	
	newMaterialRef.set({  
		name: materialName,
		description: materialDescription,
		price: materialPrice,
		unit: materialUnit,
		supplier: materialSupplier,
		stock: 0
	});
      
}
function updateFaktura(id,data){
	  
}
function deleteMaterial(id) {
	const productRef = database.ref('materials/' + id);
	return productRef.remove();  
}
  
function getFakturaById(container,id){	
	const con = document.getElementById(container);
	
	database.ref('products').once('value')
		.then(snapshot => {
		snapshot.forEach(childSnapshot => {
		
			const productData = childSnapshot.val();
			const productName = productData.name;
			const imageURL = productData.imageURL;
			const productDescription = productData.description;
			const productPrice = productData.price;
			const productId = productData.id; 

			if(productId == id){
				var h1 = document.createElement('H1'); 
				h1.innerHTML = productName;
				con.appendChild(h1);
			  
				var root = document.createElement('div');
				root.style.display = "table";
				
				
				var imageProductRoot = document.createElement('div');
				imageProductRoot.style.display = "table-cell";
				var imageProduct = document.createElement('img');
				imageProduct.src = imageURL;
				imageProductRoot.appendChild(imageProduct);
				
				root.appendChild(imageProductRoot);		  
				
				
				var descriptionRoot = document.createElement('div'); 
				descriptionRoot.style.display = "table-cell";
				var descriptionBox = document.createElement('div'); 
				descriptionBox.innerHTML = productDescription;
				descriptionRoot.appendChild(descriptionBox);
			  
			  
				var priceBox = document.createElement('div');
				priceBox.innerHTML = productPrice;
				descriptionRoot.appendChild(priceBox);
				
				root.appendChild(descriptionRoot);
				
				con.appendChild(root);
			}
		});
		})
	catch(error => {
		console.error('Error fetching products:', error);
	});  
}
function getAllFaktury(container){
	const products = new Array();
	var table = document.getElementById(container);
	
	var totalPrice = 0;
	table.innerHTML = "";
        
	database.ref('materials').once('value')
	.then(snapshot => {
		snapshot.forEach(childSnapshot => {
			const materialData = childSnapshot.val();
			
			var row = table.insertRow();
          
        
			var cellNazev = row.insertCell(0);
			var cellDecription = row.insertCell(1);
			var cellSupplier = row.insertCell(2);
			var cellPriceUnit = row.insertCell(3);
			var cellStock = row.insertCell(4);
			var cellTotalMaterial = row.insertCell(5);
			var removeMaterial = row.insertCell(6);
			var editMaterial = row.insertCell(7);

			cellNazev.innerHTML = materialData.name;
			cellDecription.innerHTML = materialData.description;
			cellSupplier.innerHTML = materialData.supplier;
			cellPriceUnit.innerHTML = materialData.price + " /" + materialData.unit;
			cellStock.innerHTML = materialData.stock;
			
			var materialPrice = materialData.stock * materialData.price;
			cellTotalMaterial.innerHTML = materialPrice;
			totalPrice += materialPrice;
			
			removeMaterial.innerHTML = '<input type="submit" onclick="deleteMaterial(\'' + childSnapshot.key + '\');" value="Smazat">';
			editMaterial.innerHTML = '<input type="submit" onclick="" value="Upravit">';          
            
			var row = table.insertRow();          
		});
		var row = table.insertRow();
		var cellTotal = row.insertCell(0);
		var cellDecription = row.insertCell(1);
		var cellSupplier = row.insertCell(2);
		var cellPriceUnit = row.insertCell(3);
		var cellStock = row.insertCell(4);
		var cellTotalMaterial = row.insertCell(5);
		cellTotalMaterial.innerHTML = totalPrice;
		
	})
	.catch(error => {
		console.error('Error fetching products:', error);
	});    
}	
  
function getAllSelect(container){
	const products = new Array();
	var selectList = document.getElementById(container);
	        
	database.ref('materials').once('value')
	.then(snapshot => {
		snapshot.forEach(childSnapshot => {
			const materialData = childSnapshot.val();
			
			selectList.innerHTML += '<option value="' + childSnapshot.key + '">' + materialData.name + '</option>';     
		});
	})
	.catch(error => {
		console.error('Error fetching products:', error);
	});
}
	
function printF(container){
	console.log(container.value);
	
	const element = document.getElementById(container);
	html2pdf().from(container).save();
}






  


