document.addEventListener('DOMContentLoaded', () => {
  // get elements
  const form = document.getElementById('contact-form');
  const textarea = document.getElementById('contact-form__message');
  const textareaShadow = document.getElementById('contact-form__message-measure');
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
        notification.textContent = '';
        notification.classList.remove('error');
        break;
      case 'response':
        submitBtn.removeAttribute('disabled');
        submitBtn.classList.remove('loading');
        break;
      case 'success':
        notification.textContent = msg;
        break;
      case 'error':
        notification.classList.add('error');
        notification.textContent = msg;
        break;
      default:
        // do nothing
    }
  };

  const onResponse = response => {
    updateUI('response');
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response);
  };

  const onSuccess = data => {
    updateUI('success', data);
  };

  const onError = error => {
    updateUI('error', error.statusText);
  };

  const onSubmit = e => {
    e.preventDefault();

    // update UI
    updateUI('loading');

    // send
    console.log('TODO: integrate');
    fetch(endpoint, {
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
