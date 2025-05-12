const express = require('express')
const app = express()
const port = 3000
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
    const re = GooglePhotosAlbum.fetchImageUrls("https://photos.app.goo.gl/NZWYRzxbeUK2rry49")
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
