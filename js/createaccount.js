document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Password Visibility Toggle
    const togglePassIcons = document.querySelectorAll('.toggle-pass');

    togglePassIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const isPassword = input.getAttribute('type') === 'password';
            
            input.setAttribute('type', isPassword ? 'text' : 'password');
            
            // Toggle icon classes
            this.classList.toggle('ph-eye');
            this.classList.toggle('ph-eye-slash');
        });
    });

    // 2. Form Submission with SweetAlert2
    const authForm = document.getElementById('authForm');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const mainPass = document.getElementById('main-pass');
    const confirmPass = document.getElementById('confirm-pass');
    const agreeCheckbox = document.getElementById('agree');

    authForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission

        // Get values
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const password = mainPass.value.trim();
        const confirmPassword = confirmPass.value.trim();

        // Validation 1: Check if all fields are filled
        if (!email || !phone || !password || !confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill in all fields!',
                confirmButtonColor: '#ff7d29'
            });
            return;
        }

        // Validation 2: Email format
        if (!email.includes("@")) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Email',
                text: 'Please enter a valid email address!',
                confirmButtonColor: '#ff7d29'
            });
            emailInput.classList.add('invalid');
            return;
        } else {
            emailInput.classList.remove('invalid');
        }

        // Validation 3: Phone number length
        if (phone.length < 10) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Phone Number',
                text: 'Please enter a valid phone number (at least 10 digits)!',
                confirmButtonColor: '#ff7d29'
            });
            phoneInput.classList.add('invalid');
            return;
        } else {
            phoneInput.classList.remove('invalid');
        }

        // Validation 4: Password length
        if (password.length < 6) {
            Swal.fire({
                icon: 'error',
                title: 'Weak Password',
                text: 'Password must be at least 6 characters long!',
                confirmButtonColor: '#ff7d29'
            });
            mainPass.classList.add('invalid');
            return;
        } else {
            mainPass.classList.remove('invalid');
        }

        // Validation 5: Passwords match
        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Password Mismatch',
                text: 'Passwords do not match! Please try again.',
                confirmButtonColor: '#ff7d29'
            });
            confirmPass.classList.add('invalid');
            return;
        } else {
            confirmPass.classList.remove('invalid');
        }

        // Validation 6: Terms acceptance
        if (!agreeCheckbox.checked) {
            Swal.fire({
                icon: 'warning',
                title: 'Terms & Conditions',
                text: 'Please agree to the Terms & Conditions and Privacy Policy!',
                confirmButtonColor: '#ff7d29'
            });
            return;
        }

        // Check if user already exists
        const existingUsers = JSON.parse(localStorage.getItem('chuksKitchenUsers')) || [];
        const userExists = existingUsers.find(user => user.email === email);

        if (userExists) {
            Swal.fire({
                icon: 'info',
                title: 'Account Exists',
                text: 'This email is already registered! Please login instead.',
                confirmButtonColor: '#ff7d29',
                showCancelButton: true,
                cancelButtonText: 'Stay Here',
                confirmButtonText: 'Go to Login'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = 'login.html';
                }
            });
            return;
        }

        // Create new user object
        const newUser = {
            email: email,
            phone: phone,
            password: password,
            createdAt: new Date().toISOString()
        };

        // Add to users array
        existingUsers.push(newUser);

        // Save to localStorage
        localStorage.setItem('chuksKitchenUsers', JSON.stringify(existingUsers));

        // Save current user session
        localStorage.setItem('chuksKitchenCurrentUser', JSON.stringify({
            email: email,
            phone: phone
        }));

        // Show success message with animation
        Swal.fire({
            icon: 'success',
            title: 'Account Created! 🎉',
            html: `Welcome to <strong>Chuks Kitchen</strong>!<br>Redirecting to homepage...`,
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            willClose: () => {
                // Clear form
                authForm.reset();
            }
        }).then(() => {
            // Redirect to homepage
            window.location.href = "hompage.html";
        });
    });

    // 3. Back to Top Button
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});