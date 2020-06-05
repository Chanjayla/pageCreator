export function throttle(fn, time) {
    let timeout
    return (...arg) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            fn(...arg)
        }, time)
    }
}

export function zipImageByCanvas(fileData) {
    return changeFileToBaseURL(fileData)
}

function changeFileToBaseURL(fileData) {
    return new Promise((resolve) => {
        const fileReader = new FileReader()
        const fileType = fileData.type
        fileReader.readAsDataURL(fileData)
        fileReader.onload = function () {
            const base64Code = this.result
            const img = new Image()
            img.src = base64Code
            img.onload = function () {
                const canvas = document.createElement('canvas')
                const context = canvas.getContext('2d')
                canvas.width = this.width
                canvas.height = this.height
                context.drawImage(this, 0, 0, canvas.width, canvas.height)
                const newImageData = canvas.toDataURL(fileType, 0.1)
                resolve(newImageData)
            }
        }
    })
}

function getBase64Size(data) {
    var size = 0
    if (data) {
        const equalIndex = data.indexOf('=')
        if (equalIndex > 0) {
            const str = data.substring(0, equalIndex)
            const strLength = str.length
            const fileLength = strLength - (strLength / 8) * 2 
            size = Math.floor(fileLength) 
        } else {
            const strLength = data.length
            const fileLength = strLength - (strLength / 8) * 2
            size = Math.floor(fileLength) 
        }
    } else {
        size = null
    }
    return size 
}
