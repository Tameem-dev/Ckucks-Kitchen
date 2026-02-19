document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Password Visibility Toggle
    const eyeIcon = document.getElementById('eyeIcon');
    const passwordInput = document.getElementById('passwordInput');

    if (eyeIcon && passwordInput) {
        eyeIcon.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            eyeIcon.classList.toggle('ph-eye');
            eyeIcon.classList.toggle('ph-eye-slash');
        });
    }

    // 2. Login Form Handling with SweetAlert2
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('emailInput');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent form reload

            // Get input values
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            // Validation 1: Check if fields are empty
            if (!email || !password) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please fill in all fields!',
                    confirmButtonColor: '#ff7d29'
                });
                return;
            }

            // Validation 2: Email format (basic check)
            if (!email.includes("@")) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Email',
                    text: 'Please enter a valid email address!',
                    confirmButtonColor: '#ff7d29'
                });
                return;
            }

            // Validation 3: Password length
            if (password.length < 6) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Password',
                    text: 'Password must be at least 6 characters long!',
                    confirmButtonColor: '#ff7d29'
                });
                return;
            }

            // Get users from localStorage
            const existingUsers = JSON.parse(localStorage.getItem('chuksKitchenUsers')) || [];

            // Find user with matching email and password
            const user = existingUsers.find(u => u.email === email && u.password === password);

            if (user) {
                // Login successful
                // Save current user session
                localStorage.setItem('chuksKitchenCurrentUser', JSON.stringify({
                    email: user.email,
                    phone: user.phone
                }));

                // Show success message
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful! 🎉',
                    html: `Welcome back to <strong>Chuks Kitchen</strong>!<br>Redirecting...`,
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    willClose: () => {
                        // Clear form
                        loginForm.reset();
                    }
                }).then(() => {
                    // Redirect to homepage
                    window.location.href = "hompage.html";
                });

            } else {
                // Login failed - user not found or wrong password
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: 'Invalid email or password. Please try again.',
                    confirmButtonColor: '#ff7d29',
                    footer: '<a href="createaccount.html" style="color: #3b82f6; text-decoration: none; font-weight: 600;">Don\'t have an account? Sign up here</a>'
                });
            }
        });
    }

    // 3. Back to Top Scroll
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 4. Check if user is already logged in (optional)
    const currentUser = localStorage.getItem('chuksKitchenCurrentUser');
    if (currentUser) {
        // User is already logged in - ask if they want to continue
        Swal.fire({
            icon: 'info',
            title: 'Already Logged In',
            text: 'You are already logged in. Go to homepage?',
            confirmButtonColor: '#ff7d29',
            showCancelButton: true,
            confirmButtonText: 'Yes, go to homepage',
            cancelButtonText: 'Logout and login again'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "hompage.html";
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // Logout user
                localStorage.removeItem('chuksKitchenCurrentUser');
                Swal.fire({
                    icon: 'success',
                    title: 'Logged Out',
                    text: 'You can now login with a different account',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    }
});