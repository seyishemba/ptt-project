const path = require('path');
const fs = require('fs');
// const pdf = require('pdf-parse');
const pdf = require('./lib/pdf-parse.js');

const assert = require('assert');

const { tts } = require('google-tts-api');

// app.js

const express = require('express');
const multer = require('multer');

const app = express();
const port = 3000;

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, 'file' + ext);
  }
});

const upload = multer({ storage: storage });

// Serve HTML form for file upload
app.get('/', (req, res) => {
    const extractText = async (pathStr) => {
        assert (fs.existsSync(pathStr), `Path does not exist ${pathStr}`)
        const pdfFile = path.resolve(pathStr)
        const dataBuffer = fs.readFileSync(pdfFile);
        const data = await pdf(dataBuffer)
        return data.text
      }
      
      // let PDF_FILE = './test/data/01-valid.pdf';
      
      
      extractText('./uploads/file.pdf').then(t => console.log(t))
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.get('/payload', (req, res) => {
    const extractText = async (pathStr) => {
        assert (fs.existsSync(pathStr), `Path does not exist ${pathStr}`)
        const pdfFile = path.resolve(pathStr)
        const dataBuffer = fs.readFileSync(pdfFile);
        const data = await pdf(dataBuffer)
        return data.text
      }
      
      // let PDF_FILE = './test/data/01-valid.pdf';
      
      
      extractText('./uploads/file.pdf').then(t => res.send(t))
//   res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/text-to-audio', async (req, res) => {
    const { text } = req.query;
    if (!text) {
      return res.status(400).send('Text is required');
    }
  
    try {
      const audioUrl = await tts(text, { lang: 'en', slow: false });
      res.json({ audioUrl });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error converting text to audio');
    }
  });

// Handle file upload
app.post('/upload', upload.single('pdf'), (req, res) => {
  res.redirect('/');
//   res.send('File uploaded successfully! ');
});
// Serve HTML form for file upload
app.get('/pdf', (req, res) => {
  res.sendFile(path.join(__dirname, 'upload.html'));
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


