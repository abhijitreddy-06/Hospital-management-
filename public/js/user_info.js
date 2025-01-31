document.getElementById('login_form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value.trim();
  
    const requestBody = { username, email, phone, password };
  
    // Send login data to the server
    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });
  
    const data = await response.json();
  
    if (response.ok && data.success) {
        // Redirect with user details in the URL
        let url = `/homepage?username=${encodeURIComponent(data.username)}&email=${encodeURIComponent(data.email)}&phone=${encodeURIComponent(data.phone)}`;
        window.location.href = url;
    } else {
        alert(data.error);  // Show error message if login failed
    }
});

  