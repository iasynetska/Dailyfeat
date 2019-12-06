let next = document.querySelector('#nextButton');
let registration = document.querySelector('.registration');
let emailOptin = document.querySelector('.emailOptin'); 

function nextStep() {
    registration.classList.add('extinction');
    emailOptin.style.display = 'flex';
    registration.addEventListener('animationend', () => {
        registration.style.display = 'none';
        
    })
}

next.addEventListener('click', nextStep);