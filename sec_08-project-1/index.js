const form = document.querySelector('form');    // get by tag
const name = document.querySelector('#name');   // get by id
const cost = document.querySelector('#cost');   // get by id
const error = document.querySelector('#error'); // get by id

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (name.value && cost.value) {
    const item = {
      name: name.value,
      cost: parseInt(cost.value)
    }

    db.collection('expenses').add(item).then(res => {
      name.value = "";
      cost.value = "";
      error.value = "";
      
      form.reset();
    });

  } else {
    error.textContent = "Please enter value before submitting."
  }
});