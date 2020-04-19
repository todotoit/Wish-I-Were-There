import BubbleImage from './bubble-img'

export function createBubble(map, center, options) {
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
    return new BubbleOverlay(b, map, options);
}

/** @constructor */
function BubbleOverlay(bounds, map, options) {
    this.bounds = bounds;
    this.map = map;
    this.user = options.user
    this.marker = options.marker
    this.images = [
        require('@/assets/img/bubbles/bubbles-gradient.png'),
        require('@/assets/img/bubbles/bubbles-expanded.png')
    ]

    this.div = null;
    this.setMap(map);
}

function createOverlayProto() {
    BubbleOverlay.prototype = new google.maps.OverlayView();

    BubbleOverlay.prototype.onAdd = function () {
        const div = document.createElement('div');
        this.label = document.createElement('label');
        this.label.classList.add('exte-small', 'bubble-label');
        this.label.innerText = this.user.name
        div.classList.add('bubble-container');
        this.bubble = new BubbleImage(div, this.images)
        this.div = div;
        const panes = this.getPanes();
        panes.overlayLayer.appendChild(div);
        panes.overlayLayer.appendChild(this.label)
        google.maps.event.addDomListener(div, 'click', e => {
            google.maps.event.trigger(this.marker, 'click');
        });
        const d = this.map.selectedUserMarker && !(this.map.selectedUserMarker.user.id === this.user.id)
        this.setVisible(this.map.showUserMarkers)
        this.setDisabled(d)
    };

    BubbleOverlay.prototype.draw = function () {
        this.update()
    };

    BubbleOverlay.prototype.update = function () {

        const overlayProjection = this.getProjection();
        const zoom = overlayProjection['T'].zoom
        let zoomLevel = 0
        if (zoom > 16) zoomLevel = 1

        const markerPos = overlayProjection.fromLatLngToDivPixel(this.marker.getPosition())
        this.label.style.top = markerPos.y + 'px'
        this.label.style.left = markerPos.x + 'px'

        const sw = overlayProjection.fromLatLngToDivPixel(this.bounds.getSouthWest());
        const ne = overlayProjection.fromLatLngToDivPixel(this.bounds.getNorthEast());

        if (zoom < 14) {
            this.div.classList.add('far')
            this.label.classList.add('far')
            if (!this.div.classList.contains('force-visible')) return
        }
        else {
            this.div.classList.remove('far')
            this.label.classList.remove('far')
        }

        this.div.style.left = sw.x + 'px';
        this.div.style.top = ne.y + 'px';
        this.div.style.width = (ne.x - sw.x) + 'px';
        this.div.style.height = (sw.y - ne.y) + 'px';
        this.bubble.setZoomLevel(zoomLevel)
    };

    BubbleOverlay.prototype.setVisible = function (val) {
        if (this.div) this.div.classList.toggle('hidden', !val)
        if (this.label) this.label.classList.toggle('hidden', !val)
    }
    BubbleOverlay.prototype.setDisabled = function (val) {
        if (this.div) this.div.classList.toggle('disabled', !!val)
        if (this.label) this.label.classList.toggle('disabled', !!val)
    }
    BubbleOverlay.prototype.forceVisible = function (val) {
        if (this.div) this.div.classList.toggle('force-visible', !!val)
        if (this.label) this.label.classList.toggle('force-visible', !!val)
    }
}


