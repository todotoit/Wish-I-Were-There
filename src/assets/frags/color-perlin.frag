#ifdef GL_ES
precision mediump float;
#endif

#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

// YUV to RGB matrix
mat3 yuv2rgb = mat3(1.0, 0.0, 1.13983,
                    1.0, -0.39465, -0.58060,
                    1.0, 2.03211, 0.0);

// RGB to YUV matrix
mat3 rgb2yuv = mat3(0.2126, 0.7152, 0.0722,
                    -0.09991, -0.33609, 0.43600,
                    0.615, -0.5586, -0.05639);

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
	vec2 mt = u_mouse.xy/u_resolution.xy;

    // Scale the coordinate system to see
    // some noise in action
    vec2 pos = vec2(st*4.0);
    vec2 translate = vec2(cos(u_time),sin(u_time));
    float coeff = sin(u_time*0.000000001)+u_time*random(st*u_time);
    float n = smoothstep(0.1,0.8, 1.0-smoothstep(0.1, 0.6, noise(pos*rotate2d(noise(pos)+u_time))));
	pos = rotate2d( noise(pos)+u_time) * (pos+translate) * 0.5;
    
        // Use polar coordinates instead of cartesian
    vec2 toCenter = vec2(0.5)-st;
    float angle = atan(toCenter.y,toCenter.x);
    float radius = length(toCenter)*2.0;

    // Map the angle (-PI to PI) to the Hue (from 0 to 1)
    // and the Saturation to the radius
    st -= 0.5;  // becomes -0.5 to 0.5
    st *= 2.0;  // becomes -1.0 to 1.0
    vec3 color = yuv2rgb * vec3(0.5, st.x, st.y);
    // Use the noise function

    float r = smoothstep(0.3, 0.5, pos.x);
        float b = smoothstep(0.3, 0.4, n);
    
    //vec3 corona = smoothstep(vec3(0.900,0.224,0.695), vec3(0.964,0.980,1.000) , vec3(0,0,noise(pos)));
    
    vec3 corona = smoothstep(vec3(0.8), vec3(1), vec3(noise(pos)));

    gl_FragColor = vec4(corona+color*corona, 1.0);
    //gl_FragColor = vec4(vec3(r, 0, noise(pos)), 1.0);
}
