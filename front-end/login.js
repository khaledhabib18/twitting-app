document.addEventListener("DOMContentLoaded", () => {
  const signInForm = document.getElementById("signInForm");
  const signUpForm = document.getElementById("signUpForm");
  const toSignUp = document.getElementById("toSignUp");
  const toSignIn = document.getElementById("toSignIn");
  const signInBtn = document.getElementById("signInBtn");
  const signUpBtn = document.getElementById("signUpBtn");

  // Helper to show popup
  function showPopup(message) {
    let popup = document.createElement("div");
    popup.className = "popup-message";
    popup.innerText = message;
    document.body.appendChild(popup);
    setTimeout(() => {
      popup.classList.add("show");
    }, 10);
    setTimeout(() => {
      popup.classList.remove("show");
      setTimeout(() => popup.remove(), 400);
    }, 2000);
  }

  // Switch to Sign Up
  toSignUp.addEventListener("click", () => {
    signInForm.classList.remove("active");
    signUpForm.classList.add("active");
  });

  // Switch to Sign In
  toSignIn.addEventListener("click", () => {
    signUpForm.classList.remove("active");
    signInForm.classList.add("active");
  });

  // Handle Sign In
  signInBtn.addEventListener("click", () => {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
      showPopup("Please enter both email and password.");
      return;
    }

    fetch("http://localhost:3000/sign-in-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data.token) {
          // Store token in localStorage
          localStorage.setItem("authToken", data.token);
          window.location.href = "index.html";
        } else {
          showPopup(data.err || "Login failed.");
        }
      })
      .catch(() => showPopup("Login failed."));
  });

  // Handle Sign Up
  signUpBtn.addEventListener("click", () => {
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    if (!name || !email || !password) {
      showPopup("Please fill all fields.");
      return;
    }

    fetch("http://localhost:3000/sign-up-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && !data.err) {
          signUpForm.classList.remove("active");
          signInForm.classList.add("active");
          showPopup("Signed up successfully!");
        } else {
          showPopup(data.err || "Sign up failed.");
        }
      })
      .catch(() => showPopup("Sign up failed."));
  });
});

// Add popup CSS
const style = document.createElement("style");
style.innerHTML = `
.popup-message {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%) scale(0.95);
  background: #74ebd5;
  color: #2d3a4b;
  padding: 14px 32px;
  border-radius: 8px;
  font-size: 17px;
  font-weight: 500;
  box-shadow: 0 4px 16px rgba(44,62,80,0.12);
  opacity: 0;
  transition: opacity 0.4s, transform 0.4s;
  z-index: 9999;
}
.popup-message.show {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}
`;
document.head.appendChild(style);
