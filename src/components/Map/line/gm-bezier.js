
// constructor
var GmapQuadraticBezier = function (startp, ctl1, endp, options, map) {

    var lineSymbol = {
        path: 'M 0,-1 0,1',
        strokeOpacity: 1,
        strokeWeight: 2,
        scale: 2
    };

    var defaultOpts = {
        step: 0.05,
        lineopts: {
            geodesic: true, strokeOpacity: 0, strokeColor: '#ffffff',
            icons: [{
                icon: lineSymbol,
                offset: '0',
                repeat: '20px'
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
    var points = this.points;
    var lineopts = { ...this.options.lineopts };
    lineopts.path = []
    for (var i = 0; i < points.length - 1; i++) {
        lineopts.path.push(
            new google.maps.LatLng(points[i].x, points[i].y), new google.maps.LatLng(points[i + 1].x, points[i + 1].y)
        );
    }
    this.line = new google.maps.Polyline(lineopts);
    this.line.setMap(this.map);
}

p.remove = function () {
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
