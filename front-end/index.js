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
    return fetch("http://localhost:3000/get-tweets").then((res) => {
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
      window.location.href = "login.html";
    });

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  function renderTweets(tweets, user) {
    const section = document.getElementById("tweetsSection");
    section.innerHTML = "";
    tweets.forEach((tweet) => {
      const isMine = tweet.author.id === user.id;
      const card = document.createElement("div");
      card.className = "tweet-card";
      card.innerHTML = `
                <div class="tweet-header">
                    <span class="tweet-author">${tweet.author.name}</span>
                    <span class="tweet-date">${formatDate(
                      tweet.createdAt || tweet.date
                    )}</span>
                </div>
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
          const newContent = prompt("Edit your tweet:", tweet.content);
          if (newContent !== null && newContent.trim() !== "") {
            fetch(`http://localhost:3000/api/tweets/${tweet.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ content: newContent.trim() }),
            })
              .then((res) => res.json())
              .then((updated) => {
                tweet.content = updated.content;
                renderTweets(tweets, user);
              });
          }
        };
        menu.querySelector(".delete-btn").onclick = () => {
          if (confirm("Delete this tweet?")) {
            fetch(`http://localhost:3000/api/tweets/${tweet.id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            }).then(() => {
              const idx = tweets.findIndex((t) => t.id === tweet.id);
              if (idx > -1) tweets.splice(idx, 1);
              renderTweets(tweets, user);
            });
          }
        };
      }
      section.appendChild(card);
    });
  }
});
