const chatWindow = document.getElementById("chatWindow");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const typeSelect = document.getElementById("typeSelect");
const themeToggle = document.getElementById("themeToggle");
const clearChat = document.getElementById("clearChat");

const API_URL = "http://localhost:8082/api/health";

// Theme management
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'dark' ? 'light_mode' : 'dark_mode';
}

themeToggle.addEventListener('click', () => {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  themeToggle.textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
});

// Clear chat
clearChat.addEventListener('click', () => {
  if (confirm("Are you sure you want to clear the conversation?")) {
    // Keep only the first welcome message
    const welcomeMsg = chatWindow.querySelector('.message.bot');
    chatWindow.innerHTML = '';
    if (welcomeMsg) {
      chatWindow.appendChild(welcomeMsg);
    } else {
      appendMessage("Hello! I'm your HealthAI assistant. How can I help you today?", "bot");
    }
  }
});

// Helper to append message
function appendMessage(content, sender = "bot", isTyping = false) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  
  if (isTyping) {
    messageDiv.innerHTML = `
      <div class="message-typing">
        Thinking
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
  } else {
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("message-content");
    
    if (typeof content === 'string') {
      contentDiv.textContent = content;
    } else {
      contentDiv.appendChild(content);
    }
    
    messageDiv.appendChild(contentDiv);
  }
  
  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return messageDiv;
}

// Format responses with HTML
function formatHealthResponse(type, data) {
  if (!data) return document.createTextNode("No data found.");

  const container = document.createElement("div");
  container.classList.add("formatted-response");

  switch (type) {
    case "fda": {
      const r = data.results || {};
      const drugInfo = document.createElement("div");
      drugInfo.classList.add("drug-info", "response-item");
      
      const fields = [
        { label: "Drug Name", value: data.drug_name },
        { label: "Generic Name", value: r.generic_name },
        { label: "Brand Name", value: r.brand_name },
        { label: "Manufacturer", value: r.manufacturer },
        { label: "Product Type", value: r.product_type },
        { label: "Route", value: Array.isArray(r.route) ? r.route.join(", ") : r.route },
        { label: "Marketing Status", value: r.marketing_status || "N/A" }
      ];
      
      fields.forEach(field => {
        if (field.value) {
          const labelSpan = document.createElement("span");
          labelSpan.classList.add("label");
          labelSpan.textContent = field.label + ":";
          
          const valueSpan = document.createElement("span");
          valueSpan.textContent = field.value;
          
          drugInfo.appendChild(labelSpan);
          drugInfo.appendChild(valueSpan);
        }
      });
      
      container.appendChild(drugInfo);
      break;
    }

    case "pubmed": {
      if (!data.articles || data.articles.length === 0) {
        return document.createTextNode("No articles found.");
      }
      
      data.articles.forEach((article, index) => {
        const articleDiv = document.createElement("div");
        articleDiv.classList.add("article-item", "response-item");
        
        const title = document.createElement("div");
        title.classList.add("article-title");
        title.textContent = article.title || "No title available";
        
        const authors = document.createElement("div");
        authors.classList.add("article-authors");
        authors.textContent = `By: ${article.authors ? article.authors.join(", ") : "Unknown"}`;
        
        const journal = document.createElement("div");
        journal.classList.add("article-journal");
        journal.textContent = `${article.journal || "Unknown journal"}, Published: ${article.publication_date || "Unknown date"}`;
        
        const links = document.createElement("div");
        links.style.marginTop = "8px";
        
        if (article.doi) {
          const doiLink = document.createElement("a");
          doiLink.href = `https://doi.org/${article.doi}`;
          doiLink.target = "_blank";
          doiLink.textContent = "View Article";
          doiLink.style.color = "var(--primary-color)";
          doiLink.style.marginRight = "12px";
          links.appendChild(doiLink);
        }
        
        articleDiv.appendChild(title);
        articleDiv.appendChild(authors);
        articleDiv.appendChild(journal);
        articleDiv.appendChild(links);
        
        container.appendChild(articleDiv);
      });
      break;
    }

    case "topic": {
    if (!data.topics || data.topics.length === 0) {
      return document.createTextNode("No topics found.");
    }
  
    data.topics.forEach((topic) => {
      const topicDiv = document.createElement("div");
      topicDiv.classList.add("topic-item", "response-item");
  
      // Title — ALWAYS append
      const title = document.createElement("div");
      title.classList.add("topic-title");
      title.textContent = topic.title || "No title available";
      topicDiv.appendChild(title);
  
      // Description — optional placeholder if empty
      const desc = document.createElement("div");
      desc.classList.add("topic-description");
      desc.textContent = topic.description || ""; // or "No description available"
      topicDiv.appendChild(desc);
  
      // URL link
      if (topic.url) {
        const link = document.createElement("a");
        link.href = topic.url;
        link.target = "_blank";
        link.classList.add("topic-url");
        link.textContent = "Learn more";
        link.style.display = "block";
        link.style.marginTop = "8px";
        topicDiv.appendChild(link);
      }
  
      container.appendChild(topicDiv);
    });
  
    break;
   }



    default:
      container.textContent = JSON.stringify(data, null, 2);
  }

  return container;
}

// Send message to backend
async function sendMessageToBackend(text, type) {
  try {
    // Show typing indicator
    const typingIndicator = appendMessage("", "bot", true);
    
    let params = {};
    
    switch(type) {
      case "fda":
        params = { drug_name: text, search_type: "general" };
        break;
      case "pubmed":
        params = { query: text, max_results: 3, date_range: "5" };
        break;
      case "topic":
      default:
        params = { topic: text, language: "en" };
        break;
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, params }),
    });

    // Remove typing indicator
    chatWindow.removeChild(typingIndicator);

    const data = await response.json();
    if (data.success) {
      const formattedResponse = formatHealthResponse(type, data.data);
      appendMessage(formattedResponse, "bot");
    } else {
      appendMessage("Sorry, I couldn't find information about that. Could you try rephrasing your question?", "bot");
    }
  } catch (err) {
    appendMessage("I'm having trouble connecting right now. Please try again in a moment.", "bot");
    console.error(err);
  }
}

// Handle user input
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  const type = typeSelect.value;
  
  if (!text || !type) return;

  appendMessage(text, "user");
  chatInput.value = "";
  sendMessageToBackend(text, type);
});

// Initialize theme
initTheme();