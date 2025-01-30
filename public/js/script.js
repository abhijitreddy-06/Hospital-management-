const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
const profileButton = document.querySelector('.profile-button');
const menuBar = document.getElementById('menuBar');

// Toggle burger menu for navigation links
if (burger && navLinks) {
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}
// Toggle profile dropdown menu
if (profileButton && menuBar) {
  profileButton.addEventListener('click', () => {
    menuBar.style.display = menuBar.style.display === 'block' ? 'none' : 'block';
  });
}
// Close menus if clicking outside
document.addEventListener('click', function (event) {
  // Close burger menu if clicking outside
  if (
    navLinks &&
    !burger.contains(event.target) &&
    !navLinks.contains(event.target)
  ) {
    navLinks.classList.remove('active');
  }
  // Close profile menu if clicking outside
  if (
    profileButton &&
    menuBar &&
    !profileButton.contains(event.target) &&
    !menuBar.contains(event.target)
  ) {
    menuBar.style.display = 'none';
  }
});
//send total appointments to homepage
fetch('/api/appointments')
      .then(response => response.json())
      .then(data => {
        const totalAppointments = document.getElementById('totalAppointments');
        totalAppointments.textContent = data.totalAppointments; // Update the UI
      })
      .catch(error => {
        console.error('Error:', error);
        const totalAppointments = document.getElementById('totalAppointments');
        totalAppointments.textContent = 'Error loading appointments'; // Handle errors gracefully
      });
//