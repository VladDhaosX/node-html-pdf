const dbocategoria = require('./dbcategoria');

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const { response } = require('express');

const swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');

var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

router.route('/categoria').get((request, response) => {
    dbocategoria.getCategorias().then(result => {
        response.json(result[0]);
    })
})

var port = process.env.PORT || 8090;
app.listen(port);
console.log('categoria api inicial en el puerto :' + port);