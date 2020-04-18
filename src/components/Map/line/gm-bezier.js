
// constructor
var repeatInterval = 35
var GmapQuadraticBezier = function (startp, ctl1, endp, options, map) {

    var lineSymbol = {
        path: 'M 0,-4 0,4',
        strokeOpacity: 1,
        strokeWeight: 2,
        strokeLineCap: 'butt',
        scale: 2
    };

    var defaultOpts = {
        step: 0.02,
        animate: {
            step: 0.05
        },
        lineopts: {
            geodesic: true, strokeOpacity: 0, strokeColor: '#ffffff', 
            icons: [{
                icon: lineSymbol,
                offset: '0',
                repeat: repeatInterval+'px'
            }],
        }
    };

    this.startp = startp;
    this.endp = endp;
    this.ctl1 = ctl1;
    this.options = { ...defaultOpts, ...options };
    this.map = map;

    this.init();
};

var p = GmapQuadraticBezier.prototype;

p.init = function () {
    this.points = this.calcPoints(this.startp, this.ctl1, this.endp, this.options.step);
}

p.getPoints = function () {
    return this.points;
}

p.draw = function () {
    this.offset = 0
    this.repeat = 100
    var points = this.points;
    var lineopts = { ...this.options.lineopts };
    lineopts.path = []
    for (var i = 0; i < points.length - 1; i++) {
        lineopts.path.push(
            new google.maps.LatLng(points[i].x, points[i].y), new google.maps.LatLng(points[i + 1].x, points[i + 1].y)
        );
    }
    this.line = new google.maps.Polyline(lineopts);
    this.createInterval = setInterval(() => {
        const icons = this.line.get('icons');
        icons[0].offset = this.offset + '%';
        icons[0].repeat = this.repeat + 'px';
        this.line.set('icons', icons);
        this.repeat /= 1.1
        if (this.repeat <= repeatInterval) {
            clearInterval(this.createInterval)
            this.animateLine()
        }
    }, 10)
    this.line.setMap(this.map);
}

p.animateLine = function () {
    if (this.stop) return
    const icons = this.line.get('icons');
    icons[0].offset = 100 - this.offset + 'px';
    this.line.set('icons', icons);
    this.offset += 0.3
    if (this.offset >= 100) this.offset = 0
    requestAnimationFrame(() => this.animateLine())
}

p.remove = function () {
    this.stop = true
    clearInterval(this.createInterval)
    this.line.setMap(null)
}

p.calcPoints = function (startp, ctl1, endp, step) {
    var points = [];

    for (var it = 0; it <= 1; it += step) {
        points.push(this.getBezier(
            { x: startp.lat(), y: startp.lng() },
            { x: ctl1.lat(), y: ctl1.lng() },
            { x: endp.lat(), y: endp.lng() },
            it));
    }
    return points;
};

// internal methods

p.B1 = function (t) { return Math.pow(1 - t, 2) };
p.B2 = function (t) { return 2 * (1 - t) * t; };
p.B3 = function (t) { return Math.pow(t, 2); };

p.getBezier = function (C1, C2, C3, percent) {
    var pos = {};
    pos.x =
        C1.x * this.B1(percent) +
        C2.x * this.B2(percent) +
        C3.x * this.B3(percent);
    pos.y =
        C1.y * this.B1(percent) +
        C2.y * this.B2(percent) +
        C3.y * this.B3(percent);
    return pos;
};

export default GmapQuadraticBezier;
