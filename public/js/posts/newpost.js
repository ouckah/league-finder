import * as validation from '../../utils/validation.js';

let postForm = document.getElementById('newpost-form');
let errorDiv = document.getElementById('error');


/*
if(postForm){
    postForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let title = document.getElementById('title').value;
        let content = document.getElementById('content').value;
        let tags = document.getElementById('tags').value;
        tags = tags?.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

        try{
            title = checkString(title, 'title');
            content = checkString(content, 'content');
            // tags validation 
          } catch (e){
            // print error message
            return;
          }
        postForm.submit();
    });
}
*/

