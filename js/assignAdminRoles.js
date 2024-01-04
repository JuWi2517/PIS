function assignAdminRole() {
    const uid = document.getElementById('userUidInput').value;
    fetch('http://localhost:3000/assignAdmin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        
      },
      body: JSON.stringify({ uid })
    })
    .then(response => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error('Failed to assign admin role');
      }
    })
    .then(message => {
      alert(message);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  function removeAdminRole() {
    const uid = document.getElementById('userUidInput').value;
    fetch('http://localhost:3000/removeAdmin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        
      },
      body: JSON.stringify({ uid })
    })
    .then(response => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error('Failed to remove admin role');
      }
    })
    .then(message => {
      alert(message);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }