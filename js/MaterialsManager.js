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



  
 
function createMaterial() {
	var database = firebase.database();
	
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
	window.location.href = "skladMaterial.html";
}
function updateMaterial(id,data){
	var database = firebase.database();
	const materialName = document.getElementById('mName').value;
	const materialDescription = document.getElementById('mDescription').value;
	const materialPrice = document.getElementById('sPrice').value;
	const materialUnit = document.getElementById('sUnit').value;
	const materialSupplier = document.getElementById('sSupplier').value;
	var idSupplierHid = document.getElementById('materialId');
	var countStock = document.getElementById('mCountStock').value;
	
	id = idSupplierHid.value;
	
	const newSupplierRef = database.ref('materials/' + id);
		newSupplierRef.set({  		
			name: materialName,
			description: materialDescription,
			price: materialPrice,
			unit: materialUnit,
			supplier: materialSupplier,
			stock: countStock
	});
	window.location.href = "skladMaterial.html";
}
function deleteMaterial(id) {
	var database = firebase.database();
	const productRef = database.ref('materials/' + id);
	productRef.remove();
	location.reload("skladMaterial.html");  
}
  
function getMaterialById(container,id){	
var database = firebase.database();
	const con = document.getElementById(container);
	
	//const productRef = database.ref('products/' + id);

	 database.ref('materials').once('value')
	.then(snapshot => {
		snapshot.forEach(childSnapshot => {
		const materialData = childSnapshot.val();
		const materialName = materialData.name;
		const materialDescription = materialData.description;
		const materialPrice = materialData.price;
		const materialUnit = materialData.unit;
		const materialSupplier = materialData.supplier;
		const materialStock = materialData.stock;
	
		const productId = childSnapshot.key; 
		if(productId == id){
			const materialNameG = document.getElementById('mName');
			const materialDescriptionG = document.getElementById('mDescription');
			const materialPriceG = document.getElementById('sPrice');
			const materialUnitG = document.getElementById('sUnit');
			const materialSupplierG = document.getElementById('sSupplier');
			var countStock = document.getElementById('mCountStock');

			materialNameG.value = materialName;
			materialDescriptionG.value = materialDescription;
			materialPriceG.value = materialPrice;
			materialUnitG.value = materialUnit;
			materialSupplierG.value = materialSupplier,
			countStock.value = materialStock	
		}
		});
	})
	.catch(error => {
		console.error('Error fetching products:', error);
	});
}
function getAllMaterials(container){
	var database = firebase.database();
	const products = new Array();
	var table = document.getElementById(container);
	
	var totalPrice = 0;
	table.innerHTML = "";
	
	var row = addRowCells(table,7); 
	setCellText(row,0,"Název");	
	setCellText(row,1,"Popis");	
	setCellText(row,2,"Dodavatel");	
	setCellText(row,3,"Cena za jednotku");
	setCellText(row,4,"Jednotek na skladu");
	setCellText(row,5,"Celková cena materiálu");	
	
	database.ref('materials').once('value')
	.then(snapshot => {
		snapshot.forEach(childSnapshot => {
			const materialData = childSnapshot.val();			
  
			var materialPrice = materialData.stock * materialData.price;
			var removeMaterialButton = '<input class="btn btn-danger"type="submit" onclick="deleteMaterial(\'' + childSnapshot.key + '\');" value="Smazat">';
			var editMaterialButton = '<a href="editMaterial.html?id=' + childSnapshot.key + '" class="btn btn-primary">Editovat</a>';
			totalPrice += materialPrice;
			
			var row = addRowCells(table,8); 
			setCellText(row,0,materialData.name);	
			setCellText(row,1,materialData.description);	
			setCellText(row,2,materialData.supplier);	
			setCellText(row,3,materialData.price + " Kč /" + materialData.unit);
			setCellText(row,4,materialData.stock);
			setCellText(row,5,materialPrice + " Kč");
			setCellText(row,6,editMaterialButton);
			setCellText(row,7,removeMaterialButton);			
			
		});
		
		var row = addRowCells(table,7); 
		setCellText(row,5, totalPrice + " Kč");
		
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
