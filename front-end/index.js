const currentUser = { name: "John Doe", id: "user123" };
const tweets = [
  {
    id: "t1",
    author: { name: "John Doe", id: "user123" },
    content: "Hello Twitter!",
    date: "2025-10-02 09:00",
  },
  {
    id: "t2",
    author: { name: "Jane Smith", id: "user456" },
    content: "Welcome to Twitting App!",
    date: "2025-10-02 09:05",
  },
  {
    id: "t3",
    author: { name: "John Doe", id: "user123" },
    content: "Second tweet from me.",
    date: "2025-10-02 09:10",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("userName").textContent = currentUser.name;

  document.getElementById("logoutBtn").onclick = function () {
    window.location.href = "login.html";
  };

  function renderTweets() {
    const section = document.getElementById("tweetsSection");
    section.innerHTML = "";
    tweets.forEach((tweet) => {
      const card = document.createElement("div");
      card.className = "tweet-card";
      card.innerHTML = `
                <div class="tweet-header">
                    <span class="tweet-author">${tweet.author.name}</span>
                    <span class="tweet-date">${tweet.date}</span>
                </div>
                <div class="tweet-content">${tweet.content}</div>
                ${
                  tweet.author.id === currentUser.id
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
      if (tweet.author.id === currentUser.id) {
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
            tweet.content = newContent.trim();
            renderTweets();
          }
        };
        menu.querySelector(".delete-btn").onclick = () => {
          if (confirm("Delete this tweet?")) {
            const idx = tweets.findIndex((t) => t.id === tweet.id);
            if (idx > -1) tweets.splice(idx, 1);
            renderTweets();
          }
        };
      }
      section.appendChild(card);
    });
  }

  renderTweets();

  document.getElementById("tweetBtn").onclick = function () {
    const input = document.getElementById("tweetInput");
    const content = input.value.trim();
    if (!content) return;
    const now = new Date();
    tweets.unshift({
      id: "t" + Date.now(),
      author: { ...currentUser },
      content,
      date: now.toLocaleString(),
    });
    input.value = "";
    renderTweets();
  };
});
