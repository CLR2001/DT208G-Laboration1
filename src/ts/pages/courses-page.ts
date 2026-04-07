const template = document.createElement('template');
template.innerHTML = `
<section class="main-content courses-main">
  <h1>Lägg till kurs</h1>
  
  <form>
    <div>
      <label for="coursecode">Kurskod:</label>
      <input type="text" name="coursecode" id="code-input" placeholder="DT084G">
    </div>
    <div>
      <label for="coursename">Kursnamn:</label>
      <input type="text" name="coursename" id="name-input" placeholder="Introduktion till programmering i JavaScript">
    </div>
    <div>
      <label for="progression">Kursprogression:</label>
      <select name="progression" id="progression-input">
        <option value="a">A</option>
        <option value="b">B</option>
        <option value="c">C</option>
      </select>
    </div>
    <div>
      <label for="syllabus">Kursplan:</label>
      <input type="text" name="syllabus" id="syllabus-input" placeholder="https://www.miun.se/utbildning/...">
    </div>
    <div class="form-buttons">
      <button type="button" class="submit-button">Spara</button>
      <button type="reset" class="reset-button">Rensa</button>
    </div>
  </form>
  <ul class="warning-list" id="warning-list"></ul>
</section>
`;
export const pageTemplate = template;