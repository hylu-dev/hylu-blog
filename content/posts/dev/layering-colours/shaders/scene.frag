#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

#define PI 3.1415926538
#define TAU 6.2831855

// create triangles
// create trees
// fractal trees along x
// create perlin hills
// place trees along hills (floor(uv.x))
// vary tree height
// loop hills trees as distance layers
// add parallaxing

float rand(float x) {
    return fract(sin(x*1255.9898)*43758.5453123)*2.-1.;
}

float rand2(vec2 uv) {
    return fract(sin(dot(uv.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float square(vec2 uv, float width, float height, float blur) {
    float shape = smoothstep(-blur, +blur, uv.x);
    shape *= 1.-smoothstep(-blur, +blur, uv.x-width);
    shape *= smoothstep(-blur, +blur, uv.y);
    shape *= 1.-smoothstep(-blur, +blur, uv.y-height);
    return shape;
}

float triangle(vec2 uv, float base, float height, float blur) {
    float col;
    
    // slope is rise/run, notice our base is our rise since we're following the y axis
    float slope = uv.y*(base/height);

    col = smoothstep(-blur,blur, uv.y);
    col *= smoothstep(-blur, +blur, uv.x - slope + base);
    col *= 1.-smoothstep(-blur,+blur, uv.x + slope - base);

    return col;
}

float tree(vec2 uv, float blur) {
    float shape = triangle(uv - vec2(0, .5), .25, .4, blur);
    shape += triangle(uv - vec2(0, .35), .28, .3, blur);
    shape += triangle(uv - vec2(0, .2), .3, .3, blur);
    shape += square(uv - vec2(-.05, 0), .1, .2, blur);
    // Shadows
    shape -= 100.*triangle(-uv + vec2(0.4, .5), 1.5, .04, blur);
    shape -= 100.*triangle(-uv + vec2(-1, .35), 2., .05, blur);
    shape -= 100.*triangle(-uv + vec2(0.4, .2), 1., .07, blur);
    // lazily stacking shapes so clamp values > 1. && < 1.
    return clamp(shape, 0., 1.);
}

float hills(float x) {
    return sin(x*.324)+sin(x)*.4;
}

float layer(vec2 uv, float blur) {
    float color;
    float height = hills(uv.x);
    color += 1.-smoothstep(-blur, blur, uv.y+height);

    float id = floor(uv.x);
    float x_offset = rand(id)*.7;
    float h_offset = rand(id)*.2;
    height = hills(id+.5+x_offset/2.);
    
    uv.x = fract(uv.x) - .5;

    color += tree(
        uv*vec2(2., 1.)
         - vec2(x_offset, -height), blur);

    return color;
}

void main() {
    // Normalized coordinates
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv = uv*2. - 1.;
    vec2 m = (u_mouse/u_resolution.xy)*2. - 1.;
    float t = u_time;
    uv.x *= u_resolution.x/u_resolution.y;
    
    vec4 color = vec4(0);
    float stars = pow(rand2(uv), 500.);
    color.rgba += stars;

    float blur = 0.01;
    for (float i=0.; i<1.; i+=1./10.) {
        float scale = mix(30., 1., i);
        float layer = layer(uv*scale+vec2(t+i*100., i)-m, blur);
        float alpha = layer;
        layer *= (1.-i);
        color = mix(color, vec4(layer), alpha);
    }

    blur = 0.05;
    float layer = layer(uv+vec2(t, 0.5)-m, blur);
    float alpha = layer;
    color = mix(color, vec4(layer*.0), alpha);

    color.rgb *= vec3(1.1, 1.4, 1.8);

    gl_FragColor = color;
}
