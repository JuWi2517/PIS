//const crypto = require('crypto');

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
const auth = firebase.auth();

 
function registerCustomer() {
	const database = firebase.database();	
	const customerEmail = document.getElementById('cEmail').value;
	const customerPass1 = document.getElementById('cPass1').value;
	const customerPass2 = document.getElementById('cPass2').value;
	const customerName = document.getElementById('cName').value;
	const customerStreet = document.getElementById('cStreet').value;
	const customerCity = document.getElementById('cCity').value;
	const customerPostalCode = document.getElementById('cPostCode').value;
	const customerTel = document.getElementById('cTel').value;
	if(customerPass1 == customerPass2){	
		
		const newCustomerRef = database.ref('customers').push();
		
		auth.createUserWithEmailAndPassword(customerEmail, customerPass1)
		.then((userCredential) => {
			const user = userCredential.user;			
			database.ref('customers/' + user.uid).set({
				email: customerEmail,
				uid: user.uid,
				name: customerName,
				street: customerStreet,
				city: customerCity,
				postalCode: customerPostalCode,
				tel: customerTel
			});
			console.log("Registrace se zdařila")
		})
		.catch((error) => {
			console.log('Účet už byl zaregistrován: ' + error)
		});
		window.location.href = "index.html"
	} else {
		console.log("hesla nejsou shodna");
	}
}
function login(event){
	event.preventDefault();
	
	console.log("Přihlašování");
	const email = document.getElementById('emailInput').value;
	const password = document.getElementById('passwordInput').value;
	
	auth.signInWithEmailAndPassword(email, password)      
	.then((userCredential) => {
		console.log('User logged in:', userCredential.user.uid);		
		window.location.href = 'index.html?userid=' +  userCredential.user.uid;
	})
	.catch((error) => {
		alert("Špatný email nebo heslo")
		console.error('Login error:', error);
	});
	
}
function updateCustomer(id,data){
	const database = firebase.database();	
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
function deleteCustomer(productId) {
	const database = firebase.database();	
	const productRef = database.ref('suppliers/' + productId);
	productRef.remove();
	location.reload("dodavatele.html");
}
  
  
function getCustomerById(container,id){
	const database = firebase.database();

	const customerName = document.getElementById('dataName');
	const customerAdress = document.getElementById('dataAdress');
	const customerEmail = document.getElementById('dataEmail');
	const customerPhone = document.getElementById('dataTel');
	
	database.ref('customers').once('value')
	.then(snapshot => {
		snapshot.forEach(childSnapshot => {		 
			const customerData = childSnapshot.val();

			if(childSnapshot.key == id){
				customerName.innerHTML = customerData.name;
				customerAdress.innerHTML  = customerData.street + ", " + customerData.postalCode + " " + customerData.city;			
				customerEmail.innerHTML  = customerData.email;
				customerPhone.innerHTML  = customerData.tel;
				
				//console.log(customerData);
			}
		});
	})
	.catch(error => {
		console.error('Error fetching products:', error);
	});  
}
function getAllCustomers(container){
	const database = firebase.database();	
	const products = new Array();
	
	var table = document.getElementById(container);
	
	var row = addRowCells(table,6); 
	setCellText(row,0,"Jméno a příjmení");	
	setCellText(row,1,"Adresa");	
	setCellText(row,2,"Email");	
	setCellText(row,3,"Telefon");
	setCellText(row,4,"Počet Objednávek");
	
	 
	database.ref('customers').once('value')
	.then(snapshot => {
		snapshot.forEach(childSnapshot => {
			const customerData = childSnapshot.val();          
		  
			var row = addRowCells(table,6); 
			var showUserButton = '<a href="showUzivatel.html?id=' + childSnapshot.key + '" class="btn btn-primary">Zobrazit</a>';
		
		setCellText(row,0,customerData.name);	
		setCellText(row,1,customerData.street + ", " + customerData.postalCode + " " + customerData.city);	
		setCellText(row,2,customerData.email);	
		setCellText(row,3,customerData.tel);
		setCellText(row,4,0);
		setCellText(row,5,showUserButton);
			
		});
			   
	})
	.catch(error => {
		console.error('Error fetching products:', error);
	});
    
	return products;

}	
function getAllCustomersSelect(container){
	const database = firebase.database();	
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
function isCustomer(id){
	const database = firebase.database();
	const productRef = database.ref('customers/' + id);
	const adminSection = document.getElementById('adminSection');
	const loginSection = document.getElementById('loginSection');
	const loginSection2 = document.getElementById('loginSection2');
	const userSection = document.getElementById('userSection');
	const userSectionA = document.getElementById('userSectionA');
	
	if(id != ''){
		productRef.once('value').then(snapshot => {
		const productData = snapshot.val();
		if (!productData) {
			console.log("neni zakaznik");
			loginSection.style.display = "none";
			loginSection2.style.display = "none";
			userSection.style.display = "none";
			return false;
		} else {
			adminSection.style.display = "none";
			loginSection.style.display = "none";
			loginSection2.style.display = "none";
			userSection.style.display = "block";
			userSectionA.href = "showProfileUzivatel.html?id=" + snapshot.key;
			
			console.log("je zakaznik");
			return true;
		}
		});
	} else {
		userSection.style.display = "none";
	}
	
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
  





  


