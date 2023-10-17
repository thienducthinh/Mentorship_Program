function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');

    // Check the current type of the input field
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
}
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    const passwordButton = document.getElementById('showPasswordButton');
    passwordButton.addEventListener('click', function () {
        togglePasswordVisibility();
    });
});