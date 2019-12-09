const formEmail = document.querySelector('.registration form');
const inputEmail = document.getElementById('inputEmail');
const registration = document.querySelector('.registration');
const registrationContunie = document.querySelector('.registrationContinue');
const email = {};

// Check email on DB
async function checkEmail(e) {
    e.preventDefault();

    const form = new FormData(e.target)
    form.forEach((value, key) => email[key] = value);

    await fetch("http://localhost:3000/api/test", {
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
                nextStep(registration, registrationContunie);
                personalInfo();
            }
            
        })
        .catch(err => {
            console.log(err);
        })
}

formEmail.addEventListener('submit', checkEmail);

// Function that contunie registration (generate name and pass inputs)
function personalInfo() {
    if (!inputEmail.value) return;
    registration.removeChild(document.querySelector('.socialRegistration'));
    const btnCircle = document.querySelector('.nextDiv input[type=button]');
    btnCircle.addEventListener('click', () => {
        document.querySelector('.hello').style.display = 'none';
        document.querySelector('.nextDiv').style.display = 'none';
        registrationContunie.querySelector('form').style.display = 'flex';
    })
    registrationContunie.querySelector('form').addEventListener('submit', registrateUser);
}

async function registrateUser(e) {
    e.preventDefault();
    const obj = Object.assign({}, email);
    const form = new FormData(e.target)
    form.forEach((value, key) => obj[key] = value);
    
    await fetch("http://localhost:3000/api/users", {
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

// Animation
function nextAnimation(step1, step2) {
    step1.classList.add('extinction');
    step2.style.display = 'flex';
    step1.addEventListener('animationend', () => {
        step1.style.display = 'none';   
    })
}
// Check is email empty
function nextStep(step1, step2) {
    if (!inputEmail.value) {
        inputEmail.style.boxShadow = '0px 0px 10px red';
        inputEmail.addEventListener('change', () => {
            inputEmail.style.boxShadow = '0px 0px 15px rgba(0, 0, 0, 0.329)';
        });
        return;
    };
    nextAnimation(step1, step2);
}
