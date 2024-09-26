/**
 * For Logo Animation
 */
function startLogoAnimation() {
    let animatedLogo = document.getElementById('animated-logo');
    let animatedLogoContainer = document.getElementById('animated-logo-container');
    let loginPage = document.getElementById('loginpage');

    function applyStyles(element, styles, delay) {
        setTimeout(() => {
            Object.assign(element.style, styles);
        }, delay);
    }

    applyStyles(animatedLogo, { animation: "logoShrinkAndMove 1s forwards" }, 500);
    setTimeout(() => {
        loginPage.classList.replace('hidden', 'show');
        animatedLogoContainer.style.backgroundColor = 'transparent';
        animatedLogoContainer.classList.add('logo-behind');
    }, 800);
}

/**
 * Opens Dialog via slide
 */
function openOptions(){
    document.getElementById('options-dialog').classList.remove('d-none');
    document.getElementById('bg-small-dialog').classList.remove('d-none');
    document.getElementById('options-dialog').classList.add('show');
    document.getElementById('bg-small-dialog').addEventListener("click",  function (e) {
        closeOptions();
      });
}

/**
 * Closes Dialog via slide
 */
function closeOptions(){
    document.getElementById('options-dialog').classList.remove('d-none');
    document.getElementById('options-dialog').classList.add('hide');
    setTimeout(function () { document.getElementById('options-dialog').classList.remove('show'); document.getElementById('bg-small-dialog').classList.add('d-none'); document.getElementById("options-dialog").classList.add('d-none'); document.getElementById("options-dialog").classList.remove('hide') }, 450);
}