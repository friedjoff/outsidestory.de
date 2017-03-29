import 'normalize.css'

import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default.js'
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'

import plyr from 'plyr'
import 'plyr/dist/plyr.css'

import './style.css'

if (typeof outsidestoryPhotos === 'object') {
  var pswpElement = document.querySelectorAll('.pswp')[0];

  var options = {
    focus: false,
    modal: false,
    closeOnScroll: false,
    history: false,
    pinchToClose: false,
    closeOnVerticalDrag: false,
    barsSize: { top:0, bottom:'auto' },
    // UI options
    closeEl: false,
    shareEl: false,
    zoomEl: false
  };

  var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, outsidestoryPhotos, options);
  gallery.init();
}

plyr.setup()
