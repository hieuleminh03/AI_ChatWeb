const url = 'http://localhost:3000';
const data = {
  message: 'how many stars are there ?',
  history: [
    {
      role: 'user',
      parts: 'Hello, I have 2 dogs in my house.'
    },
    {
      role: 'model',
      parts: 'Great to meet you. What would you like to know?'
    }
  ]
};

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
