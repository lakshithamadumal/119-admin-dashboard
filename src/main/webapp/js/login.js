document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("formAuthentication");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (email === "" || password === "") {

            Swal.fire({
                icon: "warning",
                title: "Missing Information",
                text: "Please enter both email and password."
            });

            return;
        }

        const formData = new URLSearchParams(new FormData(form));

        fetch("login-auth", {
            method: "POST",
            body: formData,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
        .then(response => response.text())
        .then(data => {

            if (data.trim() === "success") {

                Swal.fire({
                    icon: "success",
                    title: "Login Successful",
                    text: "Redirecting to Dashboard...",
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = "index.html";
                });

            } 
            else if (data.trim() === "invalid_password") {

                Swal.fire({
                    icon: "error",
                    title: "Invalid Password",
                    text: "Please check your password and try again."
                });

            } 
            else if (data.trim() === "user_not_found") {

                Swal.fire({
                    icon: "warning",
                    title: "User Not Found",
                    text: "The email you entered does not exist."
                });

            } 
            else {

                Swal.fire({
                    icon: "error",
                    title: "Server Error",
                    text: "Something went wrong on the server!"
                });

            }

        })
        .catch(() => {

            Swal.fire({
                icon: "error",
                title: "Connection Error",
                text: "Cannot connect to the server. Please check your network."
            });

        });

    });

});