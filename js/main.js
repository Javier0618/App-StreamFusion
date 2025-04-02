
// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js";
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, setDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp, onSnapshot, writeBatch } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyBrNnQQcKOpaZguVF4myX8TSQseh5sQf8s",
authDomain: "proyecto-licencia-adf0f.firebaseapp.com",
projectId: "proyecto-licencia-adf0f",
storageBucket: "proyecto-licencia-adf0f.firebasestorage.app",
messagingSenderId: "632117204154",
appId: "1:632117204154:web:b73b5a1a39457fbb47de83",
measurementId: "G-LXFTJXCNF3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// API Configuration
const API_KEY = '32e5e53999e380a0291d66fb304153fe';
const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p';

// IDs destacados para el hero slider
const featuredMovieIds = [762509, 76341]; // Dune: Part Two, Interstellar
const featuredSeriesIds = [94664, 1399]; // Demon Slayer, Game of Thrones 

// Content IDs for different categories
const contentIds = {
recentlyAddedIds: {
  movies: [1197306, 447273, 762509, 777443], // Agrega aquí los IDs de películas recién agregadas
  series: [249042, 226529, 99966, 71024] // Agrega aquí los IDs de series recién agregadas
},
  // Películas populares - IDs ampliados para tener más variedad 
      inicioMovieIds: [1197306, 777443, 1333099, 447273, 9053, 762509, 117251, 117263, 974576, 950396, 921436, 76338, 616037, 10195, 1405338, 822119, 1241982, 993710, 851644, 500664, 530254, 615173, 823219, 1357633, 12477, 402431, 558449, 539972, 939243, 1184918, 912649, 157350, 262500, 262504, 9316, 43209, 11238, 297761, 436969, 508442, 530915, 49046, 497582, 829280, 700391, 315162, 632856, 338958, 605886, 620705, 455476, 816904, 748167, 456740, 11253, 354912, 929590, 365177, 588228, 61979, 818647, 646097, 961323, 413518, 532639, 555604, 10895, 862, 863, 10193, 301528, 213121, 256835, 594530, 15167, 168903, 13002, 1729, 957452, 917496, 346698, 250546, 396422, 521029,37135, 258489, 230222, 13683, 15657, 22794, 109451, 8960, 832502, 254, 177572, 8587, 9732, 420818, 11430, 9502, 49444, 140300, 10601, 10693, 420808, 16690, 381719, 522478, 11970, 184315, 505026, 512195, 329996, 11224, 14128, 16119, 150689, 13179, 297270, 44683, 175112, 25475, 75258, 614409, 565426, 466282, 15213, 545611, 118, 458897, 9471, 4327, 240832, 1979, 166424, 22832, 133805, 7342, 1075794, 71676, 1250, 447277, 298618, 579741, 75656, 291805, 930600, 438148, 20352, 93456, 324852, 397567, 518068, 378236, 10681, 12244, 454626, 675353, 708336, 832227, 336560, 9035, 14564, 607836, 473165, 44896, 1368, 1369, 1370, 7555, 522938, 9757, 970347, 1032823, 748783, 8920, 9513, 371608, 10665, 877269, 27578, 138103, 299054, 953, 10527, 80321, 270946, 624860, 605, 604, 603, 1029955, 454286, 249660, 347126, 793285, 1079091, 459003, 1096197, 118340, 283995, 447365, 597, 1226578, 333339, 945961, 9334, 13486, 297291, 287947, 594767, 62177, 1094138, 960704, 417261, 238215, 6479, 715931, 495764, 38757, 295693, 459151, 10555, 760741, 58595, 290595, 585511, 447332, 8844, 353486, 512200, 568124, 497698, 436270, 80278, 363676, 49047, 1151534, 1593, 18360, 181533, 72105, 214756, 271110, 1771, 100402, 831815, 9023, 10501, 13186, 23823, 71672, 125509, 259072, 9902, 862855, 399579, 1059064, 346910, 766507, 4247, 4248, 4256, 4257, 4258, 580489, 335983, 791373, 297802, 284053, 488623, 974262, 961268, 588648, 1129598, 46019, 1308757, 26466, 916224, 508439, 718821, 16353, 9799, 584, 168259, 9615, 13804, 51497, 49529, 9806, 664413, 829560, 829557, 533535, 11237, 205584, 653346, 931405, 150540, 408355, 505642, 640146, 630004, 76600, 653349, 693134, 76341, 98, 277834, 400160, 82992, 337339, 385128, 384018, 385687, 593910, 572802, 565770, 284054, 299536, 786892, 324857, 274854, 550205, 260513, 399566, 299534, 1022789, 359410, 629176, 634649, 848326, 315635,429617, 557, 527774, 12153, 1930, 559, 558,  573435, 519182, 102899, 363088, 639720, 466420, 1029528, 1019411, 1010581, 823464, 1011985, 269149, 955916, 985939, 1001311, 454983, 583083, 727745, 603692, 324552, 245891, 704673, 99861, 566525, 24428,  1026999, 987686, 955555, 626412, 940551, 109445, 330457, 508883,447200, 967847,  614933, 280180, 987686, 1134433, 1025463, 829402, 940721, 1023922, 984324, 934632, 634492, 762441, 809, 1016346, 1291559, 901362, 739547, 872585,1094844, 838209, 1243895, 76163, 866398, 1239251, 969492, 438631, 1022796, 641934, 458156, 502356, 974635, 569094, 763215, 293660, 976573, 335977, 746036, 682201, 1115623, 575264, 508947, 678512, 897087, 784651, 1231574, 916224, 445030, 680041, 372058, 667520, 79707, 876792],
      // Series populares - IDs ampliados para tener más variedad
      inicioSeriesIds: [249042, 240576, 46298, 71024, 94664, 121964, 72505, 213402, 259140, 261298, 240633, 65945, 236994, 238843, 221851, 112163, 99966, 253905, 94605, 99778, 138501, 226529, 125988, 207332, 108284, 74189, 85271, 60863, 74682, 76758, 85723, 208730, 98986, 45782, 128839, 133903, 114410, 67075, 158300, 63174, 60808, 63767, 5178, 154825, 112888, 258707, 214999, 158141, 90660, 131041, 232616, 204832, 229480, 201834, 102621, 80752, 84773, 239287, 42503, 120734, 62110, 230424, 45666, 219652, 203164, 197067, 48866, 259730, 202506, 156902, 2038, 11250, 110418, 1396, 108545, 71446, 110356, 84958, 82452, 92749, 60625, 93405, 231749, 82856, 1399, 66732, 60574, 226527, 215720, 60735, 218539, 5371, 52814, 1403, 119243, 94997, 39351, 456, 76479, 198004, 94796, 60957, 67915, 96160, 62745, 114868, 202284, 218843, 117884, 62104, 120089, 83095, 235389, 205050, 82684, 69346, 85844, 127532, 97860, 85937, 63926, 95479, 207468, 1429, 64196, 121078],
      netflixMovieIds: [993710, 851644, 49046, 497582, 829280, 748167, 646097, 961323, 555604, 832502, 177572, 512195, 614409, 565426, 466282, 1075794, 960704, 1151534, 831815, 1231574, 1001311, 488623, 667520, 955916, 664413, 829560, 829557, 1026999, 280180, 1134433, 829402, 984324, 1291559, 739547, 974635, 727745, 550205, 704673, 614933, 987686, 1025463, 400160, 934632, 848326, 454983, 583083, 569094],
      netflixSeriesIds: [249042, 71024, 207332, 99966, 253905, 94605, 208730, 63174, 154825, 258707, 214999, 158141, 90660, 232616, 102621, 219652, 197067, 48866, 259730, 114868, 156902, 218843, 62104, 110418, 108545, 71446, 110356, 82452, 93405, 215720, 203164, 231749, 242876, 96160, 226527, 198004, 218539],
      disneyMovieIds: [447273, 762509, 1241982, 11238, 508442, 338958, 620705, 354912, 10895, 862, 863, 10193, 301528, 213121, 256835, 594530, 37135, 15657, 11430, 10693, 420808, 16690, 11970, 329996, 11360, 11224, 14128, 16119, 150689, 13179, 297270, 44683, 175112, 25475, 75258, 447277, 10681, 62177, 38757, 568124, 974262, 277834, 9806, 109445, 260513, 150540, 330457, 76600, 527774, 293660, 269149, 1022796, 1022789, 976573],
      disneySeriesIds: [138501, 120734, 84958, 1403, 92749, 456, 82856],
      hboMovieIds: [693134, 872585, 787699, 438631, 565770, 76341],
      hboSeriesIds: [94997, 1399],
      primeMovieIds: [588228, 1094138, 1010581, 1019411, 1029528, 359410, 629176, 593910],
      primeSeriesIds: [84773, 76479],
      paramountMovieIds: [558449, 831815, 639720, 466420, 335977, 575264],
      paramountSeriesIds: [158300, 52814, 5371, 119243],
      doramasSeriesIds: [221851, 99966, 253905, 226529, 108284, 74682, 63767, 5178, 154825, 112888, 258707, 214999, 229480, 232616, 219652, 203164, 197067, 218539, 110356, 226527, 215720, 231749, 198004, 94796, 60957, 67915, 96160],
      doramasMovieIds: [1405338, 851644, 1291559, 488623],
      animesSeriesIds: [240576, 46298, 94664, 121964, 72505, 213402, 259140, 261298, 240633, 65945, 236994, 238843, 112163, 94605, 99778, 207332, 74189, 60863, 76758, 208730, 98986, 45782, 114410, 67075, 60808, 131041, 204832, 239287, 42503, 62110, 62745, 114868, 202284, 218843, 117884, 62104, 120089, 83095, 235389, 205050, 82684, 69346, 85844, 127532, 97860, 85937, 63926, 95479, 207468, 1429, 64196, 121078],
      animesMovieIds: [12477, 1357633, 579741, 1231574, 916224, 445030, 680041, 372058, 667520, 79707, 876792]
};

// DOM Elements - Authentication
const authContainer = document.getElementById('auth-container');
const loginFormContainer = document.getElementById('login-form-container');
const registerFormContainer = document.getElementById('register-form-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const registerName = document.getElementById('register-name');
const registerEmail = document.getElementById('register-email');
const registerPassword = document.getElementById('register-password');
const registerConfirmPassword = document.getElementById('register-confirm-password');
const loginError = document.getElementById("login-error")
const registerError = document.getElementById("register-error")
const registerSuccess = document.getElementById('register-success');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');

// DOM Elements - Main App
const spinnerContainer = document.getElementById('spinner-container');
const header = document.getElementById('header');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('close-sidebar');
const overlay = document.getElementById('overlay');
const genreItems = document.querySelectorAll('.genre-item');
const backToTopBtn = document.getElementById('back-to-top');
const welcomePopup = document.getElementById('welcome-popup');
const closePopup = document.getElementById('close-popup');
const dontShowAgain = document.getElementById('dont-show-again');
const serviceItems = document.querySelectorAll('.service-item');
const hero = document.getElementById('hero');
const trendingSlider = document.getElementById('trending-slider');
const moviesSlider = document.getElementById('movies-slider');
const seriesSlider = document.getElementById('series-slider');
const sliderPrevBtns = document.querySelectorAll('.slider-prev');
const sliderNextBtns = document.querySelectorAll('.slider-next');
const servicesBackBtn = document.getElementById('services-back-btn');

// DOM Elements - User Profile
const userProfile = document.getElementById('user-profile');
const profileIcon = document.getElementById('profile-icon');
const profileDropdown = document.getElementById('profile-dropdown');
const viewProfile = document.getElementById('view-profile');
const adminPanelLink = document.getElementById('admin-panel-link');
const logoutBtn = document.getElementById('logout-btn');
const userProfilePage = document.getElementById('user-profile-page');
const profileAvatar = document.getElementById('profile-avatar');
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const infoName = document.getElementById('info-name');
const infoEmail = document.getElementById('info-email');
const infoDate = document.getElementById('info-date');
const profileTabs = document.querySelectorAll('.profile-tab');
const profileSections = document.querySelectorAll('.profile-section');
const profileMyListGrid = document.getElementById('profile-my-list-grid');
const messagesList = document.getElementById('messages-list');
const noMessages = document.getElementById('no-messages');
const backFromProfile = document.getElementById('back-from-profile');

// DOM Elements - User Message Form
const userMessageForm = document.getElementById('user-message-form');
const userMessageContent = document.getElementById('user-message-content');
const sendUserMessageBtn = document.getElementById('send-user-message-btn');
const messageLimitInfo = document.getElementById('message-limit-info');

// DOM Elements - Admin Panel
const adminPanel = document.getElementById('admin-panel');
const adminTabs = document.querySelectorAll('.admin-tab');
const adminSections = document.querySelectorAll('.admin-section');
const usersTable = document.getElementById('users-table');
const adminMessageForm = document.getElementById('admin-message-form');
const messageRecipient = document.getElementById('message-recipient');
const messageContent = document.getElementById('message-content');
const backFromAdmin = document.getElementById('back-from-admin');

// DOM Elements - Admin Messages List (NEW)
const adminMessagesList = document.getElementById('admin-messages-list');
const adminNoMessages = document.getElementById('admin-no-messages');

// DOM Elements - Modals
const editUserModal = document.getElementById('edit-user-modal');
const editUserForm = document.getElementById('edit-user-form');
const editName = document.getElementById('edit-name');
const editEmail = document.getElementById('edit-email');
const editUserId = document.getElementById('edit-user-id');
const closeEditModal = document.getElementById('close-edit-modal');
const cancelEdit = document.getElementById('cancel-edit');
const saveEdit = document.getElementById('save-edit');
const sendMessageModal = document.getElementById('send-message-modal');
const sendMessageForm = document.getElementById('send-message-form');
const messageTo = document.getElementById('message-to');
const individualMessageContent = document.getElementById('individual-message-content');
const messageUserId = document.getElementById('message-user-id');
const closeMessageModal = document.getElementById('close-message-modal');
const cancelMessage = document.getElementById('cancel-message');
const sendMessage = document.getElementById('send-message');
const deleteConfirmationModal = document.getElementById('delete-confirmation-modal');
const deleteUserId = document.getElementById('delete-user-id');
const closeDeleteModal = document.getElementById('close-delete-modal');
const cancelDelete = document.getElementById('cancel-delete');
const confirmDelete = document.getElementById('confirm-delete');

// DOM Elements - Delete Message Modal
const deleteMessageModal = document.getElementById('delete-message-modal');
const deleteMessageId = document.getElementById('delete-message-id');
const closeDeleteMessageModal = document.getElementById('close-delete-message-modal');
const cancelDeleteMessage = document.getElementById('cancel-delete-message');
const confirmDeleteMessage = document.getElementById('confirm-delete-message');

// View navigation elements
const navLinks = document.querySelectorAll('.nav-link');
const seeAllMovies = document.getElementById('see-all-movies');
const seeAllSeries = document.getElementById('see-all-series');
const backFromMovies = document.getElementById('back-from-movies');
const backFromSeries = document.getElementById('back-from-series');
const backFromAnimes = document.getElementById('back-from-animes');
const backFromDoramas = document.getElementById('back-from-doramas');
const backFromGenre = document.getElementById('back-from-genre');
const backFromSearch = document.getElementById('back-from-search');

// Views
const homeView = document.getElementById('home-view');
const moviesView = document.getElementById('movies-view');
const seriesView = document.getElementById('series-view');
const animesView = document.getElementById('animes-view');
const doramasView = document.getElementById('doramas-view');
const genreResultsView = document.getElementById('genre-results-view');
const searchResultsView = document.getElementById('search-results-view');

// Grids
const moviesGrid = document.getElementById('movies-grid');
const seriesGrid = document.getElementById('series-grid');
const animesGrid = document.getElementById('animes-grid');
const doramasGrid = document.getElementById('doramas-grid');
const genreResultsGrid = document.getElementById('genre-results-grid');
const searchResultsGrid = document.getElementById('search-results-grid');

const genreTitle = document.getElementById('genre-title');
const searchResultsTitle = document.getElementById('search-results-title');

// State variables
let currentCategory = 'inicio';
let currentService = null;
let currentGenre = null;
let currentHeroSlide = 0;
let heroInterval;
let trendingContent = [];
let moviesContent = [];
let seriesContent = [];
let continueWatchingContent = [];
let currentView = 'home';
let heroSlides = [];
let heroDots = [];
let currentUser = null;
let isAdmin = false;
let messageListeners = {}; // Para almacenar los listeners de mensajes

// Admin credentials
const ADMIN_EMAIL = 'javiervelasquez0618@gmail.com';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

// Main initialization function
function initApp() {
  // Show spinner
  showSpinner();

  // Initialize authentication
  initAuth();

  // Initialize event listeners
  initEventListeners();
}

// Initialize authentication
// Initialize authentication
function initAuth() {
  // Ocultar el contenedor de autenticación inicialmente
  // y mostrar el spinner mientras verificamos la autenticación
  authContainer.style.display = 'none';
  showSpinner();
  
  // Check if user is already logged in
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in
    try {
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        // Código existente para usuario que ya existe en Firestore
        currentUser = {
          id: user.uid,
          ...userDoc.data()
        };
        
        // Check if user is admin
        isAdmin = currentUser.email === ADMIN_EMAIL;
        
        // Mantener el contenedor de autenticación oculto
        authContainer.style.display = 'none';
        
        // Update UI for logged in user
        updateUIForLoggedInUser();
        
        // Load content
        loadAllContent().then(() => {
          // Check welcome popup
          checkWelcomePopup();

          // Start hero slideshow
          startHeroSlideshow();
          
          // Hide spinner
          hideSpinner();
        });
      } else {
        // Usuario existe en Auth pero no en Firestore
        // Crear documento de usuario con datos de Google si está disponible
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName || user.email.split('@')[0],
          email: user.email,
          registeredAt: serverTimestamp(),
          myList: [],
          messagesSent: [] // Array para rastrear mensajes enviados por el usuario
        });
        
        // Get the newly created user
        const newUserDoc = await getDoc(doc(db, "users", user.uid));
        currentUser = {
          id: user.uid,
          ...newUserDoc.data()
        };
        
        isAdmin = currentUser.email === ADMIN_EMAIL;
        
        // Hide auth container and show app
        authContainer.style.display = 'none';
        
        // Update UI for logged in user
        updateUIForLoggedInUser();
        
        // Load content
        loadAllContent().then(() => {
          // Check welcome popup
          checkWelcomePopup();

          // Start hero slideshow
          startHeroSlideshow();
          
          // Hide spinner
          hideSpinner();
        });
      }
    } catch (error) {
      console.error("Error getting user data:", error);
      hideSpinner();
    }
  } else {
      // No user is signed in
      currentUser = null;
      isAdmin = false;
      
      // Ahora sí mostramos el contenedor de autenticación
      authContainer.style.display = 'flex';
      
      // Hide spinner
      hideSpinner();
    }
  });

  // Add event listeners for auth forms
  loginForm.addEventListener('submit', handleLogin);
  registerForm.addEventListener('submit', handleRegister);
  showRegister.addEventListener('click', () => {
    loginFormContainer.style.display = 'none';
    registerFormContainer.style.display = 'block';
  });
  showLogin.addEventListener('click', () => {
    registerFormContainer.style.display = 'none';
    loginFormContainer.style.display = 'block';
  });
}

function handleGoogleSignIn() {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({
    prompt: "select_account",
  })

  signInWithPopup(auth, provider)
    .then((result) => {
      // Ocultar spinner mientras se procesa la autenticación
      showSpinner()

      // El usuario se ha autenticado correctamente
      // onAuthStateChanged se encargará del resto
    })
    .catch((error) => {
      hideSpinner()
      console.error("Error en autenticación con Google:", error)

      // Mostrar error en ambos formularios
      loginError.textContent = "Error al iniciar sesión con Google. Inténtalo de nuevo."
      loginError.style.display = "block"

      registerError.textContent = "Error al registrarse con Google. Inténtalo de nuevo."
      registerError.style.display = "block"
    })
}

// Handle login
async function handleLogin(e) {
  e.preventDefault();
  
  const email = loginEmail.value.trim();
  const password = loginPassword.value;
  
  // Show spinner
  showSpinner();
  
  try {
    // Sign in with Firebase Auth
    await signInWithEmailAndPassword(auth, email, password);
    
    // Clear form
    loginForm.reset();
    loginError.style.display = 'none';
  } catch (error) {
    // Hide spinner
    hideSpinner();
    
    // Show error
    loginError.textContent = getAuthErrorMessage(error.code);
    loginError.style.display = 'block';
  }
}

// Handle register
async function handleRegister(e) {
  e.preventDefault();
  
  const name = registerName.value.trim();
  const email = registerEmail.value.trim();
  const password = registerPassword.value;
  const confirmPassword = registerConfirmPassword.value;
  
  // Validate form
  if (password !== confirmPassword) {
    registerError.textContent = 'Las contraseñas no coinciden';
    registerError.style.display = 'block';
    registerSuccess.style.display = 'none';
    return;
  }
  
  // Show spinner
  showSpinner();
  
  try {
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Add user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      registeredAt: serverTimestamp(),
      myList: [],
      messagesSent: [] // Array to track messages sent by the user
    });
    
    // Show success message
    registerError.style.display = 'none';
    registerSuccess.textContent = 'Registro exitoso. Iniciando sesión...';
    registerSuccess.style.display = 'block';
    
    // Clear form
    registerForm.reset();
    
    // Hide spinner (auth state change will handle the rest)
  } catch (error) {
    // Hide spinner
    hideSpinner();
    
    // Show error
    registerError.textContent = getAuthErrorMessage(error.code);
    registerError.style.display = 'block';
    registerSuccess.style.display = 'none';
  }
}

// Get auth error message
function getAuthErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Este correo electrónico ya está registrado';
    case 'auth/invalid-email':
      return 'Correo electrónico inválido';
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Correo electrónico o contraseña incorrectos';
    default:
      return 'Error de autenticación: ' + errorCode;
  }
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
  // Update profile icon
  if (currentUser) {
    // Show first letter of user's name in profile icon
    profileIcon.innerHTML = currentUser.name.charAt(0).toUpperCase();
    
    // Show admin panel link if user is admin
    if (isAdmin) {
      adminPanelLink.style.display = 'flex';
    } else {
      adminPanelLink.style.display = 'none';
    }
  }
}

// Initialize event listeners
function initEventListeners() {
  // Header scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Search functionality
  searchBtn.addEventListener('click', toggleSearch);
  searchInput.addEventListener('keyup', function(e) {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });
  searchInput.addEventListener('input', function() {
    // Only perform live search if the input has focus and has content
    if (document.activeElement === searchInput && searchInput.value.trim()) {
      handleSearch();
    }
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container') && searchInput.classList.contains('active')) {
      searchInput.classList.remove('active');
    }
  });

  // Sidebar functionality
  sidebarToggle.addEventListener('click', toggleSidebar);
  closeSidebar.addEventListener('click', closeSidebarHandler);
  overlay.addEventListener('click', closeSidebarHandler);

  // Genre selection
  genreItems.forEach(item => {
    item.addEventListener('click', handleGenreClick);
  });

  // Back to top button
  window.addEventListener('scroll', toggleBackToTop);
  backToTopBtn.addEventListener('click', scrollToTop);

  // Welcome popup
  closePopup.addEventListener('click', handleClosePopup);

  // Service selection
  serviceItems.forEach(item => {
    item.addEventListener('click', handleServiceClick);
  });

  // Services back button
  servicesBackBtn.addEventListener('click', resetServices);

  // Slider navigation
  sliderPrevBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const slider = this.closest('.content-slider').querySelector('.slider-container');
      navigateSlider(slider, 'prev');
    });
  });

  sliderNextBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const slider = this.closest('.content-slider').querySelector('.slider-container');
      navigateSlider(slider, 'next');
    });
  });

  // View navigation
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const section = this.dataset.section;
      navigateToView(section);
    });
  });

// Añade este código después de los event listeners de navegación
document.querySelectorAll('.sidebar .menu-item a, .sidebar .genre-item').forEach(item => {
  item.addEventListener('click', () => {
    closeSidebarHandler(); // Cierra el sidebar cuando se hace clic en un elemento del menú
  });
});

  // See all buttons
  seeAllMovies.addEventListener('click', function(e) {
    e.preventDefault();
    navigateToView('movies');
  });

  seeAllSeries.addEventListener('click', function(e) {
    e.preventDefault();
    navigateToView('series');
  });

  // Back buttons
  backFromMovies.addEventListener('click', () => navigateToView('home'));
  backFromSeries.addEventListener('click', () => navigateToView('home'));
  backFromAnimes.addEventListener('click', () => navigateToView('home'));
  backFromDoramas.addEventListener('click', () => navigateToView('home'));
  backFromGenre.addEventListener('click', () => navigateToView('home'));
  backFromSearch.addEventListener('click', () => navigateToView('home'));
  
  // User profile functionality
  profileIcon.addEventListener('click', () => {
    const wasOpen = profileDropdown.classList.contains('active');
    toggleProfileDropdown();
    
    // Si el dropdown se está abriendo, marcar mensajes como leídos
    if (!wasOpen && profileDropdown.classList.contains('active')) {
      markMessagesAsRead();
    }
  });
  
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-profile') && profileDropdown.classList.contains('active')) {
      profileDropdown.classList.remove('active');
    }
  });
  
  viewProfile.addEventListener('click', () => {
    profileDropdown.classList.remove('active');
    showUserProfile();
  });
  
  adminPanelLink.addEventListener('click', () => {
    profileDropdown.classList.remove('active');
    showAdminPanel();
  });
  
  logoutBtn.addEventListener('click', handleLogout);
  
  backFromProfile.addEventListener('click', () => {
    userProfilePage.classList.remove('active');
    navigateToView('home');
  });
  
  backFromAdmin.addEventListener('click', () => {
    adminPanel.classList.remove('active');
    navigateToView('home');
  });
  
  // Profile tabs
  profileTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.dataset.tab;
      
      // Remove active class from all tabs and sections
      profileTabs.forEach(t => t.classList.remove('active'));
      profileSections.forEach(s => s.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding section
      this.classList.add('active');
      document.getElementById(`${tabName}-section`).classList.add('active');
      
      // Load content for the tab if needed
      if (tabName === 'my-list') {
        loadUserMyList();
      } else if (tabName === 'messages') {
        loadUserMessages();
        checkUserMessageLimit(); // Check message limit when viewing messages tab
      }
    });
  });
  
  // Admin tabs
  adminTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.dataset.tab;
      
      // Remove active class from all tabs
      adminTabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Show corresponding section
      if (tabName === 'users') {
        document.getElementById('users-section').style.display = 'block';
        document.getElementById('messages-section').style.display = 'none';
        loadUsers();
      } else if (tabName === 'messages') {
        document.getElementById('users-section').style.display = 'none';
        document.getElementById('messages-section').style.display = 'block';
        loadMessageRecipients();
        loadAdminMessages(); // NEW: Load messages for admin
      }
    });
  });
  
  // Admin message form
  adminMessageForm.addEventListener('submit', handleSendAdminMessage);
  
  // User message form
  sendUserMessageBtn.addEventListener('click', handleSendUserMessage);
  
  // Modal event listeners
  closeEditModal.addEventListener('click', () => editUserModal.style.display = 'none');
  cancelEdit.addEventListener('click', () => editUserModal.style.display = 'none');
  saveEdit.addEventListener('click', handleSaveUserEdit);
  
  closeMessageModal.addEventListener('click', () => sendMessageModal.style.display = 'none');
  cancelMessage.addEventListener('click', () => sendMessageModal.style.display = 'none');
  sendMessage.addEventListener('click', handleSendIndividualMessage);
  
  closeDeleteModal.addEventListener('click', () => deleteConfirmationModal.style.display = 'none');
  cancelDelete.addEventListener('click', () => deleteConfirmationModal.style.display = 'none');
  confirmDelete.addEventListener('click', handleDeleteUser);
  
  // Delete message modal event listeners
  closeDeleteMessageModal.addEventListener('click', () => deleteMessageModal.style.display = 'none');
  cancelDeleteMessage.addEventListener('click', () => deleteMessageModal.style.display = 'none');
  confirmDeleteMessage.addEventListener('click', handleDeleteMessage);

  document.getElementById("google-login-btn").addEventListener("click", handleGoogleSignIn)
  document.getElementById("google-register-btn").addEventListener("click", handleGoogleSignIn)
}

// Toggle profile dropdown
function toggleProfileDropdown() {
  profileDropdown.classList.toggle('active');
}

// Handle logout
async function handleLogout() {
  try {
    // Limpiar todos los listeners de mensajes
    Object.values(messageListeners).forEach(unsubscribe => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    });
    messageListeners = {};
    
    // Sign out from Firebase Auth
    await signOut(auth);
    
    // Clear current user
    currentUser = null;
    isAdmin = false;
    
    // Show auth container and hide app
    authContainer.style.display = 'flex';
    userProfilePage.classList.remove('active');
    adminPanel.classList.remove('active');
    
    // Reset forms
    loginForm.reset();
    registerForm.reset();
    loginError.style.display = 'none';
    registerError.style.display = 'none';
    registerSuccess.style.display = 'none';
    
    // Show login form
    loginFormContainer.style.display = 'block';
    registerFormContainer.style.display = 'none';
  } catch (error) {
    console.error("Error signing out:", error);
  }
}

// Show user profile
function showUserProfile() {
  // Hide all views
  homeView.classList.remove('active');
  moviesView.classList.remove('active');
  seriesView.classList.remove('active');
  animesView.classList.remove('active');
  doramasView.classList.remove('active');
  genreResultsView.classList.remove('active');
  searchResultsView.classList.remove('active');
  adminPanel.classList.remove('active');
  
  // Show profile page
  userProfilePage.classList.add('active');
  
  // Update profile information
  profileAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
  profileName.textContent = currentUser.name;
  profileEmail.textContent = currentUser.email;
  infoName.textContent = currentUser.name;
  infoEmail.textContent = currentUser.email;
  
  // Format date
  const registeredDate = currentUser.registeredAt instanceof Date 
    ? currentUser.registeredAt 
    : currentUser.registeredAt?.toDate?.() || new Date();
  infoDate.textContent = registeredDate.toLocaleDateString();
  
  // Reset tabs
  profileTabs.forEach(tab => tab.classList.remove('active'));
  profileSections.forEach(section => section.classList.remove('active'));
  profileTabs[0].classList.add('active');
  profileSections[0].classList.add('active');
  
  // Load user's my list
  loadUserMyList();
  
  // Load user's messages
  loadUserMessages();
  
  // Check user message limit
  checkUserMessageLimit();
}

// Load user's my list
async function loadUserMyList() {
  if (!currentUser) return;
  
  try {
    // Get user document from Firestore
    const userDoc = await getDoc(doc(db, "users", currentUser.id));
    
    if (userDoc.exists() && userDoc.data().myList && userDoc.data().myList.length > 0) {
      renderGridView(profileMyListGrid, userDoc.data().myList);
    } else {
      profileMyListGrid.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-film empty-icon"></i>
          <h3 class="empty-title">No hay contenido en tu lista</h3>
          <p class="empty-text">Agrega contenido a tu lista para verlo aquí.</p>
        </div>
      `;
    }
  } catch (error) {
    console.error("Error loading user's my list:", error);
    profileMyListGrid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-circle empty-icon"></i>
        <h3 class="empty-title">Error al cargar la lista</h3>
        <p class="empty-text">Ha ocurrido un error al cargar tu lista. Por favor, intenta de nuevo más tarde.</p>
        </div>
      `;
  }
}

// Load user's messages with real-time updates
function loadUserMessages() {
  if (!currentUser) return;
  
  try {
    // Limpiar listener anterior si existe
    if (messageListeners[currentUser.id]) {
      messageListeners[currentUser.id]();
    }
    
    // Mostrar estado de carga
    messagesList.innerHTML = `
      <div class="message-item" style="text-align: center;">
        <div class="spinner" style="width: 30px; height: 30px; margin: 0 auto;"></div>
        <p style="margin-top: 10px;">Cargando mensajes...</p>
      </div>
    `;
    noMessages.style.display = 'none';
    
    // Crear una consulta para escuchar mensajes en tiempo real
    const messagesQuery = query(
      collection(db, "messages"),
      where("to", "in", [currentUser.id, "all"]),
      orderBy("date", "desc")
    );
    
    // Configurar listener en tiempo real
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const userMessages = [];
      
      snapshot.forEach((doc) => {
        userMessages.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      if (userMessages.length > 0) {
        noMessages.style.display = 'none';
        messagesList.innerHTML = '';
        
        userMessages.forEach(message => {
          const messageDate = message.date instanceof Date 
            ? message.date 
            : message.date?.toDate?.() || new Date();
            
          const messageItem = document.createElement('div');
          messageItem.className = 'message-item';
          
          // Determinar si el usuario puede eliminar este mensaje
          const canDelete = message.from === currentUser.id || (isAdmin && message.to === currentUser.id);
          
          messageItem.innerHTML = `
            <div class="message-header">
              <span class="message-sender">${message.from === 'admin' ? 'Administrador' : message.from === currentUser.id ? 'Yo' : 'Sistema'}</span>
              <span class="message-date">${messageDate.toLocaleString()}</span>
            </div>
            <div class="message-content">${message.content}</div>
            ${canDelete ? `
              <div class="message-actions">
                <button class="message-delete-btn" data-id="${message.id}">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            ` : ''}
          `;
          
          messagesList.appendChild(messageItem);
          
          // Agregar event listener al botón de eliminar si existe
          if (canDelete) {
            const deleteBtn = messageItem.querySelector('.message-delete-btn');
            deleteBtn.addEventListener('click', () => {
              showDeleteMessageModal(message.id);
            });
          }
        });
        
        // AÑADIR AQUÍ: Contar mensajes no leídos y actualizar el badge
        const unreadMessages = userMessages.filter(message => 
          message.from === 'admin' && !message.read
        );
        updateNotificationBadge(unreadMessages.length);
        
      } else {
        noMessages.style.display = 'block';
        messagesList.innerHTML = '';
        updateNotificationBadge(0); // AÑADIR ESTA LÍNEA
      }
    }, (error) => {
      console.error("Error loading user's messages:", error);
      noMessages.style.display = 'none';
      messagesList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-exclamation-circle empty-icon"></i>
          <h3 class="empty-title">Error al cargar los mensajes</h3>
          <p class="empty-text">Ha ocurrido un error al cargar tus mensajes. Por favor, intenta de nuevo más tarde.</p>
        </div>
      `;
      updateNotificationBadge(0); // AÑADIR ESTA LÍNEA
    });
    
    // Guardar referencia al listener para limpiarlo después
    messageListeners[currentUser.id] = unsubscribe;
    
  } catch (error) {
    console.error("Error setting up message listener:", error);
    noMessages.style.display = 'none';
    messagesList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-circle empty-icon"></i>
        <h3 class="empty-title">Error al cargar los mensajes</h3>
        <p class="empty-text">Ha ocurrido un error al cargar tus mensajes. Por favor, intenta de nuevo más tarde.</p>
      </div>
    `;
    updateNotificationBadge(0); // AÑADIR ESTA LÍNEA
  }
}

// Añadir esta función después de loadUserMessages
function updateNotificationBadge(count) {
  const profileIcon = document.getElementById('profile-icon');
  
  // Eliminar badge existente si hay alguno
  const existingBadge = profileIcon.querySelector('.notification-badge');
  if (existingBadge) {
    existingBadge.remove();
  }
  
  // Añadir nuevo badge si hay mensajes no leídos
  if (count > 0) {
    const badge = document.createElement('div');
    badge.className = 'notification-badge';
    badge.textContent = count > 9 ? '9+' : count;
    profileIcon.appendChild(badge);
  }
}

// Añadir esta función para marcar mensajes como leídos
async function markMessagesAsRead() {
  if (!currentUser) return;
  
  try {
    // Obtener todos los mensajes no leídos para el usuario
    const messagesQuery = query(
      collection(db, "messages"),
      where("to", "in", [currentUser.id, "all"]),
      where("read", "==", false)
    );
    
    const unreadSnapshot = await getDocs(messagesQuery);
    
    // Si no hay mensajes no leídos, salir
    if (unreadSnapshot.empty) return;
    
    // Actualizar cada mensaje para marcarlo como leído
    const batch = writeBatch(db);
    unreadSnapshot.forEach((doc) => {
      batch.update(doc.ref, { read: true });
    });
    
    await batch.commit();
    
    // Actualizar el badge de notificación
    updateNotificationBadge(0);
    
  } catch (error) {
    console.error("Error marking messages as read:", error);
  }
}

// Check user message limit
async function checkUserMessageLimit() {
  if (!currentUser || isAdmin) {
    // Los administradores no tienen límite de mensajes
    sendUserMessageBtn.disabled = false;
    messageLimitInfo.textContent = 'Puedes enviar mensajes al administrador.';
    messageLimitInfo.className = 'message-limit-info';
    return;
  }
  
  try {
    // Obtener el documento del usuario para verificar los mensajes enviados
    const userDoc = await getDoc(doc(db, "users", currentUser.id));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const messagesSent = userData.messagesSent || [];
      
      // Obtener la fecha actual (solo año, mes, día)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Filtrar mensajes enviados hoy
      const messagesToday = messagesSent.filter(msg => {
        const msgDate = msg.date instanceof Date 
          ? msg.date 
          : msg.date?.toDate?.() || new Date();
        
        const msgDateOnly = new Date(msgDate);
        msgDateOnly.setHours(0, 0, 0, 0);
        
        return msgDateOnly.getTime() === today.getTime();
      });
      
      // Verificar si el usuario ha alcanzado el límite diario
      if (messagesToday.length >= 2) {
        sendUserMessageBtn.disabled = true;
        messageLimitInfo.textContent = 'Has alcanzado el límite de 2 mensajes por día. Intenta de nuevo mañana.';
        messageLimitInfo.className = 'message-limit-info message-limit-warning';
      } else {
        sendUserMessageBtn.disabled = false;
        messageLimitInfo.textContent = `Puedes enviar ${2 - messagesToday.length} mensaje${messagesToday.length === 1 ? '' : 's'} más hoy.`;
        messageLimitInfo.className = 'message-limit-info';
      }
    }
  } catch (error) {
    console.error("Error checking message limit:", error);
    sendUserMessageBtn.disabled = false;
    messageLimitInfo.textContent = 'Error al verificar límite de mensajes. Puedes intentar enviar un mensaje.';
    messageLimitInfo.className = 'message-limit-info';
  }
}

// Handle send user message
async function handleSendUserMessage() {
  if (!currentUser) return;
  
  const content = userMessageContent.value.trim();
  
  // Validate form
  if (!content) {
    alert('Por favor, escribe un mensaje');
    return;
  }
  
  try {
    // Mostrar indicador de carga
    sendUserMessageBtn.textContent = 'Enviando...';
    sendUserMessageBtn.disabled = true;
    
    // Obtener la fecha actual
    const now = new Date();
    
    // Agregar mensaje a Firestore
    const messageRef = await addDoc(collection(db, "messages"), {
      from: currentUser.id,
      to: 'admin',
      content: content,
      date: serverTimestamp(),
      read: false,
      userName: currentUser.name // Incluir el nombre del usuario para facilitar la identificación
    });
    
    // Actualizar el registro de mensajes enviados por el usuario
    const userRef = doc(db, "users", currentUser.id);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const messagesSent = userData.messagesSent || [];
      
      // Agregar el nuevo mensaje al registro
      messagesSent.push({
        id: messageRef.id,
        date: now
      });
      
      // Actualizar el documento del usuario
      await updateDoc(userRef, {
        messagesSent: messagesSent
      });
    }
    
    // Limpiar el formulario
    userMessageContent.value = '';
    
    // Restaurar botón
    sendUserMessageBtn.textContent = 'Enviar mensaje';
    
    // Verificar límite de mensajes
    checkUserMessageLimit();
    
    // Mostrar mensaje de éxito
    alert('Mensaje enviado correctamente al administrador');
  } catch (error) {
    console.error("Error sending user message:", error);
    alert("Error al enviar el mensaje. Por favor, intenta de nuevo más tarde.");
    
    // Restaurar botón
    sendUserMessageBtn.textContent = 'Enviar mensaje';
    sendUserMessageBtn.disabled = false;
  }
}

// Show delete message modal
function showDeleteMessageModal(messageId) {
  deleteMessageId.value = messageId;
  deleteMessageModal.style.display = 'block';
}

// Handle delete message
async function handleDeleteMessage() {
  const messageId = deleteMessageId.value;
  
  try {
    // Eliminar mensaje de Firestore
    await deleteDoc(doc(db, "messages", messageId));
    
    // Si el mensaje fue enviado por el usuario actual, actualizar su registro de mensajes enviados
    if (!isAdmin) {
      const userRef = doc(db, "users", currentUser.id);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        let messagesSent = userData.messagesSent || [];
        
        // Filtrar el mensaje eliminado
        messagesSent = messagesSent.filter(msg => msg.id !== messageId);
        
        // Actualizar el documento del usuario
        await updateDoc(userRef, {
          messagesSent: messagesSent
        });
        
        // Verificar límite de mensajes
        checkUserMessageLimit();
      }
    }
    
    // Cerrar modal
    deleteMessageModal.style.display = 'none';
    
    // Mostrar mensaje de éxito
    alert('Mensaje eliminado correctamente');
  } catch (error) {
    console.error("Error deleting message:", error);
    alert("Error al eliminar el mensaje. Por favor, intenta de nuevo más tarde.");
  }
}

// Show admin panel
function showAdminPanel() {
  if (!isAdmin) return;
  
  // Hide all views
  homeView.classList.remove('active');
  moviesView.classList.remove('active');
  seriesView.classList.remove('active');
  animesView.classList.remove('active');
  doramasView.classList.remove('active');
  genreResultsView.classList.remove('active');
  searchResultsView.classList.remove('active');
  userProfilePage.classList.remove('active');
  
  // Show admin panel
  adminPanel.classList.add('active');
  
  // Reset tabs
  adminTabs.forEach(tab => tab.classList.remove('active'));
  adminTabs[0].classList.add('active');
  document.getElementById('users-section').style.display = 'block';
  document.getElementById('messages-section').style.display = 'none';
  
  // Load users
  loadUsers();
  
  // Load message recipients
  loadMessageRecipients();
}

// Load users for admin panel
async function loadUsers() {
  if (!isAdmin) return;
  
  try {
    // Get all users from Firestore
    const usersSnapshot = await getDocs(collection(db, "users"));
    const tbody = usersTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      const registeredDate = userData.registeredAt instanceof Date 
        ? userData.registeredAt 
        : userData.registeredAt?.toDate?.() || new Date();
        
      const tr = document.createElement('tr');
      
      tr.innerHTML = `
        <td>${userData.name}</td>
        <td>${userData.email}</td>
        <td>${registeredDate.toLocaleDateString()}</td>
        <td>
          <button class="admin-action-btn edit" data-id="${doc.id}">Editar</button>
          <button class="admin-action-btn message" data-id="${doc.id}" data-name="${userData.name}">Mensaje</button>
          <button class="admin-action-btn delete" data-id="${doc.id}">Eliminar</button>
        </td>
      `;
      
      tbody.appendChild(tr);
    });
    
    // Add event listeners to action buttons
    const editButtons = tbody.querySelectorAll('.edit');
    const messageButtons = tbody.querySelectorAll('.message');
    const deleteButtons = tbody.querySelectorAll('.delete');
    
    editButtons.forEach(button => {
      button.addEventListener('click', () => {
        const userId = button.dataset.id;
        showEditUserModal(userId);
      });
    });
    
    messageButtons.forEach(button => {
      button.addEventListener('click', () => {
        const userId = button.dataset.id;
        const userName = button.dataset.name;
        showSendMessageModal(userId, userName);
      });
    });
    
    deleteButtons.forEach(button => {
      button.addEventListener('click', () => {
        const userId = button.dataset.id;
        showDeleteConfirmationModal(userId);
      });
    });
  } catch (error) {
    console.error("Error loading users:", error);
    usersTable.querySelector('tbody').innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center;">Error al cargar los usuarios. Por favor, intenta de nuevo más tarde.</td>
      </tr>
    `;
  }
}

// Load message recipients for admin panel
async function loadMessageRecipients() {
  if (!isAdmin) return;
  
  try {
    // Clear previous options
    while (messageRecipient.options.length > 1) {
      messageRecipient.remove(1);
    }
    
    // Get all users from Firestore
    const usersSnapshot = await getDocs(collection(db, "users"));
    
    // Add users as options
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      const option = document.createElement('option');
      option.value = doc.id;
      option.textContent = userData.name;
      messageRecipient.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading message recipients:", error);
  }
}

// Load admin messages with real-time updates (NEW)
function loadAdminMessages() {
  if (!isAdmin) return;
  
  try {
    // Limpiar listener anterior si existe
    if (messageListeners['admin']) {
      messageListeners['admin']();
    }
    
    // Mostrar estado de carga
    adminMessagesList.innerHTML = `
      <div class="message-item" style="text-align: center;">
        <div class="spinner" style="width: 30px; height: 30px; margin: 0 auto;"></div>
        <p style="margin-top: 10px;">Cargando mensajes...</p>
      </div>
    `;
    adminNoMessages.style.display = 'none';
    
    // Crear una consulta para escuchar mensajes enviados al admin en tiempo real
    const messagesQuery = query(
      collection(db, "messages"),
      where("to", "==", "admin"),
      orderBy("date", "desc")
    );
    
    // Configurar listener en tiempo real
    const unsubscribe = onSnapshot(messagesQuery, async (snapshot) => {
      const adminMessages = [];
      
      // Obtener todos los mensajes
      for (const docSnapshot of snapshot.docs) {
        const messageData = docSnapshot.data();
        
        // Si el mensaje es de un usuario, obtener su nombre
        if (messageData.from !== 'admin') {
          try {
            const userDoc = await getDoc(doc(db, "users", messageData.from));
            const userName = userDoc.exists() ? userDoc.data().name : 'Usuario desconocido';
            
            adminMessages.push({
              id: docSnapshot.id,
              ...messageData,
              userName: messageData.userName || userName
            });
          } catch (error) {
            console.error("Error getting user data for message:", error);
            adminMessages.push({
              id: docSnapshot.id,
              ...messageData,
              userName: 'Usuario desconocido'
            });
          }
        } else {
          adminMessages.push({
            id: docSnapshot.id,
            ...messageData
          });
        }
      }
      
      if (adminMessages.length > 0) {
        adminNoMessages.style.display = 'none';
        adminMessagesList.innerHTML = '';
        
        adminMessages.forEach(message => {
          const messageDate = message.date instanceof Date 
            ? message.date 
            : message.date?.toDate?.() || new Date();
            
          const messageItem = document.createElement('div');
          messageItem.className = 'message-item';
          
          messageItem.innerHTML = `
            <div class="message-header">
              <span class="message-sender">De: ${message.userName || 'Usuario'}</span>
              <span class="message-date">${messageDate.toLocaleString()}</span>
            </div>
            <div class="message-content">${message.content}</div>
            <div class="message-actions">
              <button class="message-delete-btn" data-id="${message.id}">
                <i class="fas fa-trash"></i>
              </button>
              <button class="admin-action-btn message" data-id="${message.from}" data-name="${message.userName || 'Usuario'}" style="margin-left: 10px; background-color: var(--accent-color); color: white; border-radius: 4px; padding: 4px 8px; font-size: 0.8rem;">
                <i class="fas fa-reply"></i> Responder
              </button>
            </div>
          `;
          
          adminMessagesList.appendChild(messageItem);
          
          // Agregar event listener al botón de eliminar
          const deleteBtn = messageItem.querySelector('.message-delete-btn');
          deleteBtn.addEventListener('click', () => {
            showDeleteMessageModal(message.id);
          });
          
          // Agregar event listener al botón de responder
          const replyBtn = messageItem.querySelector('.admin-action-btn.message');
          replyBtn.addEventListener('click', () => {
            showSendMessageModal(message.from, message.userName || 'Usuario');
          });
        });
      } else {
        adminNoMessages.style.display = 'block';
        adminMessagesList.innerHTML = '';
      }
    }, (error) => {
      console.error("Error loading admin messages:", error);
      adminNoMessages.style.display = 'none';
      adminMessagesList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-exclamation-circle empty-icon"></i>
          <h3 class="empty-title">Error al cargar los mensajes</h3>
          <p class="empty-text">Ha ocurrido un error al cargar los mensajes. Por favor, intenta de nuevo más tarde.</p>
        </div>
      `;
    });
    
    // Guardar referencia al listener para limpiarlo después
    messageListeners['admin'] = unsubscribe;
    
  } catch (error) {
    console.error("Error setting up admin message listener:", error);
    adminNoMessages.style.display = 'none';
    adminMessagesList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-exclamation-circle empty-icon"></i>
          <h3 class="empty-title">Error al cargar los mensajes</h3>
          <p class="empty-text">Ha ocurrido un error al cargar los mensajes. Por favor, intenta de nuevo más tarde.</p>
        </div>
      `;
  }
}

// Show edit user modal
async function showEditUserModal(userId) {
  try {
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, "users", userId));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      editName.value = userData.name;
      editEmail.value = userData.email;
      editUserId.value = userId;
      
      editUserModal.style.display = 'block';
    }
  } catch (error) {
    console.error("Error getting user data for edit:", error);
    alert("Error al cargar los datos del usuario. Por favor, intenta de nuevo más tarde.");
  }
}

// Handle save user edit
async function handleSaveUserEdit() {
  const userId = editUserId.value;
  const name = editName.value.trim();
  const email = editEmail.value.trim();
  
  // Validate form
  if (!name || !email) {
    alert('Por favor, completa todos los campos');
    return;
  }
  
  try {
    // Update user in Firestore
    await updateDoc(doc(db, "users", userId), {
      name: name,
      email: email
    });
    
    // Close modal
    editUserModal.style.display = 'none';
    
    // Reload users
    loadUsers();
    
    // Show success message
    alert('Usuario actualizado correctamente');
  } catch (error) {
    console.error("Error updating user:", error);
    alert("Error al actualizar el usuario. Por favor, intenta de nuevo más tarde.");
  }
}

// Show send message modal
function showSendMessageModal(userId, userName) {
  messageTo.value = userName;
  messageUserId.value = userId;
  individualMessageContent.value = '';
  
  sendMessageModal.style.display = 'block';
}

// Handle send individual message
async function handleSendIndividualMessage() {
  const userId = messageUserId.value;
  const content = individualMessageContent.value.trim();
  
  // Validate form
  if (!content) {
    alert('Por favor, escribe un mensaje');
    return;
  }
  
  try {
    // Mostrar indicador de carga
    sendMessage.textContent = 'Enviando...';
    sendMessage.disabled = true;
    
    // Add message to Firestore
    await addDoc(collection(db, "messages"), {
      from: 'admin',
      to: userId,
      content: content,
      date: serverTimestamp(),
      read: false
    });
    
    // Close modal
    sendMessageModal.style.display = 'none';
    
    // Reset button state
    sendMessage.textContent = 'Enviar';
    sendMessage.disabled = false;
    
    // Show success message
    alert('Mensaje enviado correctamente');
  } catch (error) {
    console.error("Error sending message:", error);
    alert("Error al enviar el mensaje. Por favor, intenta de nuevo más tarde.");
    
    // Reset button state
    sendMessage.textContent = 'Enviar';
    sendMessage.disabled = false;
  }
}

// Handle send admin message
async function handleSendAdminMessage(e) {
  e.preventDefault();
  
  const recipient = messageRecipient.value;
  const content = messageContent.value.trim();
  
  // Validate form
  if (!content) {
    alert('Por favor, escribe un mensaje');
    return;
  }
  
  try {
    // Mostrar indicador de carga
    const submitBtn = adminMessageForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    // Add message to Firestore
    await addDoc(collection(db, "messages"), {
      from: 'admin',
      to: recipient,
      content: content,
      date: serverTimestamp(),
      read: false
    });
    
    // Reset form
    adminMessageForm.reset();
    
    // Restaurar botón
    submitBtn.textContent = 'Enviar Mensaje';
    submitBtn.disabled = false;
    
    // Show success message
    alert('Mensaje enviado correctamente');
  } catch (error) {
    console.error("Error sending message:", error);
    alert("Error al enviar el mensaje. Por favor, intenta de nuevo más tarde.");
    
    // Restaurar botón
    const submitBtn = adminMessageForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Enviar Mensaje';
    submitBtn.disabled = false;
  }
}

// Show delete confirmation modal
function showDeleteConfirmationModal(userId) {
  deleteUserId.value = userId;
  deleteConfirmationModal.style.display = 'block';
}

// Handle delete user
async function handleDeleteUser() {
  const userId = deleteUserId.value;
  
  try {
    // Delete user from Firestore
    await deleteDoc(doc(db, "users", userId));
    
    // Close modal
    deleteConfirmationModal.style.display = 'none';
    
    // Reload users
    loadUsers();
    
    // Show success message
    alert('Usuario eliminado correctamente');
  } catch (error) {
    console.error("Error deleting user:", error);
    alert("Error al eliminar el usuario. Por favor, intenta de nuevo más tarde.");
  }
}

// Reset services function
function resetServices() {
  // Reset all services
  serviceItems.forEach(item => item.classList.remove('active'));
  currentService = null;
  
  // Reload original content
  loadAllContent();
  
  // Ocultar el botón de volver
  servicesBackBtn.style.display = 'none';
}

// Navigate to a specific view
function navigateToView(view) {
  // Hide all views
  homeView.classList.remove('active');
  moviesView.classList.remove('active');
  seriesView.classList.remove('active');
  animesView.classList.remove('active');
  doramasView.classList.remove('active');
  genreResultsView.classList.remove('active');
  searchResultsView.classList.remove('active');
  userProfilePage.classList.remove('active');
  adminPanel.classList.remove('active');

  // Remove active class from all nav links
  navLinks.forEach(link => link.classList.remove('active'));

  // Show selected view
  switch (view) {
    case 'home':
      homeView.classList.add('active');
      document.querySelector('.nav-link[data-section="home"]').classList.add('active');
      break;
    case 'movies':
      // Shuffle movies content for a fresh experience
      moviesContent = shuffleArray([...moviesContent]);
      moviesView.classList.add('active');
      document.querySelector('.nav-link[data-section="movies"]').classList.add('active');
      renderGridView(moviesGrid, moviesContent);
      break;
    case 'series':
      // Shuffle series content for a fresh experience
      seriesContent = shuffleArray([...seriesContent]);
      seriesView.classList.add('active');
      document.querySelector('.nav-link[data-section="series"]').classList.add('active');
      renderGridView(seriesGrid, seriesContent);
      break;
    case 'animes':
      // Fetch and display anime content
      fetchAndDisplayAnimes();
      animesView.classList.add('active');
      document.querySelector('.nav-link[data-section="animes"]').classList.add('active');
      break;
    case 'doramas':
      // Fetch and display doramas content
      fetchAndDisplayDoramas();
      doramasView.classList.add('active');
      document.querySelector('.nav-link[data-section="doramas"]').classList.add('active');
      break;
    case 'genre-results':
      genreResultsView.classList.add('active');
      break;
    case 'search-results':
      searchResultsView.classList.add('active');
      break;
    default:
      homeView.classList.add('active');
      document.querySelector('.nav-link[data-section="home"]').classList.add('active');
      break;
  }

  currentView = view;
  scrollToTop();
}

// Load all content
    async function loadAllContent() {
      try {
        // Generar y renderizar el hero slider
        const heroContent = await generateHeroContent();
        renderHeroSlides(heroContent);

        // Fetch a larger pool of movies and series
        const allMovies = await fetchContentByIds(shuffleArray(contentIds.inicioMovieIds), 'movie');
        const allSeries = await fetchContentByIds(shuffleArray(contentIds.inicioSeriesIds), 'tv');
        // Fetch recently added content
        const recentlyAddedMovies = await fetchContentByIds(contentIds.recentlyAddedIds.movies, 'movie');
        const recentlyAddedSeries = await fetchContentByIds(contentIds.recentlyAddedIds.series, 'tv');
        const recentlyAddedContent = shuffleArray([...recentlyAddedMovies, ...recentlyAddedSeries]).slice(0, 15);

        // Render recently added content
        const recentlyAddedSlider = document.getElementById('recently-added-slider');
        renderContentSlider(recentlyAddedSlider, recentlyAddedContent);
        
        // Shuffle and select content for each section - siempre mostrar exactamente 15 elementos
        trendingContent = shuffleArray([...allMovies, ...allSeries]).slice(0, 15);
        moviesContent = shuffleArray(allMovies);
        seriesContent = shuffleArray(allSeries);
        
        // Render content sliders - siempre mostrar exactamente 15 elementos
        renderContentSlider(trendingSlider, trendingContent);
        renderContentSlider(moviesSlider, moviesContent.slice(0, 15));
        renderContentSlider(seriesSlider, seriesContent.slice(0, 15));

        // Hide services back button when loading all content
        servicesBackBtn.style.display = 'none';

      } catch (error) {
        console.error('Error loading content:', error);
      }
    }

// Render content in a slider
    function renderContentSlider(sliderElement, content) {
      sliderElement.innerHTML = '';

      if (content.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
          <i class="fas fa-film empty-icon"></i>
          <h3 class="empty-title">No hay contenido disponible</h3>
          <p class="empty-text">No se encontró contenido para mostrar en esta sección.</p>
        `;
        sliderElement.appendChild(emptyState);
        return;
      }

      content.forEach(item => {
        const card = document.createElement('div');
        card.className = 'content-card';
        card.dataset.id = item.id;
        card.dataset.type = item.media_type;

        const posterPath = item.poster_path 
          ? `${IMG_BASE_URL}/w500${item.poster_path}` 
          : 'https://via.placeholder.com/300x450?text=No+Image';

        const title = item.title || item.name || 'Sin título';
        const year = (item.release_date || item.first_air_date || '').split('-')[0] || 'N/A';
        const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
        const type = item.media_type === 'movie' ? 'Película' : 'Serie';

        card.innerHTML = `
          <img src="${posterPath}" alt="${title}" class="card-poster">
          <div class="card-rating">${rating}</div>
          <div class="card-badge">${type}</div>
          <div class="card-overlay">
            <h3 class="card-title">${title}</h3>
            <div class="card-info">
              <span>${year}</span>
              <span>${type}</span>
            </div>
            <div class="card-actions">
              <button class="card-btn play-btn" title="Ver ahora">
                <i class="fas fa-play"></i>
              </button>
              <button class="card-btn info-btn" title="Más información">
                <i class="fas fa-info"></i>
              </button>
              ${sliderElement.id === 'continue-watching-slider' ? `
                <button class="card-btn remove-btn" title="Eliminar de la lista">
                  <i class="fas fa-times"></i>
                </button>
              ` : ''}
            </div>
          </div>
        `;

        // Add event listeners 
        card.querySelector('.play-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          saveToContinuarViendo(item);
          window.open(`go:${item.id}`, '_blank');
        });

        card.querySelector('.info-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          showMovieDetailsModal(item.id, item.media_type);
        });

        if (sliderElement.id === 'continue-watching-slider') {
          card.querySelector('.remove-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            removeFromContinuarViendo(item.id);
            card.remove();
            
            // Check if continue watching is empty
            if (continueWatchingContent.length === 0) {
              continueWatchingSection.style.display = 'none';
            }
          });
        }

        card.addEventListener('click', () => {
          saveToContinuarViendo(item);
          window.open(`go:${item.id}`, '_blank');
        });

        sliderElement.appendChild(card);
      });
    }

// Render content in a grid view
function renderGridView(gridElement, content) {
  gridElement.innerHTML = '';

  if (content.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
      <i class="fas fa-film empty-icon"></i>
      <h3 class="empty-title">No hay contenido disponible</h3>
      <p class="empty-text">No se encontró contenido para mostrar en esta sección.</p>
    `;
    gridElement.appendChild(emptyState);
    return;
  }

  content.forEach(item => {
    const card = document.createElement('div');
    card.className = 'grid-card';
    card.dataset.id = item.id;
    card.dataset.type = item.media_type;

    const posterPath = item.poster_path 
      ? `${IMG_BASE_URL}/w500${item.poster_path}` 
      : 'https://via.placeholder.com/300x450?text=No+Image';

    const title = item.title || item.name || 'Sin título';
    const year = (item.release_date || item.first_air_date || '').split('-')[0] || 'N/A';
    const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
    const type = item.media_type === 'movie' ? 'Película' : 'Serie';

    card.innerHTML = `
      <img src="${posterPath}" alt="${title}" class="grid-poster">
      <div class="grid-rating">${rating}</div>
      <div class="grid-badge">${type}</div>
      <div class="grid-info">
        <h3 class="grid-title">${title}</h3>
        <div class="grid-meta">
          <span>${year}</span>
          <span>${type}</span>
        </div>
      </div>
      <div class="grid-actions">
        <button class="grid-btn play-btn" title="Ver ahora">
          <i class="fas fa-play"></i>
        </button>
        <button class="grid-btn info-btn" title="Más información">
          <i class="fas fa-info"></i>
        </button>
            ${gridElement.id === 'profile-my-list-grid' ? `
              <button class="grid-btn remove-btn" title="Eliminar de la lista">
                <i class="fas fa-times"></i>
              </button>
            ` : ''}
      </div>
    `;

    // Add event listeners
    card.querySelector('.play-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      saveToContinuarViendo(item);
      window.open(`go:${item.id}`, '_blank');
    });

    card.querySelector('.info-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      showMovieDetailsModal(item.id, item.media_type);
    });

    if (gridElement.id === 'profile-my-list-grid') {
      card.querySelector('.remove-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        removeFromMyList(item.id);
        card.remove();
      });
    }

    card.addEventListener('click', () => {
      saveToContinuarViendo(item);
      window.open(`go:${item.id}`, '_blank');
    });

    gridElement.appendChild(card);
  });
}

// Render hero slides
    function renderHeroSlides(slides) {
      hero.innerHTML = '';
      
      slides.forEach((slide, index) => {
        const isActive = index === 0 ? 'active' : '';
        const slideElement = document.createElement('div');
        slideElement.className = `hero-slide ${isActive}`;
        slideElement.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${slide.backdrop_path}')`;
        
        // Crear una descripción si no existe
        const description = slide.overview || 
                           (slide.media_type === 'movie' ? 
                            'Una película imperdible que te mantendrá al borde de tu asiento.' : 
                            'Una serie fascinante con personajes inolvidables y una trama adictiva.');
        
        slideElement.innerHTML = `
          <div class="hero-overlay">
            <div class="hero-content">
              <h1 class="hero-title">${slide.title || slide.name}</h1>
              <p class="hero-description">${description.substring(0, 150)}${description.length > 150 ? '...' : ''}</p>
              <div class="hero-buttons">
                <button class="btn btn-primary hero-play-btn" data-id="${slide.id}" data-type="${slide.media_type}">
                  <i class="fas fa-play"></i> Ver ahora
                </button>
                <button class="btn btn-secondary">
                  <i class="fas fa-info-circle"></i> Más información
                </button>
              </div>
            </div>
          </div>
        `;
        
        hero.appendChild(slideElement);
      });
      
      // Add hero navigation dots
      const heroNav = document.createElement('div');
      heroNav.className = 'hero-nav';
      heroNav.id = 'hero-nav';
      
      slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `hero-dot ${index === 0 ? 'active' : ''}`;
        dot.dataset.index = index;
        dot.addEventListener('click', () => goToHeroSlide(index));
        heroNav.appendChild(dot);
      });
      
      hero.appendChild(heroNav);
      
      // Add event listeners to play buttons
      document.querySelectorAll('.hero-play-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const id = this.dataset.id;
          const type = this.dataset.type;
          const slide = slides.find(s => s.id.toString() === id);
          
          if (slide) {
            saveToContinuarViendo(slide);
          }
          
          window.open(`go:${id}`, '_blank');
        });
      });

      // Add event listeners to info buttons
      document.querySelectorAll('.hero-buttons .btn-secondary').forEach((btn, index) => {
        btn.addEventListener('click', () => {
          const slide = slides[index];
          showMovieDetailsModal(slide.id, slide.media_type);
        });
      });
      
      // Update global variables
      heroSlides = document.querySelectorAll('.hero-slide');
      heroDots = document.querySelectorAll('.hero-dot');
    }

// Navigate slider
function navigateSlider(slider, direction) {
  const cardWidth = 240; // Ancho fijo de cada tarjeta
  const scrollAmount = cardWidth * 3; // Desplazar 3 tarjetas a la vez
  
  if (direction === 'prev') {
    slider.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  } else {
    slider.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }
}

// Start hero slideshow
function startHeroSlideshow() {
  clearInterval(heroInterval);
  heroInterval = setInterval(() => {
    goToHeroSlide((currentHeroSlide + 1) % heroSlides.length);
  }, 8000);
}

// Go to specific hero slide
function goToHeroSlide(index) {
  heroSlides[currentHeroSlide].classList.remove('active');
  heroDots[currentHeroSlide].classList.remove('active');
  
  currentHeroSlide = index;
  
  heroSlides[currentHeroSlide].classList.add('active');
  heroDots[currentHeroSlide].classList.add('active');
  
  startHeroSlideshow();
}

// Toggle search
function toggleSearch() {
  searchInput.classList.toggle('active');
  if (searchInput.classList.contains('active')) {
    setTimeout(() => searchInput.focus(), 300);
  }
}

// Handle search
function handleSearch() {
  const query = searchInput.value.trim().toLowerCase();
  
  if (!query) {
    return;
  }
  
  // Determinar qué contenido buscar según el contexto actual
  let contentToSearch = [];
  let searchTitle = '';
  
  // Si hay un servicio seleccionado, buscar solo en ese servicio
  if (currentService) {
    contentToSearch = [...trendingContent, ...moviesContent, ...seriesContent];
    searchTitle = `Resultados en ${currentService.charAt(0).toUpperCase() + currentService.slice(1)} para: "${query}"`;
  } 
  // Si no hay servicio, buscar según la vista actual
  else {
    switch (currentView) {
      case 'movies':
        contentToSearch = moviesContent;
        searchTitle = `Resultados en Películas para: "${query}"`;
        break;
      case 'series':
        contentToSearch = seriesContent;
        searchTitle = `Resultados en Series para: "${query}"`;
        break;
      case 'genre-results':
        // Ya estamos en resultados de género, usar ese contenido
        const genreContent = Array.from(genreResultsGrid.querySelectorAll('.grid-card')).map(card => {
          return {
            id: parseInt(card.dataset.id),
            media_type: card.dataset.type
          };
        });
        contentToSearch = genreContent;
        searchTitle = `Resultados en ${genreTitle.textContent} para: "${query}"`;
        break;
      default:
        // En home o cualquier otra vista, buscar en todo el contenido
        contentToSearch = [
          ...trendingContent,
          ...moviesContent,
          ...seriesContent
        ];
        searchTitle = `Resultados para: "${query}"`;
        break;
    }
  }
  
  // Eliminar duplicados por ID
  const uniqueContent = Array.from(
    new Map(contentToSearch.map(item => [item.id, item])).values()
  );
  
  // Filtrar contenido basado en la búsqueda
  const searchResults = uniqueContent.filter(item => 
    (item.title || item.name || '').toLowerCase().includes(query) ||
    (item.original_title || item.original_name || '').toLowerCase().includes(query)
  );
    
    // Actualizar título de resultados
    searchResultsTitle.textContent = searchTitle;
    
    // Renderizar resultados en vista de cuadrícula
    renderGridView(searchResultsGrid, searchResults);
    
    // Navegar a la vista de resultados de búsqueda
  navigateToView('search-results');
  }

  // Toggle sidebar
  function toggleSidebar() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
  }

  // Close sidebar
  function closeSidebarHandler() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
  }

  // Handle genre click
  async function handleGenreClick(e) {
    const genreId = parseInt(e.currentTarget.dataset.genre);
    const genreName = e.currentTarget.textContent.trim();
    
    // Close sidebar
    closeSidebarHandler();
    
    // Show spinner
    showSpinner();
    
    try {
      // Obtener las películas y series que ya tenemos cargadas
      const allMovies = await fetchContentByIds(contentIds.inicioMovieIds, 'movie');
      const allSeries = await fetchContentByIds(contentIds.inicioSeriesIds, 'tv');
      
      // Obtener los detalles completos para cada película
      const moviesWithGenres = await Promise.all(
        allMovies.map(async (movie) => {
          try {
            const response = await fetch(`${API_BASE_URL}/movie/${movie.id}?api_key=${API_KEY}&language=es-MX`);
            const data = await response.json();
            return {
              ...movie,
              genres: data.genres || []
            };
          } catch (error) {
            console.error(`Error fetching genres for movie ${movie.id}:`, error);
            return {
              ...movie,
              genres: []
            };
          }
        })
      );
      
      // Obtener los detalles completos para cada serie
      const seriesWithGenres = await Promise.all(
        allSeries.map(async (serie) => {
          try {
            const response = await fetch(`${API_BASE_URL}/tv/${serie.id}?api_key=${API_KEY}&language=es-MX`);
            const data = await response.json();
            return {
              ...serie,
              genres: data.genres || []
            };
          } catch (error) {
            console.error(`Error fetching genres for series ${serie.id}:`, error);
            return {
              ...serie,
              genres: []
            };
          }
        })
      );
      
      // Filtrar por género
      const filteredMovies = moviesWithGenres.filter(movie => 
        movie.genres && movie.genres.some(genre => genre.id === genreId)
      );
      
      const filteredSeries = seriesWithGenres.filter(serie => 
        serie.genres && serie.genres.some(genre => genre.id === genreId)
      );
      
      // Combinar resultados
      const genreResults = [...filteredMovies, ...filteredSeries];

      // Mezclar aleatoriamente los resultados
      const shuffledResults = genreResults.sort(() => Math.random() - 0.5);

      // Update genre title
      genreTitle.textContent = `Género: ${genreName}`;

      // Render results in grid view
      renderGridView(genreResultsGrid, shuffledResults);
      
      // Navigate to genre results view
      navigateToView('genre-results');
      
    } catch (error) {
      console.error('Error fetching genre content:', error);
      // En caso de error, mostrar mensaje de no hay contenido
      genreTitle.textContent = `Género: ${genreName}`;
      renderGridView(genreResultsGrid, []);
      navigateToView('genre-results');
    } finally {
      // Hide spinner
      hideSpinner();
    }
  }

  // Handle service click
  async function handleServiceClick(e) {
    const service = e.currentTarget.dataset.service;
    
    // Reset all services
    serviceItems.forEach(item => item.classList.remove('active'));
    
    // If clicking the same service, reset
    if (currentService === service) {
      currentService = null;
      loadAllContent();
      // Ocultar el botón de volver
      servicesBackBtn.style.display = 'none';
      return;
    }
    
    // Set active service
    e.currentTarget.classList.add('active');
    currentService = service;
    
    // Show spinner
    showSpinner();
    
    try {
      let movieIds = [];
      let seriesIds = [];
      
      // Get IDs based on selected service
      switch (service) {
        case 'netflix':
          movieIds = contentIds.netflixMovieIds;
          seriesIds = contentIds.netflixSeriesIds;
          break;
        case 'disney':
          movieIds = contentIds.disneyMovieIds;
          seriesIds = contentIds.disneySeriesIds;
          break;
        case 'hbo':
          movieIds = contentIds.hboMovieIds;
          seriesIds = contentIds.hboSeriesIds;
          break;
        case 'prime':
          movieIds = contentIds.primeMovieIds;
          seriesIds = contentIds.primeSeriesIds;
          break;
        case 'paramount':
          movieIds = contentIds.paramountMovieIds;
          seriesIds = contentIds.paramountSeriesIds;
          break;
      }
      
      // Fetch content for the selected service
      const movies = await fetchContentByIds(shuffleArray(movieIds), 'movie');
      const series = await fetchContentByIds(shuffleArray(seriesIds), 'tv');
      
      // Update content
      trendingContent = shuffleArray([...movies, ...series]).slice(0, 15);
      moviesContent = movies;
      seriesContent = series;

      // Render updated content
      renderContentSlider(trendingSlider, trendingContent);
      renderContentSlider(moviesSlider, moviesContent.slice(0, 15));
      renderContentSlider(seriesSlider, seriesContent.slice(0, 15));
      
      // Show back button in mobile view
      servicesBackBtn.style.display = 'flex';
      
    } catch (error) {
      console.error('Error fetching service content:', error);
    } finally {
      // Hide spinner
      hideSpinner();
    }
  }

  // Toggle back to top button
  function toggleBackToTop() {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  // Scroll to top
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Check welcome popup
  function checkWelcomePopup() {
    const dontShowAgain = localStorage.getItem('dontShowPopupAgain');
    
    if (dontShowAgain !== 'true') {
      welcomePopup.style.display = 'flex';
    }
  }

  // Handle close popup
  function handleClosePopup() {
    welcomePopup.style.display = 'none';
    
    if (dontShowAgain.checked) {
      localStorage.setItem('dontShowPopupAgain', 'true');
    }
  }

  // Load continue watching content
  async function loadContinuarViendo() {
    if (!currentUser) return [];
    
    try {
      // Get user document from Firestore
      const userDoc = await getDoc(doc(db, "users", currentUser.id));
      
      if (userDoc.exists() && userDoc.data().myList) {
        return userDoc.data().myList;
      }
      
      return [];
    } catch (error) {
      console.error("Error loading continue watching:", error);
      return [];
    }
  }

  // Save to continue watching
  async function saveToContinuarViendo(item) {
    if (!currentUser) return;
    
    try {
      // Get user document from Firestore
      const userDoc = await getDoc(doc(db, "users", currentUser.id));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        let myList = userData.myList || [];
        
        // Check if item already exists
        const existingIndex = myList.findIndex(content => content.id === item.id);
        
        if (existingIndex !== -1) {
          // Update last visited date
          myList[existingIndex].lastVisited = new Date().toISOString();
        } else {
          // Add new item
          myList.push({
            ...item,
            lastVisited: new Date().toISOString()
          });
        }
        
        // Update user document in Firestore
        await updateDoc(doc(db, "users", currentUser.id), {
          myList: myList
        });
      }
    } catch (error) {
      console.error("Error saving to continue watching:", error);
    }
  }

// Remove from my list
async function removeFromMyList(itemId) {
  if (!currentUser) return;
  
  try {
    // Get user document from Firestore
    const userDoc = await getDoc(doc(db, "users", currentUser.id));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      let myList = userData.myList || [];
      
      // Filter out the item to remove
      myList = myList.filter(item => item.id !== itemId);
      
      // Update user document in Firestore
      await updateDoc(doc(db, "users", currentUser.id), {
        myList: myList
      });
      
      // Show success message
      alert('Elemento eliminado de tu lista');
    }
  } catch (error) {
    console.error("Error removing from my list:", error);
    alert('Error al eliminar el elemento de tu lista');
  }
}
  // Show spinner
  function showSpinner() {
    spinnerContainer.style.display = 'flex';
  }

  // Hide spinner
  function hideSpinner() {
    spinnerContainer.style.display = 'none';
  }

  // Fetch content by IDs
  async function fetchContentByIds(ids, type) {
    if (!ids || ids.length === 0) return [];
    
    try {
      const promises = ids.map(id => 
        fetch(`${API_BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=es-MX`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error fetching ${type} ${id}`);
          }
          return response.json();
        })
        .then(data => ({
          ...data,
          media_type: type
        }))
        .catch(error => {
          console.error(error);
          return null;
        })
      );
      
      const results = await Promise.all(promises);
      return results.filter(item => item !== null);
    } catch (error) {
      console.error(`Error fetching ${type} content:`, error);
      return [];
    }
  }

  // Generate hero content
    async function generateHeroContent() {
      try {
        // Obtener 2 películas destacadas (las que especificaste)
        const featuredMovies = await fetchContentByIds(featuredMovieIds, 'movie');
        
        // Obtener 2 series destacadas (las que especificaste)
        const featuredSeries = await fetchContentByIds(featuredSeriesIds, 'tv');
        
        // Obtener 2 películas aleatorias (excluyendo las destacadas)
        const randomMovieIds = shuffleArray([...contentIds.inicioMovieIds])
          .filter(id => !featuredMovieIds.includes(id))
          .slice(0, 2);
        const randomMovies = await fetchContentByIds(randomMovieIds, 'movie');
        
        // Obtener 2 series aleatorias (excluyendo las destacadas)
        const randomSeriesIds = shuffleArray([...contentIds.inicioSeriesIds])
          .filter(id => !featuredSeriesIds.includes(id))
          .slice(0, 2);
        const randomSeries = await fetchContentByIds(randomSeriesIds, 'tv');
        
        // Combinar y mezclar todo el contenido
        const heroContent = shuffleArray([
          ...featuredMovies,
          ...featuredSeries,
          ...randomMovies,
          ...randomSeries
        ]);
        
        return heroContent;
      } catch (error) {
        console.error('Error generando contenido para el hero:', error);
        return [];
      }
    }

  // Fetch and display animes
  async function fetchAndDisplayAnimes() {
    try {
      // Show spinner
      showSpinner();
      
      // Fetch anime content
      const animeMovies = await fetchContentByIds(contentIds.animesMovieIds, 'movie');
      const animeSeries = await fetchContentByIds(contentIds.animesSeriesIds, 'tv');
      
      // Combine and shuffle
      const animeContent = shuffleArray([...animeMovies, ...animeSeries]);
      
      // Render in grid view
      renderGridView(animesGrid, animeContent);
    } catch (error) {
      console.error('Error fetching anime content:', error);
      renderGridView(animesGrid, []);
    } finally {
      // Hide spinner
      hideSpinner();
    }
  }

  // Fetch and display doramas
  async function fetchAndDisplayDoramas() {
    try {
      // Show spinner
      showSpinner();
      
      // Fetch dorama content
      const doramaMovies = await fetchContentByIds(contentIds.doramasMovieIds, 'movie');
      const doramaSeries = await fetchContentByIds(contentIds.doramasSeriesIds, 'tv');
      
      // Combine and shuffle
      const doramaContent = shuffleArray([...doramaMovies, ...doramaSeries]);
      
      // Render in grid view
      renderGridView(doramasGrid, doramaContent);
    } catch (error) {
      console.error('Error fetching dorama content:', error);
      renderGridView(doramasGrid, []);
    } finally {
      // Hide spinner
      hideSpinner();
    }
  }

  // Show movie details modal
  async function showMovieDetailsModal(id, type) {
    // Create modal container if it doesn't exist
    const modalContainer = document.getElementById('movie-details-modal-container');
    
    // Show loading state
    modalContainer.innerHTML = `
      <div class="movie-details-modal">
        <div class="modal-overlay"></div>
        <div class="modal-container">
          <button class="modal-close" id="close-details-modal">
            <i class="fas fa-times"></i>
          </button>
          <div class="modal-content">
            <div class="modal-loading">
              <div class="spinner"></div>
              <p>Cargando detalles...</p>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Add event listener to close button
    document.getElementById('close-details-modal').addEventListener('click', () => {
      modalContainer.innerHTML = '';
    });
    
    try {
      // Fetch movie/series details
      const response = await fetch(`${API_BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=es-MX&append_to_response=credits,videos`);
      
      if (!response.ok) {
        throw new Error(`Error fetching ${type} details`);
      }
      
      const data = await response.json();
      
      // Format data
      const title = data.title || data.name || 'Sin título';
      const originalTitle = data.original_title || data.original_name || '';
      const year = (data.release_date || data.first_air_date || '').split('-')[0] || 'N/A';
      const runtime = data.runtime 
        ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m` 
        : data.episode_run_time && data.episode_run_time.length > 0 
          ? `${Math.floor(data.episode_run_time[0] / 60)}h ${data.episode_run_time[0] % 60}m` 
          : 'N/A';
      const rating = data.vote_average ? data.vote_average.toFixed(1) : 'N/A';
      const overview = data.overview || 'No hay descripción disponible.';
      const posterPath = data.poster_path 
        ? `${IMG_BASE_URL}/w500${data.poster_path}` 
        : 'https://via.placeholder.com/300x450?text=No+Image';
      const backdropPath = data.backdrop_path 
        ? `${IMG_BASE_URL}/original${data.backdrop_path}` 
        : null;
      
      // Get director or creator
      let director = 'N/A';
      if (type === 'movie' && data.credits && data.credits.crew) {
        const directorPerson = data.credits.crew.find(person => person.job === 'Director');
        director = directorPerson ? directorPerson.name : 'N/A';
      } else if (type === 'tv' && data.created_by && data.created_by.length > 0) {
        director = data.created_by.map(person => person.name).join(', ');
      }
      
      // Get cast
      const cast = data.credits && data.credits.cast 
        ? data.credits.cast.slice(0, 5).map(person => person.name).join(', ') 
        : 'N/A';
      
      // Get trailer
      let trailerKey = null;
      if (data.videos && data.videos.results && data.videos.results.length > 0) {
        const trailer = data.videos.results.find(video => 
          video.type === 'Trailer' && video.site === 'YouTube'
        ) || data.videos.results[0];
        
        trailerKey = trailer ? trailer.key : null;
      }
      
      // Render modal content
      const modalContent = `
        <div class="movie-details-modal">
          <div class="modal-overlay"></div>
          <div class="modal-container">
            ${backdropPath ? `
              <div class="modal-backdrop" style="background-image: url('${backdropPath}')">
                <div class="modal-backdrop-overlay"></div>
              </div>
            ` : ''}
            <button class="modal-close" id="close-details-modal">
              <i class="fas fa-times"></i>
            </button>
            <div class="modal-content">
              <div class="modal-header">
                <div class="modal-poster">
                  <img src="${posterPath}" alt="${title}">
                </div>
                <div class="modal-info">
                  <h2 class="modal-title">${title}</h2>
                  ${originalTitle && originalTitle !== title ? `<p class="modal-original-title">${originalTitle}</p>` : ''}
                  <div class="modal-meta">
                    <span>${year}</span>
                    <span>${runtime}</span>
                    <span class="modal-rating"><i class="fas fa-star"></i> ${rating}</span>
                  </div>
                  <div class="modal-genres">
                    ${data.genres && data.genres.map(genre => 
                      `<span class="modal-genre">${genre.name}</span>`
                    ).join('')}
                  </div>
                  <p class="modal-overview">${overview}</p>
                  <div class="modal-details">
                    <div class="modal-detail">
                      <span class="detail-label">${type === 'movie' ? 'Director' : 'Creador'}:</span>
                      <span class="detail-value">${director}</span>
                    </div>
                    <div class="modal-detail">
                      <span class="detail-label">Reparto:</span>
                      <span class="detail-value">${cast}</span>
                    </div>
                    ${type === 'tv' && data.number_of_seasons ? `
                      <div class="modal-detail">
                        <span class="detail-label">Temporadas:</span>
                        <span class="detail-value">${data.number_of_seasons}</span>
                        <div class="seasons-list">
                          ${Array.from({length: Math.min(data.number_of_seasons, 5)}, (_, i) => i + 1).map(season => `
                            <div class="season-item">
                              <span>Temporada ${season}</span>
                              <span class="episode-count">${
                                data.seasons && data.seasons[season] 
                                  ? `${data.seasons[season].episode_count} episodios` 
                                  : 'N/A'
                              }</span>
                            </div>
                          `).join('')}
                        </div>
                      </div>
                    ` : ''}
                  </div>
                  <div class="modal-actions">
                    <button class="btn btn-primary watch-btn" data-id="${id}">
                      <i class="fas fa-play"></i> Ver ahora
                    </button>
                    ${trailerKey ? `
                      <button class="btn btn-secondary trailer-btn" data-key="${trailerKey}">
                        <i class="fas fa-film"></i> Ver trailer
                      </button>
                    ` : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Update modal container
      modalContainer.innerHTML = modalContent;
      
      // Add event listeners
      document.getElementById('close-details-modal').addEventListener('click', () => {
        modalContainer.innerHTML = '';
      });
      
      document.querySelector('.watch-btn').addEventListener('click', () => {
        saveToContinuarViendo({
          id: data.id,
          media_type: type,
          title: data.title || data.name,
          poster_path: data.poster_path,
          release_date: data.release_date || data.first_air_date,
          vote_average: data.vote_average
        });
        window.open(`go:${id}`, '_blank');
      });
      
if (trailerKey) {
  document.querySelector('.trailer-btn').addEventListener('click', () => {
    // Crear el modal para el trailer
    const trailerModalContainer = document.getElementById('trailer-modal-container');
    trailerModalContainer.innerHTML = `
      <div class="movie-details-modal">
        <div class="modal-overlay"></div>
        <div class="modal-container" style="max-width: 800px;">
          <button class="modal-close" id="close-trailer-modal">
            <i class="fas fa-times"></i>
          </button>
          <div class="modal-content" style="padding: 0;">
            <iframe 
              width="100%" 
              height="450" 
              src="https://www.youtube.com/embed/${trailerKey}?autoplay=1" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
              style="border-radius: var(--border-radius);"
            ></iframe>
          </div>
        </div>
      </div>
    `;
    
    // Añadir event listener para cerrar el modal
    document.getElementById('close-trailer-modal').addEventListener('click', () => {
      trailerModalContainer.innerHTML = '';
    });
    
    // También cerrar al hacer clic en el overlay
    trailerModalContainer.querySelector('.modal-overlay').addEventListener('click', () => {
      trailerModalContainer.innerHTML = '';
    });
  });
}
    } catch (error) {
      console.error('Error fetching movie details:', error);
      
      // Show error state
      modalContainer.innerHTML = `
        <div class="movie-details-modal">
          <div class="modal-overlay"></div>
          <div class="modal-container">
            <button class="modal-close" id="close-details-modal">
              <i class="fas fa-times"></i>
            </button>
            <div class="modal-content">
              <div class="modal-error">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Error al cargar los detalles</h3>
                <p>No se pudieron cargar los detalles de este contenido. Por favor, intenta de nuevo más tarde.</p>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Add event listener to close button 
      document.getElementById('close-details-modal').addEventListener('click', () => {
        modalContainer.innerHTML = '';
      });
    }
  }

  // Utility function to shuffle array
  function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
