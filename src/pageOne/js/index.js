const formEmail = document.querySelector('.registration form');
const inputEmail = document.getElementById('inputEmail');
const registration = document.querySelector('.registration');
const registrationContunie = document.querySelector('.registrationContinue');
const email = {};

// Check email on DB
function checkEmail(e) {
    e.preventDefault();
    const form = new FormData(e.target)
    form.forEach((value, key) => email[key] = value);
    // await fetch('', email)
    //     .then((res) => {
            
    //     })
    //     .catch()
    if (true) {
        nextStep(registration, registrationContunie);
        personalInfo();
    }
}

formEmail.addEventListener('submit', checkEmail);

// Function that contunie registration (generate name and pass inputs)
function personalInfo() {
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
    
    let request = new Request(e.target.action, {
        method: 'POST',
        body: JSON.stringify(obj),
        mode: 'no-cors', 
        headers: {
            'Content-Type': 'application/json',
        }
    });
    
    await fetch(request)
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            console.log(err)
        }
    );

    if (true) {
        console.log(JSON.stringify(obj));
    }
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
