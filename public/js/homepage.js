document.addEventListener('DOMContentLoaded', () => {
  // Function to get URL parameter by name
  function getUrlParameter(name) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
  }

  // Get the username, email, and phone from the URL query string
  const username = getUrlParameter('username');
  const email = getUrlParameter('email');
  const phone = getUrlParameter('phone');

  // Display the welcome message if username exists
  const welcomeMessageElement = document.getElementById('welcomeMessage');
  if (username) {
      welcomeMessageElement.textContent = `Welcome, ${username}!`;
  } else {
      welcomeMessageElement.textContent = 'Welcome, Guest!';
  }

  // Display email
  const emailElement = document.getElementById('user_email_id');
  if (email) {
      emailElement.textContent = `${email}`;
  } else {
      emailElement.textContent = 'User email';
  }

  // Display phone number
  const phoneElement = document.getElementById('user_phone_no');
  if (phone) {
      phoneElement.textContent = `${phone}`;
  } else {
      phoneElement.textContent = 'User phone number';
  }
});
