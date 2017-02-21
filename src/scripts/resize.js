const fs = require('fs')
const glob = require('glob')
const mkdirp = require('mkdirp')
const path = require('path')
const sharp = require('sharp')

function _getPosition(string, subString, index) {
   return string.split(subString, index).join(subString).length
}

function resize (path) {
  return new Promise(function (resolve, reject) {
    var data = {}
    var count = 0
    glob('static/**/' + path, function (er, staticPhotos) {
      glob('content/**/' + path, function (er, contentPhotos) {
        contentPhotos.forEach(function (contentPhotoPath) {
          const photoPath = contentPhotoPath.substr(_getPosition(contentPhotoPath, '/', 2))
          const photoDir = photoPath.substring(0, photoPath.lastIndexOf('/') + 1)
          const photoName = photoPath.substring(photoPath.lastIndexOf('/') + 1)
          if (!staticPhotos.includes('static'+photoPath)) {
            if (!fs.existsSync('static'+photoDir)) mkdirp.sync('static'+photoDir)
            sharp(contentPhotoPath)
              .resize(1600, 1200)
              .max()
              .toFile('static'+photoPath, function (err, info) {
                if (err) reject(err)
                count++
                if (!data[photoDir]) data[photoDir] = {}
                data[photoDir][photoName] = [info.width, info.height]
                if (count === contentPhotos.length) {
                  resolve(data)
                }
              })
          } else {
            count++
          }
        })
      })
    })
  })
}

function writeData (data) {
  Object.keys(data).forEach(function (photoDir) {
    const dataName = photoDir.split('/')[1].replace(/-/g,'_')
    const dataPath = 'data/photos_' + dataName + '.json'
    fs.writeFileSync(dataPath, JSON.stringify(data[photoDir]))
  })
}

resize('photos/*.jpg').then(writeData)
resize('teaser.jpg')

