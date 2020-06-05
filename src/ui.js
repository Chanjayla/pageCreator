import {
    initSingleBtn,
    initInput,
    initCustom,
    initUploadFile,
    initTextarea,
} from './ui-element'
import {
    addStyles,
    getStyles,
    getStylesText,
    getGlobalStylesText,
    setGlobalStylesText,
    flushCloneNodeSelector,
} from './styles'
import templates from './template'
import { zipImageByCanvas } from './utils/optimize'
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/ttcn.css'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/scroll/simplescrollbars'
import 'codemirror/mode/css/css'
import 'codemirror/addon/hint/css-hint'
import 'codemirror/keymap/sublime.js'
import 'codemirror/addon/selection/active-line'

import './style/ui.scss'
let status = {
    el: null,
    maskEl: null,
    __selectEl: null,
    __widthEl: null,
    __heightEl: null,
    __backgroundColorEl: null,
    __displayEl: null,
    __boxSizingEl: null,
    __marginEl: null,
    __paddingEl: null,
    __borderEl: null,
    __topEl: null,
    __rightEl: null,
    __bottomEl: null,
    __leftEl: null,
    __classNameEl: null,
}
let copyBuffer = null
let selectCssCm = null
let globalCssCm = null
Object.defineProperty(status, 'selectEl', {
    set(el) {
        this.__selectEl = el
        flushMask()
        if (el) {
            //styles in styles.js modules
            const styles = getStyles((el.dataset && el.dataset.selector) || '0')
            //styles in window.getComputedStyle
            const computedStyles = getComputedStyle(el)
            this.__widthEl &&
                (this.__widthEl.value = styles.width || computedStyles.width)
            this.__heightEl &&
                (this.__heightEl.value = styles.height || computedStyles.height)
            this.__backgroundColorEl &&
                (this.__backgroundColorEl.value =
                    styles['background-color'] ||
                    computedStyles.backgroundColor)
            this.__displayEl &&
                (this.__displayEl.value =
                    styles.display || computedStyles.display)
            this.__boxSizingEl &&
                (this.__boxSizingEl.value =
                    styles['box-sizing'] || computedStyles.boxSizing)
            this.__marginEl &&
                (this.__marginEl.value = styles.margin || computedStyles.margin)
            this.__paddingEl &&
                (this.__paddingEl.value =
                    styles.padding || computedStyles.padding)
            this.__borderEl &&
                (this.__borderEl.value = styles.border || computedStyles.border)
            this.__topEl &&
                (this.__topEl.value = styles.top || computedStyles.top)
            this.__rightEl &&
                (this.__rightEl.value = styles.right || computedStyles.right)
            this.__bottomEl &&
                (this.__bottomEl.value = styles.bottom || computedStyles.bottom)
            this.__leftEl &&
                (this.__leftEl.value = styles.left || computedStyles.left)
            this.__classNameEl && (this.__classNameEl.value = el.className)
        } else {
            this.__widthEl && (this.__widthEl.value = '')
            this.__heightEl && (this.__heightEl.value = '')
            this.__backgroundColorEl && (this.__backgroundColorEl.value = '')
            this.__displayEl && (this.__displayEl.value = '')
            this.__boxSizingEl && (this.__boxSizingEl.value = '')
            this.__marginEl && (this.__marginEl.value = '')
            this.__paddingEl && (this.__paddingEl.value = '')
            this.__borderEl && (this.__borderEl.value = '')
            this.__topEl && (this.__topEl.value = '')
            this.__rightEl && (this.__rightEl.value = '')
            this.__bottomEl && (this.__bottomEl.value = '')
            this.__leftEl && (this.__leftEl.value = '')
            this.__classNameEl && (this.__classNameEl = '')
        }
    },
    get() {
        return this.__selectEl
    },
})
export function initPaneUI(element) {
    status.el = element
    const fragment = document.createDocumentFragment()
    const pane = initPane()
    const mask = initMask()
    const structurePart = initStructurePart()
    const layoutPart = initLayoutPart()
    const fillPart = initFillPart()
    const decoratePart = initDecoratePart()
    const structureEntry = document.createElement('div')
    const layoutEntry = document.createElement('div')
    const fillEntry = document.createElement('div')
    const decorateEntry = document.createElement('div')
    structureEntry.className = 'ui-pane-entry'
    structureEntry.innerText = 'Structure'
    layoutEntry.className = 'ui-pane-entry'
    layoutEntry.innerText = 'Layout'
    fillEntry.className = 'ui-pane-entry'
    fillEntry.innerText = 'Fill'
    decorateEntry.className = 'ui-pane-entry'
    decorateEntry.innerText = 'Decorate'
    structureEntry.addEventListener('click', (e) => {
        layoutPart.style.display = 'none'
        fillPart.style.display = 'none'
        decoratePart.style.display = 'none'
        structurePart.style.display =
            structurePart.style.display == 'block' ? 'none' : 'block'
    })
    layoutEntry.addEventListener('click', (e) => {
        structurePart.style.display = 'none'
        fillPart.style.display = 'none'
        decoratePart.style.display = 'none'
        layoutPart.style.display =
            layoutPart.style.display == 'block' ? 'none' : 'block'
    })
    fillEntry.addEventListener('click', (e) => {
        layoutPart.style.display = 'none'
        structurePart.style.display = 'none'
        decoratePart.style.display = 'none'
        fillPart.style.display =
            fillPart.style.display == 'block' ? 'none' : 'block'
    })
    decorateEntry.addEventListener('click', (e) => {
        layoutPart.style.display = 'none'
        structurePart.style.display = 'none'
        fillPart.style.display = 'none'
        if (decoratePart.style.display == 'block') {
            decoratePart.style.display = 'none'
        } else {
            decoratePart.style.display = 'block'
            if (
                status.selectEl &&
                status.selectEl.dataset &&
                status.selectEl.dataset.selector
            ) {
                selectCssCm.setValue(
                    getStylesText(status.selectEl.dataset.selector)
                )
            } else {
                selectCssCm.setValue('')
            }
            globalCssCm.setValue(getGlobalStylesText())
        }
    })
    pane.appendChild(structureEntry)
    pane.appendChild(layoutEntry)
    pane.appendChild(fillEntry)
    pane.appendChild(decorateEntry)
    pane.appendChild(structurePart)
    pane.appendChild(layoutPart)
    pane.appendChild(fillPart)
    pane.appendChild(decoratePart)
    fragment.appendChild(pane)
    fragment.appendChild(mask)
    document.body.appendChild(fragment)
}

function initPane() {
    const pane = document.createElement('div')
    pane.className = 'ui-pane'
    return pane
}

function initStructurePart() {
    const part = document.createElement('div')
    const tit = document.createElement('div')
    tit.className = 'ui-pane-tit'
    tit.innerText = 'Structure'
    part.className = 'ui-pane-part'
    part.appendChild(tit)
    part.appendChild(
        initCustom('insertChild', (input) => {
            const outer = document.createElement('div')
            const template =
                templates[input.value] && templates[input.value](input.value)
            if (template) {
                outer.innerHTML = template
            } else {
                outer.innerHTML = input.value
            }
            const node = outer.childNodes[0]
            if (status.selectEl) {
                status.selectEl.appendChild(node)
                flushMask()
            } else {
                status.el.appendChild(node)
            }
        })
    )
    part.appendChild(
        initCustom('insertBefore', (input) => {
            const outer = document.createElement('div')
            const template =
                templates[input.value] && templates[input.value](input.value)
            if (template) {
                outer.innerHTML = template
                const node = outer.childNodes[0]
                if (status.selectEl) {
                    status.selectEl.parentNode.insertBefore(
                        node,
                        status.selectEl
                    )
                } else {
                    status.el.appendChild(node)
                }
                flushMask()
            }
        })
    )
    part.appendChild(
        initCustom('insertAfter', (input) => {
            const outer = document.createElement('div')
            const template =
                templates[input.value] && templates[input.value](input.value)
            if (template) {
                outer.innerHTML = template
                const node = outer.childNodes[0]
                if (status.selectEl) {
                    const parent = status.selectEl.parentNode
                    if (parent.lastNode == status.selectEl) {
                        parent.appendChild(node)
                    } else {
                        parent.insertBefore(node, status.selectEl.nextSibling)
                    }
                } else {
                    status.el.appendChild(node)
                }
                flushMask()
            }
        })
    )
    part.appendChild(
        initSingleBtn('copy', () => {
            if (status.selectEl && status.selectEl != status.el) {
                copyBuffer = status.selectEl.cloneNode(true)
                flushMask()
            }
        })
    )
    part.appendChild(
        initSingleBtn('pasteChild', () => {
            if (copyBuffer) {
                if (status.selectEl) {
                    status.selectEl.appendChild(
                        flushCloneNodeSelector(copyBuffer.cloneNode(true))
                    )
                } else {
                    status.el.appendChild(
                        flushCloneNodeSelector(copyBuffer.cloneNode(true))
                    )
                }
                flushMask()
            }
        })
    )
    part.appendChild(
        initSingleBtn('pasteBefore', () => {
            if (copyBuffer) {
                if (status.selectEl && status.selectEl != status.el) {
                    status.selectEl.parentNode.insertBefore(
                        flushCloneNodeSelector(copyBuffer.cloneNode(true)),
                        status,
                        selectEl
                    )
                } else {
                    status.el.appendChild(
                        flushCloneNodeSelector(copyBuffer.cloneNode(true))
                    )
                }
                flushMask()
            }
        })
    )
    part.appendChild(
        initSingleBtn('pasteAfter', () => {
            if (copyBuffer) {
                if (status.selectEl && status.selectEl != status.el) {
                    const parent = status.selectEl.parentNode
                    if (parent.lastNode == status.selectEl) {
                        parent.appendChild(
                            flushCloneNodeSelector(copyBuffer.cloneNode(true))
                        )
                    } else {
                        parent.insertBefore(
                            flushCloneNodeSelector(copyBuffer.cloneNode(true)),
                            status.selectEl.nextSibling
                        )
                    }
                    flushMask()
                }
            }
        })
    )
    part.appendChild(
        initSingleBtn('delete', () => {
            if (status.selectEl && status.selectEl != status.el) {
                status.selectEl.parentNode.removeChild(status.selectEl)
                status.selectEl = null
            }
        })
    )
    const widthElement = initInput('width', (input) => {
        if (status.selectEl) {
            addStyles(status.selectEl, {
                width: input.value,
            })
            flushMask()
        }
    })
    status.__widthEl = widthElement.querySelector('input')
    part.appendChild(widthElement)
    const heightElement = initInput('height', (input) => {
        if (status.selectEl) {
            addStyles(status.selectEl, {
                height: input.value,
            })
            flushMask()
        }
    })
    status.__heightEl = heightElement.querySelector('input')
    part.appendChild(heightElement)
    const backgroundColorElement = initInput('background-color', (input) => {
        if (status.selectEl) {
            addStyles(status.selectEl, {
                'background-color': input.value,
            })
            flushMask()
        }
    })
    status.__backgroundColorEl = backgroundColorElement.querySelector('input')
    part.appendChild(backgroundColorElement)
    return part
}

function initLayoutPart() {
    const part = document.createElement('div')
    const tit = document.createElement('div')
    part.className = 'ui-pane-part'
    tit.className = 'ui-pane-tit'
    tit.innerText = 'Layout'
    part.appendChild(tit)
    const displayElement = initInput('display', (input) => {
        if (status.selectEl) {
            addStyles(status.selectEl, {
                display: input.value,
            })
            flushMask()
        }
    })
    const boxSizingElement = initInput('box-sizing', (input) => {
        if (status.selectEl) {
            addStyles(status.selectEl, {
                'box-sizing': input.value,
            })
            flushMask()
        }
    })
    const marginElement = initInput('margin', (input) => {
        if (status.selectEl) {
            addStyles(status.selectEl, {
                margin: input.value,
            })
            flushMask()
        }
    })
    const paddingElement = initInput('padding', (input) => {
        if (status.selectEl) {
            addStyles(status.selectEl, {
                padding: input.value,
            })
            flushMask()
        }
    })
    const borderElement = initInput('border', (input) => {
        if (status.selectEl) {
            addStyles(status.selectEl, {
                border: input.value,
            })
            flushMask()
        }
    })
    const topElement = initInput('top', (input) => {
        if (status.selectEl) {
            addStyles(status.selectEl, {
                top: input.value,
            })
            flushMask()
        }
    })
    const rightElement = initInput('right', (input) => {
        if (status.selectEl) {
            addStyles(status.selectEl, {
                right: input.value,
            })
            flushMask()
        }
    })
    const bottomElement = initInput('bottom', (input) => {
        if (status.selectEl) {
            addStyles(status.selectEl, {
                bottom: input.value,
            })
            flushMask()
        }
    })
    const leftElement = initInput('left', (input) => {
        if (status.selectEl) {
            addStyles(status.selectEl, {
                left: input.value,
            })
            flushMask()
        }
    })
    status.__displayEl = displayElement.querySelector('input')
    status.__boxSizingEl = boxSizingElement.querySelector('input')
    status.__marginEl = marginElement.querySelector('input')
    status.__paddingEl = paddingElement.querySelector('input')
    status.__borderEl = borderElement.querySelectorAll('input')
    status.__topEl = topElement.querySelector('input')
    status.__rightEl = rightElement.querySelector('input')
    status.__bottomEl = bottomElement.querySelector('input')
    status.__leftEl = leftElement.querySelector('input')
    part.appendChild(displayElement)
    part.appendChild(boxSizingElement)
    part.appendChild(marginElement)
    part.appendChild(paddingElement)
    part.appendChild(borderElement)
    part.appendChild(topElement)
    part.appendChild(rightElement)
    part.appendChild(bottomElement)
    part.appendChild(leftElement)
    return part
}

function initFillPart() {
    const part = document.createElement('div')
    const tit = document.createElement('div')
    tit.innerText = 'Fill'
    tit.className = 'ui-pane-tit'
    part.className = 'ui-pane-part'
    const backgroundImageElement = initUploadFile(
        'background-image',
        (input) => {
            if (status.selectEl) {
                zipImageByCanvas(input.files[0]).then((base64) => {
                    addStyles(status.selectEl, {
                        'background-image': `url(${base64})`,
                    })
                })
            }
        }
    )
    const imageSrcElement = initUploadFile('img.src', (input) => {
        if (
            status.selectEl &&
            status.selectEl.tagName.toLocaleLowerCase() == 'img'
        ) {
            zipImageByCanvas(input.files[0]).then((base64) => {
                status.selectEl.src = base64
            })
        }
    })
    part.appendChild(tit)
    part.appendChild(backgroundImageElement)
    part.appendChild(imageSrcElement)
    return part
}

function initDecoratePart() {
    const part = document.createElement('div')
    const tit = document.createElement('div')

    tit.innerText = 'Decorate'
    tit.className = 'ui-pane-tit'
    part.className = 'ui-pane-part'
    const classNameElement = initInput('className', (input) => {
        if (status.selectEl) {
            status.selectEl.className = input.value
        }
    })
    const selectDomCss = initTextarea('Select DOM Inline CSS')
    selectCssCm = CodeMirror.fromTextArea(
        selectDomCss.querySelector('textarea'),
        {
            mode: 'css',
            theme: 'ttcn',
            keyMap: 'sublime',
            smartIndent: true,
            scrollbarStyle: 'simple',
            styleActiveLine: true,
        }
    )
    const globalDomCss = initTextarea('Global DOM CSS')
    globalCssCm = CodeMirror.fromTextArea(
        globalDomCss.querySelector('textarea'),
        {
            mode: 'css',
            theme: 'ttcn',
            keyMap: 'sublime',
            smartIndent: true,
            scrollbarStyle: 'simple',
            styleActiveLine: true,
        }
    )
    globalCssCm.on('change', function () {
        setGlobalStylesText(globalCssCm.getValue())
    })
    part.appendChild(tit)
    part.appendChild(classNameElement)
    part.appendChild(selectDomCss)
    part.appendChild(globalDomCss)
    return part
}

function initMask() {
    const mask = document.createElement('div')
    const content = document.createElement('div')
    const margin = document.createElement('div')
    const padding = document.createElement('div')
    mask.className = 'ui-mask'
    content.className = 'ui-mask-content'
    margin.className = 'ui-mask-margin'
    padding.className = 'ui-mask-padding'
    mask.appendChild(margin)
    mask.appendChild(padding)
    mask.appendChild(content)
    status.el.addEventListener('click', (e) => {
        const target = e.target
        status.selectEl = target
    })
    mask.addEventListener('click', () => {
        mask.style.display = 'none'
        status.selectEl = null
    })
    status.maskEl = mask
    return mask
}

function flushMask() {
    if (status.selectEl) {
        const computeStyle = getComputedStyle(status.selectEl)
        const margin = document.querySelector('.ui-mask-margin')
        const marginLeft = -computeStyle.marginLeft.split('px')[0]
        const marginTop = -computeStyle.marginTop.split('px')[0]
        console.log(margin, marginLeft, marginTop)
        margin.style.left = marginLeft + 'px'
        margin.style.top = marginTop + 'px'
        margin.style.padding = computeStyle.margin
        // console.log(computeStyle.width,computeStyle.height,computeStyle.padding)
        status.maskEl.style.width = computeStyle.width
        status.maskEl.style.height = computeStyle.height
        status.maskEl.style.top = status.selectEl.offsetTop + 'px'
        status.maskEl.style.left = status.selectEl.offsetLeft + 'px'
        status.maskEl.style.boxSizing = computeStyle.boxSizing
        status.maskEl.style.padding = computeStyle.padding
        status.maskEl.style.border = computeStyle.border
        status.maskEl.style.borderColor = 'rgba(255, 193, 7, 1)'
        status.maskEl.style.display = 'block'
    } else {
        status.maskEl.style.display = 'none'
    }
}
