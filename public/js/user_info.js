document.getElementById('login_form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  // Prepare request data
  const requestBody = { username };
  if (email) requestBody.email = email;  // Only add email if it's not empty
  if (phone) requestBody.phone = phone;
  // Send login data to the server
  const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
  });

  const data = await response.json();

  if (response.ok) {
      let url = `http://localhost:3000/homepage?username=${encodeURIComponent(data.username)}`;
      if (data.email) url += `&email=${encodeURIComponent(data.email)}`; // Add email only if it exists
      if (data.phone) url += `&phone=${encodeURIComponent(data.phone)}`; 
      window.location.href = url;
  } else {
      alert(data.error);
  }
});
