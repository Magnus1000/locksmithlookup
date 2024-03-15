// Function to toggle the dropdown menu for the locations menu
document.addEventListener('DOMContentLoaded', function() {
    var locationsMenu = document.getElementById('locationsMenu');
    var locationsIcon = document.getElementById('locationsMenuIcon');
    var locationsDropdown = document.getElementById('locationsDropdown');

    if (locationsMenu && locationsIcon && locationsDropdown) {
        locationsMenu.addEventListener('click', function() {
            locationsDropdown.classList.toggle('open');
            locationsIcon.classList.toggle('open');
            locationsMenu.classList.toggle('open');
        });
    }

    document.addEventListener('click', function(event) {
        var isClickInside = locationsDropdown && locationsDropdown.contains(event.target) || locationsMenu && locationsMenu.contains(event.target);
        var isLocationsMenuOpen = locationsMenu && locationsMenu.classList.contains('open');

        if (locationsDropdown && locationsIcon && locationsMenu && !isClickInside && isLocationsMenuOpen) {
            locationsDropdown.classList.remove('open');
            locationsIcon.classList.remove('open');
            locationsMenu.classList.remove('open');
        }
    });
});