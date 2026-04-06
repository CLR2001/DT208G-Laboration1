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
export function initCourses(): void {

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
  isInputEmpty(course.name, 'Kursnamn kan inte vara tomt.', warningArray);
  isInputEmpty(course.syllabus, 'Kursplan kan inte vara tomt.', warningArray);
  isInputLink(course.syllabus);

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
  progression.value = "";
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
 * @function isInputEmpty
 * @description Checks if input is link (http or https).
 * @param input Input to check.
 */
function isInputLink(input: string): boolean {
  try {
    const url = new URL(input);
    return url.protocol === "http" || url.protocol === "https";
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
    console.log(`Kursen ${course.code} har raderats!`);
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
  } catch (error) {
    console.error('Kunde inte radera kursen från localStorage:', error);
    
  }
}