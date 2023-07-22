const emojiContainer = document.getElementById("emoji-container");
const categoryFilter = document.getElementById("category-filter");
const paginationContainer = document.getElementById("pagination");

const apiUrl = "https://emojihub.yurace.pro/api/all";
const emojisPerPage = 10;

let allEmojis = [];
let currentPage = 1;

function displayEmojis() {
  const startIndex = (currentPage - 1) * emojisPerPage;
  const endIndex = startIndex + emojisPerPage;
  const emojisToDisplay = allEmojis.slice(startIndex, endIndex);

  emojiContainer.innerHTML = "";
  emojisToDisplay.forEach((emoji) => {
    const emojiCard = document.createElement("div");
    emojiCard.classList.add("emoji-card");
    emojiCard.innerHTML = `<div>${emoji.name}</div><div>${emoji.htmlCode}</div><div>${emoji.category}</div>`;
    emojiContainer.appendChild(emojiCard);
  });
}

function displayFilterOptions() {
  const categories = allEmojis.reduce((uniqueCategories, emoji) => {
    if (!uniqueCategories.includes(emoji.category)) {
      uniqueCategories.push(emoji.category);
    }
    return uniqueCategories;
  }, []);

  categoryFilter.innerHTML = '<option value="">All</option>';
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function displayPagination() {
  const totalPages = Math.ceil(allEmojis.length / emojisPerPage);
  const maxPageLinks = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPageLinks / 2));
  let endPage = Math.min(totalPages, startPage + maxPageLinks - 1);

  if (endPage - startPage + 1 < maxPageLinks) {
    startPage = Math.max(1, endPage - maxPageLinks + 1);
  }

  paginationContainer.innerHTML = "";

  const previousButton = createPageButton(
    "<",
    currentPage > 1 ? currentPage - 1 : null
  );
  paginationContainer.appendChild(previousButton);

  for (let i = startPage; i <= endPage; i++) {
    const pageButton = createPageButton(i, i);
    paginationContainer.appendChild(pageButton);
  }

  const nextButton = createPageButton(
    ">",
    currentPage < totalPages ? currentPage + 1 : null
  );
  paginationContainer.appendChild(nextButton);
}

function createPageButton(text, pageNumber) {
  const pageButton = document.createElement("span");
  pageButton.textContent = text;
  pageButton.classList.add("page-link");
  if (pageNumber === currentPage) {
    pageButton.classList.add("active");
  }
  if (pageNumber !== null) {
    pageButton.addEventListener("click", () => {
      currentPage = pageNumber;
      displayEmojis();
      displayPagination();
    });
  }
  return pageButton;
}

async function fetchEmojis() {
  const response = await fetch(apiUrl);
  const data = await response.json();

  allEmojis = data;

  currentPage = 1;
  displayEmojis();
  displayFilterOptions();
  displayPagination();
}

function filterEmojisByCategory() {
  const selectedCategory = categoryFilter.value;
  let filteredEmojis = allEmojis;

  if (selectedCategory) {
    filteredEmojis = allEmojis.filter(
      (emoji) => emoji.category === selectedCategory
    );
  }

  allEmojis = filteredEmojis;
  currentPage = 1;
  displayEmojis();
  displayPagination();
}

categoryFilter.addEventListener("change", filterEmojisByCategory);

fetchEmojis();
