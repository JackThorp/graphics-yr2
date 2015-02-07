/************************************************************************/
/*    Graphics 317 coursework exercise 02                               */
/*    Author: Bernhard Kainz                                            */
/*    This file has to be altered for this exercise                     */
/************************************************************************/

#version 150 compatibility

////////////////
//exercise 2
uniform vec4 ambientColor;
uniform vec4 diffuseColor;
uniform vec4 specularColor;
uniform float specularExponent;
uniform int shader;

out vertexData
{
  vec3 pos;
  vec3 normal;
  vec4 color;
}vertex;

/////////////

void main()
{
  vertex.pos = vec3(gl_ModelViewMatrix * gl_Vertex);
  vertex.normal = normalize(gl_NormalMatrix * gl_Normal);
  gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
  vertex.color = vec4(0.0,0.0,1.0,1.0);
/*
  vec3 light_pos = vec3(gl_LightSource[0].position);
  
  float d = distance(light_pos, vertex.pos);
  vec3  l = light_pos - vertex.pos;
  vec3  r = reflect(-l, vertex.normal);
  vec3  e = normalize(vec3(0.0,0.0,0.0) - vertex.pos);

  
  if(shader == 1)
  {
    float attenuation;
    attenuation = 1.0 / (gl_LightSource[0].constantAttenuation
                + gl_LightSource[0].linearAttenuation * d
                + gl_LightSource[0].quadraticAttenuation * d * d);

    vec4 diffuseRef  = attenuation * diffuseColor * dot(vertex.normal, l);
    vec4 specularRef;
    if(dot(vertex.normal, l) < 0.0)
    {
      specularRef = vec4(0.0,0.0,0.0,1.0);  
    }
    else
    {
      specularRef = attenuation * specularColor * pow(max(0.0, dot(r,e)), (0.3 * specularExponent));
    }

    vertex.color = ambientColor + diffuseRef + specularRef;
  }
  */
}
