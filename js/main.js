
window.onload = function() {
    this.getall();
};

// Get the button, and when the user clicks on it, execute myFunction
document.getElementById("newPost").onclick = function() {
    event.preventDefault();
    let title = document.getElementById("title").value;
    let content = document.getElementById("content").value;
    let author = document.getElementById("author").value;

    let data = {
        "title": title,
        "author": author,
        "content": content,
    };

    let response = fetch('http://localhost:8080/blog-posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(data),
    }).then(data => {
        return data.text();
    }).then(response => {
        getall();
    });     
};

document.getElementById("deletePost").onclick = function() {
    event.preventDefault();
    let id = document.getElementById("id").value;


    let response = fetch('http://localhost:8080/blog-posts/' + id, {
        method: 'DELETE',
        headers: {'content-type': 'application/json'},
    }).then(data => {
        return data.text();
    }).then(response => {
        getall();
    });     
};

function getall() {
    document.getElementById("list").innerHTML = "";
    let response = fetch('http://localhost:8080/blog-posts', {
        method: 'GET',
        dataType: 'jsonp',
        headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Access-Control-Allow-Origin': '*'
        },
    }).then(data => {
        return data.text();
    }).then(response => {
        response = JSON.parse(response);
        console.log(response);
        response.forEach(element => {
            var node = document.createElement("li");                 // Create a <li> node
            var textnode = document.createTextNode(element.author + element.content);         // Create a text node
            node.appendChild(textnode);                              // Append the text to <li>
            document.getElementById("list").appendChild(node);     // Append <li> to <ul> with id="myList" 
        });
    });  
}