require('dotenv').config();
const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const sizeOf = require('image-size');
const fileUpload = require('express-fileupload');
const app = express()

const formatREGEX = /\.(gif|jpg|png|mp4)$/i;

app.use(fileUpload());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/api/', require('./routes/api'));

app.get('/', (req, res) => {
    res.status(200).render('home');
});

app.get('/:file', async (req, res) => {
    const exist = await fs.exists(`${process.cwd()}/src/files/${req.params.file}`);
    if (!exist) return res.status(404).render('nofile');

    const [, format] = formatREGEX.exec(req.params.file);

    let imgSize = null;
    if (format === 'png') {
        imgSize = sizeOf(`${process.cwd()}/src/files/${req.params.file}`);
    } else if (format === 'jpg') {
        imgSize = sizeOf(`${process.cwd()}/src/files/${req.params.file}`);
    } else if (format === 'gif') {
        imgSize = sizeOf(`${process.cwd()}/src/files/${req.params.file}`);
    }

    const fileName = `${req.params.file}`;
    res.render('file', {
        fileName: fileName,
        format: format,
        imgSize: imgSize
    });
});

app.get('/raw/:file', async (req, res) => {
    const exist = await fs.exists(`${process.cwd()}/src/files/${req.params.file}`);
    if (!exist) return res.status(404).json({ error: true, message: 'No file with such name was found!'});
    const [, format] = formatREGEX.exec(req.params.file);

    if (format === 'gif') res.writeHead(200, { "Content-Type": "image/gif" });
    else if (format === 'mp4') res.writeHead(200, { "Content-Type": "video/mp4" });
    else res.writeHead(200, { "Content-Type": "image/png" });
    

    return fs.createReadStream(`${process.cwd()}/src/files/${req.params.file}`).pipe(res);
})

app.get('*', (req, res) => {
    res.status(403).render('unauthorized');
})

app.listen(process.env.PORT ?  process.env.PORT : 3000);