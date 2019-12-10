const registration = document.querySelector('.registration');
const login = document.querySelector('.logIn');


function logIn() {
    registration.classList.add('extinction');
    registration.addEventListener('animationend', () => {
        registration.style.display = 'none';
        login.style.display = 'flex';
        login.classList.add('extinctionNext');
    })
    // document.querySelector('.socialRegistration').style.display = 'none';
}

module.exports = logIn;