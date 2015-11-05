/************************************************************************/
/*    Graphics 317 coursework exercise 02                               */
/*    Author: Bernhard Kainz                                            */
/*    This file has to be altered for this exercise                     */
/************************************************************************/

#version 150 compatibility

uniform vec4 ambientColor;
uniform vec4 diffuseColor;
uniform vec4 specularColor;
uniform float specularExponent;
uniform int shader;

in fragmentData
{
  vec3 pos;
  vec3 normal;
  vec4 color;
}frag;

///////////////

void main()
{
  
  vec3 light_pos = vec3(gl_LightSource[0].position);

  float d = distance(light_pos, frag.pos);
  vec3  l = normalize(light_pos - frag.pos);
  vec3  n = frag.normal;
  vec3  r = reflect(-l, n);
  vec3  e = normalize(vec3(0.0,0.0,0.0) - frag.pos);
  
  // Per Pixel Phong Shading //////////////////////////////////////////////////
  if(shader == 2)
  {
    float attenuation = 1.0 / (gl_LightSource[0].constantAttenuation
                      + gl_LightSource[0].linearAttenuation * d
                      + gl_LightSource[0].quadraticAttenuation * d * d);

    vec4 diffuse_ref = attenuation * diffuseColor * dot(n, l);
    vec4 specular_ref = attenuation * specularColor 
                      * pow(max(0.0, dot(r, e)), 0.3*specularExponent);
    
    gl_FragColor = ambientColor + diffuse_ref + specular_ref;
  }
  /////////////////////////////////////////////////////////////////////////////


  // Per Pixel Toon Shading ///////////////////////////////////////////////////
  if(shader == 3)
  {
    float t_factor = dot(l/length(l), n/length(n));

    if(t_factor > 0.98) {
      gl_FragColor = vec4(0.8,0.8,0.8,1.0);
    }
    else if(t_factor > 0.5) {
      gl_FragColor = vec4(0.8,0.4,0.4,1.0);
    }
    else if(t_factor > 0.25) {
      gl_FragColor = vec4(0.6,0.2,0.2,1.0);
    }
    else {
      gl_FragColor = vec4(0.1,0.1,0.1,1.0);
    }
  }
  /////////////////////////////////////////////////////////////////////////////
}
