/* cache */
var elements = null
var counter = 0

/* garantuee initall call evaluates to true */
var viewbox_y = -Infinity

/* function to load images */
function changeSrc(offset){
    /* check if there was a relevant change */
    var cur_viewbox = -document.getElementById("navbar").getBoundingClientRect()
    if(cur_viewbox - viewbox_y < 100){
        return;
    }
    
    /* cache viewbox */
    viewbox_y = cur_viewbox
    
    /* cache */
    if(elements == null){
        elements = document.querySelectorAll("*[rrealsrc]");
    }

    for (var i = counter; i < elements.length; i++) {
            var boundingClientRect = elements[i].getBoundingClientRect();
            if (elements[i].hasAttribute("rrealsrc") 
                    && boundingClientRect.top < window.innerHeight + offset) {
                elements[i].style.backgroundImage = newSrc;
                elements[i].removeAttribute("rrealsrc");
            }else{
                /* DOM is parsed top down and images are inserted in that order too */
                /* meaing that once we reach pic that insnt in viewbox none following will be*/
                counter = i; 
                return;
            }
        }
    
    /* if we got here we are done */
    counter = elements.length

}
refresh_handler = function(e) {
    /* images directly in view first (offset 0)*/
	changeSrc(0)
	/* then load images almost in view */
	changeSrc(500)
};

/* add listeners */
window.addEventListener('scroll', refresh_handler);
window.addEventListener('resize', refresh_handler);
window.addEventListener('load', refresh_handler);
