import { throttle, zipImageByCanvas} from './utils/optimize'
export function initSingleBtn(text, callback) {
    const div = document.createElement('div')
    const btn = document.createElement('div')
    div.className = 'ui-block'
    btn.className = 'ui-single-btn'
    btn.innerText = text
    btn.addEventListener('click', () => {
        callback(btn)
    })
    div.appendChild(btn)
    return div
}
export function initInput(text, callback, initVal) {
    const div = document.createElement('div')
    const input = document.createElement('input')
    const label = document.createElement('label')
    div.className = 'ui-block'
    label.innerText = text
    input.value = initVal || ''
    input.addEventListener(
        'input',
        throttle(() => {
            callback(input)
        }, 200)
    )
    div.appendChild(label)
    div.appendChild(input)
    return div
}
export function initCustom(text, callback, initVal) {
    const div = document.createElement('div')
    const input = document.createElement('input')
    const button = document.createElement('button')
    div.className = 'ui-block'
    input.value = initVal || ''
    button.className = 'ui-btn'
    button.innerText = text
    button.addEventListener('click', () => {
        callback(input)
    })
    div.appendChild(input)
    div.appendChild(button)
    return div
}

export function initUploadFile(text, callback) {
    const div = document.createElement('div')
    const input = document.createElement('input')
    const button = document.createElement('button')
    const preview = document.createElement('div')
    const previewImg = document.createElement('img')
    div.className = 'ui-block ui-upload'
    preview.className = 'ui-preview'
    input.type = 'file'
    button.className = 'ui-single-btn'
    button.innerText = text
    button.addEventListener('click', () => {
        callback(input)
    })
    input.addEventListener('change', (e) => {
        const file = e.target.files[0]
        if(file.type.indexOf('image') > -1) {
            zipImageByCanvas(file).then(base64 => {
                previewImg.src = base64
            })
        }
    })
    preview.appendChild(previewImg)
    div.appendChild(input)
    div.appendChild(preview)
    div.appendChild(button)
    return div
}
export function initTextarea(text) {
    const div = document.createElement('div')
    const p = document.createElement('p')
    const textarea = document.createElement('textarea')
    textarea.value = '123123123'
    div.className = 'ui-textarea-block'
    p.innerText = text
    div.appendChild(p)
    div.appendChild(textarea)
    return div
}


export function flushStylesList() {
    const list = document.querySelector('#stylesList')
    list.innerHTML = ''
    let fragment = document.createDocumentFragment()
    const styles = getStyles(status.selectEl)
    for (let key in styles) {
        fragment.appendChild(
            initCssTextarea(key, () =>
                Object.entries(styles[key]).reduce((val) => {
                    return `${val[0]}:${val[1]};`
                })
            )
        )
    }
    list.appendChild(fragment)
}

