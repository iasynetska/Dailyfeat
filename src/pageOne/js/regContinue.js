const formEmail = document.querySelector('.registration form');
const hello = document.querySelector('.hello');
const nextDiv = document.querySelector('.nextDiv'); 
const registration = document.querySelector('.registration');

function regContinue(callback=helloThere) {
    registration.classList.remove('extinctionNext');
    registration.classList.add('extinction');
    registration.addEventListener('animationend', callback)
}

function helloThere() {
    document.querySelector('.socialRegistration').style.display = 'none';
    formEmail.style.display = 'none';
    hello.style.display = 'block';
    nextDiv.style.display = 'block';
    registration.classList.remove('extinction');
    registration.classList.add('extinctionNext');
    const btnCircle = document.querySelector('.nextDiv input[type=button]');
    btnCircle.addEventListener('click', () => {
        regContinue(perInfo);
    })
}

function perInfo() {
    hello.style.display = 'none';
    nextDiv.style.display = 'none';
    document.querySelector('.formRegistration').style.display = 'flex';
}

module.exports = regContinue;