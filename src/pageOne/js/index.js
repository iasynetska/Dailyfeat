let next = document.querySelector('#nextButton');
let registration = document.querySelector('.registration');
let emailInput = registration.querySelector('input[type=email]');
let emailOptin = document.querySelector('.emailOptin'); 

function nextStep() {
    if (!emailInput.value) {
        emailInput.style.boxShadow = '0px 0px 10px red';
        emailInput.addEventListener('change', () => {
            emailInput.style.boxShadow = '0px 0px 15px rgba(0, 0, 0, 0.329)';
        });
        return;
    };
    registration.classList.add('extinction');
    emailOptin.style.display = 'flex';
    registration.addEventListener('animationend', () => {
        registration.style.display = 'none';
        
    })
}

next.addEventListener('click', nextStep);