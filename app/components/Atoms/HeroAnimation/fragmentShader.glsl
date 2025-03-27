varying float vDistance;

void main() {
  vec3 color = vec3(2.52, 2.50, 2.48);
  float distanceFromCenter = distance(gl_PointCoord, vec2(0.5));

  float alpha = 1.0 - (distanceFromCenter + (distanceFromCenter * .5));

  
  //   gl_FragColor = vec4(0.27, 0.27, 0.27, 1);

  // if (distanceFromCenter < 0.5 && distanceFromCenter > 0.3) {
  //   color = mix(color, vec3(0.27, 0.27, 0.27), vDistance * 0.5);
  //   gl_FragColor = vec4(color,  alpha);
  // } else 
  if (distanceFromCenter < 0.3) {
    color = mix(color, vec3(0.27, 0.27, 0.27), vDistance * 0.5);
    gl_FragColor = vec4(color, 1.0);
  } else {
    gl_FragColor = vec4(color, 0.0);
  }
}