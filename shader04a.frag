/************************************************************************/
/*    Graphics 317 coursework exercise 03                               */
/*    Author: Bernhard Kainz                                            */
/*    This file has to be altered for this exercise                     */
/************************************************************************/

#version 150 compatibility

uniform vec4 ambientColor;
uniform vec4 diffuseColor;
uniform vec4 specularColor;
uniform float specularExponent;

uniform sampler2D textureImage;

in fragmentData
{
  vec3 vpos;
  vec3 normal;
  vec4 color;
  //Exercise 4:
  vec4 texCoords;
}frag;

///////////////

void main()
{
  //texture information
  vec4 outcol = texture2D(textureImage, frag.texCoords.st);

  //////////////////////////////////////////////////////////
  //TODO Exercise 04a: integrate the texture information 
  // into a Phong shader (e.g. into the one from Exercise 2)
  //////////////////////////////////////////////////////////

  vec3 light_pos = vec3(gl_LightSource[0].position);

  float d = distance(light_pos, frag.vpos);
  vec3  l = normalize(light_pos - frag.vpos);
  vec3  n = frag.normal;
  vec3  r = reflect(-l, n);
  vec3  e = normalize(vec3(0.0,0.0,0.0) - frag.vpos);

  float attenuation = 1.0 / (gl_LightSource[0].constantAttenuation
                    + gl_LightSource[0].linearAttenuation * d 
                    + gl_LightSource[0].quadraticAttenuation * d * d);

  vec4 diffuse_ref  = attenuation
                    * diffuseColor
                    * dot(n, l);

  vec4 specular_ref = attenuation
                    * specularColor
                    * pow(max(0.0, dot(r, e)), 0.3*specularExponent);

  gl_FragColor = outcol + diffuse_ref + specular_ref;
  //////////////////////////////////////////////////////////


}
