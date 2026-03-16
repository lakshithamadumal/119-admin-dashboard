document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formAuthentication");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (email === "" || password === "") {
            Swal.fire({ icon: "warning", title: "Missing Info", text: "Please enter both email and password." });
            return;
        }

        const btn = form.querySelector("button[type='submit']");
        btn.disabled = true;
        btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>`;

        try {
            const snapshot = await db.collection("admins").where("email", "==", email).get();

            if (!snapshot.empty) {
                const adminData = snapshot.docs[0].data();

                if (adminData.password === password) {
                    localStorage.setItem("adminLoggedIn", "true");
                    localStorage.setItem("adminEmail", email);

                    Swal.fire({
                        icon: "success",
                        title: "Login Successful",
                        text: "Redirecting to Dashboard...",
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        window.location.href = "index.html";
                    });
                } else {
                    throw new Error("invalid_password");
                }
            } else {
                throw new Error("user_not_found");
            }
        } catch (error) {
            btn.disabled = false;
            btn.innerHTML = "Login";
            console.error(error);
            
            let msg = "An error occurred. Please try again.";
            if (error.message === "invalid_password") msg = "Incorrect password!";
            if (error.message === "user_not_found") msg = "Admin email not found!";
            
            Swal.fire({ icon: "error", title: "Login Failed", text: msg });
        }
    });
});