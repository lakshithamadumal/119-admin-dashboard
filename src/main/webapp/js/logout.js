document.getElementById('logoutBtn').addEventListener('click', function (e) {
    e.preventDefault();

    Swal.fire({
        title: 'Are you sure?',
        text: "You will be logged out from the dashboard!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, Logout!'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("adminLoggedIn");
            localStorage.removeItem("adminEmail");

            window.location.href = 'login.html';
        }
    });
});