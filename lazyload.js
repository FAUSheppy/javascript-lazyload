/* determine which size of image to load */
function getSize(){
    var trueRes = screen.width/window.devicePixelRatio
    if(trueRes > 1920)
        return '-640-480'
    else if(trueRes <= 1920 && trueRes >= 1200)
        return '-640x480'
    else
        return '-320x240'
}

/* check if browser is capable of webp */
function supportsWebp() {
    return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    /* alternative to check for webP support */
    //if (!self.createImageBitmap) return false;
    //const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
    //return createImageBitmap(webpData).then(() => true, () => false);
}

/* cache */
var webP = supportsWebp()
var elements = null
var counter = 0

/* garantuee initall call evaluates to true */
var viewbox_y = -Infinity

IDENT = "realsrc"

/* function to load images */
function changeSrc(offset){

    /* check if there was a relevant change */
    var cur_viewbox = -document.getElementById("navbar").getBoundingClientRect().y
    if(cur_viewbox - viewbox_y < 100){
        return;

    }

    /* cache viewbox */
    viewbox_y = cur_viewbox

    /* cache */
    if(elements == null){
        elements = document.querySelectorAll("*[" + IDENT + "]");
    }

    for (var i = counter; i < elements.length; i++) {
            var boundingClientRect = elements[i].getBoundingClientRect();
            if (elements[i].hasAttribute(IDENT)
                    && boundingClientRect.top < window.innerHeight + offset) {

                var newSrc = elements[i].getAttribute(IDENT)
                /* remove url( ... ) if it is used */
                //newSrc = newSrc.substring(4,newSrc.length-1)

                if(newSrc.indexOf(".jpg") > -1){
                    /* get correct size */
                    newSrc += getSize()

                    /* load webP if supported */
                    if(webP){
                        newSrc = newSrc  + '.webp'
                    }
                }
                elements[i].setAttribute("src", newSrc);
                elements[i].style.backgroundImage = 'url(' + newSrc +')';
                elements[i].removeAttribute(IDENT);
            }else{
                /* DOM is parsed top down and images are inserted in that order too */
                /* meaing that once we reach pic that insnt in viewbox none following will be*/
                counter = i;
                return;
            }
        }

    /* if we got here we are done */
    document.getElementById("main_scrollable").removeEventListener("scroll",refresh_handler);

}
var refresh_handler = function(e) {
    /* images directly in view first (offset 0)*/
    //changeSrc(0)
    /* then load images almost in view */
    changeSrc(500)
};

/* add listeners */
document.getElementById("main_scrollable").addEventListener('scroll', refresh_handler);
window.addEventListener('resize', refresh_handler);
window.addEventListener('load', refresh_handler);
getSize()
