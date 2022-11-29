
var express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    config = require('./config.js');

// console.log(`NODE_ENV=${config.NODE_ENV}`);

const
    dbocategoria = require('./dbcategoria'),
    morgan = require('morgan'),
    helmet = require('helmet'),
    path = require('path'),
    swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json'),
    fs = require('fs'),
    razor = require("raz"),
    microprofiler = require("microprofiler");

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

app.get('/categoria', function (req, res) {
    dbocategoria.getCategorias().then(result => {
        var buffer = new Buffer(result[0].Photo, 'binary');
        var bufferBase64 = buffer.toString('base64');
        res.json(bufferBase64);
    })
});

app.get('/PersonaFisica', function (req, res) {
    res.sendFile(path.join(__dirname, './PersonaFisica.html'));
});

// app.use(express.static(path.join(__dirname, "./")));
var pdf = require('html-pdf');
app.get('/Pdf', async (req, res) => {
    // var template = fs.readFileSync('./PdfTemplate/Fotos.html', 'utf8').toString();
    await fs.truncate('./PdfTemplate/PruebaEscritura.html', 0, async function () {
        await dbocategoria.getCategorias().then(async result => {
            let start = microprofiler.start();
            for (const f of result) {
                let buffer = Buffer.from(f.Photo, "binary");
                let sizeOf = require('buffer-image-size');
                let dimensions = sizeOf(buffer);

                const sharp = require("sharp");
                let p = await sharp(buffer)
                    .webp({ quality: 35 })
                    .toBuffer();

                fs.appendFile('./PdfTemplate/PruebaEscritura.html', `<img style="width:87%;" src="data:image/png;base64,${p.toString('base64')}" />`, function (err) {
                    if (err) throw err;
                });
            };
            let elapsedUs = microprofiler.measureFrom(start);
            console.log("Tiempo de Creacion de Html:" + elapsedUs);
        }).then(() => {
            res.sendFile(path.join(__dirname, './PdfTemplate/PruebaEscritura.html'))
        });
    });

    // let LogoBase64 = fs.readFileSync('./logoBase64.txt', 'utf8');

    // let html = ejs.render(template, data); -- RENDERIZAR HTML CON EJS
    // var html = razor.render({ model, template }); -- RENDERIZAR HTML CON RAZOR EXPRESS

    // var config = {
    //     localUrlAccess: true,
    //     "format": "A4",
    //     // base: "file:///" + __dirname + "/public",
    //     "header": {
    //         "height": "30mm",
    //         "contents": `<img src='${LogoBase64}' />`
    //     },
    //     "footer": {
    //         "contents": {
    //             default: "<div style='font-size:10px;text-align:right;'>Página <span>{{page}}</span> de <span>{{pages}}</span></div>", // fallback value
    //         }
    //     },
    //     "border": {
    //         "top": "0mm",            // default is 0, units: mm, cm, in, px
    //         "right": "5mm",
    //         "bottom": "5mm",
    //         "left": "5mm"
    //     },
    // }
    // pdf.create(html, config).toStream((err, pdfStream) => {
    //     if (err) {
    //         // handle error and return a error response code
    //         console.log(err)
    //         return res.sendStatus(500)
    //     } else {
    //         // send a status code of 200 OK
    //         res.statusCode = 200

    //         // once we are done reading end the response
    //         pdfStream.on('end', () => {
    //             // done reading
    //             return res.end()
    //         })

    //         // pipe the contents of the PDF directly to the response
    //         pdfStream.pipe(res)
    //     }
    // })
});

app.get('/PersonaFisicaPdf', (req, res) => {

    var template = fs.readFileSync('./PdfTemplate/PersonaFisica.html', 'utf8').toString();
    let LogoBase64 = fs.readFileSync('./logoBase64.txt', 'utf8');

    const model = {
        "requestClientDateTime": "2022-10-27T13:29:08.507Z",
    };

    var html = razor.render({ model, template });

    var config = {
        localUrlAccess: true,
        "format": "A4",
        // base: "file:///" + __dirname + "/public",
        "header": {
            "height": "30mm",
            "contents": `<img src='${LogoBase64}' />`
        },
        "footer": {
            "contents": {
                default: "<div style='font-size:10px;text-align:right;'>Página <span>{{page}}</span> de <span>{{pages}}</span></div>", // fallback value
            }
        },
        "border": {
            "top": "0mm",            // default is 0, units: mm, cm, in, px
            "right": "5mm",
            "bottom": "5mm",
            "left": "5mm"
        },
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
});

app.get('/PersonaAsalariadaPdf', (req, res) => {

    var template = fs.readFileSync('./PersonaAsalariada.html', 'utf8').toString();
    let LogoBase64 = fs.readFileSync('./logoBase64.txt', 'utf8');

    const model = {
        title: "Names of the Days of the Week",
        days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    };

    var html = razor.render({ model, template });

    var config = {
        localUrlAccess: true,
        "format": "A4",
        // base: "file:///" + __dirname + "/public",
        "header": {
            "height": "30mm",
            "contents": `<img src='${LogoBase64}' />`
        },
        "footer": {
            "contents": {
                default: "<div style='font-size:10px;text-align:right;'>Página <span>{{page}}</span> de <span>{{pages}}</span></div>", // fallback value
            }
        },
        "border": {
            "top": "0mm",            // default is 0, units: mm, cm, in, px
            "right": "5mm",
            "bottom": "5mm",
            "left": "5mm"
        },
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
});

var port = process.env.PORT || 8090;
app.listen(port);
console.log('api inicial en el puerto :' + port);