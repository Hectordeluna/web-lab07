let express = require('express');
let morgan = require('morgan');
const uuidv4 = require('uuid/v4');
const bodyParser = require('body-parser');

let app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));

const post = {
    id: uuidv4(),
    title: String,
    content: String,
    author: String,
    publishDate: Date,
}

const posts = [
    {
        id: uuidv4(),
        title: "My First Blog",
        content: "Hi, this is my first post",
        author: "Hector de Luna",
        publishDate: new Date(),  
    },
    {
        id: uuidv4(),
        title: "My First Blog",
        content: "Hi, this is my first posttt",
        author: "Hector de Luna",
        publishDate: new Date(),  
    }  
]

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, HEAD, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, access-control-allow-origin");
    next();
  });

app.get('/blog-posts', (req, res, next) => {
    return res.status(200).json(posts);
});

app.get('/blog-post', (req, res, next) => {
    let author = req.query.author;

    if (!author) {
        return res.status(404).json({
            code: 406,
            message: "Author not passed",
        });
    }

    let postsByAuthor = [];
    posts.forEach(element => {
        if (element.author == author) {
            postsByAuthor.push(element);
        }
    });

    if (postsByAuthor.length > 0) {
        return res.status(202).json(postsByAuthor);
    }

    return res.status(404).json({
        code: 404,
        message: "Not Found",
    });
});

app.post('/blog-posts', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, access-control-allow-origin");
    
    const {title, content, author} = req.body;
    console.log(req.body);
    if (!title || !content || !author) {
        return res.status(406).json({
            code: 406,
            message: "Not Enough fields",
        });       
    }

    posts.push({
        id: uuidv4(),
        title: title,
        content: content,
        author: author,
        publishDate: new Date(),  
    });

    return res.status(201).json({
        code: 201,
        message: "Added new post",
    }); 
});

app.delete('/blog-posts/:id', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Delete");
    const id = req.params["id"];
    if (id == null) {
        return res.status(406).json({
            code: 406,
            message: "Missing id param",
        });  
    }

    posts.forEach(function (element, index){
        if (element.id == id) {
            posts.splice(index,1)
            return res.status(200).json(element);
        }
    });

    return res.status(404).json({
        code: 404,
        message: "Not Found",
    });
}); 

app.put('/blog-posts/:idHead', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const idHead = req.params["idHead"];
    const {id, title, content, author} = req.body;
    console.log(req.body);

    if (id == null || idHead == null) {
        console.log(idHead);
        return res.status(406).json({
            code: 406,
            message: "Missing id param",
        });  
    }
    if (id != idHead) {
        return res.status(406).json({
            code: 409,
            message: "IDs do not match",
        });   
    }

    posts.forEach(function (element, index){
        if (element.id == id) {
            if (author) {
                element.author = author;
            }
            if (title) {
                element.title = title;
            }
            if (content) {
                element.content = content;
            }
            return res.status(200).json(element);
        }
    });

    return res.status(404).json({
        code: 404,
        message: "Not Found",
    });
}); 

app.listen('8080', () => {
    console.log("App running on localhost:8080");
});