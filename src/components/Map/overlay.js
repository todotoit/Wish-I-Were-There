import Bubble from './bubble'
import BubbleImage from './bubble-img'

export function createBubble(map, center) {
    createOverlayProto()
    const c = new google.maps.LatLng(center.lat, center.lng)
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
    this.images = [
        require('@/assets/img/bubbles/bubbles-noise.png'),
        require('@/assets/img/bubbles/bubbles-expanded.png')
    ]

    this.div_ = null;
    this.setMap(map);
}

function createOverlayProto() {
    BubbleOverlay.prototype = new google.maps.OverlayView();

    BubbleOverlay.prototype.onAdd = function () {
        var div = document.createElement('div');
        div.classList.add('bubble-container');
        this.bubble_ = new BubbleImage(div, this.images)
        this.div_ = div;
        var panes = this.getPanes();
        panes.overlayLayer.appendChild(div);
    };

    BubbleOverlay.prototype.draw = function () {

        // We use the south-west and north-east
        // coordinates of the overlay to peg it to the correct position and size.
        // To do this, we need to retrieve the projection from the overlay.
        var overlayProjection = this.getProjection();

        const zoom = overlayProjection['T'].zoom
        console.log(zoom)

        let zoomLevel = 0
        if (zoom > 16) zoomLevel = 1


        // Retrieve the south-west and north-east coordinates of this overlay
        // in LatLngs and convert them to pixel coordinates.
        // We'll use these coordinates to resize the div.
        var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
        var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

        // Resize the image's div to fit the indicated dimensions.
        var div = this.div_;
        if (zoom < 14) {
            div.classList.add('hidden')
            return
        }
        else div.classList.remove('hidden')

        div.style.left = sw.x + 'px';
        div.style.top = ne.y + 'px';
        div.style.width = (ne.x - sw.x) + 'px';
        div.style.height = (sw.y - ne.y) + 'px';
        this.bubble_.setZoomLevel(zoomLevel)
        //this.bubble_.setBounds(this.div_.getBoundingClientRect()) 
    };
}


