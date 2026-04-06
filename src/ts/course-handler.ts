/**
 * @file Course Handler
 * @module CourseHandler
 * @description 
 */

/* ------------------------------- Interfaces ------------------------------- */
interface CourseModule {
  [courseCode: string]: CourseInfo;
}

interface CourseInfo {
  code: string,
  name: string,
  progression: 'a' | 'b' | 'c' | string,
  syllabus: string
}

/**
 * @function initCourses
 * @description Initializes the logic for courses.
 */
export function coursesInit(): void {
  const submitButton = document.querySelector<HTMLButtonElement>('.submit-button');
  const resetButton = document.querySelector<HTMLButtonElement>('.reset-button');
  const warningList = document.querySelector<HTMLUListElement>('#warning-list');
  
  submitButton?.addEventListener('click', addCourse);
  resetButton?.addEventListener('click', () => {
    if (warningList) warningList.innerHTML = '';
  });
}

export function indexInit() {
  renderCourses();
}

function addCourse(): void {
  const code = document.querySelector<HTMLInputElement>('#code-input');
  const name = document.querySelector<HTMLInputElement>('#name-input');
  const progression = document.querySelector<HTMLInputElement>('#progression-input');
  const syllabus = document.querySelector<HTMLInputElement>('#syllabus-input');
  if (!code || !name || !progression || !syllabus)  {
    console.error('Obligatoriska fält saknas!');
    return;
  }
  
  const course: CourseInfo = {
    code: code.value.trim(),
    name: name.value.trim(),
    progression: progression.value.trim(),
    syllabus: syllabus.value.trim()
  } 

  const warningArray: Array<string> = [];
  isInputEmpty(course.code, 'Kurskod kan inte vara tomt.', warningArray);
  isInputUnique(course.code, 'Kurs med samma kod är redan sparad.', warningArray)
  isInputEmpty(course.name, 'Kursnamn kan inte vara tomt.', warningArray);
  isInputEmpty(course.syllabus, 'Kursplan kan inte vara tomt.', warningArray);
  if (!isInputLink(course.syllabus) && course.syllabus !== "") {
    warningArray.push('Kursplan måste innehålla en länk.');
  };

  if (warningArray.length > 0) {
    const warningList = document.querySelector<HTMLUListElement>('#warning-list');
    if (!warningList) return;
    warningList.innerHTML = '';
    warningArray.forEach(warning => {
      const li = document.createElement('li');
      li.textContent = warning;
      warningList?.append(li);
    });
    return;
  }

  saveCourse(course);

  const warningList = document.querySelector<HTMLUListElement>('#warning-list');
  if (warningList) warningList.innerHTML = '';

  code.value = "";
  name.value = "";
  progression.value = "a";
  syllabus.value = "";
  
  console.log(`Kursen ${course.code} har sparats!`);
}

/**
 * @function isInputEmpty
 * @description Checks if input is empty and adds warning message to an array.
 * @param input Input to check.
 * @param message Message to add to array in case of empty input.
 * @param array Array to store messsages.
 */
function isInputEmpty(input: string, message: string, array: Array<string>) {
  if(input === "") {
    array.push(message);    
  }
}

/**
 * @function isInputUnique
 * @description Checks if input is unique and adds warning message to an array.
 * @param input Input to check.
 * @param message Message to add to array in case of empty input.
 * @param array Array to store messsages.
 */
function isInputUnique(input: string, message: string, array: Array<string>) {
  const courseData = localStorage.getItem('courseModule') || '{}';
  const courseModule: CourseModule = JSON.parse(courseData);
  
  if (input in courseModule) {
    array.push(message);
  }
}

/**
 * @function isInputLink
 * @description Checks if input is link (http or https).
 * @param input Input to check.
 */
function isInputLink(input: string): boolean {
  try {
    const url = new URL(input);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (error) {
    return false;
  }
}

/**
 * @function saveCourse
 * @description Saves a course to localStorage.
 * @param course Object containing course info.
 */
function saveCourse(course: CourseInfo): void {
  try {
    const courseData = localStorage.getItem('courseModule') || '{}';
    const courseModule: CourseModule = JSON.parse(courseData);
    courseModule[course.code] = course;

    localStorage.setItem('courseModule', JSON.stringify(courseModule));
  } catch (error) {
    console.error('Kunde inte spara kursen till localStorage:', error);
  }
}

/**
 * @function removeCourse
 * @description Removes a course from localStorage.
 * @param courseCode Code of which course to delete from localStorage.
 */
function removeCourse(courseCode: string): void {
  try {
    const courseData = localStorage.getItem('courseModule') || '{}';
    const courseModule: CourseModule = JSON.parse(courseData);

    delete courseModule[courseCode];

    localStorage.setItem('courseModule', JSON.stringify(courseModule));
    console.log(`Kursen ${courseCode} har raderats!`);
  } catch (error) {
    console.error('Kunde inte radera kursen från localStorage:', error);
    
  }
}

function renderCourses(): void {
  const container = document.querySelector<HTMLElement>('.course-cards');
  if (!container) return;

  const courseData = localStorage.getItem('courseModule') || '{}';
  const courseModule: CourseModule = JSON.parse(courseData);
  const courseArray = Object.values(courseModule);

  courseArray.forEach(course => {
    const div = document.createElement('div');
    div.classList.add('course-card');
    const codeElement = document.createElement('p');
    const nameElement = document.createElement('p');
    const syllabusElement = document.createElement('div');
    const progressionElement = document.createElement('p');
    const button = document.createElement('button');

    codeElement.innerHTML = `<b>${course.code}</b>`;
    nameElement.textContent = `Namn: ${course.name}`;
    syllabusElement.innerHTML = `<p>Kursplan: </p><a href="${course.syllabus}" target="_blank">Klicka här</a>`;
    progressionElement.innerHTML = `Progression: <b>${course.progression.toUpperCase()}</b>`;

    button.type = 'button';
    button.classList.add('delete-button');
    button.textContent = 'Radera kurs';
    button.addEventListener('click', () => {
      removeCourse(course.code);
      div.remove();
    });
    div.append(codeElement, nameElement, syllabusElement, progressionElement, button);
    container.append(div)
  });
}