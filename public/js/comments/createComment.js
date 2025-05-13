import { validateComment, throwError, handleFormSubmit } from '../../utils/validation.js';

let commentForm = document.getElementById('comment-form');
let errorDiv = document.getElementById('error');
let successDiv = document.getElementById('success');



if(commentForm){
    commentForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        let postId = document.getElementById('postId').value;
        let content = document.getElementById('content').value;

        try{
            ({postId,content} = validateComment(postId,content));
            errorDiv.hidden = true;
            successDiv.hidden = false;
            successDiv.innerHTML = 'Attempting to create comment...';

            await handleFormSubmit(commentForm, { postId,content },window.location.pathname);
          } catch (e){
            throwError(e,errorDiv,successDiv);
          }
    });
}
