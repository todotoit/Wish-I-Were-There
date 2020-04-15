import BubbleImage from './bubble-img'

export function createBubble(map, center, user) {
    createOverlayProto()
    const c = new google.maps.LatLng(center.lat, center.lng)
    const circle = new google.maps.Circle({
        map: map,
        center: c,
        radius: 200,
        strokeColor: 'transparent',
        fillColor: 'transparent',
    });
    const b = circle.getBounds();
    circle.setMap(null)
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
        google.maps.event.addDomListener(div, 'click', e => {
            google.maps.event.trigger(this.marker, 'click');
        });
        const d = this.map_.selectedUserMarker && !(this.map_.selectedUserMarker.user.id === this.user_.id)
        this.setVisible(this.map_.showUserMarkers)
        this.setDisabled(d)
    };

    BubbleOverlay.prototype.draw = function () {
        const overlayProjection = this.getProjection();
        const zoom = overlayProjection['T'].zoom
        let zoomLevel = 0
        if (zoom > 16) zoomLevel = 1

        const sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
        const ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

        if (zoom < 14) {
            this.div_.classList.add('far')
            return
        }
        else this.div_.classList.remove('far')

        this.div_.style.left = sw.x + 'px';
        this.div_.style.top = ne.y + 'px';
        this.div_.style.width = (ne.x - sw.x) + 'px';
        this.div_.style.height = (sw.y - ne.y) + 'px';
        this.bubble_.setZoomLevel(zoomLevel)
        //this.bubble_.setBounds(this.div_.getBoundingClientRect()) 
    };

    BubbleOverlay.prototype.setVisible = function (val) {
        console.log(val)
        if (this.div_) this.div_.classList.toggle('hidden', !val)
    }
    BubbleOverlay.prototype.setDisabled = function (val) {
        if (this.div_) this.div_.classList.toggle('disabled', val)
    }
}


