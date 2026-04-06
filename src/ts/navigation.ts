/**
 * @file Navigation Handler
 * @module NavigationHandler
 * @description Handles the navigation logic, including hamburger menu functionality and accessibility.
 */

/**
 * @function initNavigation
 * @description Initializes the navigation functionality.
 */
export function initNavigation(): void {
  // 1. Selects DOM elements
  const nav = document.querySelector<HTMLElement>('header nav');
  const header = document.querySelector<HTMLElement>('header');
  const hamburgerButton = document.querySelector<HTMLButtonElement>('.hamburger-button');
  const navigationLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-list a, .header-logo');
  if (!nav || !hamburgerButton || !header) return;

  // 2. Initial runs on load
  updateScrollbarWidth();
  headerHeight(header);

  // 3. Event listeners for window resizing and UI updates
  window.addEventListener('resize', () =>{
    updateScrollbarWidth();
    headerHeight(header);
    if (window.innerWidth > 991 && nav.dataset.open === "true"){
      closeMenu(nav, hamburgerButton);
    }
  });

  // 4. Hamburger button functionality
  hamburgerButton.addEventListener('click', () => {
    const toOpen = nav.dataset.open !== "true";
    nav.dataset.open = toOpen.toString();
    toggleInert(toOpen);
    
    const icon = toOpen ? 'close' : 'open';
    hamburgerButton.innerHTML = `<svg class="icon"><use href="#icon-hamburger-${icon}"></use></svg>`;
  });

  // 5. Closes menu when clicking on links
  navigationLinks.forEach(link => {
    link.addEventListener('click', () => closeMenu(nav, hamburgerButton));
  });
}

/**
 * @function closeMenu
 * @description Closes the navigation menu.
 * @param {HTMLElement} nav - The navigation element to close.
 * @param {HTMLButtonElement} hamburgerButton - Button to open/close hamburger menu.
 */
function closeMenu(nav: HTMLElement, hamburgerButton: HTMLButtonElement): void {
  if (!nav || !hamburgerButton) return;

  nav.dataset.open = "false";
  toggleInert(false);
  hamburgerButton.innerHTML = '<svg class="icon"><use href="#icon-hamburger-open"></use></svg>';
}

/**
 * @function toggleInert
 * @description Toggles the 'inert' attribute on all main body elements except the header.
 * @param {boolean} value - True to set elements as inert, false to remove.
 */
function toggleInert(value: boolean): void {
  const elements = document.querySelectorAll<HTMLElement>('body > :not(header)');

  elements.forEach(element => {
    element.inert = value;
  });
}

/**
 * @function updateScrollbarWidth
 * @description Calculates and updates the --scrollbar-width CSS variable.
 */
function updateScrollbarWidth(): void{
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
}

/**
 * @function headerHeight
 * @description Calculates the current header height and updates the --header-height CSS variable.
 */
function headerHeight(header: HTMLElement): void {
  if (!header) return;

  document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`); 
}