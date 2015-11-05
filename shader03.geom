/************************************************************************/
/*    Graphics 317 coursework exercise 03                               */
/*    Author: Bernhard Kainz                                            */
/*    This file has to be altered for this exercise                     */
/************************************************************************/

#version 150 compatibility
#extension GL_ARB_geometry_shader4 : enable

layout (max_vertices = 72) out;

const float pi = 3.14159265359;

////////////////
uniform vec4 ambientColor;
uniform vec4 diffuseColor;
uniform vec4 specularColor;
uniform float specularExponent;

uniform int level;
uniform float time;

in vertexData
{
	vec3 pos;
	vec3 normal;
	vec4 color;
}vertices[];

out fragmentData
{
	vec3 vpos;
	vec3 normal;
	vec4 color;
}frag;   


///////////////////////////////////////////////////////
//pseudo random helper function
///////////////////////////////////////////////////////
float rnd(vec2 x)
{
	int n = int(x.x * 40.0 + x.y * 6400.0);
	n = (n << 13) ^ n;
	return 1.0 - float( (n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0;
}


void produceVertex(float s, float t, vec4 v0, vec4 v01, vec4 v02, vec3 n0, vec3 n01, vec3 n02, int i)
{
  ///////////////////////////////////////////////////////
  //TODO implement for subdivision
  ///////////////////////////////////////////////////////
 ///////////////////////////////////////////////////////
}
///////////////////////////////

void makeVertex(float a, float b)
{

  float g = 1 - a - b;
  
  vec3 x = a * vertices[0].pos;
  vec3 y = b * vertices[1].pos;
  vec3 z = g * vertices[2].pos;

  vec3 nx = a * vertices[0].normal;
  vec3 ny = b * vertices[1].normal;
  vec3 nz = g * vertices[2].normal;

  vec4 c0 = a * vertices[0].color;
  vec4 c1 = b * vertices[1].color;
  vec4 c2 = g * vertices[2].color;
  
  vec4 gl0 = a * gl_in[0].gl_Position;
  vec4 gl1 = b * gl_in[1].gl_Position;
  vec4 gl2 = g * gl_in[2].gl_Position;
 
  frag.normal = nx + ny + nz;
  frag.vpos   = x + y + z;
  frag.color  = c0 + c1 + c2;

  // Movement vector for simple animation
  vec4 mov = vec4(frag.normal.x, frag.normal.y, frag.normal.z, 0.0);
  
  gl_Position = gl0 + gl1 + gl2 + (mov * mod((time/10),50));

  EmitVertex();

}

void main()
{
  float div = pow(2.0, level);
  float d = 1 / div;

  for(int i = 0; i < div; i++)
  {
    for(int j = 0; j < div-i; j++)
    { 
      makeVertex(i*d, j*d);
      makeVertex((i+1)*d, j*d);
      makeVertex(i*d, (j+1)*d);

      EndPrimitive();

      if(j+1 < div-i)
      {
        makeVertex((i+1)*d, j*d);
        makeVertex(i*d, (j+1)*d);
        makeVertex((i+1)*d, (j+1)*d);
        EndPrimitive();
      }

    }
  }
}
