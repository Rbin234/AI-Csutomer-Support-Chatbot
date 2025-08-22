function formatHealthResponse(type, data) {
  if (!data) return document.createTextNode("No data found.");

  const container = document.createElement("div");
  container.classList.add("formatted-response");

  switch (type) {
    // FDA
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
          valueSpan.textContent = " " + field.value;

          drugInfo.appendChild(labelSpan);
          drugInfo.appendChild(valueSpan);
          drugInfo.appendChild(document.createElement("br"));
        }
      });

      container.appendChild(drugInfo);
      break;
    }

    // PubMed
    case "pubmed": {
      if (!data.articles || data.articles.length === 0) {
        return document.createTextNode("No articles found.");
      }

      data.articles.forEach((article) => {
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

    // Topics
    case "topic": {
      if (!data.topics || data.topics.length === 0) {
        return document.createTextNode("No topics found.");
      }

      data.topics.forEach((topic) => {
        const topicDiv = document.createElement("div");
        topicDiv.classList.add("topic-item", "response-item");

        // Title
        const title = document.createElement("div");
        title.classList.add("topic-title");
        title.textContent = topic.title || "No title available";
        topicDiv.appendChild(title);

        // Section
        const section = document.createElement("div");
        section.classList.add("topic-section");
        section.textContent = topic.section || "(No section)";
        section.style.fontSize = "0.9rem";
        section.style.color = "var(--text-secondary)";
        section.style.marginBottom = "4px";
        topicDiv.appendChild(section);

        // Description
        const desc = document.createElement("div");
        desc.classList.add("topic-description");
        desc.textContent = topic.description || "(No description)";
        desc.style.fontSize = "0.9rem";
        desc.style.color = "var(--text-secondary)";
        desc.style.marginBottom = "6px";
        topicDiv.appendChild(desc);

        // URL
        if (topic.url) {
          const link = document.createElement("a");
          link.href = topic.url;
          link.target = "_blank";
          link.textContent = "Learn more";
          link.style.display = "block";
          link.style.marginTop = "8px";
          link.style.color = "var(--primary-color)";
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
