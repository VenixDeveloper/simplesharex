require('dotenv').config();
const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const fileUpload = require('express-fileupload');
const app = express()

const formatREGEX = /\.(gif|jpg|jpeg|tiff|png|mp4)$/i;

app.use(fileUpload());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('files', path.join(__dirname, 'files'));
app.use('/api/', require('./routes/api'));

app.get('/', (req, res) => {
    res.status(200).json({ error: false, message: 'Welcome to VenixDev\'s ShareX Server 👋' });
});

app.get('/:file', async (req, res) => {
    const exist = await fs.exists(`${process.cwd()}/src/files/${req.params.file}`);
    if (!exist) return res.status(404).json({ error: true, message: 'No file with such name was found!'});

    const [, format] = formatREGEX.exec(req.params.file);

    /*
    if (format === 'gif') res.writeHead(200, { "Content-Type": "image/gif" });
    else if (format === 'mp4') res.writeHead(200, { "Content-Type": "video/mp4" });
    else res.writeHead(200, { "Content-Type": "image/png" });
    */

    const fileName = `${req.params.file}`;
    const imgData = fs.readFileSync(`${process.cwd()}/src/files/${req.params.file}`);
    res.render('file', {
        fileName: fileName,
        format: format
    });
    // return fs.createReadStream(`${process.cwd()}/src/files/${req.params.file}`).pipe(res);
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
    res.status(403).json({error: true, message: 'Unauthorized'})
})

app.listen(process.env.PORT ?  process.env.PORT : 3000);