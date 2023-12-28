document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(event) {
        const mobileDropdown = document.getElementById('mobile-dropdown');
        if (!mobileDropdown.contains(event.target)) {

            const dropdownContentMobile = document.querySelector('.dropdown-content-mobile');
            dropdownContentMobile.style.display = 'none';
        }
    });
});
