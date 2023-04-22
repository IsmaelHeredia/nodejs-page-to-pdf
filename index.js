const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

var html_to_pdf = require('html-pdf-node');
const fs = require("fs");

const port = 3000;

const app = express();

app.use(express.static('public'));

app.get("/downloads/:file", (req, res) => {
  res.download(
    path.join(__dirname, "downloads/" + req.params.file),
    (err) => {
      if (err) res.status(404).send("<h1>Not found: 404</h1>");
    }
  );
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var url_server = `http://localhost:${port}`;

app.get('/', (req, res) => {
  res.render('home/index.pug', { contenido : "hola" });
});

app.post('/convertir', (req, res) => {

  var url = req.body.url;

  var ruta_pdf = "public/downloads/page.pdf";
  var url_descarga = url_server + "/downloads/page.pdf";

  if(fs.existsSync(ruta_pdf)){
    fs.unlinkSync(ruta_pdf);
  }

  let options = { format: 'A4' };
  
  let file = { url: url };

  html_to_pdf.generatePdf(file, options).then(pdfBuffer => {

    fs.writeFile(ruta_pdf, pdfBuffer, (err) => {
      if (err) {
        res.status(400).json({estado:400, mensaje:"Error generando PDF"});
      } else {
        res.status(200).json({estado:200, mensaje:"PDF Generado", url:url_descarga});
      }
    });

  });

});

app.listen(port, () => console.log(`Servidor iniciado en el puerto ${url_server}`));