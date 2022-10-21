
var express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors');

const
    dbocategoria = require('./dbcategoria'),
    morgan = require('morgan')
helmet = require('helmet')
path = require('path')
swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json'),
    fs = require('fs');

var app = express(),
    router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

// app.use(helmet());
// app.use(morgan('tiny'));

router.route('/categoria').get((request, response) => {
    dbocategoria.getCategorias().then(result => {
        response.json(result[0]);
    })
})

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.use(express.static(path.join(__dirname, "./node_modules/bootstrap/dist/")));
var pdf = require('html-pdf');
app.get('/pdf', (req, res) => {
    var html = fs.readFileSync('./index.html', 'utf8');
    var config = {
        "base": 'http://localhost:8090/',
        "localUrlAccess": true,
        "format": "A4"
    }
    pdf.create(html, config).toStream((err, pdfStream) => {
        if (err) {
            // handle error and return a error response code
            console.log(err)
            return res.sendStatus(500)
        } else {
            // send a status code of 200 OK
            res.statusCode = 200

            // once we are done reading end the response
            pdfStream.on('end', () => {
                // done reading
                return res.end()
            })

            // pipe the contents of the PDF directly to the response
            pdfStream.pipe(res)
        }
    })
})

var port = process.env.PORT || 8090;
app.listen(port);
console.log('categoria api inicial en el puerto :' + port);