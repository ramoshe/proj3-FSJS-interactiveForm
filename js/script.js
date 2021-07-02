window.addEventListener ('load', () => {
// Variables for form sections and inputs
    const form = document.getElementsByTagName('form')[0];
    
    const name = document.querySelector('#name');
    const email = document.querySelector('#email');
    const jobRole = document.querySelector('#title')
    const otherJobRole = document.querySelector('#other-job-role');
    
    const shirtDesign = document.querySelector('#design');
    const shirtColor = document.querySelector('#color');
    const colors = shirtColor.children;
    
    const activitySection = document.querySelector('#activities');
    const activities = activitySection.getElementsByTagName('label');
    const checkboxes = activitySection.querySelectorAll('[type="checkbox"]');
    const totalDisplay = document.querySelector('#activities-cost');
   
    const payMethod = document.querySelector('#payment');
    const creditSection = document.querySelector('#credit-card');
    const paypalSection = document.querySelector('#paypal');
    const bitcoinSection = document.querySelector('#bitcoin');

    const cardNumber = document.querySelector('#cc-num');
    const zipCode = document.querySelector('#zip');
    const cvv = document.querySelector('#cvv');

// Set name field to focus on page load
    name.focus();

// Hide input for other job role until its selected
    otherJobRole.style.display = 'none';
    jobRole.addEventListener('change', (e) => {
        if (e.target.value == 'other') {
            otherJobRole.style.display = '';
        } else {
            otherJobRole.style.display = 'none';
        }
    });

// T-Shirt design selection controls options that appear for color selection
    shirtColor.disabled = true;   
    shirtDesign.addEventListener('change', () => {
        shirtColor.disabled = false;
        /**
         * This function updates the option elements in the "Color" select menu based on design choice
         * @param {string} design - the chosen option from the "Design" dropdown
         */
        function colorOptions(design) {
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
            colorOptions('heart js')
        }
        if (shirtDesign.value == 'js puns') {
            colorOptions('js puns');
        }
    });

// Accessibility - make focus states of "Activities" more obvious
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('focus', () => checkbox.parentElement.classList.add('focus'));
        checkbox.addEventListener('blur', () => checkbox.parentElement.classList.remove('focus'));
    });

// Update price in "Register for Activities" section
    let cost = 0;
    activitySection.addEventListener('change', (e) => {
        if (e.target.tagName == 'INPUT') {
            (e.target.checked) ? cost += parseInt(e.target.dataset.cost) : cost -= parseInt(e.target.dataset.cost);
            totalDisplay.textContent = `Total: $${cost}`;
        }
    });

// Payment info section changes based on selection, credit selected as default
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

    const cred = payMethod.querySelector('[value=credit-card]');
    cred.setAttribute('selected', '');

// Form validation  
    /**
     *  Helper functions for checking each field validity
     *  @return {boolean} whether or not name field is blank
     */
    function nameIsValid() {
        return /[a-z]+/i.test(name.value);
    }
    function emailIsValid() {
        emailErrorSet(); // extra credit feature, see at bottom of file
        return /^[^@]+@[^@.]+\.[a-z]+$/i.test(email.value);
    }
    function activityIsValid() {
        let selectionMade = false;
        for (let i=0; i<checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                selectionMade = true;
            }
        }
        return selectionMade;
    }
    function cardIsValid() {
        return /^\d{13,16}$/.test(cardNumber.value);
    }
    function zipIsValid() {
        return /^\d{5}$/.test(zipCode.value);
    }
    function cvvIsValid() {
        return /^\d{3}$/.test(cvv.value);
    }
    function payIsValid() {
        (payMethod.value === 'credit-card') ? (cardIsValid() && zipIsValid() && cvvIsValid()) : true;
    }

// Error notifications for invalid form entries
    /**
     *  Helper function for notifying user of error in form element 
     *  @param {function} validityCheck - the function that checks the element's validity
     *  @param {string} element - the form element that has invalid input
     */
    function errorNotify(validityCheck, element) {
        if (!validityCheck) {
            element.classList.add('not-valid');
            element.classList.remove('valid');
            element.lastElementChild.style.display = 'inherit';
        } else {
            element.classList.remove('not-valid');
            element.classList.add('valid');
            element.lastElementChild.style.display = 'none';
        }
    }

// Submit event handler with form validation AND error notifications
    form.addEventListener('submit', (e) => {
        if (nameIsValid() && emailIsValid() && activityIsValid() && payIsValid()) {
            // Submit form successfully
        } else {
            e.preventDefault();

            errorNotify(nameIsValid(), name.parentElement);
            errorNotify(emailIsValid(), email.parentElement);
            errorNotify(activityIsValid(), activitySection);

            if (payMethod.value == 'select method') {
                errorNotify(payIsValid(), payMethod.parentElement);
            }
            if (payMethod.value == 'credit-card') {
                errorNotify(true, payMethod.parentElement);
                errorNotify(cardIsValid(), cardNumber.parentElement);
                errorNotify(zipIsValid(), zipCode.parentElement);
                errorNotify(cvvIsValid(), cvv.parentElement);
            }
        }
    });

// * * * * * * * * * * * * * * EXTRA CREDIT * * * * * * * * * * * * * *

// Prevent users from registering for conflicting activities  
    checkboxes.forEach(checkbox => checkbox.addEventListener('change', (e) => {
        const activityArray = Array.from(activities);
        activityArray.splice(0, 1); //remove "Main Conference" from activities list
        const unselectedActivities = activityArray.filter(activity => !activity.querySelector('input').checked);
        const disabledActivities = activityArray.filter(activity => activity.classList.contains('disabled'));
  
        const clickedActivity = e.target.parentElement;
        const clickedBox = e.target;
        const clickedTime = clickedActivity.querySelector('.activity-time').textContent;
        
        if (clickedBox.checked) {
            unselectedActivities.forEach(activity => {
                const activityTime = activity.querySelector('.activity-time').textContent;
                const activityBox = activity.querySelector('input');
                if (activityTime === clickedTime) {
                    activity.classList.add('disabled');
                    activityBox.disabled = true;
                } 
            });
        } else {
            disabledActivities.forEach(activity => {
                const activityTime = activity.querySelector('.activity-time').textContent;
                const activityBox = activity.querySelector('input');
                if (activityTime === clickedTime) {
                    activity.classList.remove('disabled');
                    activityBox.disabled = false;
                }
            });
        }
    }));

// Real-time error messages
    name.addEventListener('input', () => {
        errorNotify(nameIsValid(), name.parentElement);
    });

// Conditional error message
    function emailErrorSet() {
        const emailError = email.nextElementSibling;
        if (/.+/.test(email.value)) {
            emailError.textContent = 'Email address must be formatted correctly';
        } else {
            emailError.textContent = 'Email field cannot be blank';
        } 
    }    
});
