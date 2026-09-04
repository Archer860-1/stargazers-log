const starredList = document.querySelector('#starred');
const repositorySection = document.querySelector('#repository-list');

/**
 * 格式化日期为可读格式 (例如: "Jan 15, 2024")
 */
const formatDate = (dateString) => {
  try {
    return new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(dateString));
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
};

/**
 * 渲染星标仓库列表
 * @param {Array} events - 星标事件数组 [{name, starred}, ...]
 */
const renderRepositories = (events) => {
  if (!Array.isArray(events) || events.length === 0) {
    starredList.innerHTML = '<li class="status">No starred repositories yet.</li>';
    return;
  }

  // 清空加载状态
  starredList.innerHTML = '';

  events.forEach((event) => {
    const item = document.createElement('li');
    item.className = 'repository-item';
    
    // 创建仓库链接（GitHub URL）
    const link = document.createElement('a');
    link.href = `https://github.com/${event.name}`;
    link.textContent = event.name;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    // 创建日期元素
    const date = document.createElement('span');
    date.className = 'starred-date';
    date.textContent = `Starred ${formatDate(event.starred)}`;
    date.setAttribute('aria-label', `Starred on ${formatDate(event.starred)}`);

    // 组装列表项
    item.appendChild(link);
    item.appendChild(document.createTextNode(' — '));
    item.appendChild(date);

    starredList.appendChild(item);
  });

  // 更新无障碍属性
  repositorySection.setAttribute('aria-busy', 'false');
};

/**
 * 显示错误信息
 * @param {Error} error - 错误对象
 */
const showError = (error) => {
  console.error('Failed to load repository events:', error);
  starredList.innerHTML = `
    <li class="status error">
      <strong>Error:</strong> Could not load repository events. ${error.message}
    </li>
  `;
  repositorySection.setAttribute('aria-busy', 'false');
};

/**
 * 加载和渲染星标仓库列表
 */
fetch('events.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  })
  .then(renderRepositories)
  .catch(showError);
