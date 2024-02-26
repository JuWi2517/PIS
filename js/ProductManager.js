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

//var database = firebase.database();



  
 
function createZbozi() {
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

        
			//const card = createBootstrapCard(productName, downloadURL, productDescription, productPrice, productId);
			//document.getElementById('productList').insertAdjacentHTML('beforeend', card);     
			window.location.href = "skladZbozi.html";					
			})
		.catch(error => {
			console.error('Error uploading image:', error);
		});  
	//window.location.href = "skladZbozi.html";	
}
function updateZbozi(id,data){
	const productName = document.getElementById('productName').value;
	const productImage = document.getElementById('productImage');
	const productDescription = document.getElementById('productDescription').value;
	const productPrice = document.getElementById('productPrice').value;
	const productStock = document.getElementById('eStock').value; 
	const productid = document.getElementById('eId').value; 
	const productImagePrev = document.getElementById('productImagePreview').src; 
	const productImageName = document.getElementById('uniqueImageNameBox').value; 
	/*
	const uniqueImageName = `${Date.now()}-${productImage.files[0].name}`;
	const newImageRef = storage.child(`product_images/${uniqueImageName}`);
	*/
	const newProductRef = database.ref('products/' + productid);
	
	if(productImage.files.length == 0){
		newProductRef.set({
			id: productid,  
			name: productName,
			imageURL: productImagePrev,
			description: productDescription,
			price: productPrice,
			imageName: productImageName,
			stockCount: productStock
		});
		window.location.href = "skladZbozi.html";
	} else {
		const uniqueImageName = `${Date.now()}-${productImage.files[0].name}`;
		const newImageRef = storage.child(`product_images/${uniqueImageName}`);
		const newProductRef = database.ref('products/' + productid);
		
		newImageRef.put(productImage)
			.then(snapshot => snapshot.ref.getDownloadURL())
				.then(downloadURL => {
					newProductRef.set({
						id: productid,  
					name: productName,
					imageURL: downloadURL,
					description: productDescription,
					price: productPrice,
					imageName: uniqueImageName,
					stockCount: productStock
			});
			

        
			//const card = createBootstrapCard(productName, downloadURL, productDescription, productPrice, productId);
			//document.getElementById('productList').insertAdjacentHTML('beforeend', card);     
			window.location.href = "skladZbozi.html";					
			})
		.catch(error => {
			console.error('Error uploading image:', error);
		}); 
		
	}
}
function deleteZbozi(id) {
	const productRef = database.ref('products/' + id);
  
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
			if (imageSnapshot.hasChildren() && imageSnapshot.numChildren() > 1){
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
  
function getZboziById(container,id){	
	var database = firebase.database();
	
	const productRef = database.ref('products/' + id);
	
	const productName = document.getElementById('productName');
	const productImage = document.getElementById('productImage');
	const productImagePreview = document.getElementById('productImagePreview');
	const productDescription = document.getElementById('productDescription');
	const productPrice = document.getElementById('productPrice');
	const productStock = document.getElementById('eStock'); 
	const productImageName = document.getElementById('uniqueImageNameBox');; 
	
	productRef.once('value')
	.then(snapshot => {
		const productData = snapshot.val();
		
		productName.value = productData.name;
		productImagePreview.src = productData.imageURL;
		productDescription.value = productData.description;
		productPrice.value = productData.price;
		productStock.value = productData.stockCount;
		productImageName.value = productData.imageName;
	

	})
	.catch(error => {
		console.error('Error fetching products:', error);
	});
	
}
function getAllZbozi(container){
	const products = new Array();
	var table = document.getElementById(container);
	var selectList = document.getElementById("skladInsertSelect");
	var removeSelectList = document.getElementById("skladRemoveSelect");
	table.innerHTML = "";
	var totalPrice = 0;
	var totalP1 = document.getElementById("totalP");
    		  
	var row = addRowCells(table,7); 
	setCellText(row,0,"Obrázek");	
	setCellText(row,1,"Název");	
	setCellText(row,2,"Popis");	
	setCellText(row,3,"Kusů zboží");
	setCellText(row,4,"Cena za kus");
	setCellText(row,5,"Cena za zboží celkem");	
    
	database.ref('products').once('value')
	.then(snapshot => {
		snapshot.forEach(childSnapshot => {
			const productData = childSnapshot.val();
          
			var cellOBR = '<img src="' + productData.imageURL + '" style="width:100px;height:100px;">' ;
			
			var totalPriceProduct = productData.price * productData.stockCount;
			
			var cellRemove = '<input class="btn btn-danger" type="submit" onclick="deleteProduct(\'' + childSnapshot.key + '\');" value="Smazat">'; 
			var cellEdit = '<a href="editZbozi.html?id=' + childSnapshot.key + '" class="btn btn-primary">Editovat</a>';
			
			var row = addRowCells(table,8); 
			setCellText(row,0,cellOBR);	
			setCellText(row,1,productData.name);	
			setCellText(row,2,productData.description);	
			setCellText(row,3,productData.stockCount);
			setCellText(row,4,productData.price + " Kč");
			setCellText(row,5,totalPriceProduct + " Kč");
			setCellText(row,6,cellEdit);
			setCellText(row,7,cellRemove);				

			totalPrice += totalPriceProduct;
			selectList.innerHTML += '<option value="' + childSnapshot.key + '">' + productData.name + '</option>';
           removeSelectList.innerHTML += '<option value="' + childSnapshot.key + '">' + productData.name + '</option>';
			    
		});
		var row = addRowCells(table,8); 
		setCellText(row,5,totalPrice + " Kč");		
	})
	.catch(error => {
		console.error('Error fetching products:', error);
	});
    
	return products;
}	
function getProduktEshopById(container,id){
	const productRef = database.ref('products/' + id);
	const con = document.getElementById(container);
	
	productRef.once('value')
	.then(snapshot => {
		const productData = snapshot.val();
		
		const productName = productData.name;
		const imageURL = productData.imageURL;
		const productDescription = productData.description;
		const productPrice = productData.price;
		const productId = productData.id; 	

		const name = document.getElementById("nazevZbozi");
		name.innerHTML = productName;
		
		const img = document.getElementById("imgZbozi");
		img.src = imageURL;
		
		const description = document.getElementById("descriptionZbozi");
		description.innerHTML = productDescription;
		
		const price = document.getElementById("priceZbozi");
		price.innerHTML = productPrice + " Kč";

	})
	.catch(error => {
		console.error('Error fetching products:', error);
	}); 
}
function addPocetSklad() {
	var database = firebase.database();
	var productId = document.getElementById("skladInsertSelect").value;
	var newCount = parseInt(document.getElementById("addCountProduct").value); 
	
	if(!isNaN(newCount) && newCount >= 0) {      
		var productRef = database.ref('materials/' + productId); 

		productRef.transaction((product) => {
		if (product) {
			product.stock += newCount; 
			location.reload("skladMaterial.html")
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
	}
	location.reload("skladMaterial.html");  
}
function removePocetSklad() {
	var database = firebase.database();
	var productId = document.getElementById("skladRemoveSelect").value;
	var newCount = parseInt(document.getElementById("removeCountProduct").value); 

	if (!isNaN(newCount) && newCount > 0) {  
		var productRef = database.ref('materials/' + productId); 

		productRef.transaction((product) => {
		if (product) {
            if(product.stock > 0)
              product.stock -= newCount; 
              location.reload("skladMaterial.html")   
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
	}
	location.reload("skladMaterial.html");  
}
function getAllSelect(container){
	var database = firebase.database();
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
function addRowCells(table,count){
	var row = table.insertRow();
	for (let i = 0; i < count; i++) {
		row.insertCell(i);
	}
	return row;
}	
function setCellText(row,indexCell,txt){
	row.cells[indexCell].innerHTML = txt;	
}
