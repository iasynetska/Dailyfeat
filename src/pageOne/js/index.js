let next = document.querySelector('#nextButton');
let registration = document.querySelector('.registration');
let emailInput = registration.querySelector('input[type=email]');
let emailOptin = document.querySelector('.emailOptin'); 
let nextCircle = document.querySelector('.nextCircle');
let registrationContinue = document.querySelector('.registrationContinue');
let btnHelloThere = document.querySelector('.nextDiv .nextCircle')

function nextAnimation(step1, step2) {
    step1.classList.add('extinction');
    step2.style.display = 'flex';
    step1.addEventListener('animationend', () => {
        step1.style.display = 'none';   
    })
}

function nextStep() {
    if (!emailInput.value) {
        emailInput.style.boxShadow = '0px 0px 10px red';
        emailInput.addEventListener('change', () => {
            emailInput.style.boxShadow = '0px 0px 15px rgba(0, 0, 0, 0.329)';
        });
        return;
    };
    nextAnimation(registration, emailOptin);
}

function nextCircleHelloThere() {
    document.querySelector('.nextDiv').style.display = 'none';
    document.querySelector('.hello').style.display = 'none';
    document.querySelector('.registrationContinue form').style.display = 'flex';
}

next.addEventListener('click', nextStep);
nextCircle.addEventListener('click', () => { nextAnimation(emailOptin, registrationContinue) });
btnHelloThere.addEventListener('click', nextCircleHelloThere)