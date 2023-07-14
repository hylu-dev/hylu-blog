#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

#define PI 3.1415926538
#define TAU 6.2831855

// Inigo Quilez
vec3 palette( in float t )
{
    vec3 a = vec3(.5);
    vec3 b = vec3(.5);
    vec3 c = vec3(1.);
    vec3 d = vec3(0.00, 0.33, 0.67);
    return a + b*cos( 6.28318*(c*t+d) );
}

void main() {
    vec2 uv = (gl_FragCoord.xy*2. - u_resolution.xy) / u_resolution.y;
    float global_dist = length(uv);
    vec4 color;

    float dist = length(uv);
    float angle = atan(uv.y*PI, uv.x*PI);
    float layer_offset = dist*2.*TAU;

    float waves = 1.-sin(dist*5.*TAU - u_time*3.);
    float umbrella = sin(angle*5. + u_time + layer_offset);

    color += vec4(umbrella);
    color += waves;

    color *= vec4(palette(global_dist+u_time*.1),1.);
    color *= pow(color, vec4(1.2)); // Increase contrast

    gl_FragColor = color;
}