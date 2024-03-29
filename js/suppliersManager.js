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
 
function createSupplier() {
	const supplierName = document.getElementById('sName').value;
	const supplierPerson = document.getElementById('sPerson').value;
	const supplierEmail = document.getElementById('sEmail').value;
	const supplierPhone = document.getElementById('sPhone').value;
	const supplierAdress = document.getElementById('sAddress').value;
	const supplierBankAcount = document.getElementById('sBankAccount').value;

	const newSupplierRef = database.ref('suppliers').push();
	newSupplierRef.set({  
		name: supplierName,
		person: supplierPerson,
		email: supplierEmail,
		phone: supplierPhone,
		adress: supplierAdress,
		bank_account: supplierBankAcount
	});
	window.location.href = "dodavatele.html";
	
}
function updateSupplier(id,data){
	  
	const supplierName = document.getElementById('sName').value;
	const supplierPerson = document.getElementById('sPerson').value;
	const supplierEmail = document.getElementById('sEmail').value;
	const supplierPhone = document.getElementById('sPhone').value;
	const supplierAdress = document.getElementById('sAddress').value;
	const supplierBankAcount = document.getElementById('sBankAccount').value;
	var idSupplierHid = document.getElementById('idSupplier');	
	id = idSupplierHid.value;
	
	const newSupplierRef = database.ref('suppliers/' + id);
		newSupplierRef.set({  		
			name: supplierName,
			person: supplierPerson,
			email: supplierEmail,
			phone: supplierPhone,
			adress: supplierAdress,
			bank_account: supplierBankAcount
		});
	window.location.href = "dodavatele.html";
}
function deleteSupplier(productId) {
	const productRef = database.ref('suppliers/' + productId);
	productRef.remove();
	location.reload("dodavatele.html");
}
  
function getSupplierById(container,id){
	const supplierName = document.getElementById('sName');
	const supplierPerson = document.getElementById('sPerson');
	const supplierEmail = document.getElementById('sEmail');
	const supplierPhone = document.getElementById('sPhone');
	const supplierAdress = document.getElementById('sAddress');
	const supplierBankAcount = document.getElementById('sBankAccount');
	
	database.ref('suppliers').once('value')
	.then(snapshot => {
		snapshot.forEach(childSnapshot => {		 
			const supplierData = childSnapshot.val();

			if(childSnapshot.key == id){
				supplierName.value = supplierData.name;
				supplierPerson.value  = supplierData.person;
				supplierEmail.value  = supplierData.email;
				supplierPhone.value  = supplierData.phone;
				supplierAdress.value  = supplierData.adress;
				supplierBankAcount.value  = supplierData.bank_account;			
			}
		});
	})
	.catch(error => {
		console.error('Error fetching products:', error);
	});  
}
function getAllSuppliers(container){
	const products = new Array();
	var table = document.getElementById(container);
	table.innerHTML = "";
	var row = addRowCells(table,8); 
	setCellText(row,0,"Název Dodavatele");	
	setCellText(row,1,"Kontaktní osoba");	
	setCellText(row,2,"Adresa");	
	setCellText(row,3,"Email");
	setCellText(row,4,"Telefon");
	setCellText(row,5,"Bankovní účet");
	 
	database.ref('suppliers').once('value')
	.then(snapshot => {
		snapshot.forEach(childSnapshot => {
			const supplierData = childSnapshot.val();          
		  
			var cellUpdate = '<a href="editDodavatel.html?id=' + childSnapshot.key + '" class="btn btn-primary">Editovat</a>';
			var cellRemove = '<input class="btn btn-danger" type="submit" onclick="deleteSupplier(\'' + childSnapshot.key + '\');" value="Smazat">';  
			var row = addRowCells(table,8); 
			setCellText(row,0,supplierData.name);	
			setCellText(row,1,supplierData.person);	
			setCellText(row,2,supplierData.adress);	
			setCellText(row,3,supplierData.email);
			setCellText(row,4,supplierData.phone);
			setCellText(row,5,supplierData.bank_account);
			setCellText(row,6,cellUpdate);
			setCellText(row,7,cellRemove);
			
		});
			   
	})
	.catch(error => {
		console.error('Error fetching products:', error);
	});
    
	return products;

}	
function getAllSuppliersSelect(container){
		const products = new Array();	  
		var selectList = document.getElementById(container);
        
		database.ref('suppliers').once('value')
		.then(snapshot => {
			snapshot.forEach(childSnapshot => {
			const supplierData = childSnapshot.val();         
		  
			selectList.innerHTML += '<option value="' + childSnapshot.key + '">' + supplierData.name + '</option>';   
		});  
	})
	.catch(error => {
		console.error('Error fetching products:', error);
	});
    
	return products;	  
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
  





  


