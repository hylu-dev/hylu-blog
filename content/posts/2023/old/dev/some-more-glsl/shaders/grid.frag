#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

#define PI 3.1415926538

float slope_step(float x) {
    float c = .5*floor(x)*ceil(sin(x*PI));
    float b = .5*floor(x+1.)*ceil(sin(x*PI-PI));
    float a = x*ceil(sin(x*PI))-floor(x)*ceil(sin(x*PI));
    return a + b + c;
}

void main() {
    vec3 color;
    vec2 uv = (gl_FragCoord.xy*2. - u_resolution.xy) / u_resolution.y;
    uv += slope_step(u_time*.5);
    uv = fract(uv*5.);
    float shape = smoothstep(-.1, -.01, uv.x) -
     smoothstep(.01, .1, uv.x) +
     smoothstep(-.1, -.01, uv.y) -
     smoothstep(.01, .1, uv.y);
    color = vec3(shape);
    gl_FragColor = vec4(color, 1.);
}