window.addEventListener ('load', () => {

// set name field to focus on page load
    const name = document.querySelector('#name');
    name.focus();

// hide input for other job role until its selected
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

// t-shirt design selection controls options that appear for color selection
    const shirtColor = document.querySelector('#color');
    shirtColor.disabled = true;
    
    const shirtDesign = document.querySelector('#design');
    shirtDesign.addEventListener('change', () => {
        shirtColor.disabled = false;
        const colors = shirtColor.children;
        
        /**
         * this function updates the color options list based on design choice
         * 
         * @param {string} design - the design that has been chosen
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

// update price in "Register for Activities" section
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

// payment info section display based on selection
    const payMethod = document.querySelector('#payment');
    const payCredit = document.querySelector('#credit-card');
    const payPaypal = document.querySelector('#paypal');
    const payBitcoin = document.querySelector('#bitcoin');

    payPaypal.style.display = 'none';
    payBitcoin.style.display = 'none';

    payMethod.addEventListener('change', () => {
        if (payMethod.value == 'credit-card' ) {
            payCredit.style.display = '';
            payPaypal.style.display = 'none';
            payBitcoin.style.display = 'none'
        }if (payMethod.value == 'paypal') {
            payCredit.style.display = 'none';
            payPaypal.style.display = '';
            payBitcoin.style.display = 'none';
        }
        if (payMethod.value == 'bitcoin' ) {
            payCredit.style.display = 'none';
            payPaypal.style.display = 'none';
            payBitcoin.style.display = ''
        }
    });
});