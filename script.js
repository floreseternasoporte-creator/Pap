// ===== BLOQUE JS 1 =====
// Deshabilitar clic derecho
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  return false;
});

// Deshabilitar teclas de desarrollo
document.addEventListener('keydown', function(e) {
  // Deshabilitar F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
  if (
    e.keyCode === 123 ||
    (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
    (e.ctrlKey && e.keyCode === 85)
  ) {
    e.preventDefault();
    return false;
  }
});

// Anti-debugging
setInterval(function() {
  debugger;
}, 100);

// Deshabilitar vista de código fuente
document.onkeypress = function (event) {
  event = (event || window.event);
  if (event.keyCode == 123) return false;
  if (event.ctrlKey && event.keyCode == 85) return false;
}

// Mensaje de advertencia
console.log('%cAdvertencia!', 'color: red; font-size: 30px; font-weight: bold;');
console.log('%cEste sitio está protegido contra inspección de código.', 'font-size: 20px;');

// ===== BLOQUE JS 2 =====
/*********************** BLOQUEO DE ACCESO EN COMPUTADORAS (Móvil obligatorio) ***********************/
    function esDispositivoMovil() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    /*********************** MODO OFFLINE ***********************/
    window.addEventListener('offline', function() {
      document.body.innerHTML = `
        <div id="offline-modal">
          <img src="https://ideogram.ai/assets/image/lossless/response/ZL-_GzzNQdy7CzioYPtDHg" alt="Sin conexión">
        </div>`;
    });
    window.addEventListener('online', function() {
      location.reload();
    });
    /* FUNCIÓN PARA ESTABLECER EL TEMA GLOBAL (día/noche) Y COLOR DE FUENTE */
    window.addEventListener('load', function() {
      if (window.innerWidth >= 1024) {
        document.body.classList.add('desktop');
      }
    });

    function organizeCarousels() {
      var carouselIds = [];
      carouselIds.forEach(id => {
        var carousel = document.getElementById(id);
        if (carousel) {
          carousel.classList.remove('grid', 'grid-cols-2', 'md:grid-cols-4');
          carousel.classList.add('flex', 'space-x-4', 'overflow-x-auto');
        }
      });
    }
    window.addEventListener('load', organizeCarousels);
    document.addEventListener("DOMContentLoaded", function() {
      var savedLang = localStorage.getItem("selectedLanguage");
      if (savedLang) {
        currentLanguage = savedLang;
        updateTranslations();
      } else {
        document.getElementById("language-modal").style.display = "flex";
      }
    });

    function updateChapterUI() {
      var chapterSection = document.getElementById('chapter-section');
      if (!chapterSection) return;
      if (storyTypeSelected === 'cuento') {
        chapterSection.style.display = 'none';
      } else if (storyTypeSelected === 'historia_completa') {
        chapterSection.style.display = 'block';
        document.querySelectorAll('.chapter-label').forEach(label => {
          label.textContent = 'Capítulo';
        });
      } else if (storyTypeSelected === 'novela') {
        chapterSection.style.display = 'block';
        document.querySelectorAll('.chapter-label').forEach(label => {
          label.textContent = 'Saga';
        });
      }
    }

    function selectStoryType(type) {
      storyTypeSelected = type;
      document.getElementById('story-creation-view').classList.add('hidden');
      document.getElementById('story-details-view').classList.remove('hidden');
      updateChapterUI();
    }
    /*************** FUNCIONES PARA COMPRA DE MONEDAS (ELIMINADAS) ***************/
    // Se han removido las funciones openBuyCoinsModal(), closeBuyCoinsModal() y buyCoins()
    /*************** FIN FUNCIONES DE COMPRA DE MONEDAS ***************/
    /*********************** NUEVAS FUNCIONES PARA SUGERENCIAS Y AUTORES DESTACADOS ***********************/
    function loadSuggestedStories() {
      firebase.database().ref('stories').once('value').then(snapshot => {
        var stories = [];
        snapshot.forEach(child => {
          var story = child.val();
          story.id = child.key;
          stories.push(story);
        });
        stories.sort((a, b) => (b.ratingValue || 0) - (a.ratingValue || 0));
        var suggested = stories.slice(0, 10);
        var container = document.getElementById('suggested-stories');
        container.innerHTML = '';
        suggested.forEach(story => {
          var card = document.createElement('div');
          card.className = 'story-card cursor-pointer';
          card.innerHTML = `
              <div class="rounded-2xl overflow-hidden shadow-md">
                <div class="story-cover-container">
                  <img src="${story.coverImage || '/api/placeholder/200/300'}" alt="${story.title}" class="story-cover-image">
                </div>
              </div>
              <div class="mt-2">
                <h3 class="font-semibold text-sm">${story.title}</h3>
              </div>
            `;
          container.appendChild(card);
        });
      });
    }

    function loadFeaturedAuthors() {
      firebase.database().ref('stories').once('value').then(snapshot => {
        var authorCounts = {};
        snapshot.forEach(child => {
          var story = child.val();
          if (story && story.userId) {
            if (!authorCounts[story.userId]) authorCounts[story.userId] = 0;
            authorCounts[story.userId]++;
          }
        });
        var authorsArray = [];
        for (let uid in authorCounts) {
          authorsArray.push({
            uid: uid,
            count: authorCounts[uid]
          });
        }
        authorsArray.sort((a, b) => b.count - a.count);
        var topAuthors = authorsArray.slice(0, 10);
        var container = document.getElementById('featured-authors');
        container.innerHTML = '';
        topAuthors.forEach(author => {
          firebase.database().ref('users/' + author.uid).once('value').then(userSnap => {
            var userData = userSnap.val();
            var card = document.createElement('div');
            card.className = 'story-card cursor-pointer';
            card.onclick = () => openAuthorProfile(author.uid);
            card.innerHTML = `
                <div class="rounded-2xl overflow-hidden shadow-md">
                  <img src="${userData.profileImage || 'https://via.placeholder.com/150'}" alt="${userData.username}" class="w-full h-40 object-cover">
                </div>
                <div class="mt-2">
                  <h3 class="font-semibold text-sm">${userData.username}</h3>
                </div>
              `;
            container.appendChild(card);
          });
        });
      });
    }
    /*************** FIN NUEVAS FUNCIONES ***********************/

// ===== BLOQUE JS 3 =====
function loadFollowingStories() {
  var user = firebase.auth().currentUser;
  if (!user) return;

  var followingStoriesDiv = document.getElementById('following-stories');
  if (!followingStoriesDiv) return;

  firebase.database().ref('following/' + user.uid).once('value').then(followingSnap => {
    followingStoriesDiv.innerHTML = '';

    followingSnap.forEach(following => {
      var followedUserId = following.key;

      firebase.database().ref('users/' + followedUserId).once('value').then(userSnap => {
        var userData = userSnap.val();

        // 检查最近更新（最近24小时）
        firebase.database().ref('stories').orderByChild('userId').equalTo(followedUserId).once('value').then(storiesSnap => {
          var hasNewContent = false;
          var latestStoryId = null;

          storiesSnap.forEach(storySnap => {
            var story = storySnap.val();
            var lastUpdate = story.lastUpdate || story.createdAt;
            if (Date.now() - lastUpdate < 24 * 60 * 60 * 1000) {
              hasNewContent = true;
              latestStoryId = storySnap.key;
            }
          });

          var storyDiv = document.createElement('div');
          storyDiv.className = 'flex flex-col items-center cursor-pointer';

          var imageContainer = document.createElement('div');
          imageContainer.className = `w-16 h-16 rounded-full overflow-hidden ${hasNewContent ? 'border-2 border-[#FE2C55]' : 'border border-gray-300'}`;

          if (hasNewContent) {
            imageContainer.classList.add('animate-pulse');
          }

          imageContainer.innerHTML = `
            <img src="${userData.profileImage || 'https://via.placeholder.com/150'}"
                 alt="${userData.username}"
                 class="w-full h-full object-cover"
                 onclick="openAuthorProfile('${followedUserId}')">
          `;

          storyDiv.appendChild(imageContainer);

          var username = document.createElement('span');
          username.className = 'text-xs mt-1 truncate w-16 text-center';
          username.textContent = userData.username;
          storyDiv.appendChild(username);

          followingStoriesDiv.appendChild(storyDiv);
        });
      });
    });
  });
}


// 页面加载和用户状态变化时调用loadFollowingStories
document.addEventListener('DOMContentLoaded', loadFollowingStories);
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    loadFollowingStories();
  }
});

// ===== BLOQUE JS 4 =====
var lastScrollTop = 0;
    var bottomNav = document.getElementById("bottom-nav");
    var scrollArea = document.getElementById("scrollable-content");

    function setBottomNavVisibility(show) {
      if (!bottomNav) return;
      bottomNav.classList.toggle("hidden", !show);
    }

    scrollArea.addEventListener("scroll", () => {
      var scrollTop = scrollArea.scrollTop;
      if (scrollTop > lastScrollTop) {
        bottomNav.classList.add("hide");
      } else {
        bottomNav.classList.remove("hide");
      }
      lastScrollTop = scrollTop;
    });

// ===== BLOQUE JS 5 =====
// Mover el listener al script principal

// ===== BLOQUE JS 6 =====
// Funciones para manejar tabs en desktop
document.addEventListener('DOMContentLoaded', function() {
  var tabButtons = document.querySelectorAll('.tab-button');
  var tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      var tabName = button.getAttribute('data-tab');

      // Remover active de todos los botones
      tabButtons.forEach(btn => {
        btn.classList.remove('active', 'border-[#FE2C55]', 'text-[#FE2C55]');
        btn.classList.add('border-transparent', 'text-gray-500');
      });

      // Agregar active al botón clickeado
      button.classList.add('active', 'border-[#FE2C55]', 'text-[#FE2C55]');
      button.classList.remove('border-transparent', 'text-gray-500');

      // Ocultar todos los contenidos
      tabContents.forEach(content => {
        content.classList.add('hidden');
      });

      // Mostrar el contenido correspondiente
      var targetContent = document.getElementById(tabName + '-tab-content');
      if (targetContent) {
        targetContent.classList.remove('hidden');

        // Si es el tab de notas, cargar las notas del usuario
        if (tabName === 'notes') {
          loadUserNotes();
        }
      }
    });
  });
});

function handleProfileImageUploadDesktop(event) {
  var file = event.target.files[0];
  if (!file) return;
  var reader = new FileReader();

  reader.onload = function(e) {
    document.getElementById('profile-image-desktop').src = e.target.result;
    // También actualizar la imagen móvil
    document.getElementById('profile-image').src = e.target.result;

    // Guardar en Firebase
    var user = firebase.auth().currentUser;
    if (user) {
      firebase.database().ref('users/' + user.uid).update({
        profileImage: e.target.result
      });
    }
  }

  if (file) {
    reader.readAsDataURL(file);
  }
}

// ===== BLOQUE JS 7 =====
function handleProfileImageUpload(event) {
    var file = event.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = e => {
      document.getElementById('profile-image').src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

// ===== BLOQUE JS 8 =====
function handleEditProfileImageUpload(event) {
    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function(e) {
      document.getElementById('edit-profile-image').src = e.target.result;
    }

    if (file) {
      reader.readAsDataURL(file);
    }
  }

// ===== BLOQUE JS 9 =====
function openNoteModal() {
  document.getElementById('note-modal').classList.remove('hidden');
}

function closeNoteModal() {
  document.getElementById('note-modal').classList.add('hidden');
  document.getElementById('note-input').value = '';
}

function saveNote() {
  var noteText = document.getElementById('note-input').value.trim();
  var currentUser = firebase.auth().currentUser;

  if (!noteText || !currentUser) return;

  firebase.database().ref('profileNotes/' + currentUser.uid).set({
    text: noteText,
    timestamp: Date.now()
  }).then(() => {
    closeNoteModal();
    var profileNote = document.getElementById('profile-note');
    profileNote.classList.remove('hidden');
    document.getElementById('note-text').textContent = noteText;
    document.getElementById('note-time').textContent = 'Expira en 12 horas';
  });
}

// ===== BLOQUE JS 10 =====
// Toggling de texto en botón de seguir
  function followAuthor() {
    var btn = document.getElementById('follow-button');
    var text = document.getElementById('follow-button-text');
    var isFollowing = text.textContent === 'Seguir';
    text.textContent = isFollowing ? 'Dejar de seguir' : 'Seguir';
    // Aquí iría lógica real de seguimiento.
  }

// ===== BLOQUE JS 11 =====
// Funciones para cambiar vistas
  function selectStoryType(type) {
    document.getElementById('story-creation-view').classList.add('hidden');
    document.getElementById('story-details-view').classList.remove('hidden');
  }

// ===== BLOQUE JS 12 =====
// Función para detectar restricciones basadas en país y operador
  function checkTransmissionAvailability() {
    return true;
  }
  // Función para aplicar la vista "cinematográfica" (YouTube) al video
  function setLiveStreamYouTubeView() {
    var video = document.getElementById('live-localVideo');
    if (video) {
      // Se muestra el video completo sin recortes (similar a letterboxing)
      video.style.objectFit = 'contain';
      video.style.width = '100vw';
      video.style.height = 'auto';
      // Se puede ajustar el contenedor para que tenga fondo negro
      var container = video.parentElement;
      if (container) {
        container.style.backgroundColor = 'black';
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
      }
    }
  }
  // Interceptar el clic en el botón de transmisión
  document.getElementById('live-startBtn').addEventListener('click', function(e) {
    e.preventDefault();
    // Se remueve la verificación de restricciones:
    document.getElementById('transmission-block-modal').classList.add('hidden');
    document.getElementById('live-stream-modal').classList.remove('hidden');
    setLiveStreamYouTubeView();
    // Inicia la transmisión (llamada a la función correspondiente)
  });

// ===== BLOQUE JS 13 =====
// FUNCIONES DE MARCOS ANIMADOS
  function openFrameSelector() {
    return;
  }

  function closeFrameSelector() {
    return;
  }

  function selectFrame() {
    return;
  }

  function applyFrame() {
    return;
  }

  function purchaseFrame() {
    return;
  }

  function showFrameHistory() {
    return;
  }

  function loadUserFrame() {
    return;
  }

  // Función para cargar estadísticas del perfil en tiempo real
  function loadUserStats(userId) {
    // Contador de publicaciones
    firebase.database().ref('communityNotes').orderByChild('authorId').equalTo(userId).on('value', postsSnapshot => {
      var postsCount = postsSnapshot.numChildren();

      var profilePostsTitle = document.getElementById('profile-posts-title');
      if (profilePostsTitle) profilePostsTitle.textContent = `${postsCount} posts`;

      var profilePostsHeader = document.getElementById('profile-posts-header');
      var sidebarPostsCount = document.getElementById('sidebar-posts-count');
      var profilePostsCountDesktop = document.getElementById('profile-posts-count-desktop');

      if (profilePostsHeader) profilePostsHeader.textContent = `${postsCount} posts`;
      if (sidebarPostsCount) sidebarPostsCount.textContent = postsCount;
      if (profilePostsCountDesktop) profilePostsCountDesktop.textContent = postsCount;

      var sidebarTotalViews = document.getElementById('sidebar-total-views');
      if (sidebarTotalViews) sidebarTotalViews.textContent = postsCount;

      loadUserPostsGrid(postsSnapshot);
    });

    firebase.database().ref('users/' + userId + '/followersCount').on('value', snapshot => {
      var followersCount = snapshot.val() || 0;
      var sidebarFollowersCount = document.getElementById('sidebar-followers-count');
      if (sidebarFollowersCount) sidebarFollowersCount.textContent = followersCount;
    });
  }

  // Función para cargar las publicaciones del usuario en el grid
  function loadUserPostsGrid(postsSnapshot) {
    var userPostsDesktop = document.getElementById('user-posts-desktop');
    var userPostsMobile = document.getElementById('user-posts');

    if (userPostsDesktop) {
      userPostsDesktop.innerHTML = "";
    }
    if (userPostsMobile) {
      userPostsMobile.innerHTML = "";
    }

    if (!postsSnapshot.exists()) {
      // Mostrar mensaje cuando no hay publicaciones
      var noStoriesMessage = `
        <div class="col-span-full text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-600 mb-2">No tienes posts aún</h3>
          <p class="text-gray-500 mb-4">Crea tu primera publicación para comenzar</p>
          <button onclick="openNoteCreationFullscreen()" class="bg-[#FE2C55] text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors">
            Crear primera publicación
          </button>
        </div>
      `;

      if (userPostsDesktop) {
        userPostsDesktop.innerHTML = noStoriesMessage;
      }
      if (userPostsMobile) {
        userPostsMobile.innerHTML = noStoriesMessage;
      }
      return;
    }

    // Cargar publicaciones existentes
    postsSnapshot.forEach(child => {
      var post = { ...(child.val() || {}), id: child.key };
      var postCard = createProfilePostCard(post);
      if (userPostsDesktop) userPostsDesktop.appendChild(postCard.cloneNode(true));
      if (userPostsMobile) userPostsMobile.appendChild(postCard);
    });
  }

  // Función para crear una tarjeta de publicación del usuario
  function createProfilePostCard(post) {
    var card = document.createElement('div');
    card.className = 'bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer w-full';
    card.onclick = () => openCommentsView(post.id);

    card.innerHTML = `
      <div class="flex items-start gap-2">
        <img src="${post.authorImage || 'https://via.placeholder.com/40'}" class="w-8 h-8 rounded-full object-cover flex-shrink-0">
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-xs text-gray-800">${post.authorName || 'Usuario'}</p>
          ${post.content ? `<p class="text-xs text-gray-700 mt-1 line-clamp-3">${post.content}</p>` : ''}
          <div class="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <span>${formatRelativeTime(post.timestamp)}</span>
          </div>
        </div>
      </div>
    `;

    return card;
  }

  // FUNCIONES DEL CREATOR HUB
  function openCreatorHub() {
    document.getElementById('main-app').classList.add('hidden');
    document.getElementById('community-view').classList.add('hidden');
    document.getElementById('profile-view').classList.add('hidden');
    document.getElementById('search-view').classList.add('hidden');
    document.getElementById('games-view').classList.add('hidden');
    document.getElementById('creator-hub-view').classList.remove('hidden');
    loadCreatorStats();
  }

  function closeCreatorHub() {
    document.getElementById('creator-hub-view').classList.add('hidden');
    mainApp.classList.remove('hidden');
  }

  function openNoteCreation() {
    // Abrir directamente la pantalla completa de creación de notas
    closeCreatorHub();
    openNoteCreationFullscreen();
  }

  // Nueva función para abrir la pantalla completa de creación de notas
  // Lógica de GIFs
  function getFadingCircleLoaderMarkup() {
    return `
      <div class="sk-fading-circle" aria-hidden="true">
        <div class="sk-circle1 sk-circle"></div><div class="sk-circle2 sk-circle"></div><div class="sk-circle3 sk-circle"></div><div class="sk-circle4 sk-circle"></div>
        <div class="sk-circle5 sk-circle"></div><div class="sk-circle6 sk-circle"></div><div class="sk-circle7 sk-circle"></div><div class="sk-circle8 sk-circle"></div>
        <div class="sk-circle9 sk-circle"></div><div class="sk-circle10 sk-circle"></div><div class="sk-circle11 sk-circle"></div><div class="sk-circle12 sk-circle"></div>
      </div>
    `;
  }

  var selectedGif = null;
  var selectedCommentGif = null;
  var TENOR_API_KEY = 'AIzaSyAY8XK11md7xVhlwHOdwFPdsgaHZeBNWjs'; // API Key para Tenor V2
var KLIPY_GIFS = [
    'https://media.tenor.com/8QfLxU0AyzQAAAAC/hello-hi.gif',
    'https://media.tenor.com/rYIw5Q9v7U8AAAAC/thumbs-up-approve.gif',
    'https://media.tenor.com/bmWd7Ff6QdQAAAAC/clap-applause.gif',
    'https://media.tenor.com/eYwN7K2wq5kAAAAC/wow-amazed.gif',
    'https://media.tenor.com/sS1qzv8v8fQAAAAC/typing-fast.gif',
    'https://media.tenor.com/DO2xN3M6H2sAAAAC/party-celebrate.gif'
  ];

  function getGifLoadingMarkup(label = 'Buscando...') {
    return `
      <div class="col-span-2 py-10 flex flex-col items-center justify-center gap-3 text-[#9f918a] text-sm">
        <div class="native-loader" aria-hidden="true"></div>
        <span>${label}</span>
      </div>
    `;
  }


  function openGifPicker() {
    window.__gifPickerContext = window.__gifPickerContext || 'post';
    var overlay = document.getElementById('gif-picker-overlay');
    var sheet = document.getElementById('gif-picker-sheet');
    overlay.classList.remove('hidden');
    sheet.classList.remove('hidden');
    setTimeout(() => {
      sheet.classList.remove('translate-y-full');
    }, 10);

    if (document.getElementById('gif-search-input').value === '') {
      searchGifs('trending');
    }
  }

  function closeGifPicker() {
    var overlay = document.getElementById('gif-picker-overlay');
    var sheet = document.getElementById('gif-picker-sheet');
    sheet.classList.add('translate-y-full');
    setTimeout(() => {
      overlay.classList.add('hidden');
      sheet.classList.add('hidden');
    }, 300);
  }

  function searchGifs(query) {
    var container = document.getElementById('gif-results-container');
    container.innerHTML = `<div class="col-span-2 py-2 text-center">${getFadingCircleLoaderMarkup()}</div>`;

    var normalizedQuery = (query || 'trending').trim() || 'trending';
    var url = `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(normalizedQuery)}&key=${TENOR_API_KEY}&limit=20&media_filter=minimal`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        container.innerHTML = '';
        if (data.results && data.results.length > 0) {
          data.results.forEach(gif => {
            var media = gif.media_formats.tinygif;
            var img = document.createElement('img');
            img.src = media.url;
            img.className = 'w-full h-32 object-cover rounded-2xl cursor-pointer hover:opacity-90 transition border border-[#e8e1dc]';
            img.onclick = () => selectGif(media.url);
            container.appendChild(img);
          });
        } else {
          container.innerHTML = '<div class="col-span-2 py-10 text-center text-[#9f918a] text-sm">No se encontraron GIFs</div>';
        }
      })
      .catch(err => {
        console.error('Error fetching GIFs:', err);
        container.innerHTML = '<div class="col-span-2 py-10 text-center text-[#9f918a] text-sm">Error al buscar GIFs</div>';
      });
  }

  document.getElementById('gif-search-input').oninput = function(e) {
    var query = e.target.value.trim();
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => searchGifs(query.length > 0 ? query : 'trending'), 450);
  };

  function selectGif(url) {
    if (window.__gifPickerContext === 'comment') {
      selectedCommentGif = url;
      var preview = document.getElementById('comment-gif-preview');
      var img = document.getElementById('selected-comment-gif-img');
      if (img) img.src = url;
      if (preview) preview.classList.remove('hidden');
      window.__gifPickerContext = 'post';
      closeGifPicker();
      return;
    }

    selectedGif = url;
    var preview = document.getElementById('gif-preview-note-content-fullscreen');
    var img = document.getElementById('selected-gif-img');
    img.src = url;
    preview.classList.remove('hidden');
    window.__gifPickerContext = 'post';
    closeGifPicker();
  }

  function removeGifFullscreen() {
    selectedGif = null;
    document.getElementById('gif-preview-note-content-fullscreen').classList.add('hidden');
    document.getElementById('selected-gif-img').src = '';
  }

  function openCommentGifPicker() {
    window.__gifPickerContext = 'comment';
    openGifPicker();
  }

  function removeCommentGif() {
    selectedCommentGif = null;
    var preview = document.getElementById('comment-gif-preview');
    var img = document.getElementById('selected-comment-gif-img');
    if (preview) preview.classList.add('hidden');
    if (img) img.src = '';
  }

  // Nueva función para abrir la pantalla completa de creación de notas
  function openNoteCreationFullscreen() {
    setBottomNavVisibility(false);
    document.getElementById('note-creation-fullscreen').classList.remove('hidden');
    document.getElementById('note-content-fullscreen').value = '';
    clearStickerSelection('note-content-fullscreen');
    removeGifFullscreen();
    document.getElementById('char-counter-fullscreen').textContent = '200';
    document.getElementById('image-preview-fullscreen').classList.add('hidden');
    document.getElementById('preview-grid-fullscreen').innerHTML = '';
    document.getElementById('image-preview-counter-fullscreen').textContent = '';
    document.getElementById('poll-preview-fullscreen').classList.add('hidden');
    document.getElementById('note-image-fullscreen').value = '';
    clearDisclosures();
    loadLocationStateFromStorage();

    // Cargar imagen de perfil actual
    var user = firebase.auth().currentUser;
    if (user) {
      firebase.database().ref('users/' + user.uid).once('value').then(snap => {
        var userData = snap.val();
        if (userData && userData.profileImage) {
          document.getElementById('note-author-image-fullscreen').src = userData.profileImage;
        }
      });
    }

    // Resetear botón
    var publishBtn = document.getElementById('publish-btn-fullscreen');
    publishBtn.disabled = false;
    publishBtn.innerHTML = 'Publicar';

    // Agregar listener para contador de caracteres
    var textarea = document.getElementById('note-content-fullscreen');
    textarea.oninput = function() {
      var remaining = 200 - this.value.length;
      document.getElementById('char-counter-fullscreen').textContent = remaining;
    };
  }
  function togglePollInput() {
    var pollPreview = document.getElementById('poll-preview-fullscreen');
    var noteContent = document.getElementById('note-content-fullscreen');
    var pollQuestion = document.getElementById('poll-question-main');
    var isHidden = pollPreview.classList.contains('hidden');

    if (isHidden) {
      pollPreview.classList.remove('hidden');
      noteContent.classList.add('hidden');
      pollQuestion.classList.remove('hidden');

      var optionInputs = document.querySelectorAll('#poll-options-container input');
      optionInputs.forEach(input => {
        input.addEventListener('input', updateCharacterCount);
      });
      pollQuestion.addEventListener('input', updateCharacterCount);

      updateAddPollButtonState();
    } else {
      pollPreview.classList.add('hidden');
      noteContent.classList.remove('hidden');
      pollQuestion.classList.add('hidden');
      removePollFullscreen();
    }
  }

  function removePollFullscreen() {
    var pollPreview = document.getElementById('poll-preview-fullscreen');
    var noteContent = document.getElementById('note-content-fullscreen');
    var pollQuestion = document.getElementById('poll-question-main');

    pollPreview.classList.add('hidden');
    noteContent.classList.remove('hidden');
    pollQuestion.classList.add('hidden');
    pollQuestion.value = '';
    pollOptionCount = 2;

    var container = document.getElementById('poll-options-container');
    container.innerHTML = `
      <div class="flex items-center space-x-1">
        <input type="text" placeholder="Opción 1" maxlength="20" class="flex-1 p-3 border border-[#e8e1dc] rounded-2xl focus:outline-none text-sm bg-[#f8f6f4] text-[#2f1a14]" data-option="1" data-char-counter="option-1-count">
        <span class="text-xs text-[#9f918a] whitespace-nowrap"><span id="option-1-count">0</span>/20</span>
      </div>
      <div class="flex items-center space-x-1">
        <input type="text" placeholder="Opción 2" maxlength="20" class="flex-1 p-3 border border-[#e8e1dc] rounded-2xl focus:outline-none text-sm bg-[#f8f6f4] text-[#2f1a14]" data-option="2" data-char-counter="option-2-count">
        <span class="text-xs text-[#9f918a] whitespace-nowrap"><span id="option-2-count">0</span>/20</span>
      </div>
    `;

    var inputs = container.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('input', updateCharacterCount);
    });

    updateAddPollButtonState();
  }

  var noteDisclosures = {
    paidPartnership: false,
    aiGenerated: false
  };

  function openDisclosureSheet() {
    var sheet = document.getElementById('disclosure-sheet');
    var overlay = document.getElementById('disclosure-sheet-overlay');
    if (sheet) sheet.classList.remove('translate-y-full');
    if (overlay) overlay.classList.remove('hidden');
  }

  function closeDisclosureSheet() {
    var sheet = document.getElementById('disclosure-sheet');
    var overlay = document.getElementById('disclosure-sheet-overlay');
    if (sheet) sheet.classList.add('translate-y-full');
    if (overlay) overlay.classList.add('hidden');
  }

  function handleDisclosureChange() {
    var paid = document.getElementById('disclosure-paid-partnership');
    var ai = document.getElementById('disclosure-ai-generated');

    noteDisclosures.paidPartnership = paid ? paid.checked : false;
    noteDisclosures.aiGenerated = ai ? ai.checked : false;

    updateDisclosurePreview();
  }

  function updateDisclosurePreview() {
    var preview = document.getElementById('disclosure-preview-fullscreen');
    var tagsContainer = document.getElementById('disclosure-preview-tags');
    var badge = document.getElementById('disclosure-badge');

    if (!preview || !tagsContainer || !badge) return;

    tagsContainer.innerHTML = '';
    var count = 0;

    if (noteDisclosures.paidPartnership) {
      count++;
      tagsContainer.innerHTML += `
        <span class="px-3 py-1 bg-[#f1ece9] text-[#5f4b44] text-xs font-bold rounded-full border border-[#e0d5cf]">
          Paid Partnership
        </span>
      `;
    }

    if (noteDisclosures.aiGenerated) {
      count++;
      tagsContainer.innerHTML += `
        <span class="px-3 py-1 bg-[#f1ece9] text-[#5f4b44] text-xs font-bold rounded-full border border-[#e0d5cf]">
          Hecho con IA
        </span>
      `;
    }

    if (count > 0) {
      preview.classList.remove('hidden');
      badge.textContent = count;
      badge.classList.remove('hidden');
    } else {
      preview.classList.add('hidden');
      badge.classList.add('hidden');
    }
  }

  function clearDisclosures() {
    noteDisclosures.paidPartnership = false;
    noteDisclosures.aiGenerated = false;

    var paid = document.getElementById('disclosure-paid-partnership');
    var ai = document.getElementById('disclosure-ai-generated');
    if (paid) paid.checked = false;
    if (ai) ai.checked = false;

    updateDisclosurePreview();
  }

  var LOCATION_STORAGE_KEY = 'drex_location_state_v1';
  var noteLocationState = {
    name: '',
    lat: null,
    lng: null,
    permission: 'prompt',
    currentLat: null,
    currentLng: null
  };

  var predefinedLocations = [
    'Centro Histórico', 'Parque Central', 'Plaza Mayor', 'Malecón', 'Zona Universitaria',
    'Café Aurora', 'Mercado Local', 'Mirador del Valle', 'Estación Norte', 'Boulevard Principal'
  ];

  var locationSearchDebounce = null;
  var activeLocationDetail = null;
  var locationDetailMap = null;
  var locationDetailTileLayer = null;
  var locationDetailPostMarker = null;
  var locationDetailUserMarker = null;
  var locationDetailWatchId = null;
  var locationDetailPostsTab = 'featured';
  var satelliteDetailMap = null;
  var satelliteTileLayer = null;
  var satelliteTargetMarker = null;
  var satelliteUserMarker = null;
  var satelliteLiveMarker = null;
  var satelliteUpdateTimer = null;
  var satelliteLiveFeedTimer = null;

  function formatLocationCoordinate(value) {
    return Number.isFinite(Number(value)) ? Number(value).toFixed(5) : 'No disponible';
  }

  function normalizeLocationLabel(value) {
    return `${value || ''}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function locationsLookRelated(a, b) {
    var first = normalizeLocationLabel(a);
    var second = normalizeLocationLabel(b);
    if (!first || !second) return false;
    return first === second || first.includes(second) || second.includes(first);
  }

  function setLocationDetailStatus(message) {
    var status = document.getElementById('location-detail-status');
    if (status) status.textContent = message || 'Mapa listo';
  }

  function closeLocationMoreMenu() {
    document.getElementById('location-more-sheet')?.classList.add('hidden');
    document.getElementById('location-more-sheet-overlay')?.classList.add('hidden');
  }

  function openLocationMoreMenu() {
    document.getElementById('location-more-sheet')?.classList.remove('hidden');
    document.getElementById('location-more-sheet-overlay')?.classList.remove('hidden');
  }

  function toggleLocationMoreMenu() {
    var sheet = document.getElementById('location-more-sheet');
    if (!sheet) return;
    if (sheet.classList.contains('hidden')) {
      openLocationMoreMenu();
      return;
    }
    closeLocationMoreMenu();
  }

  function destroyLocationRealtimeWatch() {
    if (locationDetailWatchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(locationDetailWatchId);
    }
    locationDetailWatchId = null;
  }

  function createLocationMarkerIcon(className, size = 24) {
    if (!window.L) return null;
    return L.divIcon({
      className: 'bg-transparent border-0',
      html: `<div class="${className}"></div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });
  }

  function syncLocationDetailViewport(force = false) {
    if (!window.L || !locationDetailMap) return;
    var points = [];
    if (locationDetailPostMarker) points.push(locationDetailPostMarker.getLatLng());
    if (locationDetailUserMarker) points.push(locationDetailUserMarker.getLatLng());
    if (!points.length) return;

    if (points.length === 1) {
      var target = points[0];
      if (force) {
        locationDetailMap.flyTo(target, 14, { duration: 0.55 });
      } else if (!locationDetailMap.getBounds().pad(-0.35).contains(target)) {
        locationDetailMap.panTo(target, { animate: true, duration: 0.4 });
      }
      return;
    }

    var bounds = L.latLngBounds(points);
    locationDetailMap.fitBounds(bounds, {
      padding: [70, 70],
      maxZoom: 13,
      animate: true
    });
  }

  function updateLocationDetailUserMarker(lat, lng) {
    if (!window.L || !locationDetailMap || !Number.isFinite(lat) || !Number.isFinite(lng)) return;
    var coords = [lat, lng];
    if (!locationDetailUserMarker) {
      locationDetailUserMarker = L.marker(coords, {
        icon: createLocationMarkerIcon('location-user-icon', 24)
      }).addTo(locationDetailMap);
    } else {
      locationDetailUserMarker.setLatLng(coords);
    }
    document.getElementById('location-detail-map-empty')?.classList.add('hidden');
    syncLocationDetailViewport();
  }

  function centerLocationMapOnUser() {
    if (locationDetailUserMarker && locationDetailMap) {
      locationDetailMap.flyTo(locationDetailUserMarker.getLatLng(), Math.max(locationDetailMap.getZoom(), 14), { duration: 0.55 });
      return;
    }
    startLocationRealtimeWatch(true);
  }

  function startLocationRealtimeWatch(forceRequest = false) {
    destroyLocationRealtimeWatch();
    if (!navigator.geolocation) {
      setLocationDetailStatus('Tu dispositivo no permite ubicación en tiempo real');
      return;
    }

    var options = {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 15000
    };

    var onSuccess = (position) => {
      var lat = Number(position.coords.latitude);
      var lng = Number(position.coords.longitude);
      noteLocationState.currentLat = lat;
      noteLocationState.currentLng = lng;
      saveLocationStateToStorage();
      updateLocationDetailUserMarker(lat, lng);
      updateSatelliteUserPosition(lat, lng);
      setLocationDetailStatus('Ubicación en tiempo real conectada');
    };

    var onError = () => {
      setLocationDetailStatus('Mostrando solo la ubicación del lugar');
    };

    if (forceRequest) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    }

    locationDetailWatchId = navigator.geolocation.watchPosition(onSuccess, onError, options);
  }

  function ensureLocationDetailMap(lat, lng, name) {
    var mapContainer = document.getElementById('location-detail-map');
    var emptyState = document.getElementById('location-detail-map-empty');
    if (!mapContainer) return;

    if (!window.L) {
      if (emptyState) {
        emptyState.textContent = 'No pudimos cargar el mapa en este momento.';
        emptyState.classList.remove('hidden');
      }
      return;
    }

    if (!locationDetailMap) {
      locationDetailMap = L.map(mapContainer, {
        zoomControl: false,
        attributionControl: false,
        preferCanvas: true
      });
    }

    if (!locationDetailTileLayer) {
      locationDetailTileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(locationDetailMap);
    }

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      var center = [lat, lng];
      if (!locationDetailPostMarker) {
        locationDetailPostMarker = L.marker(center, {
          icon: createLocationMarkerIcon('location-pin-icon', 30)
        }).addTo(locationDetailMap);
      } else {
        locationDetailPostMarker.setLatLng(center);
      }
      locationDetailPostMarker.bindPopup(name || 'Ubicación');
      if (emptyState) emptyState.classList.add('hidden');
    } else {
      if (locationDetailPostMarker) {
        locationDetailMap.removeLayer(locationDetailPostMarker);
        locationDetailPostMarker = null;
      }
      if (emptyState) {
        emptyState.textContent = 'Esta ubicación no tiene coordenadas exactas todavía.';
        emptyState.classList.remove('hidden');
      }
    }

    setTimeout(() => {
      locationDetailMap.invalidateSize();
      syncLocationDetailViewport(true);
    }, 80);
  }

  function formatRealtimeTimestamp() {
    return new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  function updateSatelliteTelemetry() {
    var updated = document.getElementById('satellite-updated-at');
    if (updated) {
      updated.textContent = `Última sincronización: ${formatRealtimeTimestamp()} (tiempo real)`;
    }
  }

  function updateSatelliteUserPosition(lat, lng) {
    var safeLat = Number.isFinite(lat) ? Number(lat) : null;
    var safeLng = Number.isFinite(lng) ? Number(lng) : null;
    document.getElementById('satellite-user-lat').textContent = formatLocationCoordinate(safeLat);
    document.getElementById('satellite-user-lng').textContent = formatLocationCoordinate(safeLng);

    if (!window.L || !satelliteDetailMap || !Number.isFinite(safeLat) || !Number.isFinite(safeLng)) return;
    var coords = [safeLat, safeLng];
    if (!satelliteUserMarker) {
      satelliteUserMarker = L.marker(coords, {
        icon: createLocationMarkerIcon('location-user-icon', 24)
      }).addTo(satelliteDetailMap);
    } else {
      satelliteUserMarker.setLatLng(coords);
    }
  }

  function updateSatelliteLiveCoordinates(lat, lng, label = 'Señal orbital activa') {
    var safeLat = Number.isFinite(Number(lat)) ? Number(lat) : null;
    var safeLng = Number.isFinite(Number(lng)) ? Number(lng) : null;
    document.getElementById('satellite-live-lat').textContent = formatLocationCoordinate(safeLat);
    document.getElementById('satellite-live-lng').textContent = formatLocationCoordinate(safeLng);
    var status = document.getElementById('satellite-iss-status');
    if (status) status.textContent = label;

    if (!window.L || !satelliteDetailMap || !Number.isFinite(safeLat) || !Number.isFinite(safeLng)) return;
    var coords = [safeLat, safeLng];
    if (!satelliteLiveMarker) {
      satelliteLiveMarker = L.marker(coords, {
        icon: createLocationMarkerIcon('location-pin-icon', 26)
      }).addTo(satelliteDetailMap).bindPopup('Telemetría satelital');
    } else {
      satelliteLiveMarker.setLatLng(coords);
    }
  }

  async function fetchSatelliteLivePosition() {
    var status = document.getElementById('satellite-iss-status');
    try {
      var res = await fetch('https://api.wheretheiss.at/v1/satellites/25544', { cache: 'no-store' });
      if (!res.ok) throw new Error('respuesta no válida');
      var data = await res.json();
      updateSatelliteLiveCoordinates(data.latitude, data.longitude, 'Conectado al feed orbital global');
    } catch (_) {
      var fallbackLat = Number(noteLocationState.currentLat ?? activeLocationDetail?.lat ?? 0);
      var fallbackLng = Number(noteLocationState.currentLng ?? activeLocationDetail?.lng ?? 0);
      updateSatelliteLiveCoordinates(fallbackLat, fallbackLng, 'Modo respaldo: señal local en tiempo real');
      if (status) status.textContent = 'Modo respaldo: señal local en tiempo real';
    }
  }

  function ensureSatelliteDetailMap() {
    var container = document.getElementById('satellite-map');
    if (!container || !window.L || !activeLocationDetail) return;

    if (!satelliteDetailMap) {
      satelliteDetailMap = L.map(container, {
        zoomControl: false,
        attributionControl: false,
        preferCanvas: true
      });
    }

    if (!satelliteTileLayer) {
      satelliteTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18
      }).addTo(satelliteDetailMap);
    }

    var hasTarget = Number.isFinite(activeLocationDetail.lat) && Number.isFinite(activeLocationDetail.lng);
    if (hasTarget) {
      var target = [activeLocationDetail.lat, activeLocationDetail.lng];
      if (!satelliteTargetMarker) {
        satelliteTargetMarker = L.marker(target, {
          icon: createLocationMarkerIcon('location-pin-icon', 30)
        }).addTo(satelliteDetailMap);
      } else {
        satelliteTargetMarker.setLatLng(target);
      }
    }

    var userKnown = Number.isFinite(noteLocationState.currentLat) && Number.isFinite(noteLocationState.currentLng);
    if (userKnown) {
      updateSatelliteUserPosition(noteLocationState.currentLat, noteLocationState.currentLng);
    }

    setTimeout(() => {
      satelliteDetailMap.invalidateSize();
      if (satelliteTargetMarker && satelliteUserMarker) {
        satelliteDetailMap.fitBounds(L.latLngBounds([satelliteTargetMarker.getLatLng(), satelliteUserMarker.getLatLng()]), {
          padding: [45, 45],
          maxZoom: 15
        });
      } else if (satelliteTargetMarker) {
        satelliteDetailMap.setView(satelliteTargetMarker.getLatLng(), 15);
      } else if (satelliteUserMarker) {
        satelliteDetailMap.setView(satelliteUserMarker.getLatLng(), 14);
      } else {
        satelliteDetailMap.setView([20, -70], 4);
      }
    }, 80);
  }

  function openSatelliteDetailView() {
    if (!activeLocationDetail) return;
    closeLocationMoreMenu();
    document.getElementById('satellite-detail-view')?.classList.remove('hidden');
    document.getElementById('satellite-location-name').textContent = activeLocationDetail.name || 'Ubicación';
    document.getElementById('satellite-target-lat').textContent = formatLocationCoordinate(activeLocationDetail.lat);
    document.getElementById('satellite-target-lng').textContent = formatLocationCoordinate(activeLocationDetail.lng);
    updateSatelliteTelemetry();
    if (satelliteUpdateTimer) clearInterval(satelliteUpdateTimer);
    satelliteUpdateTimer = setInterval(updateSatelliteTelemetry, 1000);
    ensureSatelliteDetailMap();
    fetchSatelliteLivePosition();
    if (satelliteLiveFeedTimer) clearInterval(satelliteLiveFeedTimer);
    satelliteLiveFeedTimer = setInterval(fetchSatelliteLivePosition, 5000);
    startLocationRealtimeWatch(true);
  }

  function closeSatelliteDetailView() {
    document.getElementById('satellite-detail-view')?.classList.add('hidden');
    if (satelliteUpdateTimer) {
      clearInterval(satelliteUpdateTimer);
      satelliteUpdateTimer = null;
    }
    if (satelliteLiveFeedTimer) {
      clearInterval(satelliteLiveFeedTimer);
      satelliteLiveFeedTimer = null;
    }
  }

  function buildLocationPostCard(note) {
    var images = Array.isArray(note.images) ? note.images : [];
    var previewImage = images[0] || note.authorImage || '';
    var safeAuthor = escapeHtml(note.authorName || 'Usuario');
    var safeContent = escapeHtml((note.content || '').trim().slice(0, 70) || 'Ver publicación');
    var safeLocation = escapeHtml(note.location?.name || '');
    var score = Math.max(0, Number(note.upvotes || 0) - Number(note.downvotes || 0));

    if (previewImage) {
      return `
        <button onclick="openLocationRelatedPost('${note.id}')" class="location-post-card w-full text-left">
          <img src="${previewImage}" alt="${safeLocation || 'Publicación'}" class="w-full h-full object-cover">
          <div class="absolute inset-x-0 bottom-0 p-2.5 text-white">
            <p class="text-[11px] font-semibold truncate">${safeAuthor}</p>
            <p class="text-[10px] text-white/80 truncate">${safeContent}</p>
          </div>
        </button>
      `;
    }

    return `
      <button onclick="openLocationRelatedPost('${note.id}')" class="location-post-card w-full text-left p-3 flex flex-col justify-end">
        <div class="absolute inset-0 bg-gradient-to-br from-[#31261f] via-[#4d332a] to-[#2a2022]"></div>
        <p class="text-[11px] font-semibold truncate">${safeAuthor}</p>
        <p class="text-[10px] text-white/80 mt-1 line-clamp-3">${safeContent}</p>
        <p class="text-[10px] text-[#ffd7c7] mt-2">${score} puntos</p>
      </button>
    `;
  }

  function renderLocationRelatedPosts() {
    var grid = document.getElementById('location-related-posts-grid');
    var empty = document.getElementById('location-related-posts-empty');
    var loading = document.getElementById('location-posts-loading');
    var meta = document.getElementById('location-detail-meta');
    if (!grid || !empty || !loading) return;

    var posts = Array.isArray(activeLocationDetail?.posts) ? [...activeLocationDetail.posts] : [];
    if (meta) {
      var total = posts.length;
      meta.textContent = `${total} publicaci${total === 1 ? 'ón' : 'ones'}`;
    }

    posts.sort((a, b) => {
      if (locationDetailPostsTab === 'recent') {
        return Number(b.timestamp || 0) - Number(a.timestamp || 0);
      }
      var scoreA = Number(a.upvotes || 0) - Number(a.downvotes || 0);
      var scoreB = Number(b.upvotes || 0) - Number(b.downvotes || 0);
      if (scoreB !== scoreA) return scoreB - scoreA;
      return Number(b.timestamp || 0) - Number(a.timestamp || 0);
    });

    loading.classList.add('hidden');

    if (!posts.length) {
      grid.classList.add('hidden');
      empty.classList.remove('hidden');
      return;
    }

    empty.classList.add('hidden');
    grid.classList.remove('hidden');
    grid.innerHTML = posts.slice(0, 24).map(buildLocationPostCard).join('');
  }

  function setLocationPostsTab(tab) {
    locationDetailPostsTab = tab === 'recent' ? 'recent' : 'featured';
    document.getElementById('location-tab-featured')?.classList.toggle('active', locationDetailPostsTab === 'featured');
    document.getElementById('location-tab-recent')?.classList.toggle('active', locationDetailPostsTab === 'recent');
    renderLocationRelatedPosts();
  }

  function loadLocationRelatedPosts() {
    var loading = document.getElementById('location-posts-loading');
    var grid = document.getElementById('location-related-posts-grid');
    var empty = document.getElementById('location-related-posts-empty');
    if (loading) loading.classList.remove('hidden');
    if (grid) {
      grid.classList.add('hidden');
      grid.innerHTML = '';
    }
    if (empty) empty.classList.add('hidden');

    if (!activeLocationDetail?.name) return;

    firebase.database().ref('communityNotes').limitToLast(300).once('value').then(snapshot => {
      var matches = [];
      snapshot.forEach(child => {
        var note = { ...(child.val() || {}), id: child.key };
        if (!note.location?.name) return;
        if (!locationsLookRelated(note.location.name, activeLocationDetail.name)) return;
        matches.push(note);
      });
      activeLocationDetail.posts = matches;
      renderLocationRelatedPosts();
    }).catch(error => {
      console.error('No se pudieron cargar los posts de la ubicación:', error);
      if (loading) loading.classList.add('hidden');
      if (empty) {
        empty.classList.remove('hidden');
        empty.innerHTML = '<p class="text-base font-semibold">No pudimos cargar las publicaciones.</p><p class="text-sm mt-1">Inténtalo de nuevo en un momento.</p>';
      }
    });
  }

  function openLocationRelatedPost(noteId) {
    closeLocationDetailView();
    setTimeout(() => openCommentsView(noteId), 180);
  }

  function openLocationDetailView(name, latRaw, lngRaw, noteId = '') {
    var lat = Number(latRaw);
    var lng = Number(lngRaw);
    var safeName = name || 'Ubicación';
    activeLocationDetail = {
      name: safeName,
      lat: Number.isFinite(lat) ? lat : null,
      lng: Number.isFinite(lng) ? lng : null,
      noteId: noteId || '',
      posts: []
    };

    document.getElementById('location-detail-name').textContent = safeName;
    document.getElementById('location-detail-meta').textContent = 'Cargando publicaciones…';
    document.getElementById('location-feedback-response')?.classList.add('hidden');
    document.getElementById('location-detail-view').classList.remove('hidden');
    closeLocationMoreMenu();
    setLocationPostsTab('featured');
    ensureLocationDetailMap(activeLocationDetail.lat, activeLocationDetail.lng, safeName);
    startLocationRealtimeWatch(true);
    loadLocationRelatedPosts();

    if (!Number.isFinite(activeLocationDetail.lat) || !Number.isFinite(activeLocationDetail.lng)) {
      setLocationDetailStatus('Buscando tu ubicación en tiempo real');
    } else {
      setLocationDetailStatus('Conectando ubicación en tiempo real');
    }
  }

  function openLocationDetailFromChip(button) {
    if (!button) return;
    openLocationDetailView(
      button.dataset.locationName || 'Ubicación',
      button.dataset.locationLat ?? null,
      button.dataset.locationLng ?? null,
      button.dataset.noteId || ''
    );
  }

  function closeLocationDetailView() {
    document.getElementById('location-detail-view').classList.add('hidden');
    closeSatelliteDetailView();
    closeLocationMoreMenu();
    destroyLocationRealtimeWatch();
  }

  function submitLocationFeedback() {
    if (!activeLocationDetail) return;

    var reportAction = document.getElementById('location-report-action');
    var response = document.getElementById('location-feedback-response');
    var user = firebase.auth().currentUser;
    var reportPayload = {
      locationName: activeLocationDetail.name,
      lat: activeLocationDetail.lat,
      lng: activeLocationDetail.lng,
      noteId: activeLocationDetail.noteId || '',
      reporterId: user?.uid || null,
      reporterName: user?.displayName || user?.email || 'Invitado',
      createdAt: Date.now()
    };

    if (reportAction) {
      reportAction.disabled = true;
      reportAction.textContent = 'Enviando...';
    }

    firebase.database().ref('locationFeedback').push(reportPayload).catch((error) => {
      console.error('No se pudo guardar el feedback de ubicación:', error);
    }).finally(() => {
      closeLocationMoreMenu();
      if (response) response.classList.remove('hidden');
      if (reportAction) {
        reportAction.disabled = false;
        reportAction.textContent = 'Reportar ubicación';
      }
      setLocationDetailStatus('Feedback recibido');
    });
  }

  function saveLocationStateToStorage() {
    var payload = {
      name: noteLocationState.name || '',
      lat: noteLocationState.lat,
      lng: noteLocationState.lng,
      permission: noteLocationState.permission || 'prompt',
      currentLat: noteLocationState.currentLat,
      currentLng: noteLocationState.currentLng,
      updatedAt: Date.now()
    };
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(payload));
  }

  function loadLocationStateFromStorage() {
    try {
      var raw = localStorage.getItem(LOCATION_STORAGE_KEY);
      if (!raw) return;
      var saved = JSON.parse(raw);
      noteLocationState.name = saved.name || '';
      noteLocationState.lat = typeof saved.lat === 'number' ? saved.lat : null;
      noteLocationState.lng = typeof saved.lng === 'number' ? saved.lng : null;
      noteLocationState.permission = saved.permission || 'prompt';
      noteLocationState.currentLat = typeof saved.currentLat === 'number' ? saved.currentLat : null;
      noteLocationState.currentLng = typeof saved.currentLng === 'number' ? saved.currentLng : null;
      updateLocationPreview();
    } catch (_) {}
  }



  function openLocationSheet() {
    var sheet = document.getElementById('location-sheet');
    var overlay = document.getElementById('location-sheet-overlay');
    if (overlay) overlay.classList.remove('hidden');
    if (sheet) sheet.classList.remove('hidden');
    prepareLocationSheet();
  }

  function closeLocationSheet() {
    var sheet = document.getElementById('location-sheet');
    var overlay = document.getElementById('location-sheet-overlay');
    if (overlay) overlay.classList.add('hidden');
    if (sheet) sheet.classList.add('hidden');
  }

  function updateLocationPreview() {
    var preview = document.getElementById('location-preview-fullscreen');
    var text = document.getElementById('location-preview-text');
    var badge = document.getElementById('location-badge');
    if (!preview || !text || !badge) return;

    if (!noteLocationState.name) {
      preview.classList.add('hidden');
      text.textContent = '';
      badge.classList.add('hidden');
      return;
    }

    text.textContent = noteLocationState.name;
    preview.classList.remove('hidden');
    badge.classList.remove('hidden');
  }

  function clearLocationSelection() {
    noteLocationState.name = '';
    noteLocationState.lat = null;
    noteLocationState.lng = null;
    saveLocationStateToStorage();
    updateLocationPreview();
  }

  async function fetchPhotonSuggestions(query) {
    var q = (query || '').trim();
    var hasCoords = typeof noteLocationState.currentLat === 'number' && typeof noteLocationState.currentLng === 'number';
    var params = new URLSearchParams({ q: q || 'near', limit: '8' });
    if (hasCoords) {
      params.set('lat', String(noteLocationState.currentLat));
      params.set('lon', String(noteLocationState.currentLng));
    }

    var url = `https://photon.komoot.io/api/?${params.toString()}`;
    var res = await fetch(url);
    if (!res.ok) throw new Error('Photon error');
    var data = await res.json();
    var features = Array.isArray(data.features) ? data.features : [];

    return features.map((f) => {
      var props = f.properties || {};
      var coords = Array.isArray(f.geometry?.coordinates) ? f.geometry.coordinates : [];
      var lng = typeof coords[0] === 'number' ? coords[0] : null;
      var lat = typeof coords[1] === 'number' ? coords[1] : null;
      var labelParts = [props.name, props.city, props.state, props.country].filter(Boolean);
      var name = labelParts.join(', ') || props.name || 'Ubicación';
      return { name, lat, lng };
    }).filter(item => item.name);
  }

  function renderLocationResultsList(items) {
    var container = document.getElementById('location-results');
    if (!container) return;

    if (!items.length) {
      container.innerHTML = '<p class="text-sm text-[#9f918a] py-2">No encontramos ubicaciones con ese nombre.</p>';
      return;
    }

    container.innerHTML = items.slice(0, 10).map(item => {
      var safeName = (item.name || 'Ubicación').replace(/"/g, '&quot;');
      var safeLat = typeof item.lat === 'number' ? item.lat : '';
      var safeLng = typeof item.lng === 'number' ? item.lng : '';
      return `
        <button data-location-name="${safeName}" data-location-lat="${safeLat}" data-location-lng="${safeLng}" onclick="selectLocation(this.dataset.locationName, this.dataset.locationLat, this.dataset.locationLng)" class="w-full text-left py-2 px-1 rounded-xl hover:bg-white/70 transition">
          <div class="flex items-center gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#8c6f66] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span class="text-sm font-semibold text-[#5f4b44] truncate">${item.name}</span>
          </div>
        </button>
      `;
    }).join('');
  }

  async function loadLocationSuggestions(query = '') {
    var q = query.trim();
    var fallbackItems = predefinedLocations
      .filter(name => !q || name.toLowerCase().includes(q.toLowerCase()))
      .map(name => ({ name, lat: noteLocationState.currentLat, lng: noteLocationState.currentLng }));

    var loading = document.getElementById('location-search-loading');
    var results = document.getElementById('location-results');
    if (loading) loading.classList.remove('hidden');
    if (results) results.classList.add('hidden');

    try {
      var apiItems = await fetchPhotonSuggestions(q);
      var merged = [...apiItems, ...fallbackItems].filter((item, idx, arr) => idx === arr.findIndex(x => x.name === item.name));
      renderLocationResultsList(merged);
    } catch (_) {
      renderLocationResultsList(fallbackItems);
    } finally {
      setTimeout(() => {
        if (loading) loading.classList.add('hidden');
        if (results) results.classList.remove('hidden');
      }, 3000);
    }
  }

  function triggerLocationSearch() {
    var query = document.getElementById('location-search-input')?.value || '';
    if (locationSearchDebounce) {
      clearTimeout(locationSearchDebounce);
      locationSearchDebounce = null;
    }
    loadLocationSuggestions(query);
  }

  function handleLocationSearchKeydown(event) {
    if (!event) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      triggerLocationSearch();
    }
  }

  function prepareLocationSheet() {
    var card = document.getElementById('location-permission-card');
    var searchSection = document.getElementById('location-search-section');
    var input = document.getElementById('location-search-input');
    if (input) input.value = '';
    var loading = document.getElementById('location-search-loading');
    var results = document.getElementById('location-results');
    if (loading) loading.classList.add('hidden');
    if (results) results.classList.remove('hidden');

    var showSearch = noteLocationState.permission === 'granted';
    if (card) card.classList.toggle('hidden', showSearch);
    if (searchSection) searchSection.classList.toggle('hidden', !showSearch);

    if (showSearch) {
      loadLocationSuggestions('');
      return;
    }

    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((status) => {
        noteLocationState.permission = status.state;
        saveLocationStateToStorage();
        var granted = status.state === 'granted';
        if (card) card.classList.toggle('hidden', granted);
        if (searchSection) searchSection.classList.toggle('hidden', !granted);
        if (granted) {
          requestLocationPermissionAndContinue(true);
        }
      }).catch(() => {});
    }
  }

  function requestLocationPermissionAndContinue(silent = false) {
    if (!navigator.geolocation) {
      if (!silent) alert('Este dispositivo no permite obtener ubicación.');
      return;
    }

    navigator.geolocation.getCurrentPosition((pos) => {
      noteLocationState.permission = 'granted';
      noteLocationState.currentLat = pos.coords.latitude;
      noteLocationState.currentLng = pos.coords.longitude;
      saveLocationStateToStorage();

      var card = document.getElementById('location-permission-card');
      var searchSection = document.getElementById('location-search-section');
      if (card) card.classList.add('hidden');
      if (searchSection) searchSection.classList.remove('hidden');

      loadLocationSuggestions('');
    }, () => {
      noteLocationState.permission = 'denied';
      saveLocationStateToStorage();
      if (!silent) alert('No pudimos acceder a tu ubicación. Puedes intentarlo de nuevo.');
    }, { enableHighAccuracy: true, timeout: 10000 });
  }

  function selectLocation(name, latRaw, lngRaw) {
    noteLocationState.name = name || '';
    var lat = Number(latRaw);
    var lng = Number(lngRaw);
    noteLocationState.lat = Number.isFinite(lat) ? lat : noteLocationState.currentLat;
    noteLocationState.lng = Number.isFinite(lng) ? lng : noteLocationState.currentLng;
    saveLocationStateToStorage();
    updateLocationPreview();
    closeLocationSheet();
  }

  loadLocationStateFromStorage();

  var pollOptionCount = 2;
  var MAX_POLL_OPTIONS = 3;

  function addPollOption() {
    var container = document.getElementById('poll-options-container');
    var currentOptions = container.querySelectorAll('div').length;

    if (currentOptions >= MAX_POLL_OPTIONS) {
      alert('El máximo de opciones es 3');
      return;
    }

    pollOptionCount++;
    var newOption = document.createElement('div');
    newOption.className = 'flex items-center space-x-1';
    var counterId = `option-${pollOptionCount}-count`;
    newOption.innerHTML = `
      <input type="text" placeholder="Opción ${pollOptionCount}" maxlength="20" class="flex-1 p-3 border border-[#e8e1dc] rounded-2xl focus:outline-none text-sm bg-[#f8f6f4] text-[#2f1a14]" data-option="${pollOptionCount}" data-char-counter="${counterId}">
      <span class="text-xs text-[#9f918a] whitespace-nowrap"><span id="${counterId}">0</span>/20</span>
      <button onclick="this.parentElement.remove(); updateAddPollButtonState()" class="text-[#8d7d75] hover:text-[#5f4b44] transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    `;
    container.appendChild(newOption);

    var newInput = newOption.querySelector('input');
    newInput.addEventListener('input', updateCharacterCount);

    updateAddPollButtonState();
  }

  function updateAddPollButtonState() {
    var container = document.getElementById('poll-options-container');
    var currentOptions = container.querySelectorAll('div').length;
    var addBtn = document.getElementById('add-poll-option-btn');

    if (currentOptions >= MAX_POLL_OPTIONS) {
      addBtn.disabled = true;
      addBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
      addBtn.disabled = false;
      addBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  }

  function updateCharacterCount(event) {
    var input = event.target;
    var counterId = input.getAttribute('data-char-counter');
    var questionCountId = input.id === 'poll-question-fullscreen' ? 'poll-question-count' : null;

    if (questionCountId) {
      document.getElementById(questionCountId).textContent = input.value.length;
    } else if (counterId) {
      document.getElementById(counterId).textContent = input.value.length;
    }
  }

  function closeNoteCreationFullscreen() {
    document.getElementById('note-creation-fullscreen').classList.add('hidden');
    setBottomNavVisibility(true);
    clearStickerSelection('note-content-fullscreen');
    closeDisclosureSheet();
    closeLocationSheet();
    clearDisclosures();
  }

  function processImageFile(file) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      var timeoutId = setTimeout(() => reject(new Error('Tiempo de espera agotado al procesar imagen')), 15000);

      reader.onload = function(e) {
        var img = new Image();
        img.onload = function() {
          try {
            var maxSide = 1600;
            var scale = Math.min(1, maxSide / Math.max(img.width, img.height));
            var canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(img.width * scale));
            canvas.height = Math.max(1, Math.round(img.height * scale));
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            var compressed = canvas.toDataURL('image/jpeg', 0.82);
            clearTimeout(timeoutId);
            resolve(compressed);
          } catch (error) {
            clearTimeout(timeoutId);
            reject(error);
          }
        };

        img.onerror = function() {
          clearTimeout(timeoutId);
          reject(new Error('No se pudo cargar la imagen seleccionada'));
        };

        img.src = e.target.result;
      };

      reader.onerror = function() {
        clearTimeout(timeoutId);
        reject(new Error('No se pudo leer una de las imágenes'));
      };

      reader.readAsDataURL(file);
    });
  }

  function handleNoteImagePreviewFullscreen(event) {
    var selectedFiles = Array.from(event.target.files || []);
    var files = selectedFiles.slice(0, 3);
    if (!files.length) return;
    if (selectedFiles.length > 3) {
      alert('Solo puedes subir un máximo de 3 fotos por publicación.');
    }

    var previewGrid = document.getElementById('preview-grid-fullscreen');
    var counter = document.getElementById('image-preview-counter-fullscreen');
    previewGrid.innerHTML = '';

    files.forEach(file => {
      var reader = new FileReader();
      reader.onload = function(e) {
        var previewImage = document.createElement('img');
        previewImage.src = e.target.result;
        previewImage.className = 'w-full aspect-square object-cover bg-black/5 rounded-lg border border-gray-300';
        previewGrid.appendChild(previewImage);
      };
      reader.readAsDataURL(file);
    });

    counter.textContent = `${files.length} foto${files.length === 1 ? '' : 's'} seleccionada${files.length === 1 ? '' : 's'} (máximo 3)`;
    document.getElementById('image-preview-fullscreen').classList.remove('hidden');
  }

  function removeImageFullscreen() {
    document.getElementById('note-image-fullscreen').value = '';
    document.getElementById('preview-grid-fullscreen').innerHTML = '';
    document.getElementById('image-preview-counter-fullscreen').textContent = '';
    document.getElementById('image-preview-fullscreen').classList.add('hidden');
  }

  function publishNoteFromFullscreen() {
    var content = resolveCommentContent('note-content-fullscreen');
    var imageFiles = Array.from(document.getElementById('note-image-fullscreen').files || []).slice(0, 3);
    var pollQuestion = document.getElementById('poll-question-main').value.trim();

    // Obtener opciones de encuesta
    var pollOptions = null;
    if (!document.getElementById('poll-preview-fullscreen').classList.contains('hidden') && pollQuestion) {
      var optionInputs = document.querySelectorAll('#poll-options-container input');
      pollOptions = [];
      optionInputs.forEach(input => {
        var optionText = input.value.trim();
        if (optionText) {
          pollOptions.push({
            text: optionText,
            votes: 0,
            voters: []
          });
        }
      });
      if (pollOptions.length < 2) {
        alert('La encuesta debe tener al menos 2 opciones');
        return;
      }
    }

    if (!content && !imageFiles.length && !pollQuestion && !noteLocationState.name && !selectedGif) {
      alert('Por favor escribe algo, agrega una imagen, un GIF, ubicación o crea una encuesta');
      return;
    }

    var user = firebase.auth().currentUser;
    if (!user) {
      alert('Debes iniciar sesión para publicar');
      return;
    }

    // Mostrar indicador de carga
    var publishBtn = document.getElementById('publish-btn-fullscreen');
    publishBtn.disabled = true;
    publishBtn.innerHTML = `${getFadingCircleLoaderMarkup()}`;

    firebase.database().ref('users/' + user.uid).once('value').then(userSnap => {
      var userData = userSnap.val() || {};

      var note = {
        content: content,
        authorId: user.uid,
        authorName: userData.username || user.displayName || "Usuario",
        authorImage: userData.profileImage || user.photoURL || 'https://via.placeholder.com/150',
        timestamp: Date.now(),
        likes: 0,
        comments: 0
      };

      // Agregar encuesta si existe
      if (pollQuestion && pollOptions) {
        note.poll = {
          question: pollQuestion,
          options: pollOptions
        };
      }

      // Agregar GIF si existe
      if (selectedGif) {
        note.gifUrl = selectedGif;
      }
      note.disclosures = {
        paidPartnership: !!noteDisclosures.paidPartnership,
        aiGenerated: !!noteDisclosures.aiGenerated
      };

      if (noteLocationState.name) {
        note.location = {
          name: noteLocationState.name,
          lat: noteLocationState.lat,
          lng: noteLocationState.lng
        };
      }

      if (imageFiles.length) {
        Promise.all(imageFiles.map(processImageFile)).then(images => {
          note.imageUrls = images;
          note.imageUrl = images[0];
          publishNoteToDatabase(note);
        }).catch((error) => {
          console.error('Error al procesar imágenes:', error);
          alert('Error al procesar las imágenes. Inténtalo con fotos más ligeras.');
          publishBtn.disabled = false;
          publishBtn.innerHTML = 'Publicar';
        });
      } else {
        publishNoteToDatabase(note);
      }
    }).catch(error => {
      console.error('Error al obtener datos del usuario:', error);
      alert('Error al publicar. Inténtalo de nuevo.');
      publishBtn.disabled = false;
      publishBtn.innerHTML = 'Publicar';
    });
  }

  function loadCreatorStats() {
    var user = firebase.auth().currentUser;
    if (!user) return;

    // Cargar estadísticas de notas
    firebase.database().ref('communityNotes').orderByChild('authorId').equalTo(user.uid).once('value').then(snapshot => {
      document.getElementById('creator-notes-count').textContent = snapshot.numChildren();
    });
  }

  // 社区功能

  function switchCommunityTab(tab) {
    var feedTab = document.getElementById('feed-tab');
    var photosTab = document.getElementById('photos-tab');
    var notesFeed = document.getElementById('notes-feed');
    var photosFeed = document.getElementById('photos-feed');
    var addNoteForm = document.getElementById('add-note-form');

    if (tab === 'feed') {
      if (feedTab) feedTab.classList.add('text-[#FE2C55]', 'border-b-2', 'border-[#FE2C55]');
      if (photosTab) photosTab.classList.remove('text-[#FE2C55]', 'border-b-2', 'border-[#FE2C55]');
      if (notesFeed) notesFeed.classList.remove('hidden');
      if (photosFeed) photosFeed.classList.add('hidden');
      if (addNoteForm) addNoteForm.classList.add('hidden');
      loadNotes();
    } else if (tab === 'photos') {
      if (photosTab) photosTab.classList.add('text-[#FE2C55]', 'border-b-2', 'border-[#FE2C55]');
      if (feedTab) feedTab.classList.remove('text-[#FE2C55]', 'border-b-2', 'border-[#FE2C55]');
      if (photosFeed) photosFeed.classList.remove('hidden');
      if (notesFeed) notesFeed.classList.add('hidden');
      if (addNoteForm) addNoteForm.classList.add('hidden');
      loadPhotos();
    } else if (tab === 'add') {
      // 显示添加笔记表单（从创作者中心访问）
      if (feedTab) feedTab.classList.remove('text-[#FE2C55]', 'border-b-2', 'border-[#FE2C55]');
      if (photosTab) photosTab.classList.remove('text-[#FE2C55]', 'border-b-2', 'border-[#FE2C55]');
      if (notesFeed) notesFeed.classList.add('hidden');
      if (photosFeed) photosFeed.classList.add('hidden');
      if (addNoteForm) addNoteForm.classList.remove('hidden');
    }
  }

  function handleNoteImagePreview(event) {
    var file = event.target.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('preview-img').src = e.target.result;
      document.getElementById('image-preview').classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }

  function removeImage() {
    document.getElementById('note-image').value = '';
    document.getElementById('image-preview').classList.add('hidden');
    document.getElementById('preview-img').src = '';
  }

  function publishNote() {
    var content = document.getElementById('note-content').value.trim();
    var imageInput = document.getElementById('note-image');

    if (!content && !imageInput.files.length) {
      alert('Por favor escribe algo o agrega una imagen');
      return;
    }

    var user = firebase.auth().currentUser;
    if (!user) {
      alert('Debes iniciar sesión para publicar');
      return;
    }

    // Mostrar indicador de carga
    var publishButton = document.querySelector('button[onclick="publishNote()"]');
    publishButton.disabled = true;
    publishButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publicando...';

    db1.ref('users/' + user.uid).once('value').then(snapshot => {
      var userData = snapshot.val() || {};
      var note = {
        content: content,
        authorId: user.uid,
        authorName: userData.username || 'Usuario',
        authorImage: userData.profileImage || user.photoURL || 'https://via.placeholder.com/150',
        timestamp: Date.now(),
        upvotes: 0,
        downvotes: 0,
        commentsCount: 0
      };

      var saveToDatabases = (noteData) => {
        var p1 = db1.ref('communityNotes').push(noteData);
        var p2 = db2.ref('communityNotes').push(noteData);
        
        return Promise.all([p1, p2]).then(() => {
          document.getElementById('note-content').value = '';
          if (imageInput) imageInput.value = '';
          var preview = document.getElementById('image-preview');
          if (preview) preview.classList.add('hidden');
          
          switchCommunityTab('feed');
          publishButton.disabled = false;
          publishButton.innerHTML = 'Publicar';
          
          
          alert('¡Publicación creada exitosamente en ambas bases de datos!');
        }).catch(error => {
          console.error('Error al publicar en una o ambas bases de datos:', error);
          alert('Error al publicar. Inténtalo de nuevo.');
          publishButton.disabled = false;
          publishButton.innerHTML = 'Publicar';
        });
      };

      if (imageInput && imageInput.files.length > 0) {
        var reader = new FileReader();
        reader.onload = function(e) {
          note.imageUrl = e.target.result;
          saveToDatabases(note);
        };
        reader.readAsDataURL(imageInput.files[0]);
      } else {
        saveToDatabases(note);
      }
    });
  }

  function publishNoteToDatabase(note) {
    // Verifica el contenido de la nota específicamente
    if (note.content && moderarContenidoNota(note.content)) {
      alert('Tu nota no puede ser publicada porque contiene contenido inapropiado.');
      // Restaurar botón
      var publishBtn = document.getElementById('publish-btn-fullscreen');
      if (publishBtn) {
        publishBtn.disabled = false;
        publishBtn.innerHTML = 'Publicar';
      }
      return;
    }

    // Publicar en ambas bases de datos
    var p1 = db1.ref('communityNotes').push(note);
    var p2 = db2.ref('communityNotes').push(note);

    Promise.all([p1, p2]).then(([ref1, ref2]) => {
      // Verifica una vez más después de publicar (en db1)
      if (note.content) {
        moderarContenidoAutomaticamente(ref1.key, note.content);
      }

      try {
        // Limpiar formularios fullscreen
        var contentFullscreen = document.getElementById('note-content-fullscreen');
        var imageFullscreen = document.getElementById('note-image-fullscreen');
        var previewFullscreen = document.getElementById('image-preview-fullscreen');

        if (contentFullscreen) contentFullscreen.value = '';
        clearStickerSelection('note-content-fullscreen');
        if (imageFullscreen) imageFullscreen.value = '';
        if (previewFullscreen) previewFullscreen.classList.add('hidden');
        var previewGridFullscreen = document.getElementById('preview-grid-fullscreen');
        var previewCounterFullscreen = document.getElementById('image-preview-counter-fullscreen');
        if (previewGridFullscreen) previewGridFullscreen.innerHTML = '';
        if (previewCounterFullscreen) previewCounterFullscreen.textContent = '';
        clearDisclosures();
        clearLocationSelection();

        // Limpiar formularios antiguos (por compatibilidad)
        var contentOld = document.getElementById('note-content');
        var imageOld = document.getElementById('note-image');
        var previewOld = document.getElementById('image-preview');

        if (contentOld) contentOld.value = '';
        if (imageOld) imageOld.value = '';
        if (previewOld) previewOld.classList.add('hidden');

        // Cerrar pantalla completa si está abierta
        var fullscreenModal = document.getElementById('note-creation-fullscreen');
        if (fullscreenModal && !fullscreenModal.classList.contains('hidden')) {
          closeNoteCreationFullscreen();
          // Abrir comunidad para ver la nota publicada
          var mainAppEl = document.getElementById('main-app');
          if (mainAppEl) mainAppEl.classList.remove('hidden');
          loadNotes();
        } else {
          switchCommunityTab('feed');
        }
      } catch (uiError) {
        console.error('La publicación se guardó, pero hubo un error de interfaz:', uiError);
      }

      alert('¡Publicación creada exitosamente!');
    }).catch(error => {
      console.error('Error al publicar:', error);
      alert('Error al publicar. Inténtalo de nuevo.');
      // Restaurar botón
      var publishBtn = document.getElementById('publish-btn-fullscreen');
      if (publishBtn) {
        publishBtn.disabled = false;
        publishBtn.innerHTML = 'Publicar';
      }
    });
  }


  function renderNoteImages(note, noteIdForModal) {
    var images = Array.isArray(note.imageUrls) && note.imageUrls.length ? note.imageUrls : (note.imageUrl ? [note.imageUrl] : []);
    if (!images.length) return '';

    var renderImageContainer = (img, index, total) => `
      <div class="w-full flex-shrink-0 snap-center relative">
        <img src="${img}" alt="Imagen ${index + 1}" onclick="openImageModal('${img}', '${noteIdForModal}')" class="w-full h-auto max-h-[80vh] object-contain rounded-lg cursor-pointer">
        ${total > 1 ? `<div class="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">${index + 1}/${total}</div>` : ''}
      </div>
    `;

    if (images.length === 1) {
      return `<div class="mb-3">${renderImageContainer(images[0], 0, 1)}</div>`;
    }

    var slides = images.map((img, index) => renderImageContainer(img, index, images.length)).join('');

    return `
      <div class="mb-3 overflow-x-auto flex snap-x snap-mandatory gap-2 pb-1">
        ${slides}
      </div>
    `;
  }


  function renderNoteAnchoredMeta(note) {
    var chips = [];

    if (note.location && note.location.name) {
      var safeName = escapeHtml(note.location.name);
      var safeLat = Number.isFinite(Number(note.location.lat)) ? Number(note.location.lat) : '';
      var safeLng = Number.isFinite(Number(note.location.lng)) ? Number(note.location.lng) : '';
      var safeNoteId = escapeHtml(note.id || '');
      chips.push(`
        <button
          type="button"
          class="location-chip-button"
          data-location-name="${safeName}"
          data-location-lat="${safeLat}"
          data-location-lng="${safeLng}"
          data-note-id="${safeNoteId}"
          onclick="openLocationDetailFromChip(this)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          <span>${safeName}</span>
        </button>
      `);
    }

    if (note.disclosures?.paidPartnership) {
      chips.push('<span class="inline-flex items-center rounded-full bg-[#fff1f4] text-[#d91c47] border border-[#FE2C55]/30 px-2.5 py-1 text-[11px] font-semibold">Paid Partnership</span>');
    }
    if (note.disclosures?.aiGenerated) {
      chips.push('<span class="inline-flex items-center rounded-full bg-[#fff1f4] text-[#d91c47] border border-[#FE2C55]/30 px-2.5 py-1 text-[11px] font-semibold">Hecho con IA</span>');
    }

    if (!chips.length) return '';

    return `
      <div class="flex flex-wrap items-center gap-2 mb-2">${chips.join('')}</div>
    `;
  }

  function getHiddenPosts() {
    try {
      var raw = localStorage.getItem('drex_hidden_posts');
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('No se pudieron leer publicaciones ocultas:', error);
      return [];
    }
  }

  function setHiddenPosts(hiddenPostIds) {
    localStorage.setItem('drex_hidden_posts', JSON.stringify(hiddenPostIds));
  }

  function getAdultContentPreference() {
    var raw = localStorage.getItem('drex_allow_adult_content');
    return raw === null ? true : raw === 'true';
  }

  function updateAdultContentToggleUI() {
    var toggle = document.getElementById('adult-content-toggle');
    var label = document.getElementById('adult-content-toggle-label');
    var enabled = getAdultContentPreference();
    if (toggle) toggle.checked = enabled;
    if (label) label.textContent = enabled ? 'Activado' : 'Desactivado';
  }

  function normalizeForMatch(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');
  }

  function isAdultContentNote(note) {
    if (!note) return false;
    if (note.isAdultContent || note.contentRating === '18+' || (note.disclosures && note.disclosures.adultContent)) return true;

    var joined = normalizeForMatch([note.content, note.url, note.title, note.poll && note.poll.question].filter(Boolean).join(' '));
    var adultPatterns = [
      /\b(18\+|solo adultos|adultos|nsfw|desnudo|desnuda|erotico|erotica|sexual|sexo|porn|xxx)\b/,
      /\bcontenido\s+delicado\b/
    ];

    return adultPatterns.some(pattern => pattern.test(joined));
  }

  function shouldHideNoteForCurrentUser(noteId, note) {
    var hiddenPosts = getHiddenPosts();
    if (hiddenPosts.includes(noteId)) return true;
    if (!getAdultContentPreference() && isAdultContentNote(note)) return true;
    var authorId = note?.authorId || note?.userId || '';
    if (isAccountBlockedForCurrentUser(authorId)) return true;
    return false;
  }

  function loadNotes() {
    var feedContainer = document.getElementById('notes-feed');
    if (!feedContainer) return;

    var user = firebase.auth().currentUser;
    var userVotes = {};

    // Cargar votos del usuario en segundo plano sin bloquear la renderizacion
    if (user) {
      firebase.database().ref('userVotes/' + user.uid).once('value').then(snap => {
        userVotes = snap.val() || {};
      }).catch(err => console.error('Error cargando votos:', err));
    }

    feedContainer.innerHTML = `<div class="py-3 text-center">${getFadingCircleLoaderMarkup()}</div>`;

    var notesRef = firebase.database().ref('communityNotes').orderByChild('timestamp').limitToLast(50);
    notesRef.off();
    notesRef.on('value', snapshot => {
      feedContainer.innerHTML = '';

      var notes = [];
      snapshot.forEach(child => {
        var rawNote = child.val() || {};
        if (shouldHideNoteForCurrentUser(child.key, rawNote)) return;
        notes.unshift({ ...rawNote, id: child.key });
      });

      if (!notes.length) {
        feedContainer.innerHTML = '<div class="bg-white border border-[#e8e1dc] rounded-3xl p-6 text-center text-sm text-[#8d7d75] shadow-sm">Aún no hay posts. Sé la primera persona en publicar.</div>';
        return;
      }

      var feedFragment = document.createDocumentFragment();

      notes.forEach(note => {
          try {
            var noteElement = document.createElement('div');
            noteElement.id = `post-${note.id}`;
            noteElement.className = 'bg-white border-b border-[#e8e1dc] rounded-none mb-0';

            var upvotes = Number(note.upvotes || 0);
            var downvotes = Number(note.downvotes || 0);
            var score = upvotes - downvotes;
            var commentsCount = Number(note.commentsCount || 0);
            var userVote = userVotes[note.id] || null;

            var pollHTML = '';
            var pollOptions = Array.isArray(note.poll?.options) ? note.poll.options : [];
            if (note.poll && pollOptions.length) {
              var totalVotes = pollOptions.reduce((sum, opt) => sum + Number(opt?.votes || 0), 0);
              pollHTML = `
              <div class="mt-3 p-3 bg-white rounded-lg border border-gray-300">
                <h4 class="font-medium text-gray-900 mb-3 text-sm">${note.poll.question}</h4>
                <div class="space-y-2">
                  ${pollOptions.map((option, index) => {
                    var votes = Number(option?.votes || 0);
                    var percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                    var hasVoted = user && Array.isArray(option?.voters) && option.voters.includes(user.uid);
                    return `
                      <button onclick="votePoll('${note.id}', ${index})" class="w-full text-left p-2.5 rounded border transition-all relative overflow-hidden ${hasVoted ? 'border-[#FE2C55] bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'}">
                        <div class="absolute inset-0 bg-[#FE2C55]" style="width: ${percentage}%; opacity: 0.08"></div>
                        <div class="relative flex justify-between items-center">
                          <span class="text-sm font-medium text-gray-900">${option?.text || 'Opción'}</span>
                          <span class="text-xs font-bold ${hasVoted ? 'text-[#FE2C55]' : 'text-gray-500'}">${percentage}%</span>
                        </div>
                      </button>
                    `;
                  }).join('')}
                </div>
                <p class="text-xs text-gray-500 mt-2">${totalVotes} voto${totalVotes !== 1 ? 's' : ''} • Toca para votar</p>
              </div>
            `;
            }

            var safeTimestamp = Number(note.timestamp) || Date.now();
            var safeAuthorId = note.authorId || '';
            var safeAuthorName = note.authorName || 'Usuario';
            var safeAuthorImage = note.authorImage || 'https://via.placeholder.com/150';

            // Si el autor es el usuario actual, usar su foto de perfil vinculada
            if (user && safeAuthorId === user.uid) {
              var headerProfileImage = document.getElementById('header-profile-image');
              if (headerProfileImage && headerProfileImage.src && !headerProfileImage.src.includes('placeholder')) {
                safeAuthorImage = headerProfileImage.src;
              }
            }

            // Generar HTML para URLs compartidas si existen
            var urlHTML = '';
            if (note.url) {
              urlHTML = `
                <div class="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <a href="${note.url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 font-semibold text-sm hover:underline break-all">
                    ${note.url}
                  </a>
                </div>
              `;
            }

            noteElement.innerHTML = `
              <div class="p-5 relative">
                <button onclick="openPostOptionsSheet('${note.id}')" class="absolute top-4 right-4 z-10 p-1 text-[#8d7d75] hover:text-[#5f4b44]" aria-label="Opciones de publicación">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <circle cx="6" cy="12" r="1.8" />
                    <circle cx="12" cy="12" r="1.8" />
                    <circle cx="18" cy="12" r="1.8" />
                  </svg>
                </button>
                <div class="flex items-start gap-3 mb-3 pr-12">
                  <button ${safeAuthorId ? `onclick="openAuthorProfile('${safeAuthorId}')"` : 'disabled'} class="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden ${safeAuthorId ? 'cursor-pointer' : 'cursor-default'}" aria-label="Ver perfil de ${safeAuthorName}">
                    <img src="${safeAuthorImage}" alt="${safeAuthorName}" class="w-full h-full object-cover">
                  </button>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-2">
                      <button ${safeAuthorId ? `onclick="openAuthorProfile('${safeAuthorId}')"` : 'disabled'} class="font-semibold text-sm text-[#7a6962] hover:text-[#5f4b44] transition-colors text-left ${safeAuthorId ? 'cursor-pointer' : 'cursor-default'}">${safeAuthorName}</button>
                      <button onclick="openPostOptionsSheet('${note.id}')" class="ml-auto p-1.5 rounded-full hover:bg-[#f1ece9] text-[#8d7d75]" aria-label="Opciones de publicación">
                        <i class="fas fa-ellipsis"></i>
                      </button>
                    </div>
                    ${renderNoteAnchoredMeta(note)}
                    ${note.content ? renderContentWithSticker(note.content, 'text-[#2f1a14] text-base whitespace-pre-wrap leading-relaxed') : ''}
                  </div>
                </div>
                ${renderNoteImages(note, note.id)}
                ${note.gifUrl ? `<div class="mb-3 rounded-2xl overflow-hidden border border-[#e8e1dc]"><img src="${note.gifUrl}" class="w-full h-auto max-h-80 object-cover"></div>` : ''}
                ${urlHTML}
                ${pollHTML}

                <div class="flex items-center pt-3 border-t border-[#efe9e5]">
                  <div class="flex items-center gap-3 text-[#7a6962]">
                    <button onclick="votePost('${note.id}', 'up')" id="upvote-${note.id}" class="vote-star flex items-center gap-1 ${userVote === 'up' ? 'active' : ''}" aria-label="Votar publicación">
                      <span class="spark"></span><span class="spark"></span><span class="spark"></span><span class="spark"></span><span class="spark"></span>
                      <svg class="fire-icon" fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 2c0 0-1.5 3.5-3.5 5.5C10 10 7 11.5 7 16c0 5 4 9 9 9s9-4 9-9c0-3.5-2-6-4-8-0.5 2-1.5 3.5-3 4.5 0-3.5-1-7.5-2-10.5z"/>
                        <path d="M16 18c0 0-0.7 1.5-1.5 2.2C13.5 21.2 13 22 13 23c0 1.7 1.3 3 3 3s3-1.3 3-3c0-1.5-1-2.5-2-3.5-0.2 0.8-0.5 1.5-1 2z" opacity="0.7"/>
                      </svg>
                    </button>
                    <span id="score-${note.id}" class="text-sm font-bold ${score > 0 ? 'text-[#5f4b44]' : 'text-[#8d7d75]'}">${formatVoteScore(score)}</span>
                    <button onclick="openCommentsView('${note.id}')" class="flex items-center gap-1.5 hover:text-[#5f4b44] transition-colors text-[#7a6962]">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" fill="currentColor"/>
                      </svg>
                      <span class="text-sm font-bold">${commentsCount}</span>
                    </button>
                  </div>
                </div>
                <p class="text-xs text-[#b2a7a1] mt-2">${formatRelativeTime(safeTimestamp)}</p>
              </div>
            `;

        feedFragment.appendChild(noteElement);
        } catch (renderError) {
          console.error('Error renderizando publicación:', note?.id, renderError);
        }
      });

      feedContainer.appendChild(feedFragment);
    });
  }

  // Función para votar en encuestas
  function votePoll(noteId, optionIndex) {
    var user = firebase.auth().currentUser;
    if (!user) {
      alert('Debes iniciar sesión para votar');
      return;
    }

    var noteRef = firebase.database().ref('communityNotes/' + noteId);
    noteRef.once('value').then(snapshot => {
      var note = snapshot.val();
      if (!note.poll) return;

      // Verificar si ya votó
      var hasVoted = false;
      var previousVoteIndex = -1;
      note.poll.options.forEach((option, index) => {
        if (option.voters && option.voters.includes(user.uid)) {
          hasVoted = true;
          previousVoteIndex = index;
        }
      });

      // Si ya votó, remover voto anterior
      if (hasVoted && previousVoteIndex !== -1) {
        note.poll.options[previousVoteIndex].votes = (note.poll.options[previousVoteIndex].votes || 1) - 1;
        note.poll.options[previousVoteIndex].voters = note.poll.options[previousVoteIndex].voters.filter(id => id !== user.uid);
      }

      // Agregar nuevo voto
      if (!note.poll.options[optionIndex].voters) {
        note.poll.options[optionIndex].voters = [];
      }
      if (!note.poll.options[optionIndex].voters.includes(user.uid)) {
        note.poll.options[optionIndex].votes = (note.poll.options[optionIndex].votes || 0) + 1;
        note.poll.options[optionIndex].voters.push(user.uid);
      }

      // Actualizar en Firebase
      noteRef.update({ poll: note.poll });
    });
  }
// Cerrar modal de imagen
function closeImageModal() {
  document.getElementById('image-modal').classList.add('hidden');
}


  function moderarContenidoNota(texto) {
    if (!texto) return false;

    var palabrasProhibidasNotas = [
      // Insultos y lenguaje ofensivo
      "idiota", "estúpido", "imbécil", "tonto", "pendejo",
      "maldito", "puta", "mierda", "carajo", "joder",
      "perra", "zorra", "maricón", "puto", "cabrón",
      // Discriminación
      "negro", "sudaca", "indio", "gitano", "judio",
      // Contenido inapropiado
      "xxx", "porn", "sex", "desnudo",
      // Violencia
      "matar", "muerte", "suicidio", "sangre",
      // Spam y estafas
      "ganar dinero", "hazte rico", "click aquí",
      // Enlaces maliciosos
      "bit.ly", "acortar.link", "short.io"
    ];

    var textoNormalizado = texto.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z\s]/g, ''); // Elimina caracteres especiales

    // Busca palabras completas, no partes de palabras
    var palabras = textoNormalizado.split(/\s+/);
    return palabras.some(palabra =>
      palabrasProhibidasNotas.includes(palabra) ||
      palabrasProhibidasNotas.some(palabraOfensiva =>
        palabra.includes(palabraOfensiva) && palabra.length < palabraOfensiva.length + 3
      )
    );
  }

function moderarContenidoAutomaticamente(noteId, content) {
  if (contienePalabrasOfensivas(content)) {
    firebase.database().ref('communityNotes/' + noteId).remove()
      .then(() => {
        console.log('Nota eliminada por contener lenguaje ofensivo');
        alert('Tu nota ha sido eliminada por contener lenguaje inapropiado.');
      });
    return true;
  }
  return false;
}

function contieneContenidoInapropiado(texto) {
  var patronesInapropiados = [
    /\b(?:porn|xxx)\b/i,
    /\b(?:kill|murder)\b/i,
    /\b(?:suicide|death)\b/i,
    /\b(?:cocaine|heroin|drugs)\b/i,
    /\b(?:terrorist|bomb)\b/i
  ];

  return patronesInapropiados.some(patron => patron.test(texto));
}

function moderarNota(noteId, content) {
  var loadingDiv = document.createElement('div');
  loadingDiv.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-[#FE2C55] mx-auto mb-4"></div>
        <p>Analizando contenido...</p>
      </div>
    </div>
  `;
  document.body.appendChild(loadingDiv);

  setTimeout(() => {
    document.body.removeChild(loadingDiv);

    if (contienePalabrasOfensivas(content)) {
      firebase.database().ref('communityNotes/' + noteId).remove();
      alert('La nota ha sido eliminada por contener lenguaje ofensivo.');
    } else if (contieneContenidoInapropiado(content)) {
      firebase.database().ref('communityNotes/' + noteId).update({
        blocked: true,
        blockReason: 'Contenido inapropiado detectado'
      });
      alert('La nota ha sido bloqueada por posible contenido inapropiado.');
    }
  }, 5000);
}

function deleteNote(noteId) {
  if (!confirm('¿Estás seguro de que quieres eliminar esta publicación?')) return;

  firebase.database().ref('communityNotes/' + noteId).remove()
    .then(() => {
      alert('Publicación eliminada exitosamente');
    })
    .catch(error => {
      console.error('Error al eliminar la publicación:', error);
      alert('Error al eliminar la publicación');
    });
}

var currentReportNoteId = null;
var currentPostOptionsNoteId = null;
var currentPostOptionsNoteData = null;
var blockedAccountsSet = new Set();
var blockedAccountsRef = null;


function setupBlockedAccountsListener(userId) {
  if (!userId) return;
  if (blockedAccountsRef) blockedAccountsRef.off();
  blockedAccountsRef = firebase.database().ref('blocks/' + userId);
  blockedAccountsRef.on('value', snapshot => {
    var data = snapshot.val() || {};
    blockedAccountsSet = new Set(Object.keys(data));
    loadNotes();
  });
}

function isAccountBlockedForCurrentUser(accountId) {
  if (!accountId) return false;
  return blockedAccountsSet.has(accountId);
}

function openPostOptionsSheet(noteId) {
  currentPostOptionsNoteId = noteId;
  var overlay = document.getElementById('post-options-overlay');
  var sheet = document.getElementById('post-options-sheet');
  var deleteBtn = document.getElementById('delete-post-btn');
  var copyBtn = document.getElementById('copy-post-text-btn');
  var blockBtn = document.getElementById('block-account-btn');
  if (!overlay || !sheet) return;

  var user = firebase.auth().currentUser;
  if (deleteBtn) deleteBtn.classList.add('hidden');
  currentPostOptionsNoteData = null;

  if (user) {
    firebase.database().ref('communityNotes/' + noteId).once('value').then(snapshot => {
      var note = snapshot.val() || {};
      currentPostOptionsNoteData = note;
      var isOwner = !!note && (note.authorId === user.uid || note.userId === user.uid);
      if (deleteBtn) deleteBtn.classList.toggle('hidden', !isOwner);
      var hasText = !!(note.content && String(note.content).trim());
      if (copyBtn) copyBtn.classList.toggle('hidden', !hasText);
      var targetAuthorId = note.authorId || note.userId || '';
      var canBlock = !!targetAuthorId && targetAuthorId !== user.uid;
      if (blockBtn) blockBtn.classList.toggle('hidden', !canBlock);
    }).catch(() => {
      if (deleteBtn) deleteBtn.classList.add('hidden');
    });
  }

  overlay.classList.remove('hidden');
  sheet.classList.remove('hidden');
  requestAnimationFrame(() => sheet.classList.add('open'));
}

function closePostOptionsSheet() {
  var overlay = document.getElementById('post-options-overlay');
  var sheet = document.getElementById('post-options-sheet');
  if (sheet) {
    sheet.classList.remove('open');
    setTimeout(() => sheet.classList.add('hidden'), 220);
  }
  if (overlay) overlay.classList.add('hidden');
  currentPostOptionsNoteId = null;
  currentPostOptionsNoteData = null;
}

function hidePostForUser() {
  if (!currentPostOptionsNoteId) return;
  var hiddenPosts = getHiddenPosts();
  if (!hiddenPosts.includes(currentPostOptionsNoteId)) {
    hiddenPosts.push(currentPostOptionsNoteId);
    setHiddenPosts(hiddenPosts);
  }
  closePostOptionsSheet();
  loadNotes();
}


function copyPostTextFromOptions() {
  var text = (currentPostOptionsNoteData && currentPostOptionsNoteData.content) ? String(currentPostOptionsNoteData.content).trim() : '';
  if (!text) {
    alert('Esta publicación no tiene texto para copiar.');
    return;
  }

  var onSuccess = () => {
    closePostOptionsSheet();
    alert('Texto copiado exitosamente.');
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(onSuccess).catch(() => {
      var temp = document.createElement('textarea');
      temp.value = text;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      temp.remove();
      onSuccess();
    });
    return;
  }

  var temp = document.createElement('textarea');
  temp.value = text;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand('copy');
  temp.remove();
  onSuccess();
}

function openBlockAccountConfirmFromOptions() {
  var modal = document.getElementById('block-account-confirm-modal');
  if (!modal) return;
  closePostOptionsSheet();
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeBlockAccountConfirmModal() {
  var modal = document.getElementById('block-account-confirm-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function confirmBlockAccountFromOptions() {
  var user = firebase.auth().currentUser;
  var targetAuthorId = currentPostOptionsNoteData?.authorId || currentPostOptionsNoteData?.userId || '';
  if (!user || !targetAuthorId || user.uid === targetAuthorId) {
    closeBlockAccountConfirmModal();
    return;
  }

  var updates = {};
  updates['blocks/' + user.uid + '/' + targetAuthorId] = { blockedAt: Date.now(), by: user.uid, mutual: true };
  updates['blocks/' + targetAuthorId + '/' + user.uid] = { blockedAt: Date.now(), by: user.uid, mutual: true };

  firebase.database().ref().update(updates).then(() => {
    blockedAccountsSet.add(targetAuthorId);
    closeBlockAccountConfirmModal();
    var ok = document.getElementById('block-account-success-modal');
    if (ok) {
      ok.classList.remove('hidden');
      ok.classList.add('flex');
    }
    loadNotes();
    performRealTimeSearch();
  }).catch(error => {
    console.error('Error bloqueando cuenta:', error);
    alert('No se pudo bloquear la cuenta. Intenta de nuevo.');
  });
}

function closeBlockAccountSuccessModal() {
  var modal = document.getElementById('block-account-success-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

function openReportFromPostOptions() {
  if (!currentPostOptionsNoteId) return;
  var noteId = currentPostOptionsNoteId;
  closePostOptionsSheet();
  reportNote(noteId);
}

function openContentPreferencesView() {
  closePostOptionsSheet();
  updateAdultContentToggleUI();
  var view = document.getElementById('content-preferences-view');
  if (view) view.classList.remove('hidden');
}

function closeContentPreferencesView() {
  var view = document.getElementById('content-preferences-view');
  var sensitiveView = document.getElementById('sensitive-content-view');
  if (view) view.classList.add('hidden');
  if (sensitiveView) sensitiveView.classList.add('hidden');
}

function openSensitiveContentView() {
  updateAdultContentToggleUI();
  var parentView = document.getElementById('content-preferences-view');
  var view = document.getElementById('sensitive-content-view');
  if (parentView) parentView.classList.add('hidden');
  if (view) view.classList.remove('hidden');
}

function deletePostFromOptions() {
  if (!currentPostOptionsNoteId) return;

  var confirmed = confirm('¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer.');
  if (!confirmed) return;

  var noteId = currentPostOptionsNoteId;
  closePostOptionsSheet();

  firebase.database().ref('communityNotes/' + noteId).remove().then(() => {
    alert('Publicación eliminada exitosamente.');
    loadNotes();
  }).catch(error => {
    console.error('Error al eliminar publicación:', error);
    alert('Hubo un error al eliminar la publicación. Intenta de nuevo.');
  });
}

function closeSensitiveContentView() {
  var view = document.getElementById('sensitive-content-view');
  var parentView = document.getElementById('content-preferences-view');
  if (view) view.classList.add('hidden');
  if (parentView) parentView.classList.remove('hidden');
}

function toggleAdultContentPreference(enabled) {
  localStorage.setItem('drex_allow_adult_content', enabled ? 'true' : 'false');
  updateAdultContentToggleUI();
  loadNotes();
}

var postReportReasons = [
  { value: 'sexual', label: 'La publicación contiene contenido sexual o desnudez' },
  { value: 'violence', label: 'Hay violencia, amenazas o acoso' },
  { value: 'hate', label: 'Incluye odio o discriminación' },
  { value: 'self_harm', label: 'Promueve autolesión o suicidio' },
  { value: 'misinformation', label: 'Información engañosa o spam' },
  { value: 'copyright', label: 'Infracción de derechos de autor' },
  { value: 'other', label: 'Otro motivo' }
];

function buildPostReportOptions() {
  var container = document.getElementById('post-report-reasons');
  if (!container) return;

  var iconMap = {
    sexual: 'fa-person-dress-burst',
    violence: 'fa-triangle-exclamation',
    hate: 'fa-ban',
    self_harm: 'fa-heart-crack',
    misinformation: 'fa-bullhorn',
    copyright: 'fa-copyright',
    other: 'fa-ellipsis'
  };

  container.innerHTML = postReportReasons.map((reason, idx) => `
    <label class="post-report-option group flex items-start gap-3 p-3 border border-gray-200 rounded-2xl bg-white hover:border-[#FE2C55] hover:bg-[#fff5f7] cursor-pointer transition-all">
      <input type="radio" name="post-report-reason" value="${reason.value}" class="sr-only" ${idx === 0 ? 'checked' : ''}>
      <span class="w-9 h-9 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center group-hover:bg-[#ffe4ea] group-hover:text-[#FE2C55] transition-colors">
        <i class="fas ${iconMap[reason.value] || 'fa-flag'}"></i>
      </span>
      <span class="text-sm text-gray-800 leading-relaxed">${reason.label}</span>
      <span class="ml-auto mt-1 w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
        <span class="w-2.5 h-2.5 rounded-full bg-[#FE2C55] opacity-0"></span>
      </span>
    </label>
  `).join('');

  refreshPostReportSelectionUI();
  container.querySelectorAll('input[name="post-report-reason"]').forEach(input => {
    input.addEventListener('change', refreshPostReportSelectionUI);
  });
}

function refreshPostReportSelectionUI() {
  document.querySelectorAll('#post-report-reasons .post-report-option').forEach(option => {
    var input = option.querySelector('input[name="post-report-reason"]');
    var dot = option.querySelector('span > span');
    if (!input) return;

    if (input.checked) {
      option.classList.add('border-[#FE2C55]', 'bg-[#fff5f7]', 'shadow-sm');
      option.classList.remove('border-gray-200', 'bg-white');
      if (dot) dot.classList.remove('opacity-0');
    } else {
      option.classList.remove('border-[#FE2C55]', 'bg-[#fff5f7]', 'shadow-sm');
      option.classList.add('border-gray-200', 'bg-white');
      if (dot) dot.classList.add('opacity-0');
    }
  });
}

function reportNote(noteId) {
  var user = firebase.auth().currentUser;
  if (!user) {
    alert('Debes iniciar sesión para reportar');
    return;
  }
  currentReportNoteId = noteId;
  buildPostReportOptions();
  document.getElementById('post-report-description').value = '';
  document.getElementById('post-report-fullscreen').classList.remove('hidden');
}

function closePostReportFullscreen() {
  document.getElementById('post-report-fullscreen').classList.add('hidden');
  currentReportNoteId = null;
}

function closePostReportResponse() {
  document.getElementById('post-report-response').classList.add('hidden');
}

function submitPostReport() {
  var user = firebase.auth().currentUser;
  if (!user) {
    alert('Debes iniciar sesión para reportar');
    return;
  }
  if (!currentReportNoteId) return;

  var reasonInput = document.querySelector('input[name="post-report-reason"]:checked');
  var reason = reasonInput ? reasonInput.value : 'other';
  var reasonLabel = postReportReasons.find(r => r.value === reason)?.label || 'Otro motivo';
  var description = document.getElementById('post-report-description').value.trim();

  var submitBtn = document.getElementById('post-report-submit-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  var reasonKeywords = {
    sexual: 'desnudo xxx sexual pornografía',
    violence: 'violencia amenaza matar golpear acoso',
    hate: 'odio racismo homofobia discriminación',
    self_harm: 'suicidio autolesión cortarse',
    misinformation: 'spam fraude engaño estafa',
    copyright: 'copyright derechos autor robo contenido',
    other: ''
  };

  firebase.database().ref('communityNotes/' + currentReportNoteId).once('value').then(snapshot => {
    var note = snapshot.val();
    if (!note) throw new Error('Publicación no encontrada');

    var algorithmInput = `${note.content || ''} ${reasonLabel} ${reasonKeywords[reason] || ''} ${description}`;
    var autoFlag = moderarContenidoNota(algorithmInput);
    var requiresHuman = ['sexual', 'violence', 'hate', 'self_harm', 'copyright'].includes(reason) || !autoFlag;
    var reportId = firebase.database().ref().push().key;

    var reportPayload = {
      reportId,
      noteId: currentReportNoteId,
      reporter: user.uid,
      reporterName: user.displayName || user.email || 'Usuario',
      noteAuthorId: note.authorId || '',
      reason,
      reasonLabel,
      description,
      algorithmInput,
      autoFlag,
      requiresHuman,
      status: requiresHuman ? 'pending_human_review' : 'auto_resolved',
      timestamp: Date.now()
    };

    document.getElementById('post-report-fullscreen').classList.add('hidden');
    document.getElementById('post-report-processing').classList.remove('hidden');

    return firebase.database().ref('postReports/' + reportId).set(reportPayload).then(() => {
      if (requiresHuman) {
        return firebase.database().ref('postReportsHumanQueue/' + reportId).set({
          ...reportPayload,
          humanPriority: autoFlag ? 'high' : 'normal',
          queuedAt: Date.now()
        });
      }
      return Promise.resolve();
    }).then(() => {
      setTimeout(() => {
        var statusMessage = requiresHuman
          ? 'No pudimos tomar una medida automática con certeza. Tu reporte fue enviado al equipo humano y está en revisión.'
          : 'Tu reporte fue procesado automáticamente y ya aplicamos las medidas correspondientes si fueron necesarias.';
        addNotification(user.uid, statusMessage, 'moderation');
      }, 15000);
    });
  }).then(() => {
    setTimeout(() => {
      document.getElementById('post-report-processing').classList.add('hidden');
      document.getElementById('post-report-response').classList.remove('hidden');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar reporte';
      currentReportNoteId = null;
    }, 1300);
  }).catch(error => {
    console.error('Error al enviar reporte de publicación:', error);
    document.getElementById('post-report-processing').classList.add('hidden');
    alert('No se pudo enviar el reporte. Inténtalo de nuevo.');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar reporte';
  });
}

// Sistema de votos estilo Reddit (funcionalidad)
function votePost(noteId, voteType) {
  var user = firebase.auth().currentUser;
  if (!user) {
    alert('Debes iniciar sesión para votar');
    return;
  }

  var userVoteRef = firebase.database().ref('userVotes/' + user.uid + '/' + noteId);
  var noteRef = firebase.database().ref('communityNotes/' + noteId);
  firebase.database().ref('users/' + user.uid).once('value').then(userSnap => {
    var userData = userSnap.val();
    var userName = (userData && userData.username) ? userData.username : (user.displayName || user.email || 'Alguien');

    userVoteRef.once('value').then(snapshot => {
    var currentVote = snapshot.val();

    noteRef.transaction(note => {
      if (note) {
        if (currentVote === 'up') {
          note.upvotes = (note.upvotes || 1) - 1;
        }

        if (currentVote !== 'up') {
          note.upvotes = (note.upvotes || 0) + 1;
        }
      }
      return note;
    }).then(result => {
      var updatedNote = result && result.snapshot ? result.snapshot.val() : null;
      if (
        updatedNote &&
        voteType === 'up' &&
        currentVote !== 'up' &&
        updatedNote.authorId &&
        updatedNote.authorId !== user.uid
      ) {
        addNotification(updatedNote.authorId, `${userName} votó positivamente tu publicación.`, 'vote');
      }
    });

    if (currentVote === 'up') {
      userVoteRef.remove();
    } else {
      userVoteRef.set('up');
    }

    var voteBtn = document.getElementById(`upvote-${noteId}`);
    if (voteBtn) {
      voteBtn.classList.remove('pop');
      void voteBtn.offsetWidth; // forzar reflow para reiniciar animación
      requestAnimationFrame(() => {
        voteBtn.classList.add('pop');
        setTimeout(() => voteBtn.classList.remove('pop'), 550);
      });
    }
    });
  });
}

var currentPostId = null;
var replyTarget = null;
var stickerTargetInputId = null;
var pendingStickers = {};
var STICKER_PREFIX = '__sticker__:';
var STICKER_TEXT_SEPARATOR = '__text__:';
var baseStickerUrls = [
  'https://i.ibb.co/MysRv7gF/IMG-9686.png',
  'https://i.ibb.co/C3rCh7WJ/IMG-9687.png',
  'https://i.ibb.co/TxxqVYX1/IMG-9688.png',
  'https://i.ibb.co/tpwwLLFQ/IMG-9689.png',
  'https://i.ibb.co/mr8WB298/IMG-9692.png',
  'https://i.ibb.co/pBjLmr7J/IMG-9691.png',
  'https://i.ibb.co/wryWpNNc/IMG-9690.png'
];
var stickerUrls = [...baseStickerUrls];

function escapeHTML(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderContentWithSticker(content, textClass = 'text-sm text-gray-800 mb-2') {
  if (content && content.startsWith(STICKER_PREFIX)) {
    var payload = content.slice(STICKER_PREFIX.length);
    var separatorIndex = payload.indexOf(STICKER_TEXT_SEPARATOR);
    var stickerUrl = separatorIndex >= 0 ? payload.slice(0, separatorIndex) : payload;
    var stickerText = separatorIndex >= 0 ? payload.slice(separatorIndex + STICKER_TEXT_SEPARATOR.length) : '';

    return `
      <div class="mb-2">
        <img src="${stickerUrl}" alt="sticker" class="w-24 h-24 object-contain rounded-lg sticker-item" data-url="${stickerUrl}">
        ${stickerText ? `<p class="${textClass} mt-2">${escapeHTML(stickerText)}</p>` : ''}
      </div>
    `;
  }
  return `<p class="${textClass}">${escapeHTML(content || '')}</p>`;
}

function renderStickerGrid(filter = '') {
  var stickerGrid = document.getElementById('sticker-grid');
  if (!stickerGrid) return;

  stickerGrid.innerHTML = `<div class="col-span-2 py-2 text-center">${getFadingCircleLoaderMarkup()}</div>`;

  var urls = stickerUrls;
  if (filter) {
    var term = filter.toLowerCase();
    urls = urls.filter(u => u.toLowerCase().includes(term));
  }

  setTimeout(() => {
  stickerGrid.innerHTML = urls.map(url => `
    <button onclick="selectSticker('${url}')" class="border border-gray-100 rounded-lg p-2 hover:border-[#FE2C55] transition-colors">
      <img src="${url}" alt="sticker" class="w-full aspect-square object-contain sticker-item" data-url="${url}">
    </button>
  `).join('');
  }, 180);
}

function filterStickers() {
  var term = document.getElementById('sticker-search')?.value || '';
  renderStickerGrid(term);
}

function openStickerPicker(inputId) {
  stickerTargetInputId = inputId;
  // reset filters
  var search = document.getElementById('sticker-search');
  if (search) search.value = '';

  renderStickerGrid('');

  var overlay = document.getElementById('sticker-sheet-overlay');
  var sheet = document.getElementById('sticker-sheet');

  overlay.classList.remove('hidden');
  sheet.classList.remove('hidden');
  setTimeout(() => {
    sheet.classList.remove('translate-y-full');
  }, 10);
}

function closeStickerPicker() {
  var overlay = document.getElementById('sticker-sheet-overlay');
  var sheet = document.getElementById('sticker-sheet');

  sheet.classList.add('translate-y-full');
  setTimeout(() => {
    overlay.classList.add('hidden');
    sheet.classList.add('hidden');
  }, 300);
  stickerTargetInputId = null;
}

function updateStickerPreview(inputId) {
  var preview = document.getElementById(`sticker-preview-${inputId}`);
  if (!preview) return;

  var stickerUrl = pendingStickers[inputId];
  if (!stickerUrl) {
    preview.innerHTML = '';
    preview.classList.add('hidden');
    return;
  }

  preview.classList.remove('hidden');
  preview.innerHTML = `
    <div class="inline-flex items-center gap-2 bg-gray-100 rounded-xl px-2 py-1">
      <img src="${stickerUrl}" alt="sticker seleccionado" class="w-14 h-14 object-contain rounded sticker-item" data-url="${stickerUrl}">
      <button onclick="clearStickerSelection('${inputId}')" class="text-[#8d7d75] hover:text-[#5f4b44]" title="Quitar sticker">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  `;
}

function clearStickerSelection(inputId) {
  delete pendingStickers[inputId];
  updateStickerPreview(inputId);
}

function resolveCommentContent(inputId) {
  var input = document.getElementById(inputId);
  if (!input) return '';

  var textContent = input.value.trim();
  var stickerUrl = pendingStickers[inputId];

  if (stickerUrl && textContent) {
    return `${STICKER_PREFIX}${stickerUrl}${STICKER_TEXT_SEPARATOR}${textContent}`;
  }

  if (stickerUrl) return `${STICKER_PREFIX}${stickerUrl}`;
  return textContent;
}

function selectSticker(url) {
  if (!stickerTargetInputId) return;
  var targetInput = document.getElementById(stickerTargetInputId);
  if (!targetInput) return;

  pendingStickers[stickerTargetInputId] = url;
  updateStickerPreview(stickerTargetInputId);
  targetInput.focus();
  closeStickerPicker();
}

// Abrir vista de comentarios
function openCommentsView(noteId) {
  currentPostId = noteId;
  var user = firebase.auth().currentUser;

  if (user) {
    firebase.database().ref('users/' + user.uid).once('value').then(snap => {
      var userData = snap.val();
      document.getElementById('current-user-avatar-comment').src = userData.profileImage || 'https://via.placeholder.com/150';
    });
  }

  firebase.database().ref('communityNotes/' + noteId).once('value').then(snapshot => {
    var note = { ...(snapshot.val() || {}), id: noteId };
    var upvotes = note.upvotes || 0;
    var downvotes = note.downvotes || 0;
    var score = upvotes - downvotes;

    // Construir HTML de encuesta si existe
    var pollHTML = '';
    if (note.poll) {
      var totalVotes = note.poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
      pollHTML = `
        <div class="mt-2 p-3 bg-white rounded-lg border border-gray-300">
          <h4 class="font-medium text-gray-900 mb-2 text-sm">${note.poll.question}</h4>
          <div class="space-y-2">
            ${note.poll.options.map((option, index) => {
              var percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
              var hasVoted = user && option.voters && option.voters.includes(user.uid);
              return `
                <button onclick="votePoll('${noteId}', ${index})" class="w-full text-left p-2 rounded border transition-all relative overflow-hidden ${hasVoted ? 'border-[#FE2C55] bg-red-50' : 'border-gray-300 bg-white'}">
                  <div class="absolute inset-0 bg-[#FE2C55]" style="width: ${percentage}%; opacity: 0.08"></div>
                  <div class="relative flex justify-between items-center">
                    <span class="text-xs font-medium text-gray-900">${option.text}</span>
                    <span class="text-xs font-bold ${hasVoted ? 'text-[#FE2C55]' : 'text-gray-500'}">${percentage}%</span>
                  </div>
                </button>
              `;
            }).join('')}
          </div>
          <p class="text-xs text-gray-500 mt-2">${totalVotes} voto${totalVotes !== 1 ? 's' : ''}</p>
        </div>
      `;
    }

    var originalAuthorId = note.authorId || '';
    document.getElementById('original-post').innerHTML = `
      <div class="flex items-start gap-3 mb-2">
        <button ${originalAuthorId ? `onclick="openAuthorProfile('${originalAuthorId}')"` : 'disabled'} class="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden ${originalAuthorId ? 'cursor-pointer' : 'cursor-default'}" aria-label="Ver perfil de ${note.authorName || 'Usuario'}">
          <img src="${note.authorImage}" class="w-full h-full object-cover">
        </button>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <button ${originalAuthorId ? `onclick="openAuthorProfile('${originalAuthorId}')"` : 'disabled'} class="font-semibold text-xs text-[#7a6962] hover:text-[#5f4b44] transition-colors text-left ${originalAuthorId ? 'cursor-pointer' : 'cursor-default'}">${note.authorName}</button>
          </div>
          ${renderNoteAnchoredMeta(note)}
          ${note.content ? renderContentWithSticker(note.content, 'text-[#2f1a14] text-base mb-2 leading-relaxed') : ''}
        </div>
      </div>
      ${renderNoteImages(note, noteId)}
      ${pollHTML}
      <div class="flex items-center gap-3 text-xs text-[#8d7d75] mt-2">
        <span class="font-bold ${score > 0 ? 'text-[#5f4b44]' : 'text-[#8d7d75]'}">${formatVoteScore(score)}</span>
      </div>
      <p class="text-xs text-[#b2a7a1] mt-2">${formatRelativeTime(note.timestamp)}</p>
    `;
  });

  loadCommentsInView(noteId);

  document.getElementById('main-app').classList.add('hidden');
  document.getElementById('comments-view').classList.remove('hidden');
}

// Cerrar vista de comentarios
function closeCommentsView() {
  document.getElementById('comments-view').classList.add('hidden');
  document.getElementById('main-app').classList.remove('hidden');
  closeStickerPicker();
  removeCommentGif();
  clearReplyTarget();
  currentPostId = null;
}

// Cargar comentarios en la vista
function loadCommentsInView(noteId) {
  var commentsList = document.getElementById('comments-list-view');
  
  // Mostrar skeletons de carga
  var skeletonHTML = '<div class="comment-skeleton"><div class="comment-skeleton-avatar"></div><div class="comment-skeleton-content flex-1"><div class="comment-skeleton-line"></div><div class="comment-skeleton-line"></div><div class="comment-skeleton-line"></div></div></div>' +
    '<div class="comment-skeleton"><div class="comment-skeleton-avatar"></div><div class="comment-skeleton-content flex-1"><div class="comment-skeleton-line"></div><div class="comment-skeleton-line"></div></div></div>' +
    '<div class="comment-skeleton"><div class="comment-skeleton-avatar"></div><div class="comment-skeleton-content flex-1"><div class="comment-skeleton-line"></div><div class="comment-skeleton-line"></div><div class="comment-skeleton-line"></div></div></div>';
  commentsList.innerHTML = skeletonHTML;

  firebase.database().ref('postComments/' + noteId).on('value', snapshot => {
    commentsList.innerHTML = '';
    var totalCount = 0;

    snapshot.forEach(child => {
      var comment = child.val();
      var commentId = child.key;
      totalCount++; // Contar comentario principal

      // Contar respuestas recursivamente
      if (comment.replies) {
        totalCount += countReplies(comment.replies);
      }

      renderCommentModern(noteId, commentId, comment, commentsList, 0);
    });

    document.getElementById('comments-count-header').textContent = totalCount + (totalCount === 1 ? ' comentario' : ' comentarios');
  });
}

// Función para formatear timestamp de comentarios
function formatRelativeTime(timestamp) {
  var now = Date.now();
  var ts = Number(timestamp) || now;
  var diff = Math.max(0, now - ts);
  var min = Math.floor(diff / 60000);
  var hr = Math.floor(diff / 3600000);
  var day = Math.floor(diff / 86400000);
  var week = Math.floor(diff / (7 * 86400000));

  if (min < 1) return "hace un momento";
  if (min < 60) return `hace ${min} min`;
  if (hr < 24) return `hace ${hr} h`;
  if (day < 7) return `hace ${day} día${day > 1 ? "s" : ""}`;
  return `hace ${week} semana${week > 1 ? "s" : ""}`;
}

function formatTimestamp(timestamp) {
  var now = Date.now();
  var diff = now - timestamp;
  var days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days < 1) {
    var hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) {
      var minutes = Math.floor(diff / (1000 * 60));
      return minutes < 1 ? 'Ahora' : `Hace ${minutes}m`;
    }
    return `Hace ${hours}h`;
  } else if (days <= 9) {
    return `Hace ${days} día${days > 1 ? 's' : ''}`;
  } else {
    var date = new Date(timestamp);
    var hours = date.getHours();
    var minutes = date.getMinutes().toString().padStart(2, '0');
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${hours}:${minutes}`;
  }
}

// Contar respuestas recursivamente
function countReplies(replies) {
  var count = 0;
  if (!replies) return count;

  Object.keys(replies).forEach(key => {
    count++;
    if (replies[key].replies) {
      count += countReplies(replies[key].replies);
    }
  });

  return count;
}

// Renderizar comentario moderno
function escapeSingleQuote(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function renderCommentModern(noteId, commentId, comment, container, level, parentId = null, parentPath = "") {
  var marginLeft = level * 16;
  var commentDiv = document.createElement('div');
  commentDiv.className = 'bg-white border border-[#e8e1dc] rounded-2xl p-3';
  commentDiv.style.marginLeft = marginLeft + 'px';
  if (level > 0) {
    commentDiv.className = 'pl-3 py-2';
    commentDiv.style.marginLeft = (Math.max(8, level * 14)) + 'px';
    commentDiv.style.borderLeft = '2px solid #d8cec8';
    commentDiv.style.background = 'transparent';
  }

  var upvotes = comment.upvotes || 0;
  var downvotes = comment.downvotes || 0;
  var score = upvotes - downvotes;

  // Generar path completo para respuestas anidadas
  var commentPath = parentPath ? `${parentPath}/replies/${commentId}` : commentId;

  var commentAuthorId = comment.authorId || '';

  commentDiv.innerHTML = `
    <div class="flex items-start gap-3">
      <button ${commentAuthorId ? `onclick="openAuthorProfile('${commentAuthorId}')"` : 'disabled'} class="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden ${commentAuthorId ? 'cursor-pointer' : 'cursor-default'}" aria-label="Ver perfil de ${comment.authorName || 'Usuario'}">
        <img src="${comment.authorImage}" class="w-full h-full object-cover">
      </button>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <button ${commentAuthorId ? `onclick="openAuthorProfile('${commentAuthorId}')"` : 'disabled'} class="font-semibold text-xs text-[#7a6962] hover:text-[#5f4b44] transition-colors text-left ${commentAuthorId ? 'cursor-pointer' : 'cursor-default'}">${comment.authorName}</button>
          <span class="text-xs text-[#b2a7a1]">${formatTimestamp(comment.timestamp)}</span>
        </div>
        ${renderContentWithSticker(comment.content, 'text-sm text-[#2f1a14] mb-2 leading-relaxed')}
        ${comment.gifUrl ? `<div class="mb-2 rounded-xl overflow-hidden border border-[#e8e1dc]"><img src="${comment.gifUrl}" class="w-full max-h-60 object-cover"></div>` : ''}
        <div class="flex items-center gap-4 text-xs text-[#8d7d75]">
          <div class="flex items-center gap-2">
            <button onclick="voteComment('${noteId}', '${commentPath}', 'up')" id="comment-upvote-${commentPath}" class="vote-star" aria-label="Votar comentario">
              <span class="spark"></span><span class="spark"></span><span class="spark"></span><span class="spark"></span><span class="spark"></span>
              <svg class="fire-icon-sm" fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2c0 0-1.5 3.5-3.5 5.5C10 10 7 11.5 7 16c0 5 4 9 9 9s9-4 9-9c0-3.5-2-6-4-8-0.5 2-1.5 3.5-3 4.5 0-3.5-1-7.5-2-10.5z"/>
                <path d="M16 18c0 0-0.7 1.5-1.5 2.2C13.5 21.2 13 22 13 23c0 1.7 1.3 3 3 3s3-1.3 3-3c0-1.5-1-2.5-2-3.5-0.2 0.8-0.5 1.5-1 2z" opacity="0.7"/>
              </svg>
            </button>
            <span id="comment-score-${commentPath}" class="font-semibold ${score > 0 ? 'text-[#5f4b44]' : 'text-[#8d7d75]'}">${formatVoteScore(score)}</span>
          </div>
          <button onclick="setReplyTarget('${commentPath}', '${escapeSingleQuote(comment.authorName || 'Usuario')}')" class="hover:text-[#5f4b44] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>
          ${comment.authorId === firebase.auth().currentUser?.uid ? `
          <button onclick="openCommentActionsSheet('${noteId}', '${commentPath}', '${escapeSingleQuote(comment.content || '')}')" class="hover:text-[#5f4b44] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
          </button>
          ` : ''}
        </div>
        <div id="replies-${commentPath}" class="mt-2 space-y-2"></div>
      </div>
    </div>
  `;

  container.appendChild(commentDiv);

  // Cargar respuestas
  if (comment.replies) {
    var repliesContainer = document.getElementById(`replies-${commentPath}`);
    Object.keys(comment.replies).forEach(replyId => {
      renderCommentModern(noteId, replyId, comment.replies[replyId], repliesContainer, level + 1, commentId, commentPath);
    });
  }

  // Verificar voto del usuario
  var user = firebase.auth().currentUser;
  if (user) {
    var safeVoteKey = commentPath.replace(/\//g, '__');
    firebase.database().ref('userCommentVotes/' + user.uid + '/' + safeVoteKey).once('value').then(voteSnapshot => {
      var vote = voteSnapshot.val();
      if (vote === 'up') {
        var btn = document.getElementById(`comment-upvote-${commentPath}`);
        if (btn) btn.classList.add('active');
      }
    });
  }
}

// Enviar comentario principal
function submitComment() {
  if (!currentPostId) return;

  var user = firebase.auth().currentUser;
  if (!user) {
    alert('Debes iniciar sesión para comentar');
    return;
  }

  var input = document.getElementById('comment-input-main');
  var content = input.value.trim();

  if (!content && !selectedCommentGif) return;

  firebase.database().ref('users/' + user.uid).once('value').then(userSnap => {
    var userData = userSnap.val();

    var payload = {
      content: content,
      authorId: user.uid,
      authorName: userData.username || 'Usuario',
      authorImage: userData.profileImage || user.photoURL || 'https://via.placeholder.com/150',
      timestamp: Date.now(),
      upvotes: 0,
      downvotes: 0
    };

    if (selectedCommentGif) payload.gifUrl = selectedCommentGif;

    if (replyTarget && replyTarget.commentId) {
      firebase.database().ref('postComments/' + currentPostId + '/' + replyTarget.commentId + '/replies').push(payload).then(() => {
        updateCommentsCount(currentPostId);
        input.value = '';
        removeCommentGif();
        clearReplyTarget();
      });
      return;
    }

    firebase.database().ref('postComments/' + currentPostId).push(payload).then(() => {
      updateCommentsCount(currentPostId);
      input.value = '';
      removeCommentGif();
    });
  });
}

// Actualizar contador de comentarios (incluyendo respuestas)
function updateCommentsCount(noteId) {
  firebase.database().ref('postComments/' + noteId).once('value').then(snapshot => {
    var totalCount = 0;

    snapshot.forEach(child => {
      totalCount++; // Comentario principal
      var comment = child.val();
      if (comment.replies) {
        totalCount += countReplies(comment.replies);
      }
    });

    firebase.database().ref('communityNotes/' + noteId).update({
      commentsCount: totalCount
    });
  });
}

function setReplyTarget(commentId, authorName) {
  replyTarget = { commentId, authorName: authorName || 'Usuario' };
  var bar = document.getElementById('reply-context-bar');
  var text = document.getElementById('reply-context-text');
  var input = document.getElementById('comment-input-main');
  if (bar && text) {
    text.textContent = `Respondiendo a @${replyTarget.authorName}`;
    bar.classList.remove('hidden');
    bar.classList.add('flex');
  }
  if (input) {
    input.placeholder = 'Escribe tu respuesta';
    input.focus();
  }
}

function clearReplyTarget() {
  replyTarget = null;
  var bar = document.getElementById('reply-context-bar');
  var input = document.getElementById('comment-input-main');
  if (bar) {
    bar.classList.add('hidden');
    bar.classList.remove('flex');
  }
  if (input) input.placeholder = '¿Qué opinas?';
}

// Votar comentario (funciona para comentarios y respuestas)
function voteComment(noteId, commentPath, voteType = "up") {
  var user = firebase.auth().currentUser;
  if (!user) {
    alert('Debes iniciar sesión para votar');
    return;
  }

  var safeVoteKey = commentPath.replace(/\//g, '__');
  var userVoteRef = firebase.database().ref('userCommentVotes/' + user.uid + '/' + safeVoteKey);
  var commentRef = firebase.database().ref('postComments/' + noteId + '/' + commentPath);

  userVoteRef.once('value').then(snapshot => {
    var currentVote = snapshot.val();

    commentRef.transaction(comment => {
      if (comment) {
        if (currentVote === 'up') {
          comment.upvotes = (comment.upvotes || 1) - 1;
        }

        if (currentVote !== 'up') {
          comment.upvotes = (comment.upvotes || 0) + 1;
        }
      }
      return comment;
    });

    if (currentVote === 'up') {
      userVoteRef.remove();
    } else {
      userVoteRef.set('up');
    }

    var voteBtn = document.getElementById(`comment-upvote-${commentPath}`);
    if (voteBtn) {
      voteBtn.classList.remove('pop');
      void voteBtn.offsetWidth; // forzar reflow para reiniciar animación
      requestAnimationFrame(() => {
        voteBtn.classList.add('pop');
        setTimeout(() => voteBtn.classList.remove('pop'), 550);
      });
    }
  });
}

// Abrir bottom sheet de opciones de comentario
function openCommentActionsSheet(noteId, commentPath, commentText) {
  var overlay = document.getElementById('comment-actions-overlay');
  var sheet = document.getElementById('comment-actions-sheet');
  var content = document.getElementById('comment-actions-content');
  
  content.innerHTML = `
    <div class="comment-action-item" onclick="copyCommentText('${escapeSingleQuote(commentText)}')">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      <span>Copiar texto</span>
    </div>
    <div class="comment-action-item delete" onclick="deleteCommentConfirm('${noteId}', '${commentPath}')">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      <span>Eliminar</span>
    </div>
  `;
  
  overlay.classList.add('active');
  sheet.classList.add('active');
  overlay.onclick = closeCommentActionsSheet;
}

// Cerrar bottom sheet
function closeCommentActionsSheet() {
  var overlay = document.getElementById('comment-actions-overlay');
  var sheet = document.getElementById('comment-actions-sheet');
  overlay.classList.remove('active');
  sheet.classList.remove('active');
}

// Copiar texto del comentario
function copyCommentText(text) {
  navigator.clipboard.writeText(text).then(() => {
    closeCommentActionsSheet();
    alert('Texto copiado al portapapeles');
  }).catch(err => {
    console.error('Error al copiar:', err);
  });
}

// Confirmar eliminación de comentario
function deleteCommentConfirm(noteId, commentPath) {
  if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
    deleteComment(noteId, commentPath);
  }
}

// Eliminar comentario
function deleteComment(noteId, commentPath) {
  var user = firebase.auth().currentUser;
  if (!user) return;

  var commentRef = firebase.database().ref('postComments/' + noteId + '/' + commentPath);
  commentRef.remove().then(() => {
    closeCommentActionsSheet();
    loadCommentsInView(noteId);
  });
}

  // VARIABLES GLOBALES
  var tapCount = 0,
    lastTap = 0,
    heartCount = 0;
  var touchstartX = 0,
    touchendX = 0; // Para detección de swipe
  // -------------------------------
  // Funciones para Corazones (Taps)
  // -------------------------------
  function handleDoubleTap(event) {
    var currentTime = new Date().getTime();
    var tapLength = currentTime - lastTap;
    if (tapLength < 300 && tapLength > 0) {
      createHeart(event.clientX, event.clientY);
      incrementHeartCount();
      lastTap = 0;
    } else {
      lastTap = currentTime;
    }
  }

  function createHeart(x, y) {
    var heart = document.createElement('div');
    heart.classList.add('heart');
    heart.style.left = (x - 12) + 'px';
    heart.style.top = (y - 12) + 'px';
    heart.innerHTML = '❤️';
    document.getElementById('hearts-container').appendChild(heart);
    setTimeout(() => {
      heart.remove();
    }, 2000);
  }

  function incrementHeartCount() {
    heartCount++;
    document.getElementById('live-tapCount').textContent = heartCount + " ❤️";
    document.getElementById('viewer-tapCount').textContent = heartCount + " ❤️";
    document.getElementById('likeCountLiveViewer').textContent = heartCount;
  }

  function sendHeart() {
    var video = document.getElementById('live-remoteVideo');
    var rect = video.getBoundingClientRect();
    var x = rect.left + rect.width / 2;
    var y = rect.top + rect.height / 2;
    createHeart(x, y);
    incrementHeartCount();
  }
  // -------------------------------
  // Funciones de Ajustes y Modales
  // -------------------------------
  function openSettingsFullscreen() {
    document.getElementById("settings-fullscreen").classList.remove("hidden");
  }

  function closeSettingsFullscreen() {
    document.getElementById("settings-fullscreen").classList.add("hidden");
  }

  function closeLiveStreamModal() {
    document.getElementById('live-stream-modal').classList.add('hidden');
  }

  function closeLiveViewModal() {
    document.getElementById('live-view-modal').classList.add('hidden');
  }

  function expandPromoBanner() {
    document.getElementById('expanded-banner').classList.remove('translate-y-full');
  }

  function closeExpandedBanner() {
    document.getElementById('expanded-banner').classList.add('translate-y-full');
  }

  function sendGift(giftName) {
    alert("Enviado regalo: " + giftName);
    closeGiftDrawer();
  }

  function closeGiftDrawer() {
    document.getElementById('gift-drawer').classList.remove('open');
  }

  function showReportModal() {
    document.getElementById('live-report-modal').classList.remove('translate-y-full');
  }

  function closeReportModal() {
    document.getElementById('live-report-modal').classList.add('translate-y-full');
  }

  function submitReport() {
    closeReportModal();
    document.getElementById('report-success').classList.remove('hidden');
    setTimeout(closeReportSuccess, 3000);
  }

  function closeReportSuccess() {
    document.getElementById('report-success').classList.add('hidden');
  }

  function handleLiveVideoUpload(event) {
    var file = event.target.files[0];
    if (file) {
      var video = document.getElementById('live-localVideo');
      video.src = URL.createObjectURL(file);
      video.play();
    }
  }
  document.getElementById('live-startBtn').addEventListener('click', function() {
    document.getElementById('live-spinner').classList.remove('hidden');
    this.classList.add('hidden');
    setTimeout(function() {
      document.getElementById('live-spinner').classList.add('hidden');
      document.getElementById('live-endBtn').classList.remove('hidden');
      document.getElementById('live-overlay').classList.add('hidden');
    }, 2000);
  });
  document.getElementById('live-endBtn').addEventListener('click', function() {
    closeLiveStreamModal();
  });

  function startCountdown() {
    var countdownElement = document.getElementById('live-countdown');
    var count = 3;
    countdownElement.textContent = count;
    var interval = setInterval(() => {
      count--;
      if (count > 0) {
        countdownElement.textContent = count;
      } else {
        clearInterval(interval);
        countdownElement.textContent = "¡En vivo!";
        setTimeout(() => {
          document.getElementById('live-overlay').classList.add('hidden');
        }, 1000);
      }
    }, 1000);
  }
  // -------------------------------
  // Nuevas Funcionalidades en Ajustes
  // -------------------------------
  // Detector de rostro (simulación: se aplica filtro de brillo/contraste)
  function startFaceDetection() {
    console.log("Detección de rostro activada - aplicando efecto belleza");
    document.getElementById("live-localVideo").style.filter = "brightness(1.2) contrast(1.1)";
  }

  function stopFaceDetection() {
    console.log("Detección de rostro desactivada - quitando efecto");
    document.getElementById("live-localVideo").style.filter = "";
  }
  document.getElementById('face-detection-toggle').addEventListener('change', function() {
    if (this.checked) {
      startFaceDetection();
    } else {
      stopFaceDetection();
    }
  });
  // Ocultar barra de vistas según el ajuste
  document.getElementById('hide-viewbar-toggle').addEventListener('change', function() {
    var viewBar = document.getElementById('live-viewCount');
    if (this.checked) {
      viewBar.classList.add('hidden');
    } else {
      viewBar.classList.remove('hidden');
    }
  });
  // -------------------------------
  // Detección de Swipe (Deslizar a la izquierda/derecha)
  // -------------------------------
  // Para vista del Transmisor: ocultar/mostrar todos los controles
  var transmitterModal = document.getElementById("live-stream-modal");
  transmitterModal.addEventListener("touchstart", function(e) {
    touchstartX = e.changedTouches[0].screenX;

function openNoteModal() {
  document.getElementById('note-modal').classList.remove('hidden');
}

function closeNoteModal() {
  document.getElementById('note-modal').classList.add('hidden');
  document.getElementById('note-input').value = '';
}

function saveNote() {
  var noteText = document.getElementById('note-input').value.trim();
  var currentUser = firebase.auth().currentUser;

  if (!noteText || !currentUser) return;

  firebase.database().ref('profileNotes/' + currentUser.uid).set({
    text: noteText,
    timestamp: Date.now()
  }).then(() => {
    closeNoteModal();
    var profileNote = document.getElementById('profile-note');
    profileNote.classList.remove('hidden');
    document.getElementById('note-text').textContent = noteText;
    document.getElementById('note-time').textContent = 'Expira en 12 horas';
  });
}

  }, false);
  transmitterModal.addEventListener("touchend", function(e) {
    touchendX = e.changedTouches[0].screenX;
    handleTransmitterSwipe();
  }, false);

  function handleTransmitterSwipe() {
    if (touchstartX - touchendX > 50) {
      hideTransmitterFunctions();
    } else if (touchendX - touchstartX > 50) {
      showTransmitterFunctions();
    }
  }

  function hideTransmitterFunctions() {
    document.getElementById("live-settingsBtn").classList.add("hidden");
    document.getElementById("live-viewCount").classList.add("hidden");
    document.getElementById("live-tapCount").classList.add("hidden");
  }

  function showTransmitterFunctions() {
    document.getElementById("live-settingsBtn").classList.remove("hidden");
    if (!document.getElementById('hide-viewbar-toggle').checked) {
      document.getElementById("live-viewCount").classList.remove("hidden");
    }
    document.getElementById("live-tapCount").classList.remove("hidden");
  }
  // Para vista del Espectador: ocultar/mostrar funciones (regalos, likes)
  var viewerModal = document.getElementById("live-view-modal");
  viewerModal.addEventListener("touchstart", function(e) {
    touchstartX = e.changedTouches[0].screenX;
  }, false);
  viewerModal.addEventListener("touchend", function(e) {
    touchendX = e.changedTouches[0].screenX;
    handleViewerSwipe();
  }, false);

  function handleViewerSwipe() {
    if (touchstartX - touchendX > 50) {
      hideViewerFunctions();
    } else if (touchendX - touchstartX > 50) {
      showViewerFunctions();
    }
  }

  function hideViewerFunctions() {
    var sideButtons = document.querySelector(".side-buttons");
    if (sideButtons) {
      sideButtons.classList.add("hidden");
    }
    document.getElementById("viewer-tapCount").classList.add("hidden");
    document.getElementById("likeCountLiveViewer").classList.add("hidden");
  }

  function showViewerFunctions() {
    var sideButtons = document.querySelector(".side-buttons");
    if (sideButtons) {
      sideButtons.classList.remove("hidden");
    }
    document.getElementById("viewer-tapCount").classList.remove("hidden");
    document.getElementById("likeCountLiveViewer").classList.remove("hidden");
  }

// ===== BLOQUE JS 14 =====
/*********************** CONFIGURACIÓN DE FIREBASE **************************/
  // Configuración de la Base de Datos 1 (Principal)
  var firebaseConfig1 = {
    apiKey: "AIzaSyC9v2qp6zGtmvsFiOknlmTHnN6zZY1RLcI",
    authDomain: "ggggg-f2508.firebaseapp.com",
    databaseURL: "https://ggggg-f2508-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ggggg-f2508",
    storageBucket: "ggggg-f2508.firebasestorage.app",
    messagingSenderId: "120837533638",
    appId: "1:120837533638:web:dab060eedf39a6d19f4cc7",
    measurementId: "G-T6F45PFWRP"
  };

  // Configuración de la Base de Datos 2 (Secundaria)
  var firebaseConfig2 = {
    apiKey: "AIzaSyCFQ_geG0HIv2EZ-bfKc97TJNtf2sdqPzc",
    authDomain: "clack-koder.firebaseapp.com",
    databaseURL: "https://clack-koder-default-rtdb.firebaseio.com",
    projectId: "clack-koder",
    storageBucket: "clack-koder.firebasestorage.app",
    messagingSenderId: "478151254938",
    appId: "1:478151254938:web:95ab7e5e3f0ba1fc2b9023",
    measurementId: "G-LV2YB1BLLW"
  };

  // Inicializar ambas instancias
  var app1 = firebase.initializeApp(firebaseConfig1);
  var app2 = firebase.initializeApp(firebaseConfig2, "secondary");

  // Definir accesos globales para facilitar el uso en el código
  var db1 = app1.database();
  var db2 = app2.database();
  var auth1 = app1.auth();
  var auth2 = app2.auth();

  // Para mantener compatibilidad con el código existente que usa 'firebase.database()'
  // por defecto usaremos la instancia principal (app1).
  // Si necesitas enviar datos a la segunda, usa 'db2'.
  // Todos los usuarios están autorizados para transmitir en vivo
  var authorizedEmails = [];
  /*********************** FUNCIONES ADICIONALES **************************/
  function contienePalabrasOfensivas(texto) {
    // Lista de 20 palabras ofensivas en español (ejemplo; ajústala según tus necesidades)
    var listaOfensiva = [
      "imbécil", "idiota", "estúpido", "tarado", "pendejo",
      "capullo", "gilipollas", "subnormal", "malparido", "bobo",
      "tonto", "inútil", "cretino", "estúpida", "pendeja",
      "zorra", "perra", "mierda", "cabrón", "merda"
    ];
    // Normalizamos el texto: quitamos acentos y lo convertimos a minúsculas
    var textoNormalizado = texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    // Se busca cada término usando delimitadores para coincidir palabras completas
    return listaOfensiva.some(palabra => {
      var regex = new RegExp("\\b" + palabra + "\\b", "i");
      return regex.test(textoNormalizado);
    });
  }
  /*********************** VARIABLES Y ELEMENTOS DEL DOM **************************/
  var authForm = document.getElementById('authForm');
  var emailInput = document.getElementById('emailInput');
  var passwordInput = document.getElementById('passwordInput');
  var submitButton = document.getElementById('submitButton');
  var toggleAuth = document.getElementById('toggleAuth');
  var authError = document.getElementById('authError');
  var continueWithEmail = document.getElementById('continueWithEmail');
  var continueWithUsername = document.getElementById('continueWithUsername');
  var continueWithPhone = document.getElementById('continueWithPhone');
  var goToPasswordStep = document.getElementById('goToPasswordStep');
  var backToOptionsFromEmail = document.getElementById('backToOptionsFromEmail');
  var backToEmailStep = document.getElementById('backToEmailStep');
  var forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
  var sendRecoveryButton = document.getElementById('sendRecoveryButton');
  var backToPasswordFromRecovery = document.getElementById('backToPasswordFromRecovery');
  var recoveryEmailInput = document.getElementById('recoveryEmailInput');
  var selectedEmailLabel = document.getElementById('selectedEmailLabel');
  var authOptions = document.getElementById('auth-options');
  var emailStep = document.getElementById('email-step');
  var passwordStep = document.getElementById('password-step');
  var recoveryStep = document.getElementById('recovery-step');
  var authFormContainer = document.getElementById('auth-form');
  var mainApp = document.getElementById('main-app');
  var isLogin = true;
  var pendingEmail = '';
  var storyTypeSelected = "";
  var currentEditingStory = null;
  var currentChapters = [];
  var currentViewedAuthorId = null;
  var liveBroadcasterId = null;
  var currentChapterEditId = null;
  var currentLanguage = 'es';
  var translations = {
    es: {
      appName: "Drex",
      authTitle: "Drex",
      emailPlaceholder: "Correo electrónico",
      passwordPlaceholder: "Contraseña",
      btnIniciarSesion: "Iniciar Sesión",
      btnToggleAuth: "¿No tienes cuenta? Regístrate",
      btnVolver: "Volver",
      searchPlaceholder: "Buscar",
      searchResults: "Resultados",
      searchBooks: "Posts",
      searchAuthors: "Cuentas",
      profileStories: "Mis Publicaciones",
      editProfile: "Editar nombre",
      saveBio: "Guardar biografía",
      createStory: "Crear Historia",
      storyTitlePlaceholder: "Título de la historia",
      selectCategory: "Selecciona una categoría",
      btnCreateStory: "Crear Historia",
      editStory: "Editar Historia",
      addChapter: "Agregar Capítulo",
      deleteStory: "Eliminar Historia",
      makePrivate: "Hacer privada",
      chapterCreationTitle: "Agregar Nuevo Capítulo",
      chapterPlaceholder: "Escribe el contenido del capítulo aquí...",
      btnSaveChapter: "Guardar Capítulo",
      readChapter: "Capítulo",
      btnPrevChapter: "Anterior",
      btnNextChapter: "Siguiente",
      rateChapter: "Califica:",
      authorProfile: "Por",
      reportProfile: "Reportar Perfil",
      reportInstructions: "Selecciona un motivo o describe el problema:",
      btnSendReport: "Enviar Reporte",
      reportSuccess: "Reporte enviado con éxito. En breve recibirás una respuesta.",
      noInfraccion: "No se detectaron infracciones en este perfil.",
      followers: "Seguidores",
      following: "Siguiendo",
      ratings: "Calificaciones",
      languageModalTitle: "Selecciona tu idioma",
      editUsernamePrompt: "Introduce tu nuevo nombre de usuario:",
      usernameUpdated: "Nombre de usuario actualizado.",
      bioUpdated: "Biografía actualizada.",
      chapterAdded: "Capítulo agregado.",
      noEditingStory: "No hay historia en edición.",
      userNotAuthenticated: "Usuario no autenticado.",
      chapterNotFound: "Capítulo no encontrado.",
      firstChapter: "Este es el primer capítulo.",
      lastChapter: "Este es el último capítulo.",
      chapterRated: "Capítulo calificado con {value} estrella(s).",
      followSelfError: "No puedes seguirte a ti mismo.",
      nowFollowing: "Ahora sigues a este autor.",
      stoppedFollowing: "Has dejado de seguir a este autor.",
      alreadyFollowing: "Ya sigues a este usuario.",
      storyDeleted: "Historia eliminada.",
      editLater: "Puedes editar tu historia más tarde desde tu perfil."
    },
    en: {
      /* Traducciones en inglés */ },
    pt: {
      /* Traducciones en portugués */ }
  };

  function getVerificationIcon(email) {
    // Si el correo es uno de los que deben estar verificados,
    // se mostrará el icono nuevo.
    if (email === "darelvega6@icloud.com" || email === "glamworksappstv@gmail.com" || email === "linapaolaromero99@gmail.com") {
      return '<img src="https://static.vecteezy.com/system/resources/previews/028/084/106/original/verified-check-mark-icon-png.png" alt="Verificado" class="inline-block w-4 h-4 ml-1">';
    }
    return "";
  }

  function updateTranslations() {
    document.getElementById('app-name').innerText = translations[currentLanguage].appName;
    var taglineEl = document.getElementById('tagline');
    if (taglineEl) taglineEl.innerText = translations[currentLanguage].tagline;
    document.getElementById('auth-title').innerText = translations[currentLanguage].authTitle;
    emailInput.placeholder = translations[currentLanguage].emailPlaceholder;
    passwordInput.placeholder = translations[currentLanguage].passwordPlaceholder;
    submitButton.innerText = translations[currentLanguage].btnIniciarSesion;
    toggleAuth.innerText = translations[currentLanguage].btnToggleAuth;
    document.getElementById('btn-volver-search').innerText = translations[currentLanguage].btnVolver;
    document.getElementById('btn-volver-profile').innerText = translations[currentLanguage].btnVolver;
    document.getElementById('btn-volver-author').innerText = translations[currentLanguage].btnVolver;
    var newReleasesTitle = document.getElementById('new-releases-title');
    if (newReleasesTitle) newReleasesTitle.innerText = translations[currentLanguage].newReleases;
    var top10Title = document.getElementById('top10-title');
    if (top10Title) top10Title.innerText = translations[currentLanguage].top10;
    var popularTitle = document.getElementById('popular-title');
    if (popularTitle) popularTitle.innerText = translations[currentLanguage].popular;
    var terrorTitle = document.getElementById('terror-title');
    if (terrorTitle) terrorTitle.innerText = translations[currentLanguage].terror;
    document.getElementById('search-input').placeholder = translations[currentLanguage].searchPlaceholder;
    var searchPostsTitle = document.getElementById('search-posts-title');
    if (searchPostsTitle) searchPostsTitle.innerText = translations[currentLanguage].searchBooks;
    var searchAccountsTitle = document.getElementById('search-accounts-title');
    if (searchAccountsTitle) searchAccountsTitle.innerText = translations[currentLanguage].searchAuthors;
    var profilePostsTitle = document.getElementById('profile-posts-title');
    if (profilePostsTitle) profilePostsTitle.innerText = 'Publicaciones';
    document.getElementById('story-type-title').innerText = translations[currentLanguage].createStory;
    document.getElementById('create-story-title').innerText = translations[currentLanguage].createStory;
    document.getElementById('story-title').placeholder = translations[currentLanguage].storyTitlePlaceholder;
    document.getElementById('story-category').options[0].text = translations[currentLanguage].selectCategory;
    document.getElementById('btn-create-story').innerText = translations[currentLanguage].btnCreateStory;
    document.getElementById('edit-story-title').innerText = translations[currentLanguage].editStory;
    document.getElementById('chapter-creation-title').innerText = translations[currentLanguage].chapterCreationTitle;
    document.getElementById('chapter-content').placeholder = translations[currentLanguage].chapterPlaceholder;
    document.getElementById('btn-save-chapter').innerText = translations[currentLanguage].btnSaveChapter;
    var detailSynopsis = document.getElementById('detail-synopsis');
    var detailMetrics = document.getElementById('detail-metrics');
    if (detailSynopsis) {
      detailSynopsis.innerText = "Sinopsis de la historia...";
    }
    if (detailMetrics) {
      detailMetrics.innerHTML =
        `<span><strong>0</strong> Visitas</span>
           <span><strong>0</strong> ${translations[currentLanguage].ratings}</span>
           <span><strong>0</strong> Capítulos</span>`;
    }
    document.getElementById('report-title').innerText = translations[currentLanguage].reportProfile;
    document.getElementById('report-instructions').innerText = translations[currentLanguage].reportInstructions;
    document.getElementById('btn-enviar-report').innerText = translations[currentLanguage].btnSendReport;
    document.getElementById('lang-modal-title').innerText = translations[currentLanguage].languageModalTitle;
  }

  function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem("selectedLanguage", lang);
    var langOverlay = document.getElementById('lang-loading-overlay');
    langOverlay.style.display = "flex";
    setTimeout(() => {
      updateTranslations();
      langOverlay.style.display = "none";
      document.getElementById('language-modal').style.display = "none";
    }, 1000);
  }
  window.addEventListener('load', () => {
    setTimeout(() => {
      var splash = document.getElementById('splash-screen');
      splash.style.opacity = '0';
      setTimeout(() => {
        splash.style.display = 'none';
      }, 1000);
    }, 3000);
  });
  /*********************** NOTIFICACIONES **************************/
  async function addNotification(userId, message, type = 'info') {
    var notificationsRef = firebase.database().ref('notifications/' + userId);
    var newNotificationRef = notificationsRef.push();
    newNotificationRef.set({
      message: message,
      timestamp: Date.now(),
      read: false,
      type: type,
      notificationId: newNotificationRef.key
    });

    // Play sound based on notification type
    var audio = new Audio();
    switch(type) {
      case 'follow':
        audio.src = 'https://assets.mixkit.co/active_storage/sfx/213/213.wav';
        break;
      case 'like':
        audio.src = 'https://assets.mixkit.co/active_storage/sfx/208/208.wav';
        break;
      case 'comment':
        audio.src = 'https://assets.mixkit.co/active_storage/sfx/221/221.wav';
        break;
      case 'vote':
        audio.src = 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3';
        break;
      default:
        audio.src = 'https://assets.mixkit.co/active_storage/sfx/206/206.wav';
    }
    audio.play().catch(e => console.log('Audio play failed:', e));

    // Handle notifications for both mobile and desktop
    if ('Notification' in window) {
      if (Notification.permission === "granted") {
        new Notification("Drex", {
          body: message,
          icon: "https://cdn-icons-png.flaticon.com/512/907/907822.png",
          vibrate: [200, 100, 200]
        });
      } else if (Notification.permission !== "denied") {
        // Request permission on mobile
        try {
          var permission = await Notification.requestPermission();
          if (permission === "granted") {
            new Notification("Drex", {
              body: message,
              icon: "https://cdn-icons-png.flaticon.com/512/907/907822.png",
              vibrate: [200, 100, 200]
            });
          }
        } catch (error) {
          console.log('Notification permission error:', error);
        }
      }
    }

    // Fallback vibration for mobile devices
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
}

  var notificationsListenerRef = null;
  var notificationsBadgeRef = null;

  function setupNotificationsBadge(userId) {
    var badge = document.getElementById('unread-notifications-count');
    if (!badge) return;

    if (notificationsBadgeRef) {
      notificationsBadgeRef.off('value');
      notificationsBadgeRef = null;
    }

    notificationsBadgeRef = firebase.database().ref('notifications/' + userId);
    notificationsBadgeRef.on('value', snapshot => {
      var unread = 0;
      snapshot.forEach(child => {
        var n = child.val();
        if (!n || !n.read) unread++;
      });

      if (unread > 0) {
        badge.textContent = unread > 99 ? '99+' : String(unread);
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
        badge.textContent = '0';
      }
    });
  }

  function clearNotificationsBadge() {
    var badge = document.getElementById('unread-notifications-count');
    if (badge) {
      badge.classList.add('hidden');
      badge.textContent = '0';
    }

    if (notificationsBadgeRef) {
      notificationsBadgeRef.off('value');
      notificationsBadgeRef = null;
    }
  }

  function openNotifications() {
    var currentUser = firebase.auth().currentUser;
    if (!currentUser) {
      alert('Debes iniciar sesión para ver notificaciones');
      return;
    }

    // iPhone/Safari: evitar dependencias que no existan (Notification / fullscreen)
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== "granted") {
      Notification.requestPermission().catch(() => {});
    }

    var modal = document.getElementById('notifications-modal');
    var notificationsList = document.getElementById('notifications-list');
    if (!modal || !notificationsList) return;

    modal.classList.remove('hidden');
    setBottomNavVisibility(false);

    // Evitar listeners duplicados al abrir/cerrar repetidas veces
    if (notificationsListenerRef) {
      notificationsListenerRef.off('value');
      notificationsListenerRef = null;
    }

    notificationsListenerRef = firebase.database().ref('notifications/' + currentUser.uid);
    notificationsListenerRef.on('value', snapshot => {
      notificationsList.innerHTML = "";

      if (!snapshot.exists()) {
        notificationsList.innerHTML = '<p class="text-gray-500 text-sm">No tienes notificaciones por ahora.</p>';
        return;
      }

      var items = [];
      snapshot.forEach(child => {
        items.push({ id: child.key, ...child.val() });
      });
      items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

      items.forEach(notification => {
        var div = document.createElement('div');
        div.className = `notification-item ${notification.type || 'info'}`;

        var iconMap = {
          follow: 'user-plus',
          like: 'heart',
          comment: 'comment',
          vote: 'arrow-up',
          message: 'envelope',
          moderation: 'shield-alt',
          chapter_published: 'book-open',
          info: 'info-circle'
        };

        div.innerHTML = `
          <i class="fas fa-${iconMap[notification.type || 'info'] || 'info-circle'} mt-0.5"></i>
          <div class="flex-1 min-w-0">
            <div class="notification-message break-words">${notification.message || 'Notificación'}</div>
            <div class="notification-time">${notification.timestamp ? new Date(notification.timestamp).toLocaleString() : ''}</div>
          </div>
          <button class="notification-delete-btn" aria-label="Eliminar notificación">Eliminar</button>
          ${!notification.read ? '<span class="unread-dot"></span>' : ''}
        `;

        var deleteBtn = div.querySelector('.notification-delete-btn');
        if (deleteBtn) {
          deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            firebase.database().ref('notifications/' + currentUser.uid + '/' + notification.id).remove();
          });
        }

        div.addEventListener('click', () => {
          if (!notification.read) {
            firebase.database().ref('notifications/' + currentUser.uid + '/' + notification.id).update({ read: true });
          }
        });

        notificationsList.appendChild(div);
      });
    });
  }

  function closeNotifications() {
    var modal = document.getElementById('notifications-modal');
    if (modal) modal.classList.add('hidden');
    setBottomNavVisibility(true);

    if (notificationsListenerRef) {
      notificationsListenerRef.off('value');
      notificationsListenerRef = null;
    }
  }
  /*********************** UTILIDADES DE FORMATO **************************/
  function formatNumber(num) {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  }

  function formatVoteScore(score) {
    var numericScore = Number(score || 0);
    if (numericScore === 0) return '0';
    var absValue = Math.abs(numericScore);
    var compact = formatNumber(absValue);
    return numericScore > 0 ? `${compact}` : `-${compact}`;
  }

  /*********************** AUTENTICACIÓN **************************/
  function showAuthSection(section) {
    authOptions.classList.add('hidden');
    emailStep.classList.add('hidden');
    passwordStep.classList.add('hidden');
    recoveryStep.classList.add('hidden');
    section.classList.remove('hidden');
    authError.classList.add('hidden');
  }

  continueWithEmail.addEventListener('click', () => {
    showAuthSection(emailStep);
  });

  continueWithUsername.addEventListener('click', () => {
    alert('Inicio con nombre de usuario disponible próximamente.');
  });

  continueWithPhone.addEventListener('click', () => {
    alert('Inicio con teléfono disponible próximamente.');
  });

  backToOptionsFromEmail.addEventListener('click', () => {
    showAuthSection(authOptions);
  });

  goToPasswordStep.addEventListener('click', () => {
    var email = emailInput.value.trim();
    if (!email) {
      showAuthSection(emailStep);
      authError.textContent = 'Por favor ingresa tu correo electrónico.';
      authError.classList.remove('hidden');
      return;
    }
    pendingEmail = email;
    selectedEmailLabel.textContent = `Correo: ${pendingEmail}`;
    showAuthSection(passwordStep);
  });

  backToEmailStep.addEventListener('click', () => {
    showAuthSection(emailStep);
  });

  forgotPasswordBtn.addEventListener('click', () => {
    recoveryEmailInput.value = pendingEmail || emailInput.value.trim();
    showAuthSection(recoveryStep);
  });

  backToPasswordFromRecovery.addEventListener('click', () => {
    showAuthSection(passwordStep);
  });

  sendRecoveryButton.addEventListener('click', () => {
    resetPassword();
  });

  toggleAuth.addEventListener('click', () => {
    isLogin = !isLogin;
    submitButton.textContent = isLogin ? translations[currentLanguage].btnIniciarSesion : 'Registrarse';
    toggleAuth.textContent = isLogin ? translations[currentLanguage].btnToggleAuth : '¿Ya tienes cuenta? Inicia sesión';
  });

  authForm.addEventListener('submit', e => {
    e.preventDefault();
    authError.classList.add('hidden');
    var email = pendingEmail || emailInput.value.trim();
    var password = passwordInput.value;
    if (!email) {
      showAuthSection(emailStep);
      authError.textContent = 'Por favor ingresa tu correo electrónico.';
      authError.classList.remove('hidden');
      return;
    }
    if (isLogin) {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(userCredential => {
          console.log("Usuario autenticado:", userCredential.user);
        })
        .catch(error => {
          console.error(error);
          authError.textContent = error.message;
          authError.classList.remove('hidden');
        });
    } else {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          var user = userCredential.user;
          var userCountRef = firebase.database().ref('userCount');
          userCountRef.transaction(count => (count || 0) + 1).then(result => {
            var newCount = result.snapshot.val();
            var isVerified = newCount <= 100;
            firebase.database().ref('users/' + user.uid).set({
              username: "Nuevo Usuario",
              bio: "",
              profileImage: "",
              followersCount: 0,
              followingCount: 0,
              ratedCount: 0,
              isVerified: isVerified,
              registrationTimestamp: Date.now(),
              founder: false,
              email: user.email
            });
          });
        })
        .catch(error => {
          console.error(error);
          authError.textContent = error.message;
          authError.classList.remove('hidden');
        });
    }
  });

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      if (authorizedEmails.includes(user.email)) {
        document.getElementById('live-transmit-btn').style.display = "block";
      } else {
        document.getElementById('live-transmit-btn').style.display = "none";
      }

      // INICIALIZAR SISTEMA DE MONEDAS de manera consistente
      setupNotificationsBadge(user.uid);

      // CARGAR ESTADÍSTICAS EN TIEMPO REAL
      loadUserStats(user.uid);
      setupBlockedAccountsListener(user.uid);

      firebase.database().ref('users/' + user.uid).once('value').then(snapshot => {
        var data = snapshot.val();
        if (data && data.blocked && data.blockedUntil && Date.now() < data.blockedUntil) {
          alert("Tu cuenta ha sido bloqueada por infracciones. Por favor, contacta con el soporte para recuperar el acceso.");
          firebase.auth().signOut();
          return;
        }
        authFormContainer.classList.add('hidden');
        mainApp.classList.remove('hidden');
        loadStories();

        // INICIALIZAR SISTEMA DE MONEDAS
  
        if (data) {
          var displayName = data.username || "Usuario";
          if (data.founder) {
            displayName += ' <span class="founder-tag">Fundador</span>';
          }
          displayName += getVerificationIcon(data.email);

          // Actualizar perfil móvil
          document.getElementById('profile-username').innerHTML = displayName;
          document.getElementById('profile-followers').textContent = formatNumber(data.followersCount || 0);
          document.getElementById('profile-following').textContent = formatNumber(data.followingCount || 0);

          // Actualizar perfil desktop
          var usernameDesktop = document.getElementById('profile-username-desktop');
          var followersDesktop = document.getElementById('profile-followers-desktop');
          var followingDesktop = document.getElementById('profile-following-desktop');

          if (usernameDesktop) usernameDesktop.innerHTML = displayName;
          if (followersDesktop) followersDesktop.textContent = formatNumber(data.followersCount || 0);
          if (followingDesktop) followingDesktop.textContent = formatNumber(data.followingCount || 0);

          if (data.bio) {
            var bioElement = document.getElementById('profile-bio');
            if (bioElement) bioElement.value = data.bio;
          }
          if (data.profileImage) {
            var profileImage = document.getElementById('profile-image');
            if (profileImage) profileImage.src = data.profileImage;

            var profileImageDesktop = document.getElementById('profile-image-desktop');
            if (profileImageDesktop) profileImageDesktop.src = data.profileImage;

            // Vincular foto en la barra superior (header)
            var headerProfileImage = document.getElementById('header-profile-image');
            if (headerProfileImage) headerProfileImage.src = data.profileImage;

            // Vincular foto en el modal de edición
            var editProfileImageMobile = document.getElementById('edit-profile-image-mobile');
            if (editProfileImageMobile) editProfileImageMobile.src = data.profileImage;
          }

          loadUserFrame(user.uid, 'profile-frame');
          loadUserFrame(user.uid, 'profile-frame-desktop');
        }
      });
    } else {
      clearNotificationsBadge();
      authFormContainer.classList.remove('hidden');
      mainApp.classList.add('hidden');
    }
  });
  /*********************** AUTENTICACIÓN CON GOOGLE Y FACEBOOK **************************/
  function signInWithGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        console.log("Google sign-in successful:", result.user);
      })
      .catch(error => {
        console.error("Error al iniciar sesión con Google:", error);
      });
  }

  function signInWithFacebook() {
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        console.log("Facebook sign-in successful:", result.user);
      })
      .catch(error => {
        console.error("Error al iniciar sesión con Facebook:", error);
      });
  }
  /*********************** CERRAR SESIÓN CON SPINNER **************************/
  function signOutUser() {
    var spinner = document.getElementById('signout-spinner');
    spinner.style.display = "flex";
    setTimeout(() => {
      firebase.auth().signOut()
        .then(() => {
          spinner.style.display = "none";
          alert("Has cerrado sesión.");
        })
        .catch(error => {
          spinner.style.display = "none";
          console.error("Error al cerrar sesión:", error);
        });
    }, 3000);
  }
  /*********************** OLVIDÉ MI CONTRASEÑA **************************/
  function resetPassword() {
    var email = (recoveryEmailInput.value || pendingEmail || emailInput.value).trim();
    if (!email) {
      alert("Por favor, ingresa tu correo electrónico para restablecer la contraseña.");
      return;
    }
    firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        alert("Se ha enviado un correo para restablecer tu contraseña.");
        showAuthSection(passwordStep);
      })
      .catch(error => {
        alert("Error al enviar el correo: " + error.message);
      });
  }
  /*********************** SOPORTE **************************/
  function openSupportModal() {
    var supportModal = document.getElementById('support-modal');
    supportModal.style.zIndex = 9999;
    supportModal.style.display = "block";
  }

  function closeSupportModal() {
    document.getElementById('support-modal').style.display = "none";
  }
  document.getElementById('support-form').addEventListener('submit', e => {
    e.preventDefault();
    var subject = document.getElementById('support-subject').value;
    var message = document.getElementById('support-message').value;
    var user = firebase.auth().currentUser;
    if (!user) return;
    var supportData = {
      userId: user.uid,
      subject,
      message,
      timestamp: Date.now(),
      status: "pending"
    };
    firebase.database().ref('supportRequests').push(supportData)
      .then(() => {
        alert("Tu solicitud ha sido enviada. Pronto recibirás una respuesta.");
        closeSupportModal();
      })
      .catch(error => {
        console.error("Error al enviar solicitud de soporte:", error);
      });
  });
  /*********************** NAVEGACIÓN Y MODALES **************************/



  function openStoryEdit(story) {
    currentEditingStory = story;
    document.getElementById('edit-story-language').value = story.language || "";
    firebase.database().ref('stories/' + story.id + '/chapters').on('value', snapshot => {
      currentChapters = [];
      var chapterListDiv = document.getElementById('chapter-list');
      chapterListDiv.innerHTML = "";
      snapshot.forEach(child => {
        var chapter = child.val();
        chapter.id = child.key;
        currentChapters.push(chapter);
      });
      currentChapters.sort((a, b) => a.chapterNumber - b.chapterNumber);
      currentChapters.forEach(chapter => {
        var div = document.createElement('div');
        div.className = "flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-200 rounded-xl mb-2";
        var chapterInfo = document.createElement('div');
        chapterInfo.innerHTML = `<span class="font-semibold">${translations[currentLanguage].readChapter} ${chapter.chapterNumber}</span>`;
        var btnContainer = document.createElement('div');
        btnContainer.className = "flex space-x-2 mt-2 sm:mt-0";
        var editButton = document.createElement('button');
        editButton.className = "bg-blue-500 text-white px-2 py-1 rounded";
        editButton.textContent = "Editar";
        editButton.onclick = () => openChapterEditModal(chapter);
        var deleteButton = document.createElement('button');
        deleteButton.className = "bg-red-500 text-white px-2 py-1 rounded";
        deleteButton.textContent = "Eliminar";
        deleteButton.onclick = () => deleteChapter(chapter.id);
        btnContainer.appendChild(editButton);
        btnContainer.appendChild(deleteButton);
        div.appendChild(chapterInfo);
        div.appendChild(btnContainer);
        chapterListDiv.appendChild(div);
      });
    });
    document.getElementById('story-edit-view').classList.remove('hidden');
  }

  function closeStoryEdit() {
    document.getElementById('story-edit-view').classList.add('hidden');
    alert(translations[currentLanguage].editLater);
  }

  function saveStoryEdits() {
    if (!currentEditingStory) {
      alert(translations[currentLanguage].noEditingStory);
      return;
    }
    var newLanguage = document.getElementById('edit-story-language').value;
    firebase.database().ref('stories/' + currentEditingStory.id).update({
        language: newLanguage
      })
      .then(() => {
        currentEditingStory.language = newLanguage;
        alert("Cambios guardados en la historia.");
      })
      .catch(error => {
        console.error("Error al actualizar la historia:", error);
      });
  }

  function openProfile() {
    mainApp.classList.add('hidden');
    document.getElementById('profile-view').classList.remove('hidden');
  }


  function openProfileSettings() {
    document.getElementById('settings-view').classList.remove('hidden');
  }

  function closeSettingsView() {
    document.getElementById('settings-view').classList.add('hidden');
  }

  function openProfileConfig() {
    var user = firebase.auth().currentUser;
    if (user) {
      firebase.database().ref('users/' + user.uid).once('value').then(snapshot => {
        var data = snapshot.val() || {};
        var usernameInput = document.getElementById('settings-username');
        var infoInput = document.getElementById('settings-info');
        if (usernameInput) usernameInput.value = data.username || "";
        if (infoInput) {
          infoInput.value = data.bio || "";
          updateInfoCounter();
        }
        selectedPronounsOption = data.pronouns || "";
        renderPronounsSelection();
      });
    }
    document.getElementById('profile-config-view').classList.remove('hidden');
  }

  function closeProfileConfig() {
    document.getElementById('profile-config-view').classList.add('hidden');
  }

  function openUpdatePhotoView() {
    var currentPhoto = document.getElementById('profile-image').src;
    document.getElementById('new-profile-preview').src = currentPhoto;
    document.getElementById('update-photo-view').classList.remove('hidden');
  }

  function closeUpdatePhotoView() {
    document.getElementById('update-photo-view').classList.add('hidden');
  }

  var selectedPronounsOption = "";

  function openUsernameConfigView() {
    document.getElementById('username-config-view').classList.remove('hidden');
  }

  function closeUsernameConfigView() {
    document.getElementById('username-config-view').classList.add('hidden');
  }

  function openInfoConfigView() {
    updateInfoCounter();
    document.getElementById('info-config-view').classList.remove('hidden');
  }

  function closeInfoConfigView() {
    document.getElementById('info-config-view').classList.add('hidden');
  }

  function openPronounsConfigView() {
    renderPronounsSelection();
    document.getElementById('pronouns-config-view').classList.remove('hidden');
  }

  function closePronounsConfigView() {
    document.getElementById('pronouns-config-view').classList.add('hidden');
  }

  function updateInfoCounter() {
    var infoInput = document.getElementById('settings-info');
    var counter = document.getElementById('settings-info-counter');
    if (infoInput && counter) {
      counter.textContent = `${infoInput.value.length}/50`;
    }
  }

  document.getElementById('settings-info')?.addEventListener('input', updateInfoCounter);

  function selectPronounsOption(value) {
    selectedPronounsOption = value;
    renderPronounsSelection();
  }

  function renderPronounsSelection() {
    document.querySelectorAll('.pronouns-option').forEach(btn => {
      var isActive = btn.textContent.trim() === selectedPronounsOption;
      btn.classList.toggle('border-[#5f4b44]', isActive);
      btn.classList.toggle('bg-[#f0ebe7]', isActive);
    });
  }

  function saveUsernameConfig() {
    var input = document.getElementById('settings-username');
    saveProfileField({ username: input ? input.value.trim() : "" }, true).then(saved => {
      if (saved) closeUsernameConfigView();
    });
  }

  function saveInfoConfig() {
    var info = (document.getElementById('settings-info')?.value || "").slice(0, 50);
    saveProfileField({ bio: info }).then(saved => {
      if (saved) closeInfoConfigView();
    });
  }

  function savePronounsConfig() {
    if (!selectedPronounsOption) {
      alert("Selecciona una opción de pronombres.");
      return;
    }
    saveProfileField({ pronouns: selectedPronounsOption }).then(saved => {
      if (saved) closePronounsConfigView();
    });
  }

  function saveProfileField(partialUpdates, validateUsername = false) {
    var user = firebase.auth().currentUser;
    if (!user) return Promise.resolve(false);
    return firebase.database().ref('users/' + user.uid).once('value').then(snapshot => {
      var userData = snapshot.val() || {};
      var updates = { ...partialUpdates };

      if (validateUsername) {
        var nextUsername = (updates.username || "").trim();
        if (!nextUsername) {
          alert("El nombre de usuario no puede estar vacío.");
          return false;
        }
        var lastUsernameChange = userData.lastUsernameChange || 0;
        var timeSinceLastChange = Date.now() - lastUsernameChange;
        var USERNAME_CHANGE_COOLDOWN = 7 * 24 * 60 * 60 * 1000;
        if (nextUsername !== userData.username && timeSinceLastChange < USERNAME_CHANGE_COOLDOWN) {
          var daysLeft = Math.ceil((USERNAME_CHANGE_COOLDOWN - timeSinceLastChange) / (24 * 60 * 60 * 1000));
          alert(`No puedes cambiar tu nombre de usuario hasta dentro de ${daysLeft} días.`);
          return false;
        }
        if (nextUsername !== userData.username) {
          updates.lastUsernameChange = Date.now();
        }
      }

      return firebase.database().ref('users/' + user.uid).update(updates).then(() => {
        if (updates.username) {
          var newName = updates.username;
          if (userData.founder) newName += ' <span class="founder-tag">Fundador</span>';
          newName += getVerificationIcon(userData.email || user.email);
          var usernameLabel = document.getElementById('profile-username');
          if (usernameLabel) usernameLabel.innerHTML = newName;
        }
        alert("Perfil actualizado");
        return true;
      }).catch(error => {
        console.error("Error al guardar cambios del perfil:", error);
        return false;
      });
    });
  }

  function previewNewPhoto(event) {
    var file = event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById('new-profile-preview').src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  function saveNewProfilePhoto() {
    var user = firebase.auth().currentUser;
    if (!user) return;

    var fileInput = document.getElementById('new-profile-image-input');
    var saveBtn = document.getElementById('save-photo-btn');
    
    if (!fileInput.files.length) {
      alert("No has seleccionado ninguna foto nueva.");
      return;
    }

    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    var file = fileInput.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
      var base64Image = e.target.result;
      
      // Actualizar en ambas bases de datos
      var p1 = db1.ref('users/' + user.uid).update({ profileImage: base64Image });
      var p2 = db2.ref('users/' + user.uid).update({ profileImage: base64Image });

      Promise.all([p1, p2]).then(() => {
        document.getElementById('profile-image').src = base64Image;
        var desktopImg = document.getElementById('profile-image-desktop');
        if (desktopImg) desktopImg.src = base64Image;
        
        saveBtn.disabled = false;
        saveBtn.innerHTML = 'Guardar';
        alert("¡Foto de perfil actualizada correctamente!");
        closeUpdatePhotoView();
      }).catch(err => {
        console.error("Error al guardar la foto:", err);
        saveBtn.disabled = false;
        saveBtn.innerHTML = 'Guardar';
        alert("Hubo un error al guardar la foto.");
      });
    };
    reader.readAsDataURL(file);
  }

  function openHome() {
    document.getElementById('community-view').classList.add('hidden');
    document.getElementById('creator-hub-view').classList.add('hidden');
    document.getElementById('profile-view').classList.add('hidden');
    document.getElementById('search-view').classList.add('hidden');
    document.getElementById('games-view').classList.add('hidden');
    document.getElementById('game-detail-overlay')?.classList.add('hidden');
    document.getElementById('game-detail-sheet')?.classList.add('hidden', 'translate-y-full');
    document.getElementById('game-loading-view')?.classList.add('hidden');
    document.getElementById('tic-tac-toe-view')?.classList.add('hidden');
    document.getElementById('games-avatar-studio-view')?.classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    loadNotes();
  }

  function openGamesView() {
    document.getElementById('main-app').classList.add('hidden');
    document.getElementById('community-view').classList.add('hidden');
    document.getElementById('creator-hub-view').classList.add('hidden');
    document.getElementById('profile-view').classList.add('hidden');
    document.getElementById('search-view').classList.add('hidden');
    document.getElementById('games-view').classList.remove('hidden');
    initializeGamesSection();
  }

  var GAMES_VERIFY_KEY = 'drex_games_verified_v1';
  var GAMES_CATALOG = [
    {
      id: 'cero-y-cruz',
      title: 'Cero y Cruz',
      description: 'Reta tu mente en partidas rápidas de tres en línea contra la IA de Drex.',
      image: 'https://i.ibb.co/YVg3RLz/IMG-0009.png'
    },
  ];
  var selectedGame = null;
  var gameBoardState = Array(9).fill('');
  var gameCurrentTurn = 'X';
  var gameLocked = false;
  var gamesSearchTimer = null;

  function getGamesVerifyState() {
    try {
      return JSON.parse(localStorage.getItem(GAMES_VERIFY_KEY) || '{}');
    } catch (_) {
      return {};
    }
  }

  function setGamesVerifyState(payload) {
    localStorage.setItem(GAMES_VERIFY_KEY, JSON.stringify(payload));
  }

  function getCurrentUserVerificationFlag() {
    var user = firebase.auth().currentUser;
    var key = user?.uid || 'guest';
    var state = getGamesVerifyState();
    return Boolean(state[key]);
  }

  function markCurrentUserVerified() {
    var user = firebase.auth().currentUser;
    var key = user?.uid || 'guest';
    var state = getGamesVerifyState();
    state[key] = true;
    setGamesVerifyState(state);
  }

  function initializeGamesSection() {
    var verified = getCurrentUserVerificationFlag();
    document.getElementById('games-verify-screen')?.classList.toggle('hidden', verified);
    document.getElementById('games-catalog-section')?.classList.toggle('hidden', !verified);
    document.getElementById('games-verifying-screen')?.classList.add('hidden');
    document.getElementById('games-success-screen')?.classList.add('hidden');
    var slider = document.getElementById('games-verify-slider');
    if (slider) slider.value = 0;

    var user = firebase.auth().currentUser;
    var profileSrc = user?.photoURL || user?.providerData?.[0]?.photoURL || 'https://via.placeholder.com/90';
    document.getElementById('games-profile-photo').src = profileSrc;
    document.getElementById('games-profile-name').textContent = user?.displayName || user?.email?.split('@')[0] || 'Creador';
    document.getElementById('game-player-avatar').src = profileSrc;
    document.getElementById('games-header-avatar').src = profileSrc;
    renderGamesCatalog('', true);
  }

  function handleGamesVerificationSlide(event) {
    var value = Number(event?.target?.value || 0);
    if (value < 98) return;
    var slider = document.getElementById('games-verify-slider');
    if (slider) slider.disabled = true;
    document.getElementById('games-verify-screen')?.classList.add('hidden');
    document.getElementById('games-verifying-screen')?.classList.remove('hidden');

    setTimeout(() => {
      document.getElementById('games-verifying-screen')?.classList.add('hidden');
      document.getElementById('games-success-screen')?.classList.remove('hidden');
      launchGamesConfetti();
      markCurrentUserVerified();
      setTimeout(() => {
        document.getElementById('games-success-screen')?.classList.add('hidden');
        document.getElementById('games-catalog-section')?.classList.remove('hidden');
        if (slider) {
          slider.value = 0;
          slider.disabled = false;
        }
      }, 1800);
    }, 1300);
  }

  function launchGamesConfetti() {
    var wrap = document.getElementById('games-confetti');
    if (!wrap) return;
    wrap.innerHTML = '';
    for (let i = 0; i < 22; i++) {
      var dot = document.createElement('span');
      dot.style.position = 'absolute';
      dot.style.width = '8px';
      dot.style.height = '8px';
      dot.style.borderRadius = '999px';
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.top = '-12px';
      dot.style.background = ['#FE2C55', '#7fd5ff', '#ffd86f', '#92ffb0'][Math.floor(Math.random() * 4)];
      dot.style.opacity = '0.95';
      dot.style.transition = `transform ${800 + Math.random() * 700}ms ease-out, opacity 900ms ease-out`;
      wrap.appendChild(dot);
      requestAnimationFrame(() => {
        dot.style.transform = `translateY(${90 + Math.random() * 90}px) translateX(${(Math.random() - 0.5) * 80}px) rotate(${Math.random() * 300}deg)`;
        dot.style.opacity = '0';
      });
    }
  }

  function renderGamesCatalog(query = '', instant = false) {
    var q = `${query || ''}`.trim().toLowerCase();
    var loading = document.getElementById('games-search-loading');
    var trending = document.getElementById('games-trending-carousel');
    var list = document.getElementById('games-results-list');
    if (!trending || !list) return;
    if (gamesSearchTimer) {
      clearTimeout(gamesSearchTimer);
      gamesSearchTimer = null;
    }
    if (!instant && loading) loading.classList.remove('hidden');

    var run = () => {
      var filtered = GAMES_CATALOG.filter(game => !q || game.title.toLowerCase().includes(q) || game.description.toLowerCase().includes(q));
      trending.innerHTML = filtered.map(game => `
        <button onclick="openGameDetailSheet('${game.id}')" class="game-square-card text-left bg-white border border-[#e8e1dc] rounded-2xl p-2 shadow-sm">
          <img src="${game.image}" class="w-full aspect-square rounded-xl object-cover">
          <p class="mt-2 text-sm font-black text-[#2f1a14] truncate">${escapeHtml(game.title)}</p>
        </button>
      `).join('') || '<p class="text-sm text-[#8d7d75]">No encontramos juegos.</p>';

      list.innerHTML = filtered.map(game => `
        <button onclick="openGameDetailSheet('${game.id}')" class="w-full p-2 bg-white rounded-2xl border border-[#e8e1dc] text-left">
          <img src="${game.image}" class="w-full aspect-square rounded-xl object-cover">
          <p class="mt-2 text-sm font-black text-[#2f1a14] truncate">${escapeHtml(game.title)}</p>
        </button>
      `).join('');
      if (!filtered.length) {
        list.innerHTML = '<div class="col-span-2 bg-white border border-[#e8e1dc] rounded-3xl p-5 text-sm text-[#8d7d75]">No encontramos juegos.</div>';
      }
      if (loading) loading.classList.add('hidden');
    };

    if (instant) {
      run();
      return;
    }
    gamesSearchTimer = setTimeout(run, 550);
  }

  function openGameDetailSheet(gameId) {
    selectedGame = GAMES_CATALOG.find(game => game.id === gameId) || null;
    if (!selectedGame) return;
    document.getElementById('game-detail-title').textContent = selectedGame.title;
    document.getElementById('game-detail-description').textContent = selectedGame.description;
    document.getElementById('game-detail-image').src = selectedGame.image;
    document.getElementById('game-detail-overlay').classList.remove('hidden');
    var sheet = document.getElementById('game-detail-sheet');
    sheet.classList.remove('hidden');
    requestAnimationFrame(() => sheet.classList.remove('translate-y-full'));
  }

  function closeGameDetailSheet() {
    var sheet = document.getElementById('game-detail-sheet');
    sheet.classList.add('translate-y-full');
    setTimeout(() => {
      sheet.classList.add('hidden');
      document.getElementById('game-detail-overlay').classList.add('hidden');
    }, 280);
  }

  function enterSelectedGame() {
    if (!selectedGame) return;
    closeGameDetailSheet();
    document.getElementById('game-loading-title').textContent = selectedGame.title;
    document.getElementById('game-loading-image').src = selectedGame.image;
    document.getElementById('game-loading-view').classList.remove('hidden');
    setTimeout(() => {
      document.getElementById('game-loading-view').classList.add('hidden');
      openTicTacToeGame();
    }, 1500);
  }

  function openTicTacToeGame() {
    gameBoardState = Array(9).fill('');
    gameCurrentTurn = 'X';
    gameLocked = false;
    var grid = document.getElementById('tic-tac-toe-grid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      var cell = document.createElement('button');
      cell.className = 'aspect-square rounded-2xl bg-white border border-[#e8e1dc] text-3xl font-black text-[#3a241d]';
      cell.onclick = () => handleTicTacToeMove(i, cell);
      grid.appendChild(cell);
    }
    document.getElementById('tic-tac-toe-status').textContent = 'Tu turno: X';
    document.getElementById('tic-tac-toe-view').classList.remove('hidden');
  }

  function handleTicTacToeMove(index, cell) {
    if (gameLocked || gameBoardState[index]) return;
    gameBoardState[index] = gameCurrentTurn;
    cell.textContent = gameCurrentTurn;
    if (evaluateTicTacToeWinner(gameCurrentTurn)) {
      document.getElementById('tic-tac-toe-status').textContent = `Ganó ${gameCurrentTurn}`;
      gameLocked = true;
      return;
    }
    if (gameBoardState.every(Boolean)) {
      document.getElementById('tic-tac-toe-status').textContent = 'Empate';
      gameLocked = true;
      return;
    }
    gameCurrentTurn = gameCurrentTurn === 'X' ? 'O' : 'X';
    document.getElementById('tic-tac-toe-status').textContent = `Turno: ${gameCurrentTurn}`;
  }

  function evaluateTicTacToeWinner(player) {
    var wins = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    return wins.some(combo => combo.every(idx => gameBoardState[idx] === player));
  }

  function exitCurrentGame() {
    document.getElementById('tic-tac-toe-view').classList.add('hidden');
  }

  function openGamesAvatarStudio() {
    document.getElementById('games-avatar-studio-view')?.classList.remove('hidden');
  }

  function closeGamesAvatarStudio() {
    document.getElementById('games-avatar-studio-view')?.classList.add('hidden');
  }

  function setAvatarStudioTab(tab) {
    var market = document.getElementById('avatar-tab-market');
    var custom = document.getElementById('avatar-tab-custom');
    var isMarket = tab !== 'custom';
    market?.classList.toggle('bg-[#d8d7df]', isMarket);
    market?.classList.toggle('text-[#2f1a14]', isMarket);
    custom?.classList.toggle('bg-[#d8d7df]', !isMarket);
    custom?.classList.toggle('text-[#2f1a14]', !isMarket);
  }

  function applyAvatarStyle(head, torso, leg) {
    var root = document.getElementById('avatar-3d-preview');
    if (!root) return;
    root.querySelector('.head').style.background = `linear-gradient(145deg, ${torso}, ${head})`;
    root.querySelector('.torso').style.background = `linear-gradient(180deg, ${torso}, ${head})`;
    root.querySelectorAll('.arm').forEach(node => node.style.background = torso);
    root.querySelectorAll('.leg').forEach(node => node.style.background = leg);
    var energy = root.querySelector('.avatar-energy');
    if (energy) energy.style.borderColor = head;
  }

  var searchRequestNonce = 0;
var SEARCH_HISTORY_KEY = 'drex_search_history';

function getSearchHistory() {
  try {
    var raw = localStorage.getItem(SEARCH_HISTORY_KEY);
    var parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function setSearchHistory(items) {
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(items.slice(0, 12)));
}

function saveSearchTerm(term) {
  var t = (term || '').trim();
  if (!t) return;
  var history = getSearchHistory().filter(item => item.toLowerCase() !== t.toLowerCase());
  history.unshift(t);
  setSearchHistory(history);
}

function removeSearchTerm(term) {
  var history = getSearchHistory().filter(item => item !== term);
  setSearchHistory(history);
  renderSearchHistory();
}

function renderSearchHistory() {
  var wrap = document.getElementById('search-history-wrap');
  var list = document.getElementById('search-history-list');
  if (!wrap || !list) return;

  var history = getSearchHistory();
  list.innerHTML = '';
  if (!history.length) {
    wrap.classList.add('hidden');
    return;
  }

  wrap.classList.remove('hidden');
  history.forEach(term => {
    var row = document.createElement('div');
    row.className = 'flex items-center gap-2';
    row.innerHTML = `
      <button class="flex-1 text-left px-3 py-2 rounded-2xl bg-white border border-[#e8e1dc] text-sm font-medium text-[#5f4b44] hover:border-[#d8cec8]">${term}</button>
      <button class="text-[#8d7d75] hover:text-[#5f4b44] p-2" aria-label="Eliminar del historial">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    `;
    var [useBtn, delBtn] = row.querySelectorAll('button');
    useBtn.onclick = () => {
      var input = document.getElementById('search-input');
      if (input) {
        input.value = term;
        updateSearchClearButton();
        performRealTimeSearch();
      }
    };
    delBtn.onclick = () => removeSearchTerm(term);
    list.appendChild(row);
  });
}

function updateSearchClearButton() {
  var input = document.getElementById('search-input');
  var btn = document.getElementById('search-clear-btn');
  if (!input || !btn) return;
  btn.classList.toggle('hidden', !input.value.trim());
}

function clearSearchInput() {
  var input = document.getElementById('search-input');
  if (!input) return;
  input.value = '';
  updateSearchClearButton();
  performRealTimeSearch();
  input.focus();
}


var isPullRefreshing = false;
function initFeedPullToRefresh() {
  var scroller = document.getElementById('scrollable-content');
  var indicator = document.getElementById('feed-pull-indicator');
  if (!scroller || !indicator) return;

  var startY = 0;
  var armed = false;

  scroller.addEventListener('touchstart', (e) => {
    if (scroller.scrollTop === 0) {
      startY = e.touches[0].clientY;
      armed = true;
    }
  }, { passive: true });

  scroller.addEventListener('touchmove', (e) => {
    if (!armed || isPullRefreshing) return;
    var delta = e.touches[0].clientY - startY;
    if (delta > 48) {
      indicator.classList.remove('hidden');
      indicator.innerHTML = getFadingCircleLoaderMarkup();
    }
  }, { passive: true });

  scroller.addEventListener('touchend', () => {
    if (indicator.classList.contains('hidden') || isPullRefreshing) {
      armed = false;
      return;
    }
    isPullRefreshing = true;
    loadNotes();
    setTimeout(() => {
      indicator.classList.add('hidden');
      indicator.innerHTML = '';
      isPullRefreshing = false;
    }, 900);
    armed = false;
  });
}

document.addEventListener('DOMContentLoaded', initFeedPullToRefresh);
function initSearchTabs() {
  document.querySelectorAll('.search-tab-button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.search-tab-button').forEach(btn => {
        btn.classList.remove('text-[#5f4b44]', 'border-[#7a6962]');
        btn.classList.add('text-[#9f918a]', 'border-transparent');
      });
      button.classList.add('text-[#5f4b44]', 'border-[#7a6962]');
      button.classList.remove('text-[#9f918a]', 'border-transparent');

      var tab = button.dataset.tab;
      document.getElementById('posts-section')?.classList.toggle('hidden', tab !== 'posts');
      document.getElementById('accounts-section')?.classList.toggle('hidden', tab !== 'accounts');
      document.getElementById('photos-section')?.classList.toggle('hidden', tab !== 'photos');
      document.getElementById('places-section')?.classList.toggle('hidden', tab !== 'places');
    });
  });
}

document.addEventListener('DOMContentLoaded', initSearchTabs);


var BARO_HISTORY_KEY = 'drex_baro_history_v1';
var baroLastSources = [];

function escapeHtml(value) {
  return `${value ?? ''}`
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeSearchText(value) {
  return `${value || ''}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenizeBaroQuery(query) {
  var base = normalizeSearchText(query);
  if (!base) return [];
  return [...new Set(base.split(' ').filter(token => token.length > 1))];
}

function calcTokenScore(tokens, text) {
  if (!tokens.length || !text) return 0;
  var normalized = normalizeSearchText(text);
  if (!normalized) return 0;
  return tokens.reduce((score, token) => score + (normalized.includes(token) ? 1 : 0), 0);
}

function openBaroView() {
  document.getElementById('baro-view')?.classList.remove('hidden');
  document.getElementById('baro-home')?.classList.remove('hidden');
  document.getElementById('baro-loading')?.classList.add('hidden');
  document.getElementById('baro-result-view')?.classList.add('hidden');
  document.getElementById('baro-followup-bar')?.classList.add('hidden');
  document.getElementById('baro-header-title')?.classList.add('hidden');
  closeBaroSourcesSheet();
  renderBaroHistory();
}

function closeBaroView() {
  document.getElementById('baro-view')?.classList.add('hidden');
  closeBaroSourcesSheet();
}

function setBaroPrompt(text) {
  var input = document.getElementById('baro-input');
  if (input) {
    input.value = text;
    input.focus();
  }
}

function getBaroHistory() {
  try { return JSON.parse(localStorage.getItem(BARO_HISTORY_KEY) || '[]'); } catch { return []; }
}

function saveBaroHistory(q) {
  var text = `${q || ''}`.trim();
  if (!text) return;
  var arr = getBaroHistory().filter(x => x.toLowerCase() !== text.toLowerCase());
  arr.unshift(text);
  localStorage.setItem(BARO_HISTORY_KEY, JSON.stringify(arr.slice(0, 20)));
}

function removeBaroHistoryItem(q) {
  var arr = getBaroHistory().filter(x => x !== q);
  localStorage.setItem(BARO_HISTORY_KEY, JSON.stringify(arr));
  renderBaroHistory();
}

function renderBaroHistory() {
  var container = document.getElementById('baro-history');
  if (!container) return;
  var arr = getBaroHistory();
  if (!arr.length) {
    container.innerHTML = '<p class="text-[0.95rem] text-[#7b878f]">Sin búsquedas recientes.</p>';
    return;
  }

  container.innerHTML = arr.map(q => {
    var safeText = escapeHtml(q);
    var encoded = encodeURIComponent(q);
    return `
      <div class="flex items-center gap-2 bg-white rounded-2xl px-4 py-3">
        <button class="flex-1 text-left text-[1rem] leading-tight text-[#1f252c] font-semibold" data-baro-fill="${encoded}">${safeText}</button>
        <button class="text-[#242b32] text-[1rem]" data-baro-remove="${encoded}" aria-label="Eliminar de recientes">✕</button>
      </div>
    `;
  }).join('');
}

document.getElementById('baro-history')?.addEventListener('click', (event) => {
  var fillButton = event.target.closest('[data-baro-fill]');
  if (fillButton) {
    setBaroPrompt(decodeURIComponent(fillButton.dataset.baroFill || ''));
    return;
  }
  var removeButton = event.target.closest('[data-baro-remove]');
  if (removeButton) {
    removeBaroHistoryItem(decodeURIComponent(removeButton.dataset.baroRemove || ''));
  }
});

function buildBaroSources(postsSnap, commentsSnap, query, tokens) {
  var sourcesMap = new Map();

  postsSnap.forEach(postChild => {
    var post = postChild.val() || {};
    var postId = postChild.key;
    var content = `${post.content || ''}`;
    var authorName = `${post.authorName || 'Usuario'}`;
    var scoreFromPost = calcTokenScore(tokens, `${content} ${authorName}`);
    var voteScore = Math.max(0, Number(post.upvotes || 0) - Number(post.downvotes || 0));

    sourcesMap.set(postId, {
      postId,
      post,
      score: scoreFromPost + Math.min(3, voteScore / 10),
      evidence: [],
      commentHits: 0
    });

    if (scoreFromPost > 0) {
      sourcesMap.get(postId).evidence.push({
        type: 'post',
        text: content
      });
    }
  });

  commentsSnap.forEach(postNode => {
    var postId = postNode.key;
    if (!sourcesMap.has(postId)) return;
    var source = sourcesMap.get(postId);
    var commentsObj = postNode.val() || {};

    Object.values(commentsObj).forEach(comment => {
      var commentText = `${comment?.content || ''}`;
      var commentScore = calcTokenScore(tokens, commentText);
      if (commentScore > 0) {
        source.score += commentScore * 0.9;
        source.commentHits += 1;
        source.evidence.push({ type: 'comment', text: commentText });
      }

      if (comment?.replies) {
        Object.values(comment.replies).forEach(reply => {
          var replyText = `${reply?.content || ''}`;
          var replyScore = calcTokenScore(tokens, replyText);
          if (replyScore > 0) {
            source.score += replyScore * 0.8;
            source.commentHits += 1;
            source.evidence.push({ type: 'reply', text: replyText });
          }
        });
      }
    });
  });

  var queryNormalized = normalizeSearchText(query);
  var ranked = [...sourcesMap.values()]
    .filter(item => item.score > 0 || normalizeSearchText(item.post?.content || '').includes(queryNormalized))
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);

  return ranked;
}

function renderBaroSourcesPill(sources) {
  var avatars = document.getElementById('baro-source-avatars');
  var text = document.getElementById('baro-sources-pill-text');
  if (!avatars || !text) return;

  avatars.innerHTML = sources.slice(0, 3).map(source => `
    <img src="${source.post?.authorImage || 'https://via.placeholder.com/40'}" class="w-8 h-8 rounded-full border-2 border-[#e2e4e7] object-cover" alt="fuente">
  `).join('');

  var names = sources.slice(0, 3).map(source => source.post?.authorName || 'Usuario').join(', ');
  text.textContent = sources.length
    ? `Fuentes: ${names}${sources.length > 3 ? ', ...' : ''}`
    : 'Fuentes';
}

function formatBaroAnswer(query, sources) {
  if (!sources.length) {
    return `
      <p class="text-[1rem] leading-tight text-[#1f252c]">No encontré suficiente información pública relacionada con <strong>${escapeHtml(query)}</strong> en este momento. Prueba con más contexto o una pregunta más específica.</p>
      <p class="text-[0.95rem] text-[#5f6c76]">La búsqueda impulsada por IA de Baro (Respuestas) usa publicaciones, comentarios y respuestas reales de Drex para sintetizar hallazgos en tiempo real.</p>
    `;
  }

  var top = sources[0];
  var topEvidence = top.evidence[0]?.text || top.post?.content || '';
  var highlights = sources.slice(0, 3).map(source => {
    var excerpt = source.evidence[0]?.text || source.post?.content || 'Sin contenido';
    var trimmed = excerpt.length > 180 ? `${excerpt.slice(0, 177)}...` : excerpt;
    return `<li><strong>${escapeHtml(source.post?.authorName || 'Usuario')}:</strong> ${escapeHtml(trimmed)}</li>`;
  }).join('');

  return `
    <p class="text-[1.65rem] leading-tight text-[#1f252c]">Según posts, comentarios y respuestas de la comunidad, la respuesta sobre <strong>${escapeHtml(query)}</strong> apunta a estos patrones:</p>
    <ul class="list-disc pl-8 text-[1rem] leading-tight text-[#1b232a] space-y-2">${highlights}</ul>
    <p class="text-[0.95rem] leading-tight text-[#4f5e6a]"><strong>Síntesis IA:</strong> Baro encontró ${sources.length} fuentes relacionadas y priorizó las más votadas y con más coincidencias semánticas. Primera fuente destacada: ${escapeHtml(topEvidence.slice(0, 130))}${topEvidence.length > 130 ? '...' : ''}.</p>
    <p class="text-[0.82rem] text-[#6c7780]">Baro (beta): disponible en EN, ES, PT-BR, IT, FR y DE.</p>
  `;
}

function renderBaroSourcesSheet() {
  var list = document.getElementById('baro-sources-list');
  if (!list) return;

  if (!baroLastSources.length) {
    list.innerHTML = '<p class="text-[#6c7780] text-lg">No hay fuentes disponibles.</p>';
    return;
  }

  list.innerHTML = baroLastSources.map((source, index) => {
    var post = source.post || {};
    var score = Math.max(0, Number(post.upvotes || 0) - Number(post.downvotes || 0));
    var comments = Number(post.commentsCount || 0) + Number(source.commentHits || 0);
    var title = `${post.content || 'Publicación sin texto'}`.trim();
    var safeTitle = escapeHtml(title.length > 120 ? `${title.slice(0, 117)}...` : title);
    var safeAuthor = escapeHtml(post.authorName || 'Usuario');
    return `
      <button onclick="openBaroSourcePost('${source.postId}')" class="w-full text-left bg-[#f6f6f6] border border-[#e8e1dc] rounded-3xl p-4">
        <p class="text-[0.95rem] text-[#606d77] font-semibold mb-1">${index + 1} · ${safeAuthor}</p>
        <p class="text-[1rem] leading-tight font-bold text-[#111820] mb-2">${safeTitle}</p>
        <p class="text-[0.9rem] text-[#5c6974]">Votos: ${score} · Comentarios: ${comments}</p>
      </button>
    `;
  }).join('');
}

function openBaroSourcesSheet() {
  renderBaroSourcesSheet();
  document.getElementById('baro-sources-overlay')?.classList.remove('hidden');
  document.getElementById('baro-sources-sheet')?.classList.remove('hidden');
}

function closeBaroSourcesSheet() {
  document.getElementById('baro-sources-overlay')?.classList.add('hidden');
  document.getElementById('baro-sources-sheet')?.classList.add('hidden');
}

function openBaroSourcePost(postId) {
  closeBaroSourcesSheet();
  closeBaroView();
  setTimeout(() => openCommentsView(postId), 220);
}

function runBaroSearch(isFollowup = false) {
  var primaryInput = document.getElementById('baro-input');
  var followupInput = document.getElementById('baro-followup-input');
  var sourceInput = isFollowup ? followupInput : primaryInput;
  var query = `${sourceInput?.value || ''}`.trim();
  if (!query) return;

  saveBaroHistory(query);
  renderBaroHistory();

  document.getElementById('baro-home')?.classList.add('hidden');
  document.getElementById('baro-result-view')?.classList.add('hidden');
  document.getElementById('baro-followup-bar')?.classList.add('hidden');
  document.getElementById('baro-header-title')?.classList.remove('hidden');

  var loading = document.getElementById('baro-loading');
  var result = document.getElementById('baro-result');
  if (loading) {
    loading.classList.remove('hidden');
    loading.innerHTML = getFadingCircleLoaderMarkup();
  }
  if (result) result.innerHTML = '';

  var tokens = tokenizeBaroQuery(query);
  Promise.all([
    firebase.database().ref('communityNotes').limitToLast(250).once('value'),
    firebase.database().ref('postComments').once('value')
  ]).then(([postsSnap, commentsSnap]) => {
    baroLastSources = buildBaroSources(postsSnap, commentsSnap, query, tokens);
    renderBaroSourcesPill(baroLastSources);

    var queryEl = document.getElementById('baro-result-query');
    if (queryEl) queryEl.textContent = query;
    if (result) result.innerHTML = formatBaroAnswer(query, baroLastSources);

    if (loading) loading.classList.add('hidden');
    document.getElementById('baro-result-view')?.classList.remove('hidden');
    document.getElementById('baro-followup-bar')?.classList.remove('hidden');

    if (followupInput) {
      followupInput.value = '';
      followupInput.placeholder = 'Haz una pregunta de seguimiento';
    }
  }).catch(() => {
    if (loading) loading.classList.add('hidden');
  });
}

document.getElementById('baro-input')?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    runBaroSearch();
  }
});

document.getElementById('baro-followup-input')?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    runBaroSearch(true);
  }
});

function openSearchView() {
  // Ocultar otras vistas
  document.getElementById('community-view').classList.add('hidden');
  document.getElementById('creator-hub-view').classList.add('hidden');
  document.getElementById('profile-view').classList.add('hidden');
  document.getElementById('games-view').classList.add('hidden');
  
  mainApp.classList.add('hidden');
  document.getElementById('search-view').classList.remove('hidden');
  
  var input = document.getElementById('search-input');
  if (input) input.focus();
  resetSearchView();
  updateSearchClearButton();
  renderSearchHistory();
}

function closeSearch() {
  document.getElementById('search-view').classList.add('hidden');
  mainApp.classList.remove('hidden');
}

function resetSearchView() {
  var initial = document.getElementById('search-initial-section');
  var loading = document.getElementById('search-query-loading');
  var results = document.getElementById('search-results-container');
  var tabs = document.getElementById('search-tabs-row');
  if (initial) initial.classList.remove('hidden');
  if (loading) loading.classList.add('hidden');
  if (results) results.classList.add('hidden');
  if (tabs) tabs.classList.add('hidden');
  renderSearchHistory();
}

function performRealTimeSearch() {
  var input = document.getElementById('search-input');
  if (!input) return;
  var query = input.value.trim().toLowerCase();
  updateSearchClearButton();

  var initial = document.getElementById('search-initial-section');
  var loading = document.getElementById('search-query-loading');
  var results = document.getElementById('search-results-container');
  var tabs = document.getElementById('search-tabs-row');

  if (!query) {
    resetSearchView();
    document.getElementById('search-posts-list').innerHTML = '';
    document.getElementById('search-accounts-list').innerHTML = '';
    document.getElementById('search-photos-grid').innerHTML = '';
    document.getElementById('search-places-list').innerHTML = '';
    return;
  }

  saveSearchTerm(input.value.trim());
  if (initial) initial.classList.add('hidden');
  if (results) results.classList.add('hidden');
  if (tabs) tabs.classList.add('hidden');
  if (loading) loading.classList.remove('hidden');

  var currentNonce = ++searchRequestNonce;

  var postsPromise = firebase.database().ref('communityNotes').once('value').then(snapshot => {
    if (currentNonce !== searchRequestNonce) return { posts: [], photos: [], places: [] };
    var posts = [];
    var photos = [];
    var placesMap = new Map();
    snapshot.forEach(child => {
      var note = child.val() || {};
      var content = (note.content || '').toLowerCase();
      var authorId = note.authorId || note.userId || '';
      if (isAccountBlockedForCurrentUser(authorId)) return;

      var matches = !query || content.includes(query) || (note.authorName || '').toLowerCase().includes(query);
      if (matches) posts.push({ ...note, id: child.key });

      var imgs = [];
      if (Array.isArray(note.imageUrls)) imgs.push(...note.imageUrls.filter(Boolean));
      if (note.imageUrl) imgs.push(note.imageUrl);
      if (imgs.length && matches) imgs.forEach(url => photos.push({ postId: child.key, url, authorName: note.authorName || 'Usuario' }));

      var locName = `${note.location?.name || ''}`.trim();
      var locNameLower = locName.toLowerCase();
      if (locName && locNameLower.includes(query)) {
        var locLat = Number(note.location?.lat);
        var locLng = Number(note.location?.lng);
        var key = locNameLower;
        if (!placesMap.has(key)) {
          placesMap.set(key, {
            name: locName,
            lat: Number.isFinite(locLat) ? locLat : null,
            lng: Number.isFinite(locLng) ? locLng : null,
            noteId: child.key
          });
        }
      }
    });
    posts.sort((a, b) => Number(b.timestamp || 0) - Number(a.timestamp || 0));
    return { posts: posts.slice(0, 100), photos: photos.slice(0, 90), places: Array.from(placesMap.values()).slice(0, 60) };
  });

  var usersPromise = firebase.database().ref('users').once('value').then(snapshot => {
    if (currentNonce !== searchRequestNonce) return [];
    var accounts = [];
    snapshot.forEach(child => {
      var userData = child.val() || {};
      var username = (userData.username || '').toLowerCase();
      if (isAccountBlockedForCurrentUser(child.key)) return;
      if (!query || username.includes(query)) accounts.push({ ...userData, uid: child.key });
    });
    return accounts.slice(0, 100);
  });

  Promise.all([postsPromise, usersPromise]).then(([postData, accounts]) => {
    if (currentNonce !== searchRequestNonce) return;
    renderPostsList(postData.posts || []);
    renderPhotosList(postData.photos || []);
    renderPlacesList(postData.places || []);
    renderAccountsList(accounts || []);
    if (loading) loading.classList.add('hidden');
    if (results) results.classList.remove('hidden');
    if (tabs) tabs.classList.remove('hidden');
  }).catch(() => {
    if (loading) loading.classList.add('hidden');
  });
}

document.getElementById('search-input').addEventListener('input', performRealTimeSearch);

function renderPostsList(posts) {
  var list = document.getElementById('search-posts-list');
  if (!list) return;
  list.innerHTML = '';
  posts.forEach(post => {
    var item = document.createElement('button');
    item.className = 'w-full text-left p-4 bg-white border border-[#e8e1dc] rounded-3xl shadow-sm hover:border-[#d8cec8] transition';
    item.innerHTML = `
      <div class="flex items-start gap-3">
        <img src="${post.authorImage || 'https://via.placeholder.com/80'}" class="w-10 h-10 rounded-full object-cover">
        <div class="min-w-0">
          <p class="text-sm font-semibold text-[#7a6962]">${post.authorName || 'Usuario'} • ${formatRelativeTime(post.timestamp)}</p>
          <p class="text-lg leading-tight text-[#2f1a14] line-clamp-2 mt-1">${post.content || 'Sin texto'}</p>
        </div>
      </div>`;
    item.onclick = () => {
      closeSearch();
      setTimeout(() => {
        openCommentsView(post.id);
      }, 300);
    };
    list.appendChild(item);
  });
  if (!posts.length) list.innerHTML = '<div class="bg-white border border-[#e8e1dc] rounded-3xl p-5 text-sm text-[#8d7d75]">No hay posts que coincidan.</div>';
}

function renderPhotosList(photos) {
  var grid = document.getElementById('search-photos-grid');
  if (!grid) return;
  grid.innerHTML = '';
  photos.forEach(photo => {
    var btn = document.createElement('button');
    btn.className = 'relative aspect-square rounded-2xl overflow-hidden border border-[#e8e1dc] bg-white';
    btn.innerHTML = `<img src="${photo.url}" class="w-full h-full object-cover" alt="Foto de post">`;
    btn.onclick = () => { closeSearch(); setTimeout(() => openCommentsView(photo.postId), 250); };
    grid.appendChild(btn);
  });
  if (!photos.length) grid.innerHTML = '<div class="col-span-3 bg-white border border-[#e8e1dc] rounded-3xl p-5 text-sm text-[#8d7d75]">No hay fotos que coincidan.</div>';
}

function renderAccountsList(accounts) {
  var list = document.getElementById('search-accounts-list');
  if (!list) return;
  list.innerHTML = '';
  accounts.forEach(account => {
    var item = document.createElement('div');
    item.className = 'flex items-center space-x-3 cursor-pointer p-3 rounded-2xl bg-white border border-[#e8e1dc] hover:border-[#d8cec8] shadow-sm';
    item.innerHTML = `
      <img src="${account.profileImage || 'https://via.placeholder.com/50'}" alt="${account.username || 'Cuenta'}" class="w-11 h-11 rounded-full object-cover">
      <span class="font-semibold text-[#2f1a14]">${account.username || 'Cuenta'}${getVerificationIcon(account.email || '')}</span>`;
    item.addEventListener('click', () => openAuthorProfile(account.uid));
    list.appendChild(item);
  });
  if (!accounts.length) list.innerHTML = '<div class="bg-white border border-[#e8e1dc] rounded-3xl p-5 text-sm text-[#8d7d75]">No hay cuentas que coincidan.</div>';
}

function renderPlacesList(places) {
  var list = document.getElementById('search-places-list');
  if (!list) return;
  list.innerHTML = '';
  places.forEach(place => {
    var item = document.createElement('button');
    item.className = 'w-full p-3 rounded-2xl bg-white border border-[#e8e1dc] hover:border-[#d8cec8] text-left shadow-sm transition';
    item.innerHTML = `
      <div class="flex items-center gap-2.5">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-[#8c6f66] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        <span class="text-sm font-semibold text-[#2f1a14] truncate">${escapeHtml(place.name || 'Lugar')}</span>
      </div>
    `;
    item.onclick = () => {
      closeSearch();
      setTimeout(() => {
        openLocationDetailView(place.name || 'Ubicación', place.lat, place.lng, place.noteId || '');
      }, 220);
    };
    list.appendChild(item);
  });
  if (!places.length) list.innerHTML = '<div class="bg-white border border-[#e8e1dc] rounded-3xl p-5 text-sm text-[#8d7d75]">No hay lugares que coincidan.</div>';
}

/*********************** PERFIL (Propio) **************************/
  function uploadProfileImage() {
    document.getElementById('profile-image-input').click();
  }

  function handleProfileImageUpload(event) {
    var file = event.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = (e) => {
      // El resultado ya trae el prefijo 'data:image/jpeg;base64,...' o 'data:image/png;base64,...'
      var base64String = e.target.result;
      var user = firebase.auth().currentUser;
      if (!user) return;
      // Guardamos la imagen en base64 en la Realtime Database
      firebase.database().ref('users/' + user.uid).update({
          profileImage: base64String
        })
        .then(() => {
          document.getElementById('profile-image').src = base64String;
        })
        .catch(error => {
          console.error("Error al guardar la imagen en la base de datos:", error);
        });
    };
    reader.onerror = (error) => {
      console.error("Error al convertir la imagen a base64:", error);
    };
    // Convertimos el archivo a Data URL (base64)
    reader.readAsDataURL(file);
  }

  function editUsername() {
    openProfileEdit();
  }

  function saveBio() {
    var bio = document.getElementById('profile-bio').value;
    var user = firebase.auth().currentUser;
    firebase.database().ref('users/' + user.uid).update({
        bio
      })
      .then(() => {
        addNotification(user.uid, translations[currentLanguage].bioUpdated);
        alert(translations[currentLanguage].bioUpdated);
      })
      .catch(error => {
        console.error("Error al actualizar la biografía:", error);
      });
  }
  // Función para convertir un archivo a una cadena Base64
  function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.onerror = (error) => {
        reject("Error al convertir la imagen: " + error);
      };
      reader.readAsDataURL(file);
    });
  }
  /*********************** MODAL DE EDICIÓN DE PERFIL **************************/
  function openProfileEdit() {
    var user = firebase.auth().currentUser;
    if (!user) return;
    firebase.database().ref('users/' + user.uid).once('value').then(snapshot => {
      var data = snapshot.val() || {};

      // Campos móviles
      var editUsernameMobile = document.getElementById('edit-username');
      var editPronounsMobile = document.getElementById('edit-pronouns');
      var editBioMobile = document.getElementById('edit-bio');
      if (editUsernameMobile) editUsernameMobile.value = data.username || "";
      if (editPronounsMobile) editPronounsMobile.value = data.pronouns || "";
      if (editBioMobile) editBioMobile.value = data.bio || "";
      document.getElementById('edit-inkspired').value = data.inkspired || "";
      document.getElementById('edit-instagram').value = data.instagram || "";
      document.getElementById('edit-webtoon').value = data.webtoon || "";
      document.getElementById('edit-website').value = data.website || "";
      document.getElementById('edit-city').value = data.city || "";
      document.getElementById('edit-gender').value = data.gender || "";
      document.getElementById('edit-birthday').value = data.birthday || "";
      document.getElementById('edit-followers').textContent = formatNumber(data.followersCount || 0);
      document.getElementById('edit-following').textContent = formatNumber(data.followingCount || 0);

      // Campos desktop
      var usernameDesktop = document.getElementById('edit-username-desktop');
      var emailDesktop = document.getElementById('edit-email-desktop');
      var firstNameDesktop = document.getElementById('edit-first-name-desktop');
      var lastNameDesktop = document.getElementById('edit-last-name-desktop');
      var birthdayDesktop = document.getElementById('edit-birthday-desktop');
      var genderDesktop = document.getElementById('edit-gender-desktop');
      var cityDesktop = document.getElementById('edit-city-desktop');
      var websiteDesktop = document.getElementById('edit-website-desktop');
      var bioDesktop = document.getElementById('edit-bio-desktop');
      var profileImageDesktop = document.getElementById('edit-profile-image-desktop');
      var followersDesktop = document.getElementById('edit-followers-desktop');
      var followingDesktop = document.getElementById('edit-following-desktop');
      var storiesDesktop = document.getElementById('edit-stories-count-desktop');

      if (usernameDesktop) usernameDesktop.value = data.username || "";
      if (emailDesktop) emailDesktop.value = user.email || "";
      if (firstNameDesktop) firstNameDesktop.value = data.firstName || "";
      if (lastNameDesktop) lastNameDesktop.value = data.lastName || "";
      if (birthdayDesktop) birthdayDesktop.value = data.birthday || "";
      if (genderDesktop) genderDesktop.value = data.gender || "male";
      if (cityDesktop) cityDesktop.value = data.city || "";
      if (websiteDesktop) websiteDesktop.value = data.website || "";
      if (bioDesktop) bioDesktop.value = data.bio || "";
      if (profileImageDesktop) profileImageDesktop.src = data.profileImage || "https://via.placeholder.com/200";
      if (followersDesktop) followersDesktop.textContent = formatNumber(data.followersCount || 0);
      if (followingDesktop) followingDesktop.textContent = formatNumber(data.followingCount || 0);

      // Cargar campos de redes sociales en desktop
      var instagramDesktop = document.getElementById('edit-instagram-desktop');
      var webtoonDesktop = document.getElementById('edit-webtoon-desktop');
      var inkspiredDesktop = document.getElementById('edit-inkspired-desktop');

      if (instagramDesktop) instagramDesktop.value = data.instagram || "";
      if (webtoonDesktop) webtoonDesktop.value = data.webtoon || "";
      if (inkspiredDesktop) inkspiredDesktop.value = data.inkspired || "";

      firebase.database().ref('communityNotes').orderByChild('authorId').equalTo(user.uid).once('value').then(snapshot => {
        var totalPosts = snapshot.numChildren();
        var editStoriesCount = document.getElementById('edit-stories-count');
        if (editStoriesCount) editStoriesCount.textContent = totalPosts;
        if (storiesDesktop) storiesDesktop.textContent = totalPosts;
      });

      document.getElementById('profile-edit-modal').style.display = "block";
    });
  }

  function handleEditProfileImageUploadDesktop(event) {
    var file = event.target.files[0];
    if (!file) return;
    var reader = new FileReader();

    reader.onload = function(e) {
      if (document.getElementById('edit-profile-image-desktop')) document.getElementById('edit-profile-image-desktop').src = e.target.result;
      // También actualizar la imagen móvil
      if (document.getElementById('edit-profile-image-mobile')) document.getElementById('edit-profile-image-mobile').src = e.target.result;
    }

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  function loadUserNotes() {
    var user = firebase.auth().currentUser;
    if (!user) return;

    var notesContainer = document.getElementById('notes-tab-content');

    firebase.database().ref('communityNotes').orderByChild('authorId').equalTo(user.uid).once('value').then(snapshot => {
      var notesHTML = '<h2 class="text-2xl font-bold mb-6">Mis Notas</h2>';

      if (snapshot.exists()) {
        var notes = [];
        snapshot.forEach(child => {
          notes.push({...child.val(), id: child.key});
        });

        notes.sort((a, b) => b.timestamp - a.timestamp);

        notesHTML += '<div class="grid grid-cols-1 gap-4">';
        notes.forEach(note => {
          notesHTML += `
            <div class="bg-white p-4 rounded-xl border hover:shadow-md transition-shadow">
              ${note.content ? renderContentWithSticker(note.content, 'mb-3') : ''}
              ${note.imageUrl ? `<img src="${note.imageUrl}" alt="Imagen de la nota" class="w-full h-auto max-h-[70vh] object-contain rounded-lg mb-3">` : ''}
              <div class="flex items-center justify-between text-sm text-gray-500">
                <span>${formatRelativeTime(note.timestamp)}</span>
                <span>❤️ ${note.likes || 0}</span>
              </div>
            </div>
          `;
        });
        notesHTML += '</div>';
      } else {
        notesHTML += '<p class="text-gray-600">No has publicado ninguna nota aún. Ve a la comunidad para crear tu primera nota.</p>';
      }

      notesContainer.innerHTML = notesHTML;
    });
  }

  function closeProfileEdit() {
    document.getElementById('profile-edit-modal').style.display = "none";
  }

  function saveProfileEdits() {
    var user = firebase.auth().currentUser;
    if (!user) return;

    // Detectar si estamos en móvil o desktop
    var isMobile = window.innerWidth < 1024;
    var mobileUsernameInput = document.getElementById('edit-username');
    var settingsUsernameInput = document.getElementById('settings-username');
    var desktopUsernameInput = document.getElementById('edit-username-desktop');
    var newUsername = isMobile ?
      ((mobileUsernameInput?.value || settingsUsernameInput?.value || "").trim()) :
      (desktopUsernameInput?.value || "").trim();

    // Validar cambio de nombre de usuario (solo cada 7 días)
    firebase.database().ref('users/' + user.uid).once('value').then(snapshot => {
      var userData = snapshot.val() || {};
      var lastUsernameChange = userData.lastUsernameChange || 0;
      var timeSinceLastChange = Date.now() - lastUsernameChange;
      var USERNAME_CHANGE_COOLDOWN = 7 * 24 * 60 * 60 * 1000; // 7 días

      if (newUsername !== userData.username && timeSinceLastChange < USERNAME_CHANGE_COOLDOWN) {
        var daysLeft = Math.ceil((USERNAME_CHANGE_COOLDOWN - timeSinceLastChange) / (24 * 60 * 60 * 1000));
        alert(`No puedes cambiar tu nombre de usuario hasta dentro de ${daysLeft} días.`);
        return;
      }

      var updates = {};

      if (isMobile) {
        var valueOrCurrent = (id, current) => {
          var el = document.getElementById(id);
          return el ? el.value : (current || "");
        };
        // Datos desde campos móviles
        updates = {
          username: newUsername,
          pronouns: valueOrCurrent('edit-pronouns', userData.pronouns),
          bio: valueOrCurrent('edit-bio', userData.bio),
          inkspired: valueOrCurrent('edit-inkspired', userData.inkspired),
          instagram: valueOrCurrent('edit-instagram', userData.instagram),
          webtoon: valueOrCurrent('edit-webtoon', userData.webtoon),
          website: valueOrCurrent('edit-website', userData.website),
          city: valueOrCurrent('edit-city', userData.city),
          gender: valueOrCurrent('edit-gender', userData.gender),
          birthday: valueOrCurrent('edit-birthday', userData.birthday)
        };
      } else {
        // Datos desde campos desktop
        updates = {
          username: newUsername,
          firstName: document.getElementById('edit-first-name-desktop').value,
          lastName: document.getElementById('edit-last-name-desktop').value,
          bio: document.getElementById('edit-bio-desktop').value,
          website: document.getElementById('edit-website-desktop').value,
          instagram: document.getElementById('edit-instagram-desktop').value,
          webtoon: document.getElementById('edit-webtoon-desktop').value,
          inkspired: document.getElementById('edit-inkspired-desktop').value,
          city: document.getElementById('edit-city-desktop').value,
          gender: document.getElementById('edit-gender-desktop').value,
          birthday: document.getElementById('edit-birthday-desktop').value
        };
      }

      // Si cambió el nombre de usuario, actualizar timestamp
      if (newUsername !== userData.username) {
        updates.lastUsernameChange = Date.now();
      }
      if (updates.username === "darheel_") {
        updates.followersCount = 19000;
        updates.founder = true;
        updates.isVerified = true;
      }

      firebase.database().ref('users/' + user.uid).update(updates)
        .then(() => {
          addNotification(user.uid, translations[currentLanguage].usernameUpdated);
          var newName = updates.username;
          if (updates.founder) {
            newName += ' <span class="founder-tag">Fundador</span>';
          }
          newName += getVerificationIcon(updates.email || user.email);
          document.getElementById('profile-username').innerHTML = newName;
          alert("Perfil actualizado");
          closeProfileEdit();
        })
        .catch(error => {
          console.error("Error al guardar cambios en el perfil:", error);
        });
    });
  }

  function uploadEditProfileImage() {
    document.getElementById('edit-profile-image-input').click();
  }

  function handleEditProfileImageUpload(event) {
    var file = event.target.files[0];
    if (!file) return;
    var user = firebase.auth().currentUser;
    if (!user) return;
    var storageRef = firebase.storage().ref();
    var imageRef = storageRef.child('profileImages/' + user.uid + '/' + file.name);
    var uploadTask = imageRef.put(file);
    uploadTask.on('state_changed', null, error => {
      console.error("Error al subir la imagen (edición):", error);
    }, () => {
      uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
        firebase.database().ref('users/' + user.uid).update({
          profileImage: downloadURL
        });
        document.getElementById('edit-profile-image').src = downloadURL;
      });
    });
  }
  /*********************** PERFIL DEL AUTOR **************************/
  function openAuthorProfile(authorId) {
    var currentUser = firebase.auth().currentUser;
    // Si intentan abrir su propio perfil desde tarjetas/autores,
    // redirigir al perfil personal donde vive la edición.
    if (currentUser && currentUser.uid === authorId) {
      openProfile();
      return;
    }

    var addNoteBtn = document.getElementById('add-note-btn');
    var profileNote = document.getElementById('profile-note');
    var followButton = document.getElementById('follow-button');
    var followButtonText = document.getElementById('follow-button-text');

    addNoteBtn.classList.add('hidden');
    // En perfil de autor, el botón principal siempre es de seguir.
    if (followButtonText) followButtonText.textContent = 'Seguir';
    if (followButton) {
      followButton.onclick = followAuthor;
      followButton.classList.add('bg-[#FE2C55]');
      followButton.classList.remove('bg-[#e8e1dc]', 'text-black');
    }

    // Limpiar residuales de acciones extra en perfil
    var extraProfileIcon = document.getElementById('extra-profile-icon');
    if (extraProfileIcon) extraProfileIcon.remove();


    // Check for existing note
    firebase.database().ref('profileNotes/' + authorId).once('value').then(snapshot => {
      var noteData = snapshot.val();
      if (noteData && noteData.text && noteData.timestamp) {
        var expirationTime = noteData.timestamp + (12 * 60 * 60 * 1000); // 12 hours
        if (Date.now() < expirationTime) {
          profileNote.classList.remove('hidden');
          document.getElementById('note-text').textContent = noteData.text;
          var timeLeft = Math.floor((expirationTime - Date.now()) / (60 * 60 * 1000));
          document.getElementById('note-time').textContent = `Expira en ${timeLeft} horas`;
        } else {
          profileNote.classList.add('hidden');
          snapshot.ref.remove(); // Remove expired note
        }
      } else {
        profileNote.classList.add('hidden');
      }
    });
    firebase.database().ref('users/' + authorId).once('value').then(snapshot => {
      var authorData = snapshot.val();
      if (!authorData || (authorData.blocked && authorData.blockedUntil && Date.now() < authorData.blockedUntil)) {
        document.getElementById('blocked-error-modal').style.display = "flex";
        return;
      }
      var authorNameHTML = authorData.username || 'Autor desconocido';
      if (authorData.founder) {
        authorNameHTML += ' <span class="founder-tag">Fundador</span>';
      }
      authorNameHTML += getVerificationIcon(authorData.email || "");
      document.getElementById('author-profile-name').innerHTML = authorNameHTML;
      document.getElementById('author-profile-image').src = authorData.profileImage || 'https://via.placeholder.com/150';
      document.getElementById('author-followers').textContent = formatNumber(authorData.followersCount || 0);
      document.getElementById('author-following').textContent = formatNumber(authorData.followingCount || 0);
      document.getElementById('author-rated').textContent = authorData.ratedCount || 0;


      // También actualizar la imagen del autor en búsquedas si existe
      setTimeout(() => {
        var searchResults = document.querySelectorAll(`[data-author-id="${authorId}"]`);
        searchResults.forEach(element => {
          loadUserFrame(authorId, element.id + '-frame');
        });
      }, 500);
      var socialLinksHTML = "";
      if (authorData.instagram) {
        socialLinksHTML += `<a href="${authorData.instagram}" target="_blank"><img src="https://img.utdstc.com/icon/847/f33/847f33af27bea889ccaa9b1d25135b42ff5bb590297182d0983afb7304d96884:200" alt="Instagram" class="w-6 h-6"></a>`;
      }
      if (authorData.webtoon) {
        socialLinksHTML += `<a href="${authorData.webtoon}" target="_blank"><img src="https://www.webtoons.com/favicon.ico" alt="Webtoon" class="w-6 h-6"></a>`;
      }
      if (authorData.inkspired) {
        socialLinksHTML += `<a href="${authorData.inkspired}" target="_blank"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmCCZ41lZmMTQKuO2yydE3lFF0PGbgnLZoXA&s=10" alt="Inkspired" class="w-6 h-6"></a>`;
      }
      if (authorData.website) {
        socialLinksHTML += `<a href="${authorData.website}" target="_blank"><i class="fa-solid fa-globe text-2xl"></i></a>`;
      }
      document.getElementById('author-social-links').innerHTML = socialLinksHTML;
      firebase.database().ref(`liveStreams/${authorId}/isLive`).once('value').then(snapshot => {
        if (snapshot.exists() && snapshot.val()) {
          var liveLabel = document.getElementById('live-label');
          if (!liveLabel) {
            liveLabel = document.createElement('span');
            liveLabel.id = "live-label";
            // Cambiamos el texto a "DIRECTO" y el fondo a verde
            liveLabel.textContent = "DIRECTO";
            liveLabel.className = "absolute top-0 left-0 bg-green-600 text-white px-2 py-1 rounded text-xs";
            var container = document.getElementById('author-profile-img-container');
            container.style.position = "relative";
            container.appendChild(liveLabel);
          }
          // Agregamos una clase para un borde pulsante de color verde (estilo Duolingo)
          document.getElementById('author-profile-image').classList.add('live-border');
        } else {
          var liveLabel = document.getElementById('live-label');
          if (liveLabel) {
            liveLabel.remove();
          }
          document.getElementById('author-profile-image').classList.remove('live-border');
        }
      });
    });
    currentViewedAuthorId = authorId;
    document.getElementById('author-profile-modal').style.display = "block";
    updateFollowIcon();
    // Cargar posts del autor
    var authorPostsContainer = document.getElementById('author-posts-container');
    if (authorPostsContainer) {
      authorPostsContainer.innerHTML = '<div class="text-center py-8 text-gray-500"><div class="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-[#FE2C55] rounded-full"></div></div>';

      firebase.database().ref('communityNotes').orderByChild('authorId').equalTo(authorId).once('value', snapshot => {
        authorPostsContainer.innerHTML = "";
        if (!snapshot.exists()) {
          authorPostsContainer.innerHTML = '<p class="text-center py-8 text-gray-500 italic">Este usuario aún no tiene posts.</p>';
          return;
        }

        snapshot.forEach(child => {
          var post = { ...(child.val() || {}), id: child.key };
          var card = document.createElement('div');
          card.className = 'bg-[#1e2c4a] rounded-xl border border-[#283a5e] p-4 hover:bg-[#25365a] transition-all cursor-pointer w-full text-left';
          card.onclick = () => { closeAuthorProfile(); setTimeout(() => openCommentsView(post.id), 250); };

          card.innerHTML = `
            <div class="flex items-start gap-3">
              <img src="${post.authorImage || 'https://via.placeholder.com/40'}" class="w-10 h-10 rounded-full object-cover flex-shrink-0">
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-center">
                  <p class="font-bold text-sm text-gray-100">${post.authorName || 'Usuario'}</p>
                  <span class="text-[10px] text-gray-400">${formatRelativeTime(post.timestamp)}</span>
                </div>
                ${post.content ? `<p class="text-sm text-gray-300 mt-2 leading-relaxed">${post.content}</p>` : ''}
              </div>
            </div>
          `;

          authorPostsContainer.appendChild(card);
        });
      });
    }

    document.getElementById('author-profile-image').onclick = function() {
      firebase.database().ref(`liveStreams/${authorId}/isLive`).once('value').then(snapshot => {
        if (snapshot.exists() && snapshot.val()) {
          openLiveViewModal(authorId);
        }
      });
    };
  }

  function closeAuthorProfile() {
    document.getElementById('author-profile-modal').style.display = "none";
    var mainAppElement = document.getElementById('main-app');
    if (mainAppElement) {
      mainAppElement.classList.remove('hidden');
    }
  }

  function closeBlockedErrorModal() {
    document.getElementById('blocked-error-modal').style.display = "none";
    var mainAppElement = document.getElementById('main-app');
    if (mainAppElement) {
      mainAppElement.classList.remove('hidden');
    }
  }
  /*********************** FUNCIONES PARA SEGUIR **************************/
  function updateFollowIcon() {
    var currentUser = firebase.auth().currentUser;
    if (!currentUser || !currentViewedAuthorId) return;
    var followRef = firebase.database().ref('followers/' + currentViewedAuthorId + '/' + currentUser.uid);
    followRef.once('value').then(snapshot => {
      var followIcon = document.getElementById('follow-icon');
      followIcon.src = snapshot.exists() ?
        "https://cdn-icons-png.flaticon.com/512/907/907822.png" :
        "https://cdn-icons-png.freepik.com/512/8370/8370007.png";
    });
  }

  function followAuthor() {
    var currentUser = firebase.auth().currentUser;
    if (!currentUser || !currentViewedAuthorId) return;
    if (currentUser.uid === currentViewedAuthorId) {
      alert(translations[currentLanguage].followSelfError);
      return;
    }

    var followRef = firebase.database().ref('followers/' + currentViewedAuthorId + '/' + currentUser.uid);
    var followButton = document.getElementById('follow-button');
    var authorFollowersRef = firebase.database().ref('users/' + currentViewedAuthorId + '/followersCount');
    var currentFollowersElement = document.getElementById('author-followers');

    // Escuchar cambios en tiempo real del contador de seguidores
    authorFollowersRef.on('value', (snapshot) => {
      var followersCount = snapshot.val() || 0;
      currentFollowersElement.textContent = formatNumber(followersCount);
    });

    followRef.once('value').then(snapshot => {
      if (snapshot.exists()) {
        // Dejar de seguir
        followRef.remove().then(() => {
          authorFollowersRef.transaction(current => {
            return (current || 1) - 1;
          });

          followButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>`;
        });
      } else {
        // Comenzar a seguir
        followRef.set({
          followedAt: Date.now()
        }).then(() => {
          authorFollowersRef.transaction(current => {
            return (current || 0) + 1;
          });

          firebase.database().ref('users/' + currentUser.uid).once('value').then(userSnap => {
            var followerName = userSnap.val().username;
            addNotification(currentViewedAuthorId, `${followerName} te ha seguido`);
          });

          followButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>`;
        });
      }
    });
  }



  function blockAuthor() {
    var currentUser = firebase.auth().currentUser;
    if (!currentUser || !currentViewedAuthorId) return;

    var blockRef = firebase.database().ref('blocks/' + currentUser.uid + '/' + currentViewedAuthorId);
    var blockButton = document.getElementById('block-button');

    blockRef.once('value').then(snapshot => {
      if (snapshot.exists()) {
        // Desbloquear
        blockRef.remove().then(() => {
          blockButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>`;
          alert('Usuario desbloqueado');
        });
      } else {
        // Bloquear
        blockRef.set({
          blockedAt: Date.now()
        }).then(() => {
          blockButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>`;
          alert('Usuario bloqueado');
        });
      }
    });
  }

  function blockAuthor() {
    var currentUser = firebase.auth().currentUser;
    if (!currentUser || !currentViewedAuthorId) return;

    var blockRef = firebase.database().ref('blocks/' + currentUser.uid + '/' + currentViewedAuthorId);
    var blockButton = document.getElementById('block-button');

    blockRef.once('value').then(snapshot => {
      if (snapshot.exists()) {
        // Desbloquear
        blockRef.remove().then(() => {
          blockButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>`;
          alert('Usuario desbloqueado');
        });
      } else {
        // Bloquear
        blockRef.set({
          blockedAt: Date.now()
        }).then(() => {
          blockButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>`;
          alert('Usuario bloqueado');
        });
      }
    });
  }

  function followUser(userId) {
    var currentUser = firebase.auth().currentUser;
    if (!currentUser) return;
    if (currentUser.uid === userId) {
      alert(translations[currentLanguage].followSelfError);
      return;
    }
    var followRef = firebase.database().ref('followers/' + userId + '/' + currentUser.uid);
    followRef.once('value').then(snapshot => {
      if (snapshot.exists()) {
        alert(translations[currentLanguage].alreadyFollowing);
      } else {
        followRef.set({
            followedAt: Date.now()
          })
          .then(() => {
            var userFollowersCountRef = firebase.database().ref('users/' + userId + '/followersCount');
            userFollowersCountRef.transaction(current => (current || 0) + 1);
            firebase.database().ref('users/' + currentUser.uid).once('value').then(userSnap => {
              var followerName = userSnap.val().username;
              addNotification(userId, `${followerName} te ha seguido`);
            });


            alert(translations[currentLanguage].nowFollowing);
          });
      }
    });
  }

  function openFollowingModal() {
    var currentUser = firebase.auth().currentUser;
    if (!currentViewedAuthorId) return;
    if (currentUser.uid !== currentViewedAuthorId) {
      alert("La lista de usuarios que sigue este autor es privada.");
      return;
    }
    firebase.database().ref('following/' + currentViewedAuthorId).once('value').then(snapshot => {
      var followingListDiv = document.getElementById('following-list');
      followingListDiv.innerHTML = '';
      snapshot.forEach(child => {
        var followingUserId = child.key;
        firebase.database().ref('users/' + followingUserId).once('value').then(userSnap => {
          var userData = userSnap.val();
          var followingDiv = document.createElement('div');
          followingDiv.className = 'flex items-center space-x-4';
          var verifiedIcon = getVerificationIcon(userData.email || "");
          followingDiv.innerHTML = `
                    <img src="${userData.profileImage || 'https://via.placeholder.com/50'}" alt="${userData.username}" class="w-12 h-12 rounded-full object-cover">
                    <span class="font-semibold">${userData.username || 'Usuario'}${verifiedIcon}</span>
                    <button onclick="followUser('${followingUserId}')" class="bg-[#58CC02] text-white p-1 rounded-full">
                      <i class="fa-solid fa-user-plus"></i>
                    </button>
                  `;
          followingListDiv.appendChild(followingDiv);
        });
      });
      document.getElementById('following-modal').style.display = "block";
    });
  }

  function closeFollowingModal() {
    document.getElementById('following-modal').style.display = "none";
  }
  /*********************** REPORTES **************************/
  document.getElementById('report-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var user = firebase.auth().currentUser;
    if (!user || !currentViewedAuthorId) return;
    if (user.uid === currentViewedAuthorId) {
      alert("No puedes reportarte a ti mismo.");
      return;
    }
    var reason = document.getElementById('report-reason').value;
    var description = document.getElementById('report-description').value;
    // Guardar el reporte de inmediato en la base de datos
    var reporterName = user.displayName || user.email || "Usuario";
    var reportData = {
      reporter: user.uid,
      reporterName: reporterName,
      reportedUser: currentViewedAuthorId,
      reportedName: "", // lo obtendremos luego
      reason: reason,
      description: description,
      timestamp: Date.now(),
      status: "pending"
    };
    firebase.database().ref('reports').push(reportData)
      .catch(error => {
        console.error("Error al enviar el reporte:", error);
      });
    // Se obtiene la información del perfil denunciado
    firebase.database().ref('users/' + currentViewedAuthorId).once('value').then(authorSnap => {
      if (!authorSnap.exists()) {
        alert("El perfil reportado no existe.");
        return;
      }
      var reportedData = authorSnap.val();
      var reportedUsername = reportedData.username || "";
      // Guardamos el nombre denunciado en el reporte (opcional)
      reportData.reportedName = reportedUsername;
      // Simular un tiempo de verificación de 16 segundos
      setTimeout(() => {
        // Se realizan las comprobaciones (puedes agregar otros criterios si lo deseas)
        if (contienePalabrasOfensivas(reportedUsername)) {
          // Si se detecta lenguaje ofensivo: actualizar el perfil denunciado para bloquearlo
          firebase.database().ref('users/' + currentViewedAuthorId).update({
            blocked: true,
            // Bloqueo por 24 horas (ajusta este tiempo según tus políticas)
            blockedUntil: Date.now() + (24 * 60 * 60 * 1000)
          }).then(() => {
            // Notificación al perfil denunciado indicando el bloqueo
            firebase.database().ref('notifications/' + currentViewedAuthorId).push({
              message: "Hemos detectado que tu perfil contiene lenguaje ofensivo. Tu cuenta ha sido bloqueada temporalmente hasta que un administrador la revise.",
              timestamp: Date.now(),
              read: false
            });
          });
          // Notificar al denunciante
          addNotification(user.uid, "Hemos revisado el perfil que has reportado y se han detectado infracciones. El perfil denunciado ha sido bloqueado hasta su revisión.");
          // Mostrar un mensaje en un modal de respuesta
          document.getElementById('admin-response-modal').innerHTML = `
          <div class="p-6 text-center">
            <h2 class="text-2xl font-bold mb-4">Reporte Procesado</h2>
            <p>Hemos revisado el perfil que has reportado. Se han detectado infracciones por lenguaje ofensivo y el perfil ha sido bloqueado hasta que un administrador lo revise.</p>
            <button onclick="closeAdminResponseModal()" class="bg-[#58CC02] text-white px-4 py-2 rounded mt-4">Cerrar</button>
          </div>`;
        } else {
          // Si no se detecta ninguna infracción en el nombre
          addNotification(user.uid, "Hemos revisado el perfil que has reportado y no hemos encontrado ningún problema.");
          document.getElementById('admin-response-modal').innerHTML = `
          <div class="p-6 text-center">
            <h2 class="text-2xl font-bold mb-4">Reporte Procesado</h2>
            <p>Hemos revisado el perfil que has reportado y no se han encontrado infracciones.</p>
            <button onclick="closeAdminResponseModal()" class="bg-[#58CC02] text-white px-4 py-2 rounded mt-4">Cerrar</button>
          </div>`;
        }
        document.getElementById('admin-response-modal').style.display = "none";
      }, 16000); // 16 segundos de retardo para procesar
    });
  });
  /*********************** CREACIÓN DE HISTORIAS **************************/
  document.getElementById('story-form').addEventListener('submit', function(e) {
    e.preventDefault();
    document.getElementById('story-upload-spinner').style.display = "flex";
    var title = document.getElementById('story-title').value;
    var category = document.getElementById('story-category').value;
    var synopsis = document.getElementById('story-synopsis').value || "";
    var language = document.getElementById('story-language').value;
    var rating = document.getElementById('story-rating').value;
    var coverInput = document.getElementById('story-cover');
    var user = firebase.auth().currentUser;
    if (!user) {
      alert(translations[currentLanguage].userNotAuthenticated);
      document.getElementById('story-upload-spinner').style.display = "none";
      return;
    }
    var newStory = {
      userId: user.uid,
      title,
      category,
      synopsis,
      language,
      type: storyTypeSelected,
      coverImage: "",
      createdAt: Date.now(),
      isPrivate: false,
      views: 0,
      rating: rating,
      email: user.email
    };
    if (storyTypeSelected === 'cuento') {
      newStory.content = document.getElementById('cuento-content') ? document.getElementById('cuento-content').value : "";
    }

    function saveStory(coverURL = "") {
      newStory.coverImage = coverURL;
      firebase.database().ref('users/' + user.uid).once('value').then(snapshot => {
        var userData = snapshot.val();
        newStory.username = userData && userData.username ? userData.username : "Autor Desconocido";
        newStory.email = userData.email || user.email;
        var storyRef = firebase.database().ref('stories').push();
        newStory.id = storyRef.key;
        storyRef.set(newStory)
          .then(() => {
            document.getElementById('story-upload-spinner').style.display = "none";
            setTimeout(() => {
              document.getElementById('story-details-view').classList.add('hidden');
              openStoryEdit(newStory);
            }, 3000);
          })
          .catch(error => {
            console.error("Error al guardar la historia:", error);
            document.getElementById('story-upload-spinner').style.display = "none";
          });
      });
    }
    if (coverInput.files.length > 0) {
      var file = coverInput.files[0];
      validateCoverImage(file)
        .then(() => {
          return convertFileToBase64(file);
        })
        .then((base64Image) => {
          saveStory(base64Image);
        })
        .catch(errMsg => {
          alert(errMsg);
          document.getElementById('story-upload-spinner').style.display = "none";
        });
    } else {
      saveStory();
    }
  });

  function closeStoryCreation() {
    document.getElementById('story-creation-view').classList.add('hidden');
  }

  function backToStoryType() {
    document.getElementById('story-details-view').classList.add('hidden');
    document.getElementById('story-creation-view').classList.remove('hidden');
  }

  function validateCoverImage(file) {
    return new Promise((resolve, reject) => {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function() {
        var ratio = img.naturalWidth / img.naturalHeight;
        if (ratio > 3 || ratio < 0.3) {
          URL.revokeObjectURL(url);
          reject("La imagen de portada tiene un formato no permitido (posible screenshot).");
        } else {
          URL.revokeObjectURL(url);
          resolve();
        }
      };
      img.onerror = function() {
        URL.revokeObjectURL(url);
        reject("Error al cargar la imagen.");
      };
      img.src = url;
    });
  }
  /*********************** CAPÍTULOS **************************/
  function openChapterCreationModal() {
    currentChapterEditId = null;
    document.getElementById('chapter-form').reset();
    document.getElementById('word-count').innerText = "0 palabras";
    document.getElementById('letter-count').innerText = "0 letras";
    document.getElementById('font-size').value = 16;
    document.getElementById('font-size-value').innerText = "16px";
    document.getElementById('chapter-content').style.fontSize = "16px";
    document.getElementById('chapter-content').style.fontFamily = "Arial";
    document.getElementById('btn-save-chapter').textContent = translations[currentLanguage].btnSaveChapter;
    document.getElementById('chapter-creation-modal').style.display = "flex";
  }

  function closeChapterCreationModal() {
    document.getElementById('chapter-creation-modal').style.display = "none";
    document.getElementById('chapter-form').reset();
    document.getElementById('word-count').innerText = "0 palabras";
    document.getElementById('letter-count').innerText = "0 letras";
    document.getElementById('font-size').value = 16;
    document.getElementById('font-size-value').innerText = "16px";
    document.getElementById('chapter-content').style.fontSize = "16px";
    document.getElementById('chapter-content').style.fontFamily = "Arial";
    document.getElementById('chapter-schedule').value = "";
    currentChapterEditId = null;
    document.getElementById('btn-save-chapter').textContent = translations[currentLanguage].btnSaveChapter;
  }
  document.getElementById('chapter-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var content = document.getElementById('chapter-content').value;
    var scheduledDate = document.getElementById('chapter-schedule').value;

    if (!currentEditingStory) {
      alert(translations[currentLanguage].noEditingStory);
      return;
    }

    var user = firebase.auth().currentUser;
    if (!user) {
      alert(translations[currentLanguage].userNotAuthenticated);
      return;
    }

    if (currentChapterEditId) {
      var chapterRef = firebase.database().ref('stories/' + currentEditingStory.id + '/chapters/' + currentChapterEditId);
      chapterRef.update({
          content: content
        })
        .then(() => {
          closeChapterCreationModal();
          alert("Capítulo actualizado correctamente.");
        })
        .catch(error => {
          console.error("Error al actualizar capítulo:", error);
        });
    } else {
      var chapterNumber = currentChapters.length + 1;
      var newChapter = {
        chapterNumber,
        content,
        createdAt: Date.now(),
        status: 'published'
      };

      var chapterRef = firebase.database().ref('stories/' + currentEditingStory.id + '/chapters').push();
      newChapter.id = chapterRef.key;

      chapterRef.set(newChapter)
        .then(() => {
          closeChapterCreationModal();
          alert(translations[currentLanguage].chapterAdded);
        })
        .catch(error => {
          console.error("Error al agregar capítulo:", error);
        });
    }
  });

  function openChapterEditModal(chapter) {
    currentChapterEditId = chapter.id;
    document.getElementById('chapter-content').value = chapter.content;
    document.getElementById('btn-save-chapter').textContent = "Guardar Cambios";
    document.getElementById('chapter-creation-modal').style.display = "flex";
  }

  function deleteChapter(chapterId) {
    if (confirm("¿Estás seguro de eliminar este capítulo?")) {
      firebase.database().ref('stories/' + currentEditingStory.id + '/chapters/' + chapterId).remove()
        .then(() => {
          alert("Capítulo eliminado correctamente.");
        })
        .catch(error => {
          console.error("Error al eliminar capítulo:", error);
        });
    }
  }

  /*********************** EFECTO SKELETON **************************/
  function applySkeletonEffect() {
    document.getElementById('profile-image').classList.add('skeleton');
    document.getElementById('profile-username').classList.add('skeleton');
    document.getElementById('profile-bio').classList.add('skeleton');
    var userPosts = document.getElementById('user-posts');
    if (userPosts) {
      userPosts.classList.add('skeleton');
    }
  }

  function removeSkeletonEffect() {
    document.getElementById('profile-image').classList.remove('skeleton');
    document.getElementById('profile-username').classList.remove('skeleton');
    document.getElementById('profile-bio').classList.remove('skeleton');
    var userPosts = document.getElementById('user-posts');
    if (userPosts) {
      userPosts.classList.remove('skeleton');
    }
  }
  if (!navigator.onLine) {
    applySkeletonEffect();
  }
  window.addEventListener('offline', applySkeletonEffect);
  window.addEventListener('online', removeSkeletonEffect);
  /*********************** CARGA DE HISTORIAS **************************/
  function loadStories() {
    firebase.database().ref('stories').on('value', snapshot => {
      var stories = [];
      snapshot.forEach(child => {
        stories.push(child.val());
      });
      var newReleases = stories.sort((a, b) => b.createdAt - a.createdAt);
      renderStories(newReleases, 'new-releases', false);
      var top10 = stories.sort((a, b) => b.views - a.views).slice(0, 10);
      renderStories(top10, 'top10', false);
      var popular = stories.sort((a, b) => b.views - a.views);
      renderStories(popular, 'popular', false);
      var terrorStories = stories.filter(story => story.category === 'terror');
      renderStories(terrorStories, 'terror-stories', false);
    });
  }

  function renderStories(stories, elementId, editMode) {
    var container = document.getElementById(elementId);
    if (!container) return;
    container.innerHTML = '';
    stories.forEach(story => {
      if (story.blocked) return;
      var storyCard = document.createElement('div');
      storyCard.className = 'story-card cursor-pointer relative';
      storyCard.onclick = editMode ? () => openStoryEdit(story) : null;
      storyCard.innerHTML = `
          <div class="rounded-2xl overflow-hidden shadow-md transform transition-transform hover:scale-105">
            <div class="story-cover-container">
              <img src="${story.coverImage || '/api/placeholder/200/300'}" alt="${story.title}" class="story-cover-image">
            </div>
          </div>
          <div class="mt-2">
            <h3 class="font-semibold text-sm">${story.title}</h3>
          </div>
        `;
      var languageDiv = document.createElement('div');
      languageDiv.className = "mt-1 flex items-center space-x-2";
      languageDiv.innerHTML = `<span class="text-xs text-gray-400">Idioma: ${story.language || "N/A"}</span>`;
      if (story.rating === "18plus") {
        languageDiv.innerHTML += ' <span class="text-xs text-red-600 font-bold border border-red-600 rounded px-1">+18</span>';
      }
      storyCard.appendChild(languageDiv);
      container.appendChild(storyCard);
    });
  }
  /*********************** NUEVAS FUNCIONES: SUGERENCIAS Y AUTORES DESTACADOS **************************/
  function loadSuggestedStories() {
    var container = document.getElementById('suggested-stories');
    if (!container) return;
    firebase.database().ref('stories').once('value').then(snapshot => {
      var stories = [];
      snapshot.forEach(child => {
        var story = child.val();
        story.id = child.key;
        stories.push(story);
      });
      stories.sort((a, b) => (b.ratingValue || 0) - (a.ratingValue || 0));
      var suggested = stories.slice(0, 10);
      var container = document.getElementById('suggested-stories');
      container.innerHTML = '';
      suggested.forEach(story => {
        var card = document.createElement('div');
        card.className = 'story-card cursor-pointer';
        card.innerHTML = `
              <div class="rounded-2xl overflow-hidden shadow-md">
                <div class="story-cover-container">
                  <img src="${story.coverImage || '/api/placeholder/200/300'}" alt="${story.title}" class="story-cover-image">
                </div>
              </div>
              <div class="mt-2">
                <h3 class="font-semibold text-sm">${story.title}</h3>
              </div>
            `;
        container.appendChild(card);
      });
    });
  }

  function loadFeaturedAuthors() {
    var container = document.getElementById('featured-authors');
    if (!container) return;
    firebase.database().ref('stories').once('value').then(snapshot => {
      var authorCounts = {};
      snapshot.forEach(child => {
        var story = child.val();
        if (story && story.userId) {
          if (!authorCounts[story.userId]) authorCounts[story.userId] = 0;
          authorCounts[story.userId]++;
        }
      });
      var authorsArray = [];
      for (let uid in authorCounts) {
        authorsArray.push({
          uid: uid,
          count: authorCounts[uid]
        });
      }
      authorsArray.sort((a, b) => b.count - a.count);
      var topAuthors = authorsArray.slice(0, 10);
      var container = document.getElementById('featured-authors');
      container.innerHTML = '';
      topAuthors.forEach(author => {
        firebase.database().ref('users/' + author.uid).once('value').then(userSnap => {
          var userData = userSnap.val();
          var card = document.createElement('div');
          card.className = 'story-card cursor-pointer';
          card.onclick = () => openAuthorProfile(author.uid);
          card.innerHTML = `
                <div class="rounded-2xl overflow-hidden shadow-md">
                  <img src="${userData.profileImage || 'https://via.placeholder.com/150'}" alt="${userData.username}" class="w-full h-40 object-cover">
                </div>
                <div class="mt-2">
                  <h3 class="font-semibold text-sm">${userData.username}</h3>
                </div>
              `;
          container.appendChild(card);
        });
      });
    });
  }
  /*********************** NUEVAS FUNCIONES: DESCARGAR HISTORIA COMPLETA PARA LECTURA OFFLINE **************************/
  function downloadStory() {
    if (!window.currentStoryId) {
      alert("No se ha seleccionado una historia.");
      return;
    }
    var storyId = window.currentStoryId;
    var btn = document.getElementById('download-story-btn');
    var icon = btn.querySelector('i');
    icon.classList.add('fa-spin');
    firebase.database().ref('stories/' + storyId).once('value')
      .then(storySnap => {
        var storyData = storySnap.val();
        if (!storyData) {
          throw new Error("Historia no encontrada");
        }
        return firebase.database().ref('stories/' + storyId + '/chapters').once('value')
          .then(chaptersSnap => {
            var chaptersHTML = '';
            chaptersSnap.forEach(child => {
              var chapter = child.val();
              chapter.id = child.key;
              // Se crea un bloque para cada capítulo con título y contenido completo
              chaptersHTML += `<div class="chapter" style="margin-bottom:20px;">
                  <h3 style="margin-bottom:10px;">Capítulo ${chapter.chapterNumber}</h3>
                  <p style="text-align:justify; white-space: pre-wrap;">${chapter.content}</p>
                </div>`;
            });
            storyData.chaptersHTML = chaptersHTML;
            return storyData;
          });
      })
      .then(storyData => {
        var htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${storyData.title}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    .cover { max-width: 100%; height: auto; }
    .chapter { margin-top: 20px; margin-bottom: 20px; }
    .chapter h3 { margin-bottom: 10px; }
    .chapter p { text-align: justify; white-space: pre-wrap; }
  </style>
</head>
<body>
  <h1>${storyData.title}</h1>
  <img src="${storyData.coverImage}" alt="Portada" class="cover">
  <div class="chapters">
    ${storyData.chaptersHTML}
  </div>
</body>
</html>`;
        var blob = new Blob([htmlContent], {
          type: 'text/html'
        });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = storyData.title.replace(/\s+/g, '_') + '.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        icon.classList.remove('fa-spin');
        icon.classList.remove('fa-download');
        icon.classList.add('fa-check');
        alert("Historia descargada para lectura offline.");
        setTimeout(() => {
          icon.classList.remove('fa-check');
          icon.classList.add('fa-download');
        }, 2000);
      })
      .catch(err => {
        console.error(err);
        alert("Error al descargar la historia: " + err.message);
        icon.classList.remove('fa-spin');
      });
  }
  /*********************** LIVE STREAMING **************************/
  var liveLocalStream = null;
  var livePeerConnection = null;
  var liveBroadcasting = false;
  var currentBroadcasterId = null;
  var giftListenerRef = null;

  function giftListenerCallback(snapshot) {
    var gift = snapshot.val();
    var giftUrl = "";
    if (gift.giftType === "mariposas") {
      giftUrl = "https://i.pinimg.com/originals/7c/29/36/7c2936db7563085ef7470d50fd06e4e3.gif";
    } else if (gift.giftType === "ballena") {
      giftUrl = "https://i.pinimg.com/originals/86/31/83/863183316ed35cfeda7baf9ee1de0596.gif";
    } else if (gift.giftType === "corazon_coreano") {
      giftUrl = "https://cdn.pixabay.com/animation/2022/09/17/16/20/16-20-08-700_512.gif";
    } else if (gift.giftType === "Globo") {
      giftUrl = "https://i.pinimg.com/originals/2d/f8/97/2df897364f655a0b14070a9e2f95d602.gif";
    } else if (gift.giftType === "ciudad_deseñcionada") {
      giftUrl = "https://i.pinimg.com/originals/6a/9a/74/6a9a7425e736575ee78816254227d1a8.gif";
    } else if (gift.giftType === "diamante") {
      giftUrl = "https://i.pinimg.com/originals/79/a5/49/79a54992591652b1595c6c61c49170fb.gif";
    } else if (gift.giftType === "oso_beaboo") {
      giftUrl = "https://www.icegif.com/wp-content/uploads/2021/11/icegif-346.gif";
    } else if (gift.giftType === "oso_saltarin") {
      giftUrl = "https://www.icegif.com/wp-content/uploads/2021/11/icegif-347.gif";
    } else if (gift.giftType === "besboos_carinosos") {
      giftUrl = "https://i.pinimg.com/originals/3b/d4/d9/3bd4d9778b5e0a11ab141cb7b545ab10.gif";
    } else if (gift.giftType === "besboos_leyendo") {
      giftUrl = "https://i.pinimg.com/originals/c6/41/ba/c641babc376ffe10f65ee472a646c6e1.gif";
    } else if (gift.giftType === "estrella") {
      giftUrl = "https://media3.giphy.com/media/svpuvuc70ht48WU6dj/giphy.gif?cid=6c09b952logfyfctuhi46ekgb2g7tmi345ycn9atumxwz7an&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=s";
    } else if (gift.giftType === "unicornio") {
      giftUrl = "https://cdn.pixabay.com/animation/2024/12/02/02/56/02-56-03-27_512.gif";
    } else if (gift.giftType === "arcoiris") {
      giftUrl = "https://i.pinimg.com/originals/17/9c/e7/179ce7068a3c543261505ea69398b714.gif";
    } else if (gift.giftType === "pastel") {
      giftUrl = "https://i.gifer.com/3EcT.gif";
    } else if (gift.giftType === "baile") {
      giftUrl = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh0_aNKZP5QwCAtf0QD5SBK4JulDqNJr6UDg8w4R-E_12arxSsP_HBQhksCL-7xfipx_uVmYbagEFjE8tZGBX-AO40PwMJvIOpr49e_sedIGjCWkUqkrUJZGR4vwr4ygNUrR1hreOsTgc4/s1600/BkM47.gif";
    } else if (gift.giftType === "musica") {
      giftUrl = "https://i.pinimg.com/originals/68/fc/a0/68fca09b36725b767735abef8c7e1117.gif";
    } else if (gift.giftType === "sol") {
      giftUrl = "https://cdn.pixabay.com/animation/2024/03/08/13/17/13-17-23-34_512.gif";
    } else if (gift.giftType === "nube") {
      giftUrl = "https://cdn.pixabay.com/animation/2022/09/17/16/20/16-20-08-700_512.gif";
    } else if (gift.giftType === "globo") {
      giftUrl = "https://images.emojiterra.com/google/noto-emoji/animated-emoji/1f388.gif";
    } else if (gift.giftType === "caramelo") {
      giftUrl = "https://i.pinimg.com/originals/e2/9c/7b/e29c7bc3faadc09dfcddb6ca11243c6d.gif";
    } else if (gift.giftType === "delfin") {
      giftUrl = "https://media.tenor.com/TyrY0krJG3kAAAAj/milk-and-mocha.gif";
    } else if (gift.giftType === "fuego") {
      giftUrl = "https://i.pinimg.com/originals/af/8a/27/af8a27bf984e189f6a6bd7a6922075c1.gif";
    }
    if (giftUrl !== "") {
      showGiftAnimation(giftUrl, gift.senderName);
    }
    snapshot.ref.remove();
  }

  function listenForGifts() {
    if (!currentBroadcasterId) return;
    giftListenerRef = firebase.database().ref(`liveStreams/${currentBroadcasterId}/gifts`);
    giftListenerRef.on('child_added', giftListenerCallback);
  }

  function stopListeningForGifts() {
    if (giftListenerRef) {
      giftListenerRef.off('child_added', giftListenerCallback);
      giftListenerRef = null;
    }
  }

  function listenForComments(broadcasterId) {
    var commentsRef = firebase.database().ref(`liveStreams/${broadcasterId}/comments`);
    commentsRef.on('child_added', snapshot => {
      var comment = snapshot.val();
      var commentElem = document.createElement('div');
      commentElem.className = 'comment-bubble';
      commentElem.textContent = comment.senderName + ": " + comment.text;
      if (document.getElementById('commentsContainerLive')) {
        document.getElementById('commentsContainerLive').appendChild(commentElem);
        setTimeout(() => {
          commentElem.remove();
        }, 3000);
      }
      if (firebase.auth().currentUser && firebase.auth().currentUser.uid === broadcasterId) {
        var bcContainer = document.getElementById('broadcasterCommentsContainer');
        if (bcContainer) {
          var clone = commentElem.cloneNode(true);
          bcContainer.appendChild(clone);
          bcContainer.scrollTop = bcContainer.scrollHeight;
        }
      }
    });
  }

  function openLiveStreamModal() {
    var user = firebase.auth().currentUser;
    if (!user) {
      alert("Debes estar autenticado para transmitir en vivo.");
      return;
    }
    // Todos los usuarios pueden transmitir en vivo
    if (!user.email) {
      alert("Por favor verifica tu correo electrónico para transmitir en vivo.");
      return;
    }
    currentBroadcasterId = user.uid;
    var useCamera = confirm("¿Desea transmitir en vivo usando su cámara? Presione OK para cámara, Cancelar para video pregrabado.");
    if (useCamera) {
      document.getElementById('live-stream-modal').classList.remove('hidden');
      navigator.mediaDevices.getUserMedia({
          video: true,
          audio: {
            echoCancellation: true
          }
        })
        .then(stream => {
          liveLocalStream = stream;
          document.getElementById('live-localVideo').srcObject = stream;
          setTimeout(() => {
            document.getElementById('live-spinner').style.display = "none";
          }, 3000);
        })
        .catch(err => {
          alert("Error al acceder a la cámara: " + err);
        });
    } else {
      document.getElementById('live-video-input').click();
    }
    var profileImg = document.getElementById('profile-image');
    if (profileImg) {
      profileImg.classList.add('live-border');
    }
    document.getElementById('live-spinner').style.display = "flex";
    listenForComments(currentBroadcasterId);
    listenForGifts();
  }

  function handleLiveVideoUpload(event) {
    var file = event.target.files[0];
    if (!file) return;
    var videoElement = document.createElement('video');
    videoElement.src = URL.createObjectURL(file);
    videoElement.autoplay = true;
    videoElement.loop = true;
    videoElement.controls = true;
    videoElement.play();
    videoElement.onloadedmetadata = function() {
      var canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      var ctx = canvas.getContext('2d');
      var promotionText = prompt("Ingrese información de promoción (opcional):");

      function drawFrame() {
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        ctx.font = "30px sans-serif";
        ctx.fillStyle = "rgba(88,204,2,0.7)";
        ctx.textAlign = "right";
        ctx.fillText("Drex", canvas.width - 10, canvas.height - 10);
        if (promotionText) {
          ctx.font = "24px sans-serif";
          ctx.fillStyle = "rgba(255,255,255,0.8)";
          ctx.textAlign = "left";
          ctx.fillText(promotionText, 10, 30);
        }
        requestAnimationFrame(drawFrame);
      }
      drawFrame();
      var canvasStream = canvas.captureStream(30);
      var chosenAudioPromise;
      var chosenLanguage = prompt("Ingrese el idioma de audio a transmitir: 'es' para español, 'en' para inglés. Deje en blanco para usar el audio original.");
      if (chosenLanguage === "es") {
        var audioFileInput = document.getElementById('live-audio-es');
        if (audioFileInput.files.length > 0) {
          var audioFile = audioFileInput.files[0];
          var audioElement = document.createElement('audio');
          audioElement.src = URL.createObjectURL(audioFile);
          audioElement.play();
          chosenAudioPromise = new Promise(resolve => {
            audioElement.onloadedmetadata = function() {
              resolve(audioElement.captureStream().getAudioTracks()[0]);
            }
          });
        }
      } else if (chosenLanguage === "en") {
        var audioFileInput = document.getElementById('live-audio-en');
        if (audioFileInput.files.length > 0) {
          var audioElement = document.createElement('audio');
          audioElement.src = URL.createObjectURL(audioFileInput.files[0]);
          audioElement.play();
          chosenAudioPromise = new Promise(resolve => {
            audioElement.onloadedmetadata = function() {
              resolve(audioElement.captureStream().getAudioTracks()[0]);
            }
          });
        }
      }
      if (!chosenAudioPromise) {
        var videoStream = videoElement.captureStream();
        chosenAudioPromise = Promise.resolve(videoStream.getAudioTracks()[0]);
      }
      chosenAudioPromise.then(audioTrack => {
        if (audioTrack) {
          canvasStream.addTrack(audioTrack);
        }
        liveLocalStream = canvasStream;
        document.getElementById('live-stream-modal').classList.remove('hidden');
        document.getElementById('live-localVideo').srcObject = liveLocalStream;
        setTimeout(() => {
          document.getElementById('live-spinner').style.display = "none";
        }, 3000);
      });
    };
  }

  function closeLiveStreamModal() {
    document.getElementById('live-stream-modal').classList.add('hidden');
    if (liveLocalStream) {
      liveLocalStream.getTracks().forEach(track => track.stop());
      liveLocalStream = null;
    }
    if (liveBroadcasting) {
      endLiveStream();
    }
    var profileImg = document.getElementById('profile-image');
    if (profileImg) {
      profileImg.classList.remove('live-border');
    }
    stopListeningForGifts();
  }

  function startLiveCountdown(duration, callback) {
    var remaining = duration;
    var countdownEl = document.getElementById('live-countdown');
    countdownEl.textContent = remaining;
    var interval = setInterval(() => {
      remaining--;
      if (remaining > 0) {
        countdownEl.textContent = remaining;
      } else {
        clearInterval(interval);
        countdownEl.textContent = "";
        callback();
      }
    }, 1000);
  }
  document.getElementById('live-startBtn').addEventListener('click', () => {
    startLiveCountdown(10, () => {
      document.getElementById('live-indicator').classList.remove('hidden');
      document.getElementById('live-startBtn').classList.add('hidden');
      document.getElementById('live-endBtn').classList.remove('hidden');
      startBroadcasting();
    });
  });

  function startBroadcasting() {
    livePeerConnection = new RTCPeerConnection();
    liveLocalStream.getTracks().forEach(track => {
      livePeerConnection.addTrack(track, liveLocalStream);
    });
    livePeerConnection.onicecandidate = event => {
      if (event.candidate) {
        firebase.database().ref(`liveStreams/${currentBroadcasterId}/candidates`).push(event.candidate.toJSON());
      }
    };
    livePeerConnection.createOffer().then(offer => {
      return livePeerConnection.setLocalDescription(offer).then(() => offer);
    }).then(offer => {
      firebase.database().ref(`liveStreams/${currentBroadcasterId}`).set({
        isLive: true,
        offer: offer,
        views: 0
      });
      liveBroadcasting = true;
      firebase.database().ref(`liveStreams/${currentBroadcasterId}/views`).on('value', snapshot => {
        var views = snapshot.val() || 0;
        document.getElementById('live-viewCount').textContent = views + " vistas";
      });
      listenForComments(currentBroadcasterId);
    });
  }

  function endLiveStream() {
    if (livePeerConnection) {
      livePeerConnection.close();
      livePeerConnection = null;
    }
    firebase.database().ref(`liveStreams/${currentBroadcasterId}`).remove();
    liveBroadcasting = false;
    var profileImg = document.getElementById('profile-image');
    if (profileImg) {
      profileImg.classList.remove('live-border');
    }
    setTimeout(() => {
      closeLiveStreamModal();
    }, 3000);
  }
  document.getElementById('live-endBtn').addEventListener('click', () => {
    endLiveStream();
  });

  function openLiveViewModal(broadcasterId) {
    liveBroadcasterId = broadcasterId;
    firebase.database().ref('users/' + broadcasterId).once('value').then(snapshot => {
      var data = snapshot.val();
      if (data && data.username) {
        document.getElementById('streamerName').innerText = data.username;
      }
    });
    document.getElementById('live-view-modal').classList.remove('hidden');
    firebase.database().ref(`liveStreams/${broadcasterId}/views`).on('value', snapshot => {
      var views = snapshot.val() || 0;
      document.getElementById('viewerCountLive').textContent = views;
    });
    firebase.database().ref(`liveStreams/${broadcasterId}/views`).transaction(current => (current || 0) + 1);
    var viewerPC = new RTCPeerConnection();
    viewerPC.onicecandidate = event => {
      if (event.candidate) {
        firebase.database().ref(`liveStreams/${broadcasterId}/viewerCandidates`).push(event.candidate.toJSON());
      }
    };
    viewerPC.ontrack = event => {
      document.getElementById('live-remoteVideo').srcObject = event.streams[0];
    };
    firebase.database().ref(`liveStreams/${broadcasterId}/offer`).once('value').then(snapshot => {
      var offer = snapshot.val();
      if (!offer) {
        alert("El autor no está transmitiendo.");
        closeLiveViewModal();
        return;
      }
      viewerPC.setRemoteDescription(new RTCSessionDescription(offer))
        .then(() => viewerPC.createAnswer())
        .then(answer => viewerPC.setLocalDescription(answer).then(() => answer))
        .then(answer => {
          firebase.database().ref(`liveStreams/${broadcasterId}/answer`).set(answer);
        });
    });
    firebase.database().ref(`liveStreams/${broadcasterId}`).on('value', snapshot => {
      if (!snapshot.exists()) {
        document.getElementById('live-endedMessage') && document.getElementById('live-endedMessage').classList.remove('hidden');
        setTimeout(closeLiveViewModal, 3000);
      }
    });
    listenForComments(broadcasterId);
    window.currentViewerPC = viewerPC;
  }

  function closeLiveViewModal() {
    document.getElementById('live-view-modal').classList.add('hidden');
    document.getElementById('live-endedMessage') && document.getElementById('live-endedMessage').classList.add('hidden');
    if (window.currentViewerPC) {
      window.currentViewerPC.close();
      window.currentViewerPC = null;
    }
  }
  document.getElementById('gift-btn') && document.getElementById('gift-btn').addEventListener('click', () => {
    document.getElementById('gift-drawer').classList.add('open');
  });

  function closeGiftDrawer() {
    document.getElementById('gift-drawer').classList.remove('open');
  }

  function sendGift(giftType) {
    var currentUser = firebase.auth().currentUser;
    if (!currentUser || currentUser.uid === liveBroadcasterId) {
      alert("No puedes enviar regalos a ti mismo.");
      return;
    }
    firebase.database().ref('users/' + liveBroadcasterId).transaction(userData => {
      if (userData) {
      }
      return userData;
    }).then(() => {
      var giftData = {
        giftType: giftType,
        senderName: currentUser.displayName || currentUser.email || "Alguien",
        timestamp: Date.now()
      };
      firebase.database().ref(`liveStreams/${liveBroadcasterId}/gifts`).push(giftData);
      closeGiftDrawer();
    }).catch(error => {
      console.error("Error al enviar regalo:", error);
    });
  }

  function showGiftAnimation(giftUrl, senderName) {
    var transmitBtn = document.getElementById('live-startBtn');
    if (transmitBtn) transmitBtn.style.display = 'none';
    var animContainer = document.getElementById('gift-animation');
    animContainer.innerHTML = `
        <div class="text-center">
          <p class="text-white mb-1">${senderName} ha enviado un regalo</p>
          <img src="${giftUrl}" alt="Regalo" class="mx-auto" style="max-width: 80%; max-height: 80%;">
        </div>`;
    animContainer.classList.add('show');
    setTimeout(() => {
      animContainer.classList.remove('show');
    }, 4000);
  }
  /*********************** REPORTAR HISTORIA Y BLOQUEO **************************/
  var lastX = null,
    lastY = null,
    lastZ = null;
  var shakeThreshold = 15;
  var shakeTimeout = null;

  function deviceMotionHandler(event) {
    var acceleration = event.accelerationIncludingGravity;
    if (!acceleration) return;
    var {
      x,
      y,
      z
    } = acceleration;
    if (lastX === null) {
      lastX = x;
      lastY = y;
      lastZ = z;
      return;
    }
    var deltaX = Math.abs(x - lastX);
    var deltaY = Math.abs(y - lastY);
    var deltaZ = Math.abs(z - lastZ);
    if (deltaX + deltaY + deltaZ > shakeThreshold) {
      if (!shakeTimeout) {
        triggerReportModal();
        shakeTimeout = setTimeout(() => {
          shakeTimeout = null;
        }, 1000);
      }
    }
    lastX = x;
    lastY = y;
    lastZ = z;
  }

  function initShakeDetection() {
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', deviceMotionHandler, false);
    } else {
      console.log("DeviceMotionEvent no está soportado");
    }
  }

  function triggerReportModal() {
  }

  function openReportStoryModal() {
    var reportModal = document.getElementById('report-story-modal');
    if (reportModal) {
      reportModal.style.display = 'block';
      setTimeout(() => {
        reportModal.style.transform = 'translateY(0)';
      }, 10);
    }
  }

  function closeReportStoryModal() {
    var reportModal = document.getElementById('report-story-modal');
    if (reportModal) {
      reportModal.style.transform = 'translateY(100%)';
      setTimeout(() => {
        reportModal.style.display = 'none';
      }, 300);
    }
  }
  document.getElementById('report-story-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var formData = new FormData(e.target);
    var reason = formData.get('reportReason');
    var description = document.getElementById('report-story-description').value;
    if (!window.currentStoryId) {
      alert("No se ha seleccionado una historia.");
      return;
    }
    var user = firebase.auth().currentUser;
    if (!user) {
      alert("Debes estar autenticado para reportar.");
      return;
    }
    var reportData = {
      reporter: user.uid,
      reporterName: user.displayName || user.email,
      storyId: window.currentStoryId,
      reason: reason,
      description: description,
      timestamp: Date.now(),
      status: "pending"
    };
    firebase.database().ref('storyReports').push(reportData)
      .then(() => {
        alert("Reporte enviado.");
        closeReportStoryModal();
      })
      .catch(error => {
        console.error("Error al enviar reporte:", error);
      });
  });

  function listenForStoryBlock(storyId) {
    firebase.database().ref('stories/' + storyId + '/blocked').on('value', snapshot => {
      if (snapshot.exists() && snapshot.val() === true) {
        openStoryBlockedModal();
      }
    });
  }

  function openStoryBlockedModal() {
    var modal = document.getElementById('story-blocked-modal');
    if (modal) {
      modal.style.display = 'flex';
    }
  }
  var blockedStartX = null;
  var storyBlockedModal = document.getElementById('story-blocked-modal');
  if (storyBlockedModal) {
    storyBlockedModal.addEventListener('touchstart', function(e) {
      blockedStartX = e.touches[0].clientX;
    });
    storyBlockedModal.addEventListener('touchmove', function(e) {
      if (blockedStartX === null) return;
      var diffX = blockedStartX - e.touches[0].clientX;
      if (diffX > 100) {
        triggerBlockedAnimation();
        blockedStartX = null;
      }
    });
  }

  function triggerBlockedAnimation() {
    var dot1 = document.createElement('div');
    var dot2 = document.createElement('div');
    [dot1, dot2].forEach(dot => {
      dot.style.position = 'absolute';
      dot.style.width = '20px';
      dot.style.height = '20px';
      dot.style.backgroundColor = '#58CC02';
      dot.style.borderRadius = '50%';
      dot.style.transition = 'all 0.5s ease-in-out';
    });
    dot1.style.top = '50%';
    dot1.style.left = '10%';
    dot2.style.top = '50%';
    dot2.style.left = '80%';
    storyBlockedModal.appendChild(dot1);
    storyBlockedModal.appendChild(dot2);
    setTimeout(() => {
      dot1.style.left = '45%';
      dot2.style.left = '55%';
    }, 100);
    setTimeout(() => {
      storyBlockedModal.style.display = 'none';
      dot1.remove();
      dot2.remove();
    }, 1000);
  }
  window.addEventListener('load', initShakeDetection);
  /*********************** MODAL DE CREACIÓN DE CAPÍTULO **************************/
  document.getElementById('font-family').addEventListener('change', function() {
    document.getElementById('chapter-content').style.fontFamily = this.value;
  });
  document.getElementById('font-size').addEventListener('input', function() {
    var size = this.value;
    document.getElementById('chapter-content').style.fontSize = size + "px";
    document.getElementById('font-size-value').innerText = size + "px";
  });
  document.getElementById('chapter-content').addEventListener('input', function() {
    var text = this.value;
    var words = text.trim().split(/\s+/).filter(word => word.length > 0);
    document.getElementById('word-count').innerText = words.length + " palabras";
    document.getElementById('letter-count').innerText = text.replace(/\s/g, "").length + " letras";
  });
  /*********************** NUEVAS FUNCIONES: SUGERENCIAS Y AUTORES DESTACADOS **************************/
  function loadSuggestedStories() {
    var container = document.getElementById('suggested-stories');
    if (!container) return;
    firebase.database().ref('stories').once('value').then(snapshot => {
      var stories = [];
      snapshot.forEach(child => {
        var story = child.val();
        story.id = child.key;
        stories.push(story);
      });
      stories.sort((a, b) => (b.ratingValue || 0) - (a.ratingValue || 0));
      var suggested = stories.slice(0, 10);
      var container = document.getElementById('suggested-stories');
      container.innerHTML = '';
      suggested.forEach(story => {
        var card = document.createElement('div');
        card.className = 'story-card cursor-pointer';
        card.innerHTML = `
              <div class="rounded-2xl overflow-hidden shadow-md">
                <div class="story-cover-container">
                  <img src="${story.coverImage || '/api/placeholder/200/300'}" alt="${story.title}" class="story-cover-image">
                </div>
              </div>
              <div class="mt-2">
                <h3 class="font-semibold text-sm">${story.title}</h3>
              </div>
            `;
        container.appendChild(card);
      });
    });
  }

  function loadFeaturedAuthors() {
    var container = document.getElementById('featured-authors');
    if (!container) return;
    firebase.database().ref('stories').once('value').then(snapshot => {
      var authorCounts = {};
      snapshot.forEach(child => {
        var story = child.val();
        if (story && story.userId) {
          if (!authorCounts[story.userId]) authorCounts[story.userId] = 0;
          authorCounts[story.userId]++;
        }
      });
      var authorsArray = [];
      for (let uid in authorCounts) {
        authorsArray.push({
          uid: uid,
          count: authorCounts[uid]
        });
      }
      authorsArray.sort((a, b) => b.count - a.count);
      var topAuthors = authorsArray.slice(0, 10);
      var container = document.getElementById('featured-authors');
      container.innerHTML = '';
      topAuthors.forEach(author => {
        firebase.database().ref('users/' + author.uid).once('value').then(userSnap => {
          var userData = userSnap.val();
          var card = document.createElement('div');
          card.className = 'story-card cursor-pointer';
          card.onclick = () => openAuthorProfile(author.uid);
          card.innerHTML = `
                <div class="rounded-2xl overflow-hidden shadow-md">
                  <img src="${userData.profileImage || 'https://via.placeholder.com/150'}" alt="${userData.username}" class="w-full h-40 object-cover">
                </div>
                <div class="mt-2">
                  <h3 class="font-semibold text-sm">${userData.username}</h3>
                </div>
              `;
          container.appendChild(card);
        });
      });
    });
  }
  /*************** FIN NUEVAS FUNCIONES **************************/

// ===== BLOQUE JS 15 =====
function downloadStory() {
    if (!window.currentStoryId) {
      alert("No se ha seleccionado una historia.");
      return;
    }
    var storyId = window.currentStoryId;
    var btn = document.getElementById('download-story-btn');
    var icon = btn.querySelector('i');
    icon.classList.add('fa-spin');
    firebase.database().ref('stories/' + storyId).once('value')
      .then(storySnap => {
        var storyData = storySnap.val();
        if (!storyData) {
          throw new Error("Historia no encontrada");
        }
        return firebase.database().ref('stories/' + storyId + '/chapters').once('value')
          .then(chaptersSnap => {
            var chaptersHTML = '';
            chaptersSnap.forEach(child => {
              var chapter = child.val();
              chapter.id = child.key;
              // Se crea un bloque para cada capítulo con título y contenido completo
              chaptersHTML += `<div class="chapter" style="margin-bottom:20px;">
                  <h3 style="margin-bottom:10px;">Capítulo ${chapter.chapterNumber}</h3>
                  <p style="text-align:justify; white-space: pre-wrap;">${chapter.content}</p>
                </div>`;
            });
            storyData.chaptersHTML = chaptersHTML;
            return storyData;
          });
      })
      .then(storyData => {
        var htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${storyData.title}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    .cover { max-width: 100%; height: auto; }
    .chapter { margin-top: 20px; margin-bottom: 20px; }
    .chapter h3 { margin-bottom: 10px; }
    .chapter p { text-align: justify; white-space: pre-wrap; }
  </style>
</head>
<body>
  <h1>${storyData.title}</h1>
  <img src="${storyData.coverImage}" alt="Portada" class="cover">
  <div class="chapters">
    ${storyData.chaptersHTML}
  </div>
</body>
</html>`;
        var blob = new Blob([htmlContent], {
          type: 'text/html'
        });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = storyData.title.replace(/\s+/g, '_') + '.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        icon.classList.remove('fa-spin');
        icon.classList.remove('fa-download');
        icon.classList.add('fa-check');
        alert("Historia descargada para lectura offline.");
        setTimeout(() => {
          icon.classList.remove('fa-check');
          icon.classList.add('fa-download');
        }, 2000);
      })
      .catch(err => {
        console.error(err);
        alert("Error al descargar la historia: " + err.message);
        icon.classList.remove('fa-spin');
      });
  }

// ===== BLOQUE JS 16 =====
<!-- Script para la vista de Live (Duolingo Live Style) -->
  var liveContainer = document.getElementById('liveContainer');
  var heartButton = document.getElementById('heartButton');
  var heartButtonViewer = document.getElementById('heartButtonViewer');
  var likeCountLive = document.getElementById('likeCountLive');
  var likesLive = 0;

  function createHeart(x, y) {
    var heart = document.createElement('img');
    heart.src = "https://cdn-0.emojis.wiki/emoji-pics/twitter/green-heart-twitter.png";
    heart.className = 'floating-heart';
    heart.style.position = 'absolute';
    heart.style.left = `${x - 12}px`;
    heart.style.top = `${y - 12}px`;
    liveContainer.appendChild(heart);
    setTimeout(() => {
      heart.remove();
    }, 1500);
  }

  function updateLikeCountLive() {
    likesLive++;
    if (likesLive >= 1000) {
      likeCountLive.textContent = (likesLive / 1000).toFixed(1) + 'K';
    } else {
      likeCountLive.textContent = likesLive;
    }
  }
  heartButton.addEventListener('click', () => {
    var rect = heartButton.getBoundingClientRect();
    createHeart(rect.left + rect.width / 2, rect.top + rect.height / 2);
    updateLikeCountLive();
  });

// ===== BLOQUE JS 17 =====
function openReportModal() {
    var modal = document.getElementById('report-modal');
    var modalContent = modal.querySelector('div');
    modal.style.display = 'flex';
    requestAnimationFrame(() => {
      modal.classList.remove('opacity-0', 'pointer-events-none');
      modalContent.classList.remove('translate-y-full');
    });
  }

  function closeReportModal() {
    var modal = document.getElementById('report-modal');
    var modalContent = modal.querySelector('div');
    modalContent.classList.add('translate-y-full');
    modal.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }

// ===== BLOQUE JS 18 =====
var translations = {
    es: {
      appName: "Drex",
      authTitle: "Drex",
      emailPlaceholder: "Correo electrónico",
      passwordPlaceholder: "Contraseña",
      btnIniciarSesion: "Iniciar Sesión",
      btnToggleAuth: "¿No tienes cuenta? Regístrate",
      btnVolver: "Volver",
      searchPlaceholder: "Buscar",
      searchResults: "Resultados",
      searchBooks: "Posts",
      searchAuthors: "Cuentas",
      profileStories: "Mis Publicaciones",
      editProfile: "Editar nombre",
      saveBio: "Guardar biografía",
      createStory: "Crear Historia",
      storyTitlePlaceholder: "Título de la historia",
      selectCategory: "Selecciona una categoría",
      btnCreateStory: "Crear Historia",
      editStory: "Editar Historia",
      addChapter: "Agregar Capítulo",
      deleteStory: "Eliminar Historia",
      makePrivate: "Hacer privada",
      chapterCreationTitle: "Agregar Nuevo Capítulo",
      chapterPlaceholder: "Escribe el contenido del capítulo aquí...",
      btnSaveChapter: "Guardar Capítulo",
      readChapter: "Capítulo",
      btnPrevChapter: "Anterior",
      btnNextChapter: "Siguiente",
      rateChapter: "Califica:",
      authorProfile: "Por",
      reportProfile: "Reportar Perfil",
      reportInstructions: "Selecciona un motivo o describe el problema:",
      btnSendReport: "Enviar Reporte",
      reportSuccess: "Reporte enviado con éxito. En breve recibirás una respuesta.",
      noInfraccion: "No se detectaron infracciones en este perfil.",
      followers: "Seguidores",
      following: "Siguiendo",
      ratings: "Calificaciones",
      languageModalTitle: "Selecciona tu idioma",
      editUsernamePrompt: "Introduce tu nuevo nombre de usuario:",
      usernameUpdated: "Nombre de usuario actualizado.",
      bioUpdated: "Biografía actualizada.",
      chapterAdded: "Capítulo agregado.",
      noEditingStory: "No hay historia en edición.",
      userNotAuthenticated: "Usuario no autenticado.",
      chapterNotFound: "Capítulo no encontrado.",
      firstChapter: "Este es el primer capítulo.",
      lastChapter: "Este es el último capítulo.",
      chapterRated: "Capítulo calificado con {value} estrella(s).",
      followSelfError: "No puedes seguirte a ti mismo.",
      nowFollowing: "Ahora sigues a este autor.",
      stoppedFollowing: "Has dejado de seguir a este autor.",
      alreadyFollowing: "Ya sigues a este usuario.",
      storyDeleted: "Historia eliminada.",
      editLater: "Puedes editar tu historia más tarde desde tu perfil."
    },
    en: {
      appName: "Drex",
      editLater: "You can edit your story later from your profile."
    },
    pt: {
      appName: "Drex",
      tagline: "Seu portal para histórias inesquecíveis",
      editLater: "Você pode editar sua história mais tarde em seu perfil."
    }
  };
  // Función que actualiza los textos de la interfaz según currentLanguage
  function updateTranslations() {
    // Ejemplo: Actualizamos el título de la aplicación y el tagline
    document.getElementById('app-name').innerText = translations[currentLanguage].appName;
    var taglineEl = document.getElementById('tagline');
    if (taglineEl) taglineEl.innerText = translations[currentLanguage].tagline;
    // ... (continúa actualizando todos los elementos que dependan de traducciones)
  }
  // Función para establecer el idioma y guardar la selección
  function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem("selectedLanguage", lang);
    var langOverlay = document.getElementById('lang-loading-overlay');
    if (langOverlay) langOverlay.style.display = "flex";
    setTimeout(() => {
      updateTranslations();
      if (langOverlay) langOverlay.style.display = "none";
      var langModal = document.getElementById('language-modal');
      if (langModal) langModal.style.display = "none";
    }, 1000);
  }

  function blockAuthor() {
    var currentUser = firebase.auth().currentUser;
    if (!currentUser || !currentViewedAuthorId) return;

    var blockRef = firebase.database().ref('blocks/' + currentUser.uid + '/' + currentViewedAuthorId);
    var blockButton = document.getElementById('block-button');

    blockRef.once('value').then(snapshot => {
      if (snapshot.exists()) {
        // Desbloquear
        blockRef.remove().then(() => {
          blockButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>`;
          alert('Usuario desbloqueado');
        });
      } else {
        // Bloquear
        blockRef.set({
          blockedAt: Date.now()
        }).then(() => {
          blockButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>`;
          alert('Usuario bloqueado');
        });
      }
    });
  }
