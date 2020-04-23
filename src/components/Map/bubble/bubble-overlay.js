import { supports } from '@/utils'
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
    const ext = supports.webp ? 'webp' : 'png'
    this.images = [
        require('@/assets/img/bubbles/bubbles-gradient.' + ext),
        require('@/assets/img/bubbles/bubbles-expanded.' + ext)
    ]

    this.div = null;
    this.setMap(map);
}

function createOverlayProto() {
    BubbleOverlay.prototype = new google.maps.OverlayView();

    BubbleOverlay.prototype.onAdd = function () {
        const div = document.createElement('div');
        this.label = document.createElement('label');
        this.label.classList.add('exte-small');
        this.label.classList.add('bubble-label');
        this.label.innerText = this.user.name
        div.classList.add('bubble-container');
        this.bubble = new BubbleImage(div, this.images)
        this.div = div;
        const panes = this.getPanes();
        panes.overlayLayer.appendChild(div);
        panes.overlayLayer.appendChild(this.label)
        const d = this.map.selectedUserMarker && !(this.map.selectedUserMarker.user.id === this.user.id)
        this.setVisible(this.map.showUserMarkers)
        this.setDisabled(d)
    };

    BubbleOverlay.prototype.draw = function () {
        this.update()
    };

    BubbleOverlay.prototype.update = function () {
        const overlayProjection = this.getProjection();
        if (!overlayProjection || !this.div) return
        const zoom = overlayProjection['T'].zoom
        let zoomLevel = 0
        if (zoom > 16) zoomLevel = 1

        const sw = overlayProjection.fromLatLngToDivPixel(this.bounds.getSouthWest());
        const ne = overlayProjection.fromLatLngToDivPixel(this.bounds.getNorthEast());
        const markerPos = overlayProjection.fromLatLngToDivPixel(this.marker.getPosition())
        this.label.style.transform = `translate(${markerPos.x}px, ${markerPos.y}px)`
        if (zoom < 14) {
            this.div.classList.add('far')
            this.label.classList.add('far')
            if (!this.div.classList.contains('force-visible')) return
        }
        else {
            this.div.classList.remove('far')
            this.label.classList.remove('far')
        }

        this.div.style.transform = `translate(${sw.x}px, ${ne.y}px)`
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


