varying vec2 vTextureCoord;
varying vec4 vColor;

uniform sampler2D uSampler;

uniform float outerStrength;
uniform float innerStrength;

uniform vec4 glowColor;

uniform vec4 filterArea;
uniform vec4 filterClamp;

const float PI = 3.14159265358979323846264;
const float DIST = __DIST__;
const float ANGLE_STEP_SIZE = min(__ANGLE_STEP_SIZE__, PI * 2.0);

const float ANGLE_STEP_NUM = ceil(PI * 2.0 / ANGLE_STEP_SIZE);
const float MAX_TOTAL_ALPHA = DIST * (DIST + 1.0) / 2.0 * ANGLE_STEP_NUM;

void main(void) {
    vec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);

    float totalAlpha = 0.0;

    vec2 direction;
    vec2 displaced;
    vec4 curColor;

    for (float angle = 0.0; angle < PI * 2.0; angle += ANGLE_STEP_SIZE) {
       direction = vec2(cos(angle), sin(angle)) * px;

       for (float curDistance = 1.0; curDistance <= DIST; curDistance++) {
           displaced = clamp(vTextureCoord + direction * curDistance, filterClamp.xy, filterClamp.zw);

           curColor = texture2D(uSampler, displaced);

           totalAlpha += (DIST - curDistance + 1.0) * curColor.a;
       }
    }
    
    curColor = texture2D(uSampler, vTextureCoord);

    float alphaRatio = (totalAlpha / MAX_TOTAL_ALPHA);

    float innerGlowStrength = min(1.0, (1.0 - alphaRatio) * innerStrength * curColor.a);
    
    vec4 innerColor = mix(curColor, glowColor, innerGlowStrength);

    float outerGlowStrength = min(1.0, alphaRatio * outerStrength * (1.0 - innerColor.a));

    vec4 outerGlowColor = outerGlowStrength * glowColor.rgba;
    
    gl_FragColor = innerColor + outerGlowColor;
}
