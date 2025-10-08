// ✅ Use your Google Sheet CSV link here
const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQYS--3fuk9O_kCJN6WRZCi2z-0EDH8bD2qbuM9RB4Pi_IfXEn6MG-FkjYEC-ogVfrwlU4AR_ggydLa/pub?output=csv";

async function fetchMenu() {
  try {
    const response = await fetch(csvUrl);
    const data = await response.text();
    const rows = data.split("\n").map(row => row.split(","));

    const headers = rows[0];
    const items = rows.slice(1).map(row => {
      let item = {};
      headers.forEach((h, i) => {
        item[h.trim()] = row[i] ? row[i].trim() : "";
      });
      return item;
    });

    return items;
  } catch (error) {
    console.error("Error fetching menu:", error);
    document.getElementById("menu").innerText = "⚠️ Failed to load menu. Make sure sheet is public.";
    return [];
  }
}

// Category icons mapping
const categoryIcons = {
  'Appetizers': 'fas fa-seedling',
  'Starters': 'fas fa-seedling',
  'Main Course': 'fas fa-utensils',
  'Mains': 'fas fa-utensils',
  'Desserts': 'fas fa-ice-cream',
  'Beverages': 'fas fa-coffee',
  'Drinks': 'fas fa-coffee',
  'Salads': 'fas fa-leaf',
  'Soups': 'fas fa-bowl-food',
  'Pasta': 'fas fa-plate-wheat',
  'Pizza': 'fas fa-pizza-slice',
  'Seafood': 'fas fa-fish',
  'Chicken': 'fas fa-drumstick-bite',
  'Beef': 'fas fa-hamburger',
  'Vegetarian': 'fas fa-carrot',
  'Veg': 'fas fa-carrot'
};

function renderCategories(items) {
  const categoriesDiv = document.getElementById("categories");
  categoriesDiv.innerHTML = "";

  const categories = [...new Set(items.map(item => item.Category))];

  categories.forEach((cat, index) => {
    const card = document.createElement("div");
    card.className = "category-card";
    card.style.animationDelay = `${index * 0.1}s`;
    card.onclick = () => redirectToCategory(cat);
    
    const iconClass = categoryIcons[cat] || 'fas fa-utensils';
    const description = getCategoryDescription(cat);
    
    card.innerHTML = `
      <div class="category-icon">
        <i class="${iconClass}"></i>
      </div>
      <h3 class="category-name">${cat}</h3>
      <p class="category-description">${description}</p>
    `;
    
    categoriesDiv.appendChild(card);
  });
}

function getCategoryDescription(category) {
  const descriptions = {
    'Appetizers': 'Start your meal with our delicious appetizers',
    'Starters': 'Perfect beginning to your culinary journey',
    'Main Course': 'Hearty and satisfying main dishes',
    'Mains': 'Our signature main course selections',
    'Desserts': 'Sweet endings to perfect your meal',
    'Beverages': 'Refreshing drinks to complement your meal',
    'Drinks': 'Carefully selected beverages',
    'Salads': 'Fresh and healthy salad options',
    'Soups': 'Warm and comforting soup selections',
    'Pasta': 'Authentic pasta dishes made with love',
    'Pizza': 'Wood-fired pizzas with premium ingredients',
    'Seafood': 'Fresh catches from the ocean',
    'Chicken': 'Tender and flavorful chicken dishes',
    'Beef': 'Premium beef selections',
    'Vegetarian': 'Plant-based dishes full of flavor',
    'Veg': 'Delicious vegetarian options'
  };
  
  return descriptions[category] || 'Carefully crafted dishes for your enjoyment';
}

function renderMenu(items, category) {
  const menuDiv = document.getElementById("menu-items");
  if (!menuDiv) {
    console.error("Menu items container not found!");
    return;
  }
  
  menuDiv.innerHTML = "";
  console.log(`Rendering menu for category: ${category}`);
  console.log('All items:', items);
  console.log('Available categories:', [...new Set(items.map(item => item.Category))]);

  const filtered = items.filter(item => 
    item.Category === category || 
    item.Category === category.toLowerCase() || 
    item.Category === category.toUpperCase() ||
    item.category === category ||
    item.category === category.toLowerCase() ||
    item.category === category.toUpperCase()
  );
  console.log(`Found ${filtered.length} items for category: ${category}`);
  console.log('Filtered items:', filtered);

  if (filtered.length === 0) {
    // If no items found for the specific category, show all items as fallback
    console.log('No items found for category, showing all items as fallback');
    const allItems = items.slice(0, 6); // Show first 6 items
    if (allItems.length > 0) {
      allItems.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "menu-item";
        div.style.animationDelay = `${index * 0.1}s`;
        
        // Check for different possible image column names
        const imageUrl = item.ImageURL || item.Image || item.image || item.Photo || item.photo;
        const imageHtml = imageUrl && imageUrl.trim() !== '' 
          ? `<img src="${imageUrl}" alt="${item.ItemName || item.Name || 'Menu Item'}" class="menu-image" loading="lazy" 
               onerror="this.style.display='none';">`
          : `<div class="menu-image" style="background: #f8f9fa; display: flex; align-items: center; justify-content: center; color: #6c757d; font-size: 1.5rem;">
               <span>No Image</span>
             </div>`;
        
        div.innerHTML = `
          ${imageHtml}
          <div class="menu-content">
            <div class="menu-header">
              <h3 class="menu-name">${item.ItemName || item.Name || item.item_name || 'Delicious Item'}</h3>
              <span class="menu-price">₹${item.Price || item.price || item.cost || '0'}</span>
            </div>
            <p class="menu-description">${item.Description || item.description || item.desc || 'Delicious and carefully prepared with premium ingredients.'}</p>
          </div>
        `;
        
        menuDiv.appendChild(div);
      });
      return;
    }
    
    menuDiv.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 20px; margin: 20px;">
        <div style="font-size: 3rem; color: var(--primary-color); margin-bottom: 20px;">
          <i class="fas fa-search"></i>
        </div>
        <h3 style="color: var(--text-dark); margin-bottom: 15px;">No Items in This Category</h3>
        <p style="color: var(--text-light); font-size: 1.1rem; line-height: 1.6; max-width: 400px; margin: 0 auto;">
          We don't have any items in the "${category}" category yet. Please try selecting a different category above.
        </p>
      </div>
    `;
    return;
  }

  filtered.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "menu-item";
    div.style.animationDelay = `${index * 0.1}s`;
    
    // Check for different possible image column names
    const imageUrl = item.ImageURL || item.Image || item.image || item.Photo || item.photo;
    const imageHtml = imageUrl && imageUrl.trim() !== '' 
      ? `<img src="${imageUrl}" alt="${item.ItemName || item.Name || 'Menu Item'}" class="menu-image" loading="lazy" 
           onerror="this.style.display='none';">`
      : `<div class="menu-image" style="background: #f8f9fa; display: flex; align-items: center; justify-content: center; color: #6c757d; font-size: 1.5rem;">
           <span>No Image</span>
         </div>`;
    
    div.innerHTML = `
      ${imageHtml}
      <div class="menu-content">
        <div class="menu-header">
          <h3 class="menu-name">${item.ItemName || item.Name || item.item_name || 'Delicious Item'}</h3>
          <span class="menu-price">₹${item.Price || item.price || item.cost || '0'}</span>
        </div>
        <p class="menu-description">${item.Description || item.description || item.desc || 'Delicious and carefully prepared with premium ingredients.'}</p>
      </div>
    `;
    
    menuDiv.appendChild(div);
  });
}

// Smooth scroll functions
function scrollToMenu() {
  document.getElementById('menu').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

function scrollToAbout() {
  document.getElementById('about').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

function scrollToContact() {
  document.getElementById('contact').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

function scrollToMap() {
  document.getElementById('map').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

// Call restaurant function
function callRestaurant() {
  window.location.href = 'tel:+15551234567';
}

// Email restaurant function
function emailRestaurant() {
  window.location.href = 'mailto:info@ourrestaurant.com';
}

// Redirect to category page
function redirectToCategory(category) {
  // Store the category in localStorage so the category page can access it
  localStorage.setItem('selectedCategory', category);
  // Redirect to category page
  window.location.href = 'category.html';
}

// Show loading state
function showLoading() {
  const menuDiv = document.getElementById("menu-items");
  menuDiv.innerHTML = '<div class="loading">Loading our delicious menu...</div>';
}

// Show error state
function showError(message) {
  const menuDiv = document.getElementById("menu-items");
  menuDiv.innerHTML = `
    <div class="error-message">
      <h3>⚠️ ${message}</h3>
      <p>Please check your connection and try again.</p>
      <button onclick="location.reload()" style="background: var(--gradient-primary); color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
        Try Again
      </button>
    </div>
  `;
}

// Global variables for search
let allMenuItems = [];
let searchTimeout;

// Initialize with veg category displayed by default
document.addEventListener('DOMContentLoaded', async () => {
  showLoading();
  
  try {
    const items = await fetchMenu();
    allMenuItems = items; // Store all items globally
    console.log('Loaded items:', items);
    if (items.length > 0) {
      renderCategories(items);
      // Show veg category items by default
      console.log('Rendering veg category...');
      renderMenu(items, 'veg');
      initializeSearch(); // Initialize search functionality
    } else {
      showError("No menu items found");
    }
  } catch (error) {
    console.error('Error loading menu:', error);
    showError("Failed to load menu");
  }
});

// Search functionality
function initializeSearch() {
  const searchInput = document.getElementById('searchInput');
  const clearSearch = document.getElementById('clearSearch');
  const searchSuggestions = document.getElementById('searchSuggestions');
  
  if (!searchInput) return;
  
  // Use global allMenuItems if available (for category page)
  if (window.allMenuItems && allMenuItems.length === 0) {
    allMenuItems = window.allMenuItems;
  }
  
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    if (query.length === 0) {
      hideSuggestions();
      if (clearSearch) clearSearch.style.display = 'none';
      return;
    }
    
    if (clearSearch) clearSearch.style.display = 'block';
    
    // Immediate search for single characters, debounced for longer queries
    if (query.length === 1) {
      performSearch(query);
    } else {
      // Debounce search for longer queries
      searchTimeout = setTimeout(() => {
        performSearch(query);
      }, 200);
    }
  });
  
  // Add Enter key support for search
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = e.target.value.trim();
      
      if (query.length > 0) {
        hideSuggestions();
        performDirectSearch(query);
      }
    }
  });
  
  // Add arrow key navigation for suggestions
  let selectedSuggestionIndex = -1;
  
  searchInput.addEventListener('keydown', (e) => {
    const searchSuggestions = document.getElementById('searchSuggestions');
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (searchSuggestions && searchSuggestions.classList.contains('show')) {
        const suggestions = searchSuggestions.querySelectorAll('.suggestion-item');
        if (suggestions.length > 0) {
          selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, suggestions.length - 1);
          updateSuggestionSelection(suggestions, selectedSuggestionIndex);
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (searchSuggestions && searchSuggestions.classList.contains('show')) {
        const suggestions = searchSuggestions.querySelectorAll('.suggestion-item');
        if (suggestions.length > 0) {
          selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
          updateSuggestionSelection(suggestions, selectedSuggestionIndex);
        }
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const query = e.target.value.trim();
      
      if (searchSuggestions && searchSuggestions.classList.contains('show') && selectedSuggestionIndex >= 0) {
        const suggestions = searchSuggestions.querySelectorAll('.suggestion-item');
        if (suggestions[selectedSuggestionIndex]) {
          const suggestionName = suggestions[selectedSuggestionIndex].querySelector('.suggestion-name').textContent;
          selectSuggestion(suggestionName);
        }
      } else if (query.length > 0) {
        hideSuggestions();
        performDirectSearch(query);
      }
    } else if (e.key === 'Escape') {
      hideSuggestions();
      selectedSuggestionIndex = -1;
    }
  });
  
  // Clear search functionality
  if (clearSearch) {
    clearSearch.addEventListener('click', () => {
      searchInput.value = '';
      hideSuggestions();
      clearSearch.style.display = 'none';
      // Reset to default view
      if (window.location.pathname.includes('category.html')) {
        const selectedCategory = localStorage.getItem('selectedCategory');
        if (selectedCategory) {
          // Check if renderCategoryItems function exists (category page)
          if (typeof renderCategoryItems === 'function') {
            renderCategoryItems(allMenuItems.filter(item => 
              item.Category === selectedCategory || 
              item.category === selectedCategory
            ));
          } else {
            // Fallback: reload the page to show all category items
            window.location.reload();
          }
        }
      } else {
        // Hide the menu section on index page when clearing search
        const menuSection = document.querySelector('.menu-section');
        if (menuSection) {
          menuSection.style.display = 'none';
        }
        // Remove search results header if it exists
        removeSearchResultsHeader();
        renderMenu(allMenuItems, 'veg');
      }
    });
  }
  
  // Hide suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      hideSuggestions();
    }
  });
}

// Helper function to update suggestion selection
function updateSuggestionSelection(suggestions, selectedIndex) {
  suggestions.forEach((suggestion, index) => {
    if (index === selectedIndex) {
      suggestion.classList.add('selected');
      suggestion.scrollIntoView({ block: 'nearest' });
    } else {
      suggestion.classList.remove('selected');
    }
  });
}

function performDirectSearch(query) {
  if (!allMenuItems || allMenuItems.length === 0) {
    console.log('No menu items available for search');
    return;
  }
  
  console.log('Performing direct search for:', query);
  
  // Redirect to search results page
  window.location.href = `search.html?q=${encodeURIComponent(query)}`;
}

function performSearch(query) {
  if (!allMenuItems || allMenuItems.length === 0) return;
  
  const searchSuggestions = document.getElementById('searchSuggestions');
  if (!searchSuggestions) return;
  
  console.log('performSearch called with:', query);
  
  // Check if we're on a category page and filter accordingly
  const isCategoryPage = window.location.pathname.includes('category.html');
  const selectedCategory = localStorage.getItem('selectedCategory');
  
  // Filter items based on page type
  let itemsToSearch = allMenuItems;
  if (isCategoryPage && selectedCategory) {
    itemsToSearch = allMenuItems.filter(item => 
      item.Category === selectedCategory || 
      item.category === selectedCategory
    );
  }
  
  // Search through filtered menu items with more strict matching
  const results = itemsToSearch.filter(item => {
    const name = (item.ItemName || item.Name || item.item_name || '').toLowerCase();
    const description = (item.Description || item.description || item.desc || '').toLowerCase();
    const category = (item.Category || item.category || '').toLowerCase();
    const searchTerm = query.toLowerCase().trim();
    
    console.log(`🔍 Checking item: "${name}" for search term: "${searchTerm}"`);
    console.log(`📋 Item details:`, { name, description, category });
    
    // For single character searches, check if it appears anywhere in the name
    if (searchTerm.length === 1) {
      const matches = name.includes(searchTerm);
      console.log(`Single char match for "${name}": ${matches}`);
      return matches;
    }
    
    // For two character searches, check if it appears anywhere in the name
    if (searchTerm.length === 2) {
      const matches = name.includes(searchTerm);
      console.log(`Two char match for "${name}": ${matches}`);
      return matches;
    }
    
    // For longer searches, check name first
    if (name.includes(searchTerm)) {
      console.log(`✅ Name contains match for "${name}": true`);
      return true;
    }
    
    // Only check description if name doesn't match and search term is at least 3 characters
    if (searchTerm.length >= 3 && description.includes(searchTerm)) {
      console.log(`✅ Description contains match for "${name}": true`);
      return true;
    }
    
    // Check category for longer searches
    if (searchTerm.length >= 3 && category.includes(searchTerm)) {
      console.log(`✅ Category contains match for "${name}": true`);
      return true;
    }
    
    console.log(`❌ No match for "${name}"`);
    return false;
  });
  
  console.log('Search results:', results.length);
  
  if (results.length === 0) {
    showNoResults();
    return;
  }
  
  // Sort results by relevance (exact matches first, then partial matches)
  const sortedResults = results.sort((a, b) => {
    const aName = (a.ItemName || a.Name || a.item_name || '').toLowerCase();
    const bName = (b.ItemName || b.Name || b.item_name || '').toLowerCase();
    const searchTerm = query.toLowerCase();
    
    // Exact match gets highest priority
    if (aName === searchTerm) return -1;
    if (bName === searchTerm) return 1;
    
    // Starts with search term gets second priority
    if (aName.startsWith(searchTerm)) return -1;
    if (bName.startsWith(searchTerm)) return 1;
    
    // Contains search term gets third priority
    if (aName.includes(searchTerm)) return -1;
    if (bName.includes(searchTerm)) return 1;
    
    // Alphabetical order for remaining items
    return aName.localeCompare(bName);
  });
  
  // Show suggestions (limit to 10 results for better coverage)
  const limitedResults = sortedResults.slice(0, 10);
  displaySuggestions(limitedResults);
}

function displaySuggestions(results) {
  const searchSuggestions = document.getElementById('searchSuggestions');
  if (!searchSuggestions) return;
  
  const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
  
  const suggestionsHTML = results.map(item => {
    const imageUrl = item.ImageURL || item.Image || item.image || item.Photo || item.photo;
    const name = item.ItemName || item.Name || item.item_name || 'Menu Item';
    const price = item.Price || item.price || item.cost || '0';
    const category = item.Category || item.category || '';
    
    // Highlight matching text in the name
    const highlightedName = highlightSearchTerm(name, searchTerm);
    
    return `
      <div class="suggestion-item" onclick="selectSuggestion('${name}')">
        ${imageUrl ? `<img src="${imageUrl}" alt="${name}" onerror="this.style.display='none'">` : ''}
        <div class="suggestion-content">
          <div class="suggestion-name-price">
            <div class="suggestion-name">${highlightedName}</div>
            <div class="suggestion-price">₹${price}</div>
          </div>
          ${category ? `<div class="suggestion-category">${category}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');
  
  searchSuggestions.innerHTML = suggestionsHTML;
  searchSuggestions.classList.add('show');
}

function highlightSearchTerm(text, searchTerm) {
  if (!searchTerm || searchTerm.length === 0) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="search-highlight">$1</mark>');
}

function showNoResults() {
  const searchSuggestions = document.getElementById('searchSuggestions');
  if (!searchSuggestions) return;
  
  // Check if we're on a category page
  const isCategoryPage = window.location.pathname.includes('category.html');
  const selectedCategory = localStorage.getItem('selectedCategory');
  const message = isCategoryPage && selectedCategory 
    ? `No dishes found in ${selectedCategory} category` 
    : 'No dishes found matching your search';
  
  searchSuggestions.innerHTML = `
    <div class="no-suggestions">
      <i class="fas fa-search"></i>
      <p>${message}</p>
    </div>
  `;
  searchSuggestions.classList.add('show');
}

function hideSuggestions() {
  const searchSuggestions = document.getElementById('searchSuggestions');
  if (searchSuggestions) {
    searchSuggestions.classList.remove('show');
  }
}

function selectSuggestion(itemName) {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.value = itemName;
  }
  
  hideSuggestions();
  
  // Redirect to search results page with the selected item name
  window.location.href = `search.html?q=${encodeURIComponent(itemName)}`;
}

// Function to add search results header
function addSearchResultsHeader(query, resultCount) {
  // Remove any existing search results header
  const existingHeader = document.querySelector('.search-results-header');
  if (existingHeader) {
    existingHeader.remove();
  }
  
  // Create new search results header
  const header = document.createElement('div');
  header.className = 'search-results-header';
  header.innerHTML = `
    <h1 class="search-results-title">Search results</h1>
    <div class="search-results-summary">
      <div class="search-results-count">${resultCount} results found for "${query}"</div>
      <div>Showing ${resultCount} result${resultCount !== 1 ? 's' : ''}</div>
    </div>
    <h2 class="products-section-title">Products (${resultCount})</h2>
  `;
  
  // Insert the header before the menu section
  const menuSection = document.querySelector('.menu-section');
  if (menuSection) {
    menuSection.parentNode.insertBefore(header, menuSection);
  }
}

// Function to remove search results header
function removeSearchResultsHeader() {
  const existingHeader = document.querySelector('.search-results-header');
  if (existingHeader) {
    existingHeader.remove();
  }
}

// ===== MOBILE NAVIGATION FUNCTIONS =====
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobileNavMenu');
  const toggleButton = document.querySelector('.mobile-menu-toggle i');
  
  if (mobileMenu.classList.contains('show')) {
    mobileMenu.classList.remove('show');
    toggleButton.classList.remove('fa-times');
    toggleButton.classList.add('fa-bars');
  } else {
    mobileMenu.classList.add('show');
    toggleButton.classList.remove('fa-bars');
    toggleButton.classList.add('fa-times');
  }
}

function closeMobileMenu() {
  const mobileMenu = document.getElementById('mobileNavMenu');
  const toggleButton = document.querySelector('.mobile-menu-toggle i');
  
  mobileMenu.classList.remove('show');
  toggleButton.classList.remove('fa-times');
  toggleButton.classList.add('fa-bars');
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
  const mobileMenu = document.getElementById('mobileNavMenu');
  const toggleButton = document.querySelector('.mobile-menu-toggle');
  
  if (mobileMenu && !mobileMenu.contains(event.target) && !toggleButton.contains(event.target)) {
    closeMobileMenu();
  }
});

// Close mobile menu on window resize
window.addEventListener('resize', function() {
  if (window.innerWidth > 768) {
    closeMobileMenu();
  }
});
