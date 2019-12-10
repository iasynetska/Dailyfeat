const formEmail = document.querySelector('.registration form');
const inputEmail = document.getElementById('inputEmail');
const registration = document.querySelector('.registration');
const login = document.querySelector('.logIn');
const registrationContunie = document.querySelector('.registrationContinue');
const email = {};

// Check email on DB
async function checkEmail(e) {
    e.preventDefault();
    // Is empty?
    if(!inputEmail.value) { emptyEmail(); return; }

    const form = new FormData(e.target)
    form.forEach((value, key) => email[key] = value);

    // Check email 

    await fetch("https://dailyfeat.herokuapp.com/api/emails", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(email)
    })
        .then(res => {
            return res.text();
        })
        .then(data => {
            if (data == 'false') {
                regContinue();
            } if (data == 'true') {
                logIn();
            }
            
        })
        .catch(err => {
            console.log(err);
        })
}

formEmail.addEventListener('submit', checkEmail);

// Registrate user

async function registrateUser(e) {
    e.preventDefault();
    const obj = Object.assign({}, email);
    const form = new FormData(e.target)
    form.forEach((value, key) => obj[key] = value);
    
    await fetch("https://dailyfeat.herokuapp.com/api/users", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(obj)
    })
        .then(res => {
            console.log(res);
            return res.text();
        })
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        })
} 

// If email isn't - reg

function regContinue() {
    document.querySelector('.socialRegistration').style.display = 'none';
    formEmail.style.display = 'none';
    document.querySelector('.hello').style.display = 'block';
    document.querySelector('.nextDiv').style.display = 'block';
    const btnCircle = document.querySelector('.nextDiv input[type=button]');
    btnCircle.addEventListener('click', () => {
        document.querySelector('.hello').style.display = 'none';
        document.querySelector('.nextDiv').style.display = 'none';
        document.querySelector('.formRegistration').style.display = 'flex';
    })
}

// If email is - login

function logIn() {
    registration.style.display = 'none';
    document.querySelector('.socialRegistration').style.display = 'none';
    login.style.display = 'flex';
}


// Is email empty ?

function emptyEmail() {
    if (!inputEmail.value) {
        inputEmail.style.boxShadow = '0px 0px 10px red';
        inputEmail.addEventListener('change', () => {
            inputEmail.style.boxShadow = '0px 0px 15px rgba(0, 0, 0, 0.329)';
        });
    }
}