import Bubble from './bubble'
import BubbleSVG from './bubble-svg'

export function createBubble(map, center) {
    createOverlayProto()
    const c = new google.maps.LatLng(center.x, center.y)
    const circle = new google.maps.Circle({
        map: map,
        center: c,
        radius: 200,
        strokeColor: 'transparent',
        fillColor: 'transparent'
    });
    const b = circle.getBounds();
    return new BubbleOverlay(b, map);
}

/** @constructor */
function BubbleOverlay(bounds, map) {
    this.bounds_ = bounds;
    this.map_ = map;

    this.div_ = null;
    this.setMap(map);
}

function createOverlayProto() {
    BubbleOverlay.prototype = new google.maps.OverlayView();

    BubbleOverlay.prototype.onAdd = function () {
        var div = document.createElement('div');
        div.classList.add('bubble-container');
        this.bubble_ = new BubbleSVG(div)
        this.div_ = div;
        var panes = this.getPanes();
        panes.overlayLayer.appendChild(div);
    };

    BubbleOverlay.prototype.draw = function () {

        // We use the south-west and north-east
        // coordinates of the overlay to peg it to the correct position and size.
        // To do this, we need to retrieve the projection from the overlay.
        var overlayProjection = this.getProjection();

        // Retrieve the south-west and north-east coordinates of this overlay
        // in LatLngs and convert them to pixel coordinates.
        // We'll use these coordinates to resize the div.
        var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
        var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

        // Resize the image's div to fit the indicated dimensions.
        var div = this.div_;
        div.style.left = sw.x + 'px';
        div.style.top = ne.y + 'px';
        div.style.width = (ne.x - sw.x) + 'px';
        div.style.height = (sw.y - ne.y) + 'px';
        this.bubble_.setBounds(this.div_.getBoundingClientRect()) 
    };
}


