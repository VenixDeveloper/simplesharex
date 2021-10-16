const express = require("express");
const fs = require("fs-extra");
const { nanoid } = require("nanoid");
const router = express.Router();

const formatREGEX = /\.(gif|jpg|jpeg|tiff|png|mp4)$/i;

router.get('/', (req, res) => res.status(200).json({error: false, message: 'What are you doing here?'}));

router.post('/upload', async (req, res) => {
    if (!req.headers.key || req.headers.key !== process.env.SECRETPASS) return res.status(403).json({ error: true, message: 'Invalid key given.'});
    if (!req.files.file || !formatREGEX.test(req.files.file.name)) return res.status(403).json({ error: true, message: 'Invalid file type given.'});

    const string = await nanoid(process.env.FILELENGTH || 8);
    const [, type] = formatREGEX.exec(req.files.file.name);

    try {
        if (type === 'mp4') await fs.writeFile(`${process.cwd()}/src/files/${string}.mp4`, req.files.file.data)
        else await fs.writeFile(`${process.cwd()}/src/files/${string}${type === 'gif' ? '.gif' : '.png'}`, req.files.file.data);
        
        return res.json({ URL: `https://${process.env.DOMAIN === 'localhost' ? `localhost:${process.env.PORT}` : process.env.DOMAIN}/${string}.${type}`});
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: true,
            message: 'Whoops. The server ran into an error!'
        });
    }
});

module.exports = router;