const express = require('express')
const app = express()

// read the port from a file named port.txt or use 3000 as default
const fs = require('fs')
const portFile = 'port.txt'
let port = 3000
if (fs.existsSync(portFile)) {
    const portData = fs.readFileSync(portFile, 'utf8')
    port = parseInt(portData, 10)
    if (isNaN(port) || port < 1 || port > 65535) {
        console.error('Invalid port number in port.txt. Using default port 3000.')
        port = 3000
    }
}
const request = require('request')
const GooglePhotosAlbum = require('google-photos-album-image-url-fetch')

let images = []

app.get('/', (req, res) => {
    // serve the index.html file
    res.sendFile(__dirname + '/public/index.html')
    console.log('requested index.html')
})

app.get('/img.jpg', (req, res) => {
    if (images.length === 0) {
        return res.status(503).send('No images available')
    }
    const randomIndex = Math.floor(Math.random() * images.length)
    const imageUrl = images[randomIndex].url

    res.setHeader('Content-Type', 'image/jpeg')
    res.setHeader('Cache-Control', 'no-store')
    request.get(imageUrl)
        .on('error', (err) => {
            res.status(500).send('Error fetching image')
            console.error(err)
        })
        .pipe(res)
    // log the successful image fetch
    console.log(`Fetched image: ${imageUrl}`)
})

app.listen(port, () => {
    // get the image list from the google photos album
    let albumUrl = 'shush'
    if (fs.existsSync('albumurl.txt')) {
        const urlData = fs.readFileSync("albumurl.txt", 'utf8')
        albumUrl = parseInt(urlData, 10)
        if (isNaN(albumUrl)) {
            console.error('NO URL BITCH')
            process.exit(1)
        }
    }
    const re = GooglePhotosAlbum.fetchImageUrls(albumUrl)
    re.then((result) => {
        images = result
        //console.log(images)
        console.log(`catapi listening on port ${port}`)
    }).catch((err) => {
        console.error(err)
        // stop the server if there is an error
        process.exit(1)
    })
})
