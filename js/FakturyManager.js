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
  function deleteFaktura(id) {
  }
    
  function getFakturaById(container,id){	
       
  }
  function getAllFaktury(container){
      
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

  async function renderOrder(orderId, downloadVar) {
    var database = firebase.database();
    var orderRef = database.ref('orders').child(orderId);
    var productsRef = database.ref('products');
    var suppliersRef = database.ref('suppliers');
    var usersRef = database.ref('users');

    var datumVystaveni = document.getElementById("datumVystaveni");
    var datumSplatnosti = document.getElementById("datumSplatnosti");
    var datumZdan = document.getElementById("datumZdan");
    var elementWithoutDPH = document.getElementById("totalWithoutDPH");
    var elementWithDPH = document.getElementById("totalWithDPH");
    var elementSazbaDPH = document.getElementById("totalSazbaDPH");

    var elementOdberatelJmeno = document.getElementById("odberatelJmeno");
    var elementOdberatelAdresa = document.getElementById("odberatelAdresa");
    var elementOdberatelPSC = document.getElementById("odberatelPSC");
    var elementOdberatelICO = document.getElementById("odberatelICO");

    try {
        const [orderSnapshot, productsSnapshot] = await Promise.all([orderRef.once('value'), productsRef.once('value')]);
        const order = orderSnapshot.val();
        const products = productsSnapshot.val();

        if (order) {
            var formattedDate = new Date(order.timestamp).toDateString();
            datumVystaveni.innerHTML = formattedDate;
            datumSplatnosti.innerHTML = formattedDate;
            datumZdan.innerHTML = formattedDate;

            const supplierSnapshot = await usersRef.child(order.userId).once('value');
            const supplier = supplierSnapshot.val();

            if (supplier) {
                elementOdberatelJmeno.innerHTML = supplier.name;
                elementOdberatelAdresa.innerHTML = supplier.street;
                elementOdberatelPSC.innerHTML = supplier.postalCode + " " + supplier.city;

                if (supplier.ico) {
                    elementOdberatelICO.innerHTML = "IČO: "+supplier.ico;
                }       
            }

            var polozkyDiv = document.getElementById('polozky');
            var table = document.createElement('table');
            table.style.display = 'table';
            table.style.width = '100%';
            table.style.margin = '20px';

            var headerRow = table.insertRow();
            ['Zboží', 'DPH', 'Cena za kus bez DPH', 'Cena za kus s DPH', 'Počet kusů', 'Cena Celkem'].forEach(function (headerText) {
                var headerCell = document.createElement('td');
                headerCell.textContent = headerText;
                headerRow.appendChild(headerCell);
            });

            var totalPriceWithoutDPH = 0;
            var totalPriceWithDPH = 0;

            order.items.forEach(function (item) {
                var product = products[item.productId];
                if (product) {
                    var row = table.insertRow();
                    ['name', 'dph', 'priceWithoutDPH', 'price', 'quantity', 'totalPrice'].forEach(function (property) {
                        var cell = row.insertCell();
                        if (property === 'dph') {
                            cell.textContent = '18%';
                        } else if (property === 'quantity') {
                            cell.textContent = item.quantity + " Ks";
                        } else if (property === 'priceWithoutDPH') {
                            var priceWithoutDPH = parseFloat(product['price']) * 0.82;
                            cell.textContent = priceWithoutDPH.toFixed(2) + " Kč";
                            totalPriceWithoutDPH += priceWithoutDPH * item.quantity;
                        } else if (property === 'totalPrice') {
                            var totalPrice = parseFloat(product['price']) * item.quantity;
                            cell.textContent = totalPrice.toFixed(2) + " Kč";
                            totalPriceWithDPH += totalPrice;
                        } else if (property === 'price') {
                            cell.textContent = product['price'] + ' Kč';
                        } else {
                            cell.textContent = product[property];
                        }
                    });
                }
            });
            elementSazbaDPH.innerHTML = (totalPriceWithDPH - totalPriceWithoutDPH).toFixed(2) + " Kč";
            elementWithDPH.innerHTML = totalPriceWithDPH.toFixed(2) + " Kč";
            elementWithoutDPH.innerHTML = totalPriceWithoutDPH.toFixed(2) + " Kč";

            polozkyDiv.appendChild(table);

            // Uložení faktury
            if (downloadVar == "true") {
                const element = document.getElementById("faktura");
                await html2pdf().from(element).save();
            }
        } else {
            console.log("Order with ID", orderId, "not found.");
        }
    } catch (error) {
        console.log('Error retrieving order or products:', error);
    }
}

async function renderNakup(orderId, downloadVar) {
    var database = firebase.database();
    var orderRef = database.ref('ordersMaterials').child(orderId);
    var materialsRef = database.ref('materials'); // Updated reference to 'materials' instead of 'products'
    var suppliersRef = database.ref('suppliers');
    var customerRef = database.ref('customers');

    var datumVystaveni = document.getElementById("datumVystaveni");
    var datumSplatnosti = document.getElementById("datumSplatnosti");
    var datumZdan = document.getElementById("datumZdan");
    var elementWithoutDPH = document.getElementById("totalWithoutDPH");
    var elementWithDPH = document.getElementById("totalWithDPH");
    var elementSazbaDPH = document.getElementById("totalSazbaDPH");

    var elementDodavatelJmeno = document.getElementById("dodavatelJmeno");
    var elementDodavatelAdresa = document.getElementById("dodavatelAdresa");
    var elementDodavatelPSC = document.getElementById("dodavatelPSC");
    var elementDodavatelICO = document.getElementById("dodavatelICO");

    try {
        const [orderSnapshot, materialsSnapshot] = await Promise.all([orderRef.once('value'), materialsRef.once('value')]);
        var order = orderSnapshot.val();
        var materials = materialsSnapshot.val();

        if (order) {
            var formattedDate = new Date(order.timestamp).toDateString();
            datumVystaveni.innerHTML = formattedDate;
            datumSplatnosti.innerHTML = formattedDate;
            datumZdan.innerHTML = formattedDate;

            const supplierSnapshot = await suppliersRef.child(order.supplierID).once('value');
            var supplier = supplierSnapshot.val();
            if (supplier) {
                elementDodavatelJmeno.innerHTML = supplier.name;
                elementDodavatelICO.innerHTML = supplier.ico;
                elementDodavatelAdresa.innerHTML = supplier.street;
                elementDodavatelPSC.innerHTML = supplier.postalCode + " " + supplier.city;
            }

            var polozkyDiv = document.getElementById('polozky');
            var table = document.createElement('table');
            table.style.display = 'table';
            table.style.width = '100%';
            table.style.margin = '20px';


            var headerRow = table.insertRow();
            ['Zboží', 'DPH', 'Cena za kus bez DPH', 'Cena za kus s DPH', 'Počet kusů', 'Cena Celkem'].forEach(function(headerText) {
                var headerCell = document.createElement('td');
                headerCell.textContent = headerText;
                headerRow.appendChild(headerCell);
            });

            var totalPriceWithoutDPH = 0;
            var totalPriceWithDPH = 0;

            order.items.forEach(function(item) {
                var material = materials[item.productId];
                if (material) {
                    var row = table.insertRow();
                    ['name', 'dph', 'priceWithoutDPH', 'price', 'quantity', 'totalPrice'].forEach(function(property) {
                        var cell = row.insertCell();
                        if (property === 'dph') {
                            cell.textContent = '18%';
                        } else if (property === 'quantity') {
                            cell.textContent = item.quantity + " Ks";
                        } else if (property === 'priceWithoutDPH') {
                            var priceWithoutDPH = parseFloat(material['price']) * 0.82;
                            cell.textContent = priceWithoutDPH.toFixed(2) + " Kč";
                            totalPriceWithoutDPH += priceWithoutDPH * item.quantity;
                        } else if (property === 'totalPrice') {
                            var totalPrice = parseFloat(material['price']) * item.quantity;
                            cell.textContent = totalPrice.toFixed(2) + " Kč";
                            totalPriceWithDPH += totalPrice;
                        } else if (property === 'price') {
                            cell.textContent = material['price'] + ' Kč';
                        } else {
                            cell.textContent = material[property];
                        }
                    });
                }
            });
            elementSazbaDPH.innerHTML = (totalPriceWithDPH - totalPriceWithoutDPH).toFixed(2) + " Kč";
            elementWithDPH.innerHTML = totalPriceWithDPH.toFixed(2) + " Kč";
            elementWithoutDPH.innerHTML = totalPriceWithoutDPH.toFixed(2) + " Kč";

            polozkyDiv.appendChild(table);

            // Uložení faktury
            if (downloadVar == "true") {
                const element = document.getElementById("faktura");
                await html2pdf().from(element).save();
            }
        } else {
            console.log("Order with ID", orderId, "not found.");
        }
    } catch (error) {
        console.log('Error retrieving order or materials:', error);
    }
}

