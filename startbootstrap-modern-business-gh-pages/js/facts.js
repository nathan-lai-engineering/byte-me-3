var facts = [];

// Create a request variable and assign a new XMLHttpRequest object to it.
var request = new XMLHttpRequest()

// Open a new connection, using the GET request on the URL endpoint
request.open('GET', 'https://some-random-api.ml/facts/koala', true)

request.onload = function() {
  // Begin accessing JSON data here
}

// Send request
request.send()

// Begin accessing JSON data here
var data = JSON.parse(this.response)

data.forEach(fact => {
  // Log each movie's title
  console.log(fact.fact);
})
