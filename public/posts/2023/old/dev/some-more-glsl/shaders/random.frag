#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

#define PI 3.1415926538
#define TAU 6.2831855
#define SEED 123.

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float signed_random(in vec2 _st) {
    return 2.*random(_st)-1.;
}

void main() {
    vec3 color;
    vec2 uv = (gl_FragCoord.xy*2. - u_resolution.xy) / u_resolution.y;
    vec2 uv0 = (uv + 1.)/2.;
    float shape;
    float count = 10.;
    float offset = 2.*step(1., mod(uv.y*count, 2.0 )) - 1.;
    offset += 5.*signed_random(vec2(floor(uv.y*count)+SEED));
    uv.x +=  u_time*.1*offset + offset;
    float h_offset = signed_random(vec2(floor(uv.x*20.)) + SEED);
    shape = ceil(sin(h_offset));
    color = vec3(shape);
    color *= vec3(uv0.x, uv0.y, 1);
    gl_FragColor = vec4(1.-color, 1.);
}