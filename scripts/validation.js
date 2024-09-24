function validateName() {
    document.getElementById('name').addEventListener('input', function(e) {
        let name = e.target.value;
        let pattern = /^[A-Za-z ]+$/;
        if (name.match(pattern)) {
          e.target.setCustomValidity('');
        } else {
          e.target.setCustomValidity('Please enter name and use letters only');
        }
      });
      console.log(email);
      
    }

function validateEmail() {
document.getElementById('email').addEventListener('input', function(e) {
    let email = e.target.value;
    let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.match(pattern)) {
      e.target.setCustomValidity('');
    } else {
      e.target.setCustomValidity('Please enter a valid email address. Example: user@example.de');
    }
  });
  console.log(email);
  
}

function validatePasswordMatch() {
    const password = document.getElementById('password');
const confirm = document.getElementById('confirm_password');
confirm.addEventListener('input', function(event) {
    if (password.value !== confirm.value) {
        confirm.setCustomValidity('Passwords do not match.');
    } else {
        confirm.setCustomValidity('');
    }
});
}