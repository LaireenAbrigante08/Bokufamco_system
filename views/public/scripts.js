// public/scripts.js

function showContainer(containerId) {
    // Hide all containers
    document.querySelectorAll('.container').forEach(container => {
        container.classList.add('hidden');
    });

    // Show the selected container
    document.getElementById(containerId).classList.remove('hidden');
}

function logout() {
    const confirmation = confirm("Are you sure you want to log out?");
    if (confirmation) {
        window.location.href = "/landing"; // Adjust the redirect path as necessary
    }
}
