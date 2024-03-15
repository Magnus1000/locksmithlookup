// Function to toggle the dropdown menu for the locations menu
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');

    var locationsMenu = document.getElementById('locationsMenu');
    var locationsIcon = document.getElementById('locationsMenuIcon');
    var locationsDropdown = document.getElementById('locationsDropdown');

    if (locationsMenu && locationsIcon && locationsDropdown) {
        console.log('All elements found');

        locationsMenu.addEventListener('click', function() {
            console.log('locationsMenu clicked');

            locationsDropdown.classList.toggle('open');
            locationsIcon.classList.toggle('open');
            locationsMenu.classList.toggle('open');
        });
    } else {
        console.log('One or more elements not found');
    }

    document.addEventListener('click', function(event) {
        console.log('Document clicked');

        var isClickInside = locationsDropdown && locationsDropdown.contains(event.target) || locationsMenu && locationsMenu.contains(event.target);
        var isLocationsMenuOpen = locationsMenu && locationsMenu.classList.contains('open');

        if (locationsDropdown && locationsIcon && locationsMenu && !isClickInside && isLocationsMenuOpen) {
            console.log('Click outside the open menu');

            locationsDropdown.classList.remove('open');
            locationsIcon.classList.remove('open');
            locationsMenu.classList.remove('open');
        }
    });
});