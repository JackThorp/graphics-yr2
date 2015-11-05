/************************************************************************/
/*    Graphics 317 coursework exercise 04b                               */
/*    Author: Bernhard Kainz                                            */
/*    This file has to be altered for this exercise                     */
/************************************************************************/

#version 150 core

//simplified IO structures, no geometry shader any more
in vec2 textureUV;
out vec3 color;

//this is the texture of the framebuffer object
uniform sampler2D renderedTexture;

void main(){

	//this is one fragment of the framebuffer texture, which the main programme produces 

  ////////////////////////////////////////////////////////////////////
  // TODO Exercise 04b: implement a simple image based blur in following
  ////////////////////////////////////////////////////////////////////
  float s[12] = float[](-0.10568,-0.07568,-0.042158,
                        -0.02458,-0.01987456,-0.0112458,
                        0.0112458,0.01987456,0.02458,
                        0.042158,0.07568,0.10568);
  int n = 12;
  float d_max = 0.3;

  vec2 c = vec2(0.5, 0.5);
  vec2 p = normalize(c - textureUV);

  color = vec3(0.0,0.0,0.0);

  for(int i = 0; i < n; i++)
  {
    color += texture(renderedTexture, textureUV + (p * s[i] * d_max)).xyz;
  }

  color /= n;

}
