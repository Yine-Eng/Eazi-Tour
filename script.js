// NavBar
const menuBar = document.getElementById("menu-bar");
const navLinks = document.getElementById("nav-links");
const menuBarNav = menuBar.querySelector("i");

menuBar.addEventListener("click", (e) => {
    navLinks.classList.toggle("open");
    const isOpen = navLinks.classList.contains("open");
    menuBarNav.setAttribute("class", isOpen ? "fa-solid fa-x" : "fa-solid fa-bars");
});

navLinks.addEventListener("click", (e) => {
    navLinks.classList.remove("open");
    menuBarNav.setAttribute("class", "fa-solid fa-bars");
});

// Swiper and ScrollReveal
const scrollRevealOption = {
    distance: "3.13rem",
    origin: "bottom",
    duration: 1000,
};

ScrollReveal().reveal(".header-container h1", {
    ...scrollRevealOption,
});

ScrollReveal().reveal(".header-container p", {
    ...scrollRevealOption,
    delay: 500,
});

ScrollReveal().reveal(".header-container form", {
    ...scrollRevealOption,
    delay: 1000,
});

ScrollReveal().reveal(".services-card", {
    duration: 1000,
    interval: 500,
});

ScrollReveal().reveal(".destination-card", {
    ...scrollRevealOption,
    interval: 500,
});

ScrollReveal().reveal(".package-card", {
    ...scrollRevealOption,
    interval: 500,
});

const swiper = new Swiper(".swiper", {
    slidesPerView: "auto",
    spaceBetween: 20,
    pagination: {
    el: ".swiper-pagination",
    },
});

// Get elements
//Trigger Eazi features (initially hidden and shown after conditions are met)
const triggerCheckbox = document.getElementById('trigger-eazi-tool');
const eaziSelectTool = document.querySelector('.eazi-select-tool');
const eaziDestinationToolFinds = document.querySelector('.eazi-destination-tool-finds');
const searchButton = document.querySelector('.eazi-continent-select .btn');
const continentSelect = document.getElementById('continent-select');

// Destination cards 
const destinationField = document.getElementById('destination-field');
const destinationCards = document.querySelectorAll('.destination-card');

// Packages
const packageButtons = document.querySelectorAll('.package-card .btn');

// Email and Subscribe btn
const subscribeBtn = document.getElementById('subscribe-btn');
const subscribeEmail = document.getElementById('subscribe-email');
const emailError = document.getElementById('email-error');
const validInput = document.getElementById('valid-input');

// Function to reveal sections smoothly and scroll to them
function showSectionAndScroll(section) {
    section.classList.add('show');
    section.scrollIntoView({ behavior: 'smooth' });
}

// Function to fill destination and scroll to home
function fillDestinationAndScroll(destination) {
    destinationField.value = destination;
    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
}

// Email validation function using regex
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Function to fetch countries by continent
async function fetchCountriesByContinent(continent) {
    const response = await fetch(`https://restcountries.com/v3.1/region/${continent}`);
    const countries = await response.json();
    return countries;
}

async function fetchImagesForCountries(countries) {
    const imagePromises = countries.map(async (country) => {
        const response = await fetch(`https://eazi-tour-backend.vercel.app/api/photos?query=${country.name.common}`);
        const data = await response.json();
        
        if (data.results.length === 0) {
            console.warn(`No images found for ${country.name.common}`);
            return { country: country.name.common, imageUrl: '' };
        }

        // Attempts to find an image with the dimensions 1920x1280 or uses the first available image
        const suitableImage = data.results.find(img => img.width === 1920 && img.height === 1280);
        const imageUrl = suitableImage?.urls?.regular || data.results[0]?.urls?.regular || '';
        
        return { country: country.name.common, imageUrl };
    });

    const images = await Promise.all(imagePromises);
    return images;
}

function updateEaziDestinationToolFinds(images) {
    images.forEach((imageData, index) => {
        const card = document.getElementById(`eazi-destination-card-${index + 1}`);
        const imgElement = card.querySelector('img');
        const contentElement = card.querySelector('.destination-content');

        // Updates the image and content
        imgElement.src = imageData.imageUrl;
        imgElement.alt = imageData.country;
        contentElement.textContent = imageData.country;

        // Makes the destination card fully visible
        card.style.opacity = '1';
    });

    // Makes the eazi-destination-tool-finds section visible and scrolls to it
    eaziDestinationToolFinds.style.display = 'block';
    eaziDestinationToolFinds.scrollIntoView({ behavior: 'smooth' });
}

// Function triggered when the search button is clicked
async function handleSearch(event) {
    event.preventDefault();
    const continent = continentSelect.value;

    if (!continent) {
        alert('Please select a continent.');
        return;
    }

    try {
        // Fetch countries by continent and randomize selection
        const countries = await fetchCountriesByContinent(continent);
        const randomCountries = countries.sort(() => 0.5 - Math.random()).slice(0, 4);
        
        // Fetch images for the selected countries
        const images = await fetchImagesForCountries(randomCountries);
        
        // Update the Eazi Destination Tool Finds section with the images
        updateEaziDestinationToolFinds(images);
        
        // Make the eazi-destination-tool-finds section visible and scroll to it
        showSectionAndScroll(eaziDestinationToolFinds);
    } catch (error) {
        console.error('Error fetching countries or images:', error);
    }
}

// Event listener for the checkbox
triggerCheckbox.addEventListener('change', () => {
    if (triggerCheckbox.checked) {
        // Show the eazi-select-tool section and scroll to it
        showSectionAndScroll(eaziSelectTool);
    } else {
        // Hide the eazi-select-tool if unchecked
        eaziSelectTool.classList.remove('show');
    }
});

// Event listeners for destination cards
destinationCards.forEach(card => {
    card.addEventListener('click', () => {
        const destination = card.querySelector('.destination-content').textContent;
        fillDestinationAndScroll(destination);
    });
});

// Event listeners for package "Book Now" buttons
packageButtons.forEach(button => {
    button.addEventListener('click', () => {
        const packageTitle = button.closest('.package-card').querySelector('h4').textContent;
        fillDestinationAndScroll(packageTitle);
    });
});

// Event listener for the subscribe button
subscribeBtn.addEventListener('click', (event) => {
    const email = subscribeEmail.value.trim();
    
    if (!isValidEmail(email)) {
        event.preventDefault(); // Prevent form submission if email is invalid
        subscribeEmail.classList.add('input-error');
        emailError.style.display = 'block'; // Show error message
        validInput.style.display = 'none'; // Hide success message
    } else {
        subscribeEmail.classList.remove('input-error');
        emailError.style.display = 'none'; // Hide error message
        validInput.style.display = 'block'; // Show success message
    }
});

// Search button event listener
searchButton.addEventListener('click', handleSearch);