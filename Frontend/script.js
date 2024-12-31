document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;

        fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        })
        .then(response => response.json())
        .then(data => {
            alert('User registered successfully!');
            window.location.href = 'login.html';  // Redirect to login page
        })
        .catch(error => alert('Registration failed: ' + error));
    });
});
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())  // Parse the response as JSON
        .then(data => {
            if (data.token) {
                // Store the token in localStorage or sessionStorage
                localStorage.setItem('token', data.token);
                window.location.href = 'Home.html';  // Redirect to booking page
            } else {
                alert('Login failed: ' + data.message);  // Display the error message from the backend
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Login failed');
        });
    });
});