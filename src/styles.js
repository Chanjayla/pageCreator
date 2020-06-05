import { transObjToArr } from './utils/trans'
const styles = {}
let globalCss = ''
let globalCssDom = null
export function getElementStyles(el) {
    const selectors = el.dataset.selectors
    const arr = selectors.split(' ')
    const result = []
    arr.forEach((val) => {
        if (styles[val]) {
            result.push(styles[val])
        }
    })
    return result
}

export function addStyles(node,styleObj) {
    if (!node) {
        return
    }
    if (node.dataset.selector) {
        const selector = node.dataset.selector
        if(!styles[selector]) {
            addWatcher(node, styleObj)
        } else {
            styles[selector] = styleObj
        }
    } else {
        addWatcher(node, styleObj)
    }
}

function addWatcher(node,styleObject) {
    const id = createSelectorId()
    node.dataset.selector = id
    styles[`__${id}`] = {}
    Object.defineProperty(styles, id, {
        get() {
            return this[`__${id}`]
        },
        set(styleObj) {
            Object.assign(this[`__${id}`], styleObj)
            node.style.cssText = transObjToArr(this[`__${id}`]).join(';')
        }
    })
    styles[`${id}`] = styleObject
}

export function getStyles(selector) {
    return styles[selector] || {}
}

export function getStylesText(selector) {
    const styles = getStyles(selector)
    const stylesArr = []
    for(let key in styles) {
        stylesArr.push('\t' + key + ':' + styles[key])
    }
    return `element.style {\n${stylesArr.join(';\n')}\n}\n`
}

export function getGlobalStylesText() {
    return globalCss
}

export function setGlobalStylesText(text) {
    globalCss = text
    if(globalCssDom) {
        document.head.removeChild(globalCssDom)
        globalCssDom.innerHTML = text
        document.head.appendChild(globalCssDom)
    } else {
        globalCssDom = document.createElement('style')
        globalCssDom.innerHTMl = text
        document.head.appendChild(globalCssDom)
    }
}

export function flushCloneNodeSelector(node) {
    if(node.dataset && node.dataset.selector) {
        addWatcher(node, styles[node.dataset.selector])
    }
    for(let i=0;i<node.childNodes.length;++i) {
        flushCloneNodeSelector(node.childNodes[i])
    }
    return node
}

function createSelectorId() {
    const timeStamp = new Date().getTime()
    const random = Math.random().toString().substring(3,6)
    return random + timeStamp
}
function querySelectorAllBindStyles(root, selector) {
    const arr = Array.prototype.slice.call(
        document.querySelectorAll(`${root} ${selector}`),
        0
    )
    arr.forEach((node) => {
        if (node.dataset.selector) {
            node.dataset.selector += ',' + selector
        } else {
            node.dataset.selector = selector
        }
    })
}

