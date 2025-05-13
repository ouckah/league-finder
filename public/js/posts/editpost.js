import { validatePost, throwError } from '../../utils/validation.js';

let editPostForm = document.getElementById('editpost-form');
let errorDiv = document.getElementById('error');
let successDiv = document.getElementById('success');


if (editPostForm) {
    editPostForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      let title = document.getElementById('title').value;
      let content = document.getElementById('content').value;
      let tags = document.getElementById('tags').value;
      let image = document.getElementById('image').value;

      try {
            validatePost(image, title, content, tags);
            errorDiv.hidden = true;
            successDiv.hidden = false;
            successDiv.innerHTML = 'Attempting to edit post...';
        const response = await fetch(editPostForm.action, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            content,
            image,
            tags
          })
        });
        if (response.ok) {
          const data = await response.json();
          window.location.href = `/posts/${data.postId}`;
        } else {
          const data = await response.json();
          throwError(data.error,errorDiv,successDiv);
        }
      } catch (e) {
        throwError(e,errorDiv,successDiv);
      }
    });
  }
