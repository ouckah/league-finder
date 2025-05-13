import { validatePost, throwError, handleFormSubmit } from '../../utils/validation.js';

let postForm = document.getElementById('newpost-form');
let errorDiv = document.getElementById('error');
let successDiv = document.getElementById('success');



if(postForm){
    postForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        let title = document.getElementById('title').value;
        let content = document.getElementById('content').value;
        let tags = document.getElementById('tags').value;
        let image = document.getElementById('image').value;

        try{
            validatePost(image, title, content, tags);
            errorDiv.hidden = true;
            successDiv.hidden = false;
            successDiv.innerHTML = 'Attempting to create post...';

            await handleFormSubmit(postForm, { title, content, image, tags },'/posts/');
          } catch (e){
            throwError(e,errorDiv,successDiv);
          }
    });
}


