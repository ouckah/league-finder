import * as validation from '../../utils/validation.js';

let teamForm = document.getElementById('newteams-form');
let errorDiv = document.getElementById('error');


if (teamForm) {
  teamForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let title = document.getElementById('title').value;

    // Not sure how we want to handle this. This works for now but it depends on how new team handblebars is done
    let desiredRoles = Array.from(document.querySelectorAll('input[name="desiredRole[]"]:checked'))
      .map(input => input.value);

    let desiredRanks = Array.from(document.querySelectorAll('input[name="desiredRank[]"]:checked'))
      .map(input => input.value);

    let region = document.getElementById('region').value;
    let description = document.getElementById('description').value;

    console.log(desiredRanks, desiredRoles);
    try {
      validation.validateTeam(title, desiredRanks, desiredRoles, region, description);
    } catch (e) {
      validation.throwError(e,errorDiv);
      return;
    }
    teamForm.submit();
  });
}