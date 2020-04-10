import Bubble from './bubble'
import BubbleImage from './bubble-img'

export function createBubble(map, center, user) {
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
    return new BubbleOverlay(b, map, user);
}

/** @constructor */
function BubbleOverlay(bounds, map, user) {
    this.bounds_ = bounds;
    this.map_ = map;
    this.user_ = user
    this.images = [
        require('@/assets/img/bubbles/bubbles-gradient.png'),
        require('@/assets/img/bubbles/bubbles-expanded.png')
    ]

    this.div_ = null;
    this.setMap(map);
}

function createOverlayProto() {
    BubbleOverlay.prototype = new google.maps.OverlayView();

    BubbleOverlay.prototype.onAdd = function () {
        const div = document.createElement('div');
        const label = document.createElement('label');
        div.appendChild(label)
        label.innerText = this.user_.name
        div.classList.add('bubble-container');
        this.bubble_ = new BubbleImage(div, this.images)
        this.div_ = div;
        const panes = this.getPanes();
        panes.overlayLayer.appendChild(div);
    };

    BubbleOverlay.prototype.draw = function () {

        // We use the south-west and north-east
        // coordinates of the overlay to peg it to the correct position and size.
        // To do this, we need to retrieve the projection from the overlay.
        const overlayProjection = this.getProjection();
        const zoom = overlayProjection['T'].zoom

        let zoomLevel = 0
        if (zoom > 16) zoomLevel = 1


        // Retrieve the south-west and north-east coordinates of this overlay
        // in LatLngs and convert them to pixel coordinates.
        // We'll use these coordinates to resize the div.
        const sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
        const ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

        // Resize the image's div to fit the indicated dimensions.
        const div = this.div_;
        if (zoom < 14) {
            div.classList.add('far')
            return
        }
        else div.classList.remove('far')

        div.style.left = sw.x + 'px';
        div.style.top = ne.y + 'px';
        div.style.width = (ne.x - sw.x) + 'px';
        div.style.height = (sw.y - ne.y) + 'px';
        this.bubble_.setZoomLevel(zoomLevel)
        //this.bubble_.setBounds(this.div_.getBoundingClientRect()) 
    };

    BubbleOverlay.prototype.setVisible = function (val) {
        this.div_.classList.toggle('hidden', !val)
    }
}


