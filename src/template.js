const signColor = ['#f44336','#009688','#795548','#e91e63','#4caf50','#9e9e9e','#9c27b0','#8bc34a','#607d8b','#673ab7','#cddc39','#3f51b5','#ffeb3b','#2196f3','#ffc107','#03a9f4','#ff9800','#00bcd4','#ff5722']
let signCount = -1
export default {
    div: (key) => createCloseTag(key),
    a: (key) => createCloseTag(key),
    h1: (key) => createCloseTag(key),
    h2: (key) => createCloseTag(key),
    h3: (key) => createCloseTag(key),
    h4: (key) => createCloseTag(key),
    h5: (key) => createCloseTag(key),
    i: (key) => createCloseTag(key),
    em: (key) => createCloseTag(key),
    ul: (key) => createCloseTag(key),
    li: (key) => createCloseTag(key),
    ol: (key) => createCloseTag(key),
    sub: (key) => createCloseTag(key),
    sup: (key) => createCloseTag(key),
    img: (key) =>`<img src="" style="width: 100px;height: 100px;">`,
    hr: (key) =>`<hr />`,
    // table: (key) =>`<table><tr><td>item</td></tr></table>`,
    // tr: (key) =>`<tr><td>item</td></tr>`,
    // td: (key) =>`<td>item</td>`,
    form: (key) => createCloseTag(key),
    section: (key) => createCloseTag(key),
    article: (key) => createCloseTag(key),
    input: (key) => `<input value=''>`,
    select: (key) => createCloseTag(key),
    option: (key) => createCloseTag(key)
}

function createCloseTag(tagName, externalStyle) {
    return `<${tagName} style="background-color: ${signColor[(signCount+1)%signColor.length]};${externalStyle || ''}">${tagName}</${tagName}>`
}


function createNotCloseTag(tagName, externalStyle) {
    return `<${tagName} style="background-color: ${signColor[(signCount+1)%signColor.length]};${externalStyle || ''}">`
}