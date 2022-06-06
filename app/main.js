


let openMenu = document.querySelector('.fa-bars');
let menuModal = document.querySelector('.menu_mobile');
let closeMenu = document.querySelector('.fa-close');

openMenu.addEventListener('click', () => {
    menuModal.classList.remove('hidden');
});

closeMenu.addEventListener('click', () => {
    menuModal.classList.add('hidden');
});



