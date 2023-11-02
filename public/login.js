$(document).ready(function () {
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const errorText = document.getElementById('errorText');
    const passwordInput = document.getElementById('password');

    function login() {
        const emailInput = document.getElementById('email').value;
        const passwordInput = document.getElementById('password').value;

        $.get('/api/users', function(users){
            let userFound = false;
            users.forEach(function(user){
                if (user.email === emailInput) {
                    userFound = true;
                    if (user.password === passwordInput) {
                        // Redirect to the next page if email and password match
                        // Assuming userEmailAddress contains the email address
                        if (user.role === 1) {
                            window.location.href = 'mentor.html?email=' + encodeURIComponent(user.email);
                        } else {
                            window.location.href = 'mentee.html?email=' + encodeURIComponent(user.email);
                        }
                    } else {
                        errorText.textContent = 'Incorrect password';
                    }
                }
            });
            
            if (!userFound) {
                errorText.textContent = 'User not found';
            }
        });
            
    }

    // Event listener for the login button click
    loginButton.addEventListener('click', login);

    document.addEventListener('keydown', function(event) {
        // Check if the pressed key is "Enter"
        if (event.key === 'Enter' || event.key === 'NumpadEnter') {
            // Your code to execute when Enter is pressed
            // For example, you can call a function or perform an action here
            // E.g., submit a form, trigger a button click, etc.
            login();
        }
    });
});