const API_URL = 'https://script.google.com/macros/s/AKfycbxWrnpLMrUaq2KiVuALUl8ihcI-fpnPnxMdfqSGmYvcLYzzlc62SmHfnDWBGcLhFV59YA/exec';
let currentPage = 1;
let totalPages = 1;

document.addEventListener('DOMContentLoaded', function() {
  const videoList = document.getElementById('videoList');
  const searchInput = document.getElementById('searchInput');
  const paginationContainer = document.getElementById('pagination');
  
  // Load initial data
  loadPageData(currentPage);
  
  // Search functionality
  searchInput.addEventListener('input', function() {
    loadPageData(1, this.value.toLowerCase());
  });
  
  function loadPageData(page, searchTerm = '') {
    fetch(`${API_URL}?page=${page}`)
      .then(response => response.json())
      .then(result => {
        let videos = result.data;
        currentPage = result.page;
        totalPages = result.totalPages;
        
        // Filter if search term exists
        if (searchTerm) {
          videos = videos.filter(video => 
            video.nama.toLowerCase().includes(searchTerm) || 
            video.judul.toLowerCase().includes(searchTerm)
          );
        }
        
        displayVideos(videos);
        setupPagination();
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        videoList.innerHTML = '<p>Gagal memuat data. Silakan coba lagi nanti.</p>';
      });
  }
  
function displayVideos(videosToDisplay) {
  if (videosToDisplay.length === 0) {
    videoList.innerHTML = '<p>Tidak ada video yang ditemukan.</p>';
    return;
  }
  
  videoList.innerHTML = videosToDisplay.map(video => `
    <div class="video-card">
      
      <a href="${video.tonton}" target="_blank" class="thumbnail-link">
        <img src="${video.thumbnail}" alt="${video.judul}" class="video-thumbnail">
      </a>
	  
      <div class="video-title">${video.nomor}. ${video.judul}</div>

      <div class="contact-info">
      <div class="video-info"><strong>Karya:</strong> ${video.nama}</div>
        <div class="video-info">
          <strong>WhatsApp: </strong> 
          <a href="https://wa.me/${video.whatsapp.replace(/[^0-9+]/g, '')}" target="_blank" class="contact-link">
            ${video.whatsapp}
          </a>
        </div>
        <div class="video-info">
         <strong>Email: </strong> 
          <a href="mailto:${video.email}" target="_blank" class="contact-link">
            ${video.email}
          </a>
        </div>
      </div>
    </div>
  `).join('');
}
  
  function setupPagination() {
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
      <button class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}" 
        onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
        Prev
      </button>
    `;
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
      paginationHTML += `<button class="pagination-btn" onclick="changePage(1)">1</button>`;
      if (startPage > 2) {
        paginationHTML += `<span class="pagination-dots">...</span>`;
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `
        <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
          onclick="changePage(${i})">
          ${i}
        </button>
      `;
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationHTML += `<span class="pagination-dots">...</span>`;
      }
      paginationHTML += `<button class="pagination-btn" onclick="changePage(${totalPages})">${totalPages}</button>`;
    }
    
    // Next button
    paginationHTML += `
      <button class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}" 
        onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
        Next
      </button>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
  }
  
  window.changePage = function(newPage) {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      currentPage = newPage;
      const searchTerm = searchInput.value.toLowerCase();
      loadPageData(currentPage, searchTerm);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
});