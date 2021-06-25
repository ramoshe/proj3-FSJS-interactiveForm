window.addEventListener ('load', () => {

// Set name field to focus on page load
    const name = document.querySelector('#name');
    name.focus();

// Hide input for other job role until its selected
    const otherJobRole = document.querySelector('#other-job-role');
    otherJobRole.style.display = 'none';

    const jobRole = document.querySelector('#title')
    jobRole.addEventListener('change', (e) => {
        if (e.target.value == 'other') {
            otherJobRole.style.display = '';
        } else {
            otherJobRole.style.display = 'none';
        }
    });

// T-Shirt design selection controls options that appear for color selection
    const shirtColor = document.querySelector('#color');
    shirtColor.disabled = true;
    
    const shirtDesign = document.querySelector('#design');
    shirtDesign.addEventListener('change', () => {
        shirtColor.disabled = false;
        const colors = shirtColor.children;
        
        /**
         * This function updates the option elements in the "Color" select menu based on design choice
         * @param {string} design - the chosen option from the "Design" dropdown
         */
        function colorsList(design) {
            let firstLoop = true;
            for (let i=0; i<colors.length; i++) {
                const theme = colors[i].dataset.theme;
                if (theme && theme == design) {
                    colors[i].removeAttribute('hidden');
                    if (firstLoop) {
                        colors[i].setAttribute('selected', '');
                        firstLoop = false;
                    }
                } else {
                    colors[i].setAttribute('hidden', '');
                    colors[i].removeAttribute('selected');
                }
            }
        }

        if (shirtDesign.value == 'heart js') {
            colorsList('heart js')
        }
        if (shirtDesign.value == 'js puns') {
            colorsList('js puns');
        }
    });

// Update price in "Register for Activities" section
    const activities = document.querySelector('#activities');
    let totalDisplay = document.querySelector('#activities-cost');
    let cost = 0;

    activities.addEventListener('change', (e) => {
        if (e.target.tagName == 'INPUT') {
            if (e.target.checked) {
                cost += parseInt(e.target.dataset.cost);
            } else {
                cost -= parseInt(e.target.dataset.cost);
            }
            totalDisplay.textContent = `Total: $${cost}`;
        }
    });

// Payment info section display based on selection
    const payMethod = document.querySelector('#payment');
    const creditSection = document.querySelector('#credit-card');
    const paypalSection = document.querySelector('#paypal');
    const bitcoinSection = document.querySelector('#bitcoin');

    paypalSection.style.display = 'none';
    bitcoinSection.style.display = 'none';

    payMethod.addEventListener('change', () => {
        if (payMethod.value == 'credit-card' ) {
            creditSection.style.display = '';
            paypalSection.style.display = 'none';
            bitcoinSection.style.display = 'none'
        }if (payMethod.value == 'paypal') {
            creditSection.style.display = 'none';
            paypalSection.style.display = '';
            bitcoinSection.style.display = 'none';
        }
        if (payMethod.value == 'bitcoin' ) {
            creditSection.style.display = 'none';
            paypalSection.style.display = 'none';
            bitcoinSection.style.display = ''
        }
    });

// Form validation helper functions
    const form = document.getElementsByTagName('form')[0];
    
    /**
     *  Helper function for checking "Name" field validity
     *  @return {boolean} whether or not name field is blank
     */
    function nameIsValid() {
        return /[a-z]+/i.test(name.value);
    }
    /**
     *  Helper function for checking "Email Address"" validity
     *  @return {boolean} whether or not the email is formatted properly 
     */
    function emailIsValid() {
        const email = document.querySelector('#email');
        return /^[^@]+@[^@.]+\.[a-z]+$/i.test(email.value);
    }
    /**
     *  Helper function for checking "Register for Activities" validity
     *  @return {boolean} whether or not any of the checkboxes in the section are checked 
     */
    function activitiesIsValid() {
        const checkboxes = activities.querySelectorAll('[type="checkbox"]');
        let selectionMade = false;
        for (let i=0; i<checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                selectionMade = true;
            }
        }
        return selectionMade;
    }
    /**
     *  Helper function for checking "Payment Info" for credit card payments validity 
     *      the variables have been pulled out for later access
     * 
     *  @return {boolean} whether or not correct number of digits have been entered in each field
     */
    const cardNumber = document.querySelector('#cc-num');
    const cardIsValid = /^\d{13,16}$/.test(cardNumber.value);
    const zipCode = document.querySelector('#zip');
    const zipIsValid = /^\d{5}$/.test(zipCode.value)
    const cvv = document.querySelector('#cvv');
    const cvvIsValid = /^\d{3}$/.test(cvv.value);
    function payIsValid() {
        console.log(cardNumber.value +' '+ zipCode.value +' '+ cvv.value);
        console.log(cardIsValid +' '+ zipIsValid +' '+ cvvIsValid);
        if (payMethod.value == 'credit-card') {
            if (cardIsValid && zipIsValid && cvvIsValid) {
                return true;
            } else {
                return false;
            } 
        } else if (payMethod.value == 'select method') {
            return false;
        } else {
            return true;
        }
    };

// Error indicator helper functions
    /**
     *  Helper function for notifying user of error in form element 
     *  @param {string} element - the form element that has invalid input
     */
    function errorNotify(element) {
        element.classList.add('not-valid');
        element.classList.remove('valid');
        element.lastElementChild.style.display = 'inherit';
    }

    /**
     *  Helper function for removing error notification from form element 
     *  @param {string} element - the form element that has invalid input
     */
    function errorResolved(element) {
        element.classList.remove('not-valid');
        element.classList.add('valid');
        element.lastElementChild.style.display = 'none';
    }

// Form submit event handler with form validation AND error notifications
    form.addEventListener('submit', (e) => {
        if (nameIsValid() && emailIsValid() && activitiesIsValid() && payIsValid()) {
            // Submit form successfully
        } else {
            e.preventDefault();

            if (!nameIsValid()) {
                errorNotify(name.parentElement);
            } else {
                errorResolved(name.parentElement);
            }
            
            if (!emailIsValid()) {
                errorNotify(email.parentElement);
            } else {
                errorResolved(email.parentElement);
            }
            
            if (!activitiesIsValid()) {
                errorNotify(activities);
            } else {
                errorResolved(activities);
            }

            if (!payIsValid()) {
                if (payMethod.value == 'credit-card') {
                    //console.log(cardIsValid +' '+ zipIsValid +' '+ cvvIsValid);
                    if (!cardIsValid) {
                        errorNotify(cardNumber.parentElement);
                    } else {
                        errorResolved(cardNumber.parentElement);
                    }
                    if (!zipIsValid) {
                        errorNotify(zipCode.parentElement);
                    } else {
                        errorResolved(zipCode.parentElement);
                    }
                    if (!cvvIsValid) {
                        errorNotify(cvv.parentElement);
                    } else {
                        errorResolved(cvv.parentElement);
                    }
                } else if (payMethod.value == 'select method') {
                    errorNotify(payMethod.parentElement);
                } else {
                    errorResolved(payMethod.parentElement);
                }
            }
        }
    });

// Accessibility - make focus states of "Activities" more obvious
    const checkboxes = activities.querySelectorAll('[type="checkbox"]');
    for (let i=0; i<checkboxes.length; i++) {
        checkboxes[i].addEventListener('focus', (e) => {
            checkboxes[i].parentElement.className = 'focus';
        })
        checkboxes[i].addEventListener('blur', (e) => {
            checkboxes[i].parentElement.removeAttribute('class', 'focus')
        })
    }
});
