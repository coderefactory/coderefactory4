import 'whatwg-fetch';

document.addEventListener('DOMContentLoaded', () => {
  // get elements
  const form = document.getElementById('contact-form');
  const textarea = document.getElementById('contact-form__message');
  const textareaShadow = document.getElementById('contact-form__message-measure');
  if (!form) {
    return; 
  }
  const submitBtn = form.querySelector('button');
  const notification = document.getElementById('contact-form__notification');

  // get values
  const endpoint = form.getAttribute('action');

  // set flags

  // define behaviors for textarea resizing
  const copyInput = () => {
    textareaShadow.value = textarea.value;
  };

  const matchHeight = () => {
    textarea.style.height = `${textareaShadow.scrollHeight}px`;
  };

  const clearHeight = () => {
    textarea.style.height = '';
  };

  // define behaviors for form submission
  const updateUI = (state, msg) => {
    switch (state) {
      case 'loading':
        submitBtn.setAttribute('disabled', 'disabled');
        submitBtn.classList.add('loading');
        notification.innerHTML = '';
        notification.classList.remove('error');
        break;
      case 'response':
        submitBtn.removeAttribute('disabled');
        submitBtn.classList.remove('loading');
        break;
      case 'success':
        notification.innerHTML = msg;
        form.reset();
        break;
      case 'error':
        notification.classList.add('error');
        notification.innerHTML = msg;
        break;
      default:
        // do nothing
    }
  };

  const onResponse = response => {
    console.log(response);
    updateUI('response');
    if (response.ok) {
      // return response.json();
      return Promise.resolve(response);
    }
    return Promise.reject(response);
  };

  const onSuccess = data => {
    console.log(data);
    updateUI('success', `<span>${data.toString()}</span>`);
  };

  const onError = error => {
    // console.log(error.statusText);
    console.log(error);
    updateUI('error', `<span>Dangit. Error. You can also email us directly at <a href="mailto:info@coderefactory.com">info@coderefactory.com</a>.</span>`);
  };

  const onSubmit = e => {
    e.preventDefault();

    // update UI
    updateUI('loading');

    // send
    window.fetch(endpoint, {
      method: 'POST',
      body: new FormData(event.target),
    })
    .then(onResponse)
    .then(onSuccess)
    .catch(onError);
  };

  // attach behaviors for textarea resizing
  textarea.addEventListener('input', copyInput);
  textarea.addEventListener('focus', clearHeight);
  textarea.addEventListener('blur', matchHeight);

  // attach behaviors for form submission
  form.addEventListener('submit', onSubmit);
});
