#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

#define PI 3.1415926538

float square(vec2 uv, vec2 pos, float size) {
    float blur = .02;
    vec2 bot = smoothstep(pos-blur, pos, uv);
    vec2 top = smoothstep(pos+size, pos+size+blur, uv);
    vec2 shape = bot-top;
    return shape.x*shape.y;
}

mat2 rotate(float angle) {
    return mat2(
        cos(angle), -sin(angle),
        sin(angle), cos(angle)
    );
}

void main() {
    vec3 color;
    vec2 uv = (gl_FragCoord.xy*2. - u_resolution.xy) / u_resolution.y;
    float dist = length(uv);
    dist = sin(dist*2. + u_time);
    dist = pow(dist, 8.);

    uv = fract(uv*5.*rotate(u_time*.2) + 3.*sin(u_time*.5))*2. - 1.;

    float shape = square(uv, vec2(-dist/2.), dist);

    shape += smoothstep(-.02, -.01, uv.x) -
     smoothstep(.01, .02, uv.x) +
     smoothstep(-.02, -.01, uv.y) -
     smoothstep(.01, .02, uv.y);
    color = vec3(shape);

    gl_FragColor = vec4(color, 1.);
}