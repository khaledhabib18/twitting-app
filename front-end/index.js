document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  // Logout handler
  document.getElementById("logoutBtn").onclick = function () {
    localStorage.removeItem("authToken");
    window.location.href = "login.html";
  };

  // Tweet button handler
  document.getElementById("tweetBtn").onclick = function () {
    const input = document.getElementById("tweetInput");
    const content = input.value.trim();
    if (!content) return;

    fetch("http://localhost:3000/add-tweet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({ content }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add tweet");
        return res.json();
      })
      .then((newTweet) => {
        tweets.unshift(newTweet);
        input.value = "";
        location.reload();
        renderTweets(tweets, user);
      })
      .catch(() => {
        alert("Could not add tweet. Please try again.");
      });
  };

  let user = null;
  let tweets = [];

  // Get user data
  function getUserData() {
    return fetch("http://localhost:3000/get-user-data", {
      headers: { Authorization: `${token}` },
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to get user data");
      return res.json();
    });
  }

  // Get tweets
  function getTweets() {
    return fetch("http://localhost:3000/get-tweets", {
      headers: { Authorization: `${token}` },
    }).then((res) => {
      if (!res.ok) throw new Error("Failed to get tweets");
      return res.json();
    });
  }

  // Load user and tweets
  Promise.all([getUserData(), getTweets()])
    .then(([userData, tweetsData]) => {
      user = userData;
      tweets = tweetsData;
      document.getElementById("userName").textContent = user.name;
      renderTweets(tweets, user);
    })
    .catch((err) => {
      alert("Error loading data: " + err.message);
      // window.location.href = "login.html";
    });

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  function renderTweets(tweets, user) {
    const section = document.getElementById("tweetsSection");
    section.innerHTML = "";
    tweets.forEach((tweet) => {
      const isMine = tweet.userid === user.uid;
      const card = document.createElement("div");
      card.className = "tweet-card";
      card.innerHTML = `
      <div class="tweet-header">
        <span class="tweet-author">${tweet.author}</span>
      </div>
      <div class="tweet-date" style="margin-bottom:8px;">${formatDate(
        tweet.createdAt
      )}</div>
      <div class="tweet-content">${tweet.content}</div>
      ${
        isMine
          ? `
          <div class="tweet-options" tabindex="0">&#8942;</div>
          <div class="options-menu">
              <button class="edit-btn">Edit</button>
              <button class="delete-btn">Delete</button>
          </div>
      `
          : ""
      }
    `;
      if (isMine) {
        const optionsBtn = card.querySelector(".tweet-options");
        const menu = card.querySelector(".options-menu");
        optionsBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          menu.classList.toggle("show");
        });
        document.addEventListener("click", () => {
          menu.classList.remove("show");
        });
        menu.addEventListener("click", (e) => {
          e.stopPropagation();
        });
        menu.querySelector(".edit-btn").onclick = () => {
          // Create popup for editing tweet
          const popup = document.createElement("div");
          popup.style.position = "fixed";
          popup.style.top = "50%";
          popup.style.left = "50%";
          popup.style.transform = "translate(-50%, -50%)";
          popup.style.background = "#fff";
          popup.style.padding = "24px";
          popup.style.borderRadius = "12px";
          popup.style.boxShadow = "0 4px 16px rgba(44,62,80,0.12)";
          popup.style.zIndex = "9999";
          popup.innerHTML = `
    <h3>Edit Tweet</h3>
    <textarea id="editTweetContent" style="width:100%;height:80px;border-radius:8px;border:1px solid #dbe2ef;padding:8px;">${tweet.content}</textarea>
    <div style="margin-top:16px;text-align:right;">
      <button id="cancelEditBtn" style="margin-right:8px;padding:8px 18px;border-radius:8px;border:none;background:#eee;cursor:pointer;">Cancel</button>
      <button id="saveEditBtn" style="padding:8px 18px;border-radius:8px;border:none;background:linear-gradient(90deg,#74ebd5 0%,#ACB6E5 100%);color:#fff;cursor:pointer;">Save</button>
    </div>
  `;
          document.body.appendChild(popup);

          document.getElementById("cancelEditBtn").onclick = () => {
            popup.remove();
          };

          document.getElementById("saveEditBtn").onclick = () => {
            const newContent = document
              .getElementById("editTweetContent")
              .value.trim();
            if (!newContent) return;
            fetch(`http://localhost:3000/edit-tweet/${tweet.uid}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
              },
              body: JSON.stringify({ content: newContent }),
            })
              .then((res) => {
                if (!res.ok) throw new Error("Failed to edit tweet");
                return res.json();
              })
              .then(() => {
                tweet.content = newContent;
                popup.remove();
                renderTweets(tweets, user);
              })
              .catch(() => {
                alert("Could not edit tweet. Please try again.");
                popup.remove();
              });
          };
        };
        menu.querySelector(".delete-btn").onclick = () => {
          if (confirm("Delete this tweet?")) {
            fetch(`http://localhost:3000/delete-tweet/${tweet.uid}`, {
              method: "DELETE",
              headers: { Authorization: `${token}` },
            })
              .then((res) => {
                if (!res.ok) throw new Error("Failed to delete tweet");
                return res.json();
              })
              .then(() => {
                const idx = tweets.findIndex((t) => t.uid === tweet.uid);
                if (idx > -1) tweets.splice(idx, 1);
                renderTweets(tweets, user);
              })
              .catch(() => {
                alert("Could not delete tweet. Please try again.");
              });
          }
        };
      }
      section.appendChild(card);
    });
  }
});
