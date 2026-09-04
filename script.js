const list = document.querySelector('#repository-list');

const formatStars = (stars) => new Intl.NumberFormat('en', {
  notation: 'compact',
  maximumFractionDigits: 1
}).format(stars);

const formatDate = (date) => new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
}).format(new Date(date));

const renderRepositories = (repositories) => {
  if (!repositories.length) {
    list.innerHTML = '<p class="status">No starred repositories yet.</p>';
    return;
  }

  list.innerHTML = repositories.map((repository) => `
    <article class="repository">
      <div>
        <h2>${repository.repository}</h2>
        <p>${repository.description}</p>
        <div class="meta">
          <span class="language">${repository.language}</span>
          <span class="stars">${formatStars(repository.stars)} stars</span>
          <span class="updated">Updated ${formatDate(repository.updated)}</span>
        </div>
      </div>
      <span class="event">${repository.event}</span>
    </article>
  `).join('');
};

const showError = () => {
  list.innerHTML = '<p class="status">Could not load repository events. Please try again.</p>';
};

fetch('events.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.json();
  })
  .then(renderRepositories)
  .catch(showError);
fetch("events.json")
  .then((response) => response.json())
  .then((events) => {
    const list = document.querySelector("#starred");
    events.forEach((event) => {
      const item = document.createElement("li");
      item.textContent = `${event.name} — starred ${event.starred}`;
      list.appendChild(item);
    });
  });
