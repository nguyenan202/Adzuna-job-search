import { PdfReader } from 'pdfreader';
import { fileURLToPath } from 'url'
import path from 'path';

const parsePdf = (uploadPath) => {
    return new Promise((resolve, reject) => {
        const textItems = [];

        new PdfReader().parseFileItems(uploadPath, (err, item) => {
            if (err) {
                reject(err);
                return;
            }

            if (!item) {
                resolve(textItems.join('\\n'));
                return;
            }

            if (item.text) {
                textItems.push(item.text);
            }
        });
    });
};

const extractPDF = async (req, res) => {
    try {
        const {
            userId
        } = req.body;

        const sampleFile = req.files.pdfFile;
        const imageType = sampleFile.mimetype.replace('application/', '');

        const __filename = fileURLToPath(import.meta.url);
        let __dirname = path.dirname(__filename);
        __dirname = __dirname.replace('controllers', 'public\\images')

        const date = new Date().valueOf();
        const picturePath = `${date}${userId}.${imageType}`

        const uploadPath = path.join(__dirname, picturePath);

        sampleFile.mv(uploadPath)
            .then(() => {
                parsePdf(uploadPath)
                    .then((text) => {
                        res.status(200).json({ text });
                    })
                    .catch((err) => {
                        console.error('Error parsing PDF:', err);
                        res.status(500).json({ error: 'Failed to parse PDF' });
                    })
            })
            .catch((err) => {
                console.log(err);
            });

    } catch (err) {
        res.status(500).json({ message: err });
    }
}


export {
    extractPDF
}