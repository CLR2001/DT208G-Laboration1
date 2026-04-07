/**
 * @file SPA Page Handler
 * @module PageHandler
 * @description Manages the Single Page Application (SPA) logic.
 */

import { coursesInit } from "./course-handler";
import { indexInit } from "./course-handler";

interface PageModule {
  readonly pageTemplate: HTMLTemplateElement;
}

interface Pages {
  [key: string]: HTMLTemplateElement;
};

// 1. Imports all page files matching the pattern
const pageFiles = import.meta.glob<PageModule>("./pages/*-page.ts", { eager: true });
if (Object.keys(pageFiles).length === 0) {
  console.error('No pages found!');
}

const pageInits: Record<string, () => void> = {
  'index': indexInit,
  'courses': coursesInit
};

/**
 * @function initPageHandler
 * @description Initializes the page handling logic.
 */
export function initPageHandler(): void {
  const app = document.querySelector<HTMLElement>('#app');
  if (!app) return;

  const pages: Pages = {};

  // 2. Populate the pages object dynamically
  for (const path in pageFiles) {
    const fileName = path.split('/').pop() || '';
    const pageKey = fileName.replace('-page.ts', '');

    const pageObject = pageFiles[path];
    console.log(pageObject);
    
    if (pageObject && pageObject.pageTemplate) {
      pages[pageKey] = pageObject.pageTemplate;
    }  
  }

  // 3. Listens to browser back/forward buttons (popstate)
  window.addEventListener('popstate', (event) => {
    let pageToLoad = event.state && event.state.page;
    if (!pageToLoad) {
      pageToLoad = window.location.pathname.replace('/', '') || 'index';
    }
    renderPageContent(app, pages, pageToLoad, false);
  });

  // 4. Intercepts clicks on elements with the [data-page] attribute
  document.addEventListener('click', (event) => {
    const target = event.target as Element;
    const link = target.closest('[data-page]');
    if (link) {
      event.preventDefault();
      const activePage = link.getAttribute('data-page');
      if (!app || !pages || !activePage) return;
      renderPageContent(app, pages, activePage);
    }
  });

  // 5. Initial render based on current URL path on load
  const currentPath = window.location.pathname.replace('/', '');
  const initialPage = currentPath || 'index';
  renderPageContent(app, pages, initialPage, false);
}

/**
 * @function renderPageContent
 * @description Renders the HTML content of the selected page and updates the browser URL.
 * @param app - Main container for SPA.
 * @param pages - Object with page content as templates.
 * @param activePage - The key of the page to be displayed.
 * @param updateHistory - Whether to push a new state to the browser history.
 */
function renderPageContent (app: HTMLElement, pages: Pages, activePage: string, updateHistory = true) {
  app.replaceChildren();
  const template = pages[activePage];
  if (template) {
    app.appendChild(template.content.cloneNode(true));

    if (pageInits[activePage]) {
      pageInits[activePage]();
    }
  } else {
    app.appendChild(pages['nf'].content.cloneNode(true));
  }


  window.scrollTo(0, 0);

  if (updateHistory) {
    const url = activePage === 'index' ? '/' : `/${activePage}`;
    window.history.pushState({ page: activePage }, "", url);
  }

  updateActivePageClass(activePage);
};

/**
 * @function updateActivePageClass
 * @description Updates the 'active-page' CSS class on navigation links.
 * @param activePage - The key of the currently active page.
 */
function updateActivePageClass(activePage: string) {
  const navLinks = document.querySelectorAll('.nav-list a');
  navLinks.forEach(link => {
    if (link.getAttribute('data-page') === activePage) {
      link.classList.add('active-page');
    } else {
      link.classList.remove('active-page');
    }
  });
}