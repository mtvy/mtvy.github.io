
/**--------------------------------------------------------------------*\
 * @param {str}        tag            -> html element name
 * @param {dict}       attrs          -> htmt attr (class, id...) 
 * @param {[str]}      styles.wrds    -> text to show at the element
 * @param {[html_obj]} styles.chldrn  -> children elements to push 
 *                                       into the main element
 * @param {str_url}    styles.imgs    -> images to show at the element
 * 
 * @note Need to send params: words and children even if they are empty.
 * 
 * @return html string object
\**--------------------------------------------------------------------*/
function crtElem(tag, attrs, styles = {}) {

    let elem = document.createElement(tag);

    for (let attr in attrs) elem.setAttribute(attr, attrs[attr]);

    if ( styles.wrds ) for ( let ind in styles.wrds ) elem.appendChild(document.createTextNode(styles.wrds[ind]));
    
    if (styles.chldrn) for (let ind in styles.chldrn) elem.appendChild(styles.chldrn[ind]);

    if ( styles.imgs ) for ( let ind in styles.imgs ) elem.style.backgroundImage = styles.imgs[ind];
    
    return elem;
    
}
/**--------------------------------------------------------------------*/


/**--------------------------------------------------------------------*/
function crtFirstFrame(body) {

    body.appendChild(crtElem('h1', {}, {'wrds' : ['Игровое поле']}));

    let field = crtElem('div', {'class' : 'field'});
    
    body.appendChild(crtElem('div', 
        {'class' : 'field-box'}, {'chldrn' : [field]}));
    
    body.appendChild(crtElem('div', 
        {'class' : 'cv'}));

}
/**--------------------------------------------------------------------*/


/**--------------------------------------------------------------------*/
function crtMenu(body) {
    body.
}
/**--------------------------------------------------------------------*/


/**--------------------------------------------------------------------*/
(function(body, doc) {

    crtFirstFrame(body);

    crtMenu(body);

})(document.querySelector('body'), document);
/**--------------------------------------------------------------------*/
