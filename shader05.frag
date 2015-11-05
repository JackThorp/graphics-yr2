/************************************************************************/
/*    Graphics 317 coursework exercise 05                               */
/*    Author: Bernhard Kainz                                            */
/*    This file has to be altered for this exercise                     */
/************************************************************************/


#version 150 compatibility

in vec3 origin, dir, point; 
out vec4 outcolour;
bool intersection;
float eps = 0.005;
int specular_exponent = 7;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

const int raytraceDepth = 42;
const int numSpheres = 6;

struct Ray
{
  vec3 origin;
  vec3 dir;
};
struct Sphere
{
  vec3 centre;
  float radius;
  vec3 colour;
};
struct Plane
{
  vec3 point;
  vec3 normal;
  vec3 colour;
};

struct Intersection
{
  float t;
  vec3 point;     // hit point
  vec3 normal;     // normal
  float distance;
  int hit;
  vec3 colour;
};

////////////////////////////////////////////////////////////////////
// TODO Exercise 5: implement a simple geometry based ray tracing
// implement the functions in the follwing. 
// In order to reach all points you need to implement at least one
// feature more than shown in the coursework description
// effects like refraction, scattering, caustics, soft hadows, etc. 
// are possible. 
////////////////////////////////////////////////////////////////////

vec4 shade(vec3 p, vec3 n, vec3 col)
{
    vec3  light_pos = vec3(gl_LightSource[0].position);
    float d = distance(light_pos, p);
    vec3  l = normalize(light_pos - p);
    vec3  r = reflect(-l, n);
    vec3  e = normalize(vec3(0,0,0) - p);

    float attenuation = 1.0 / (gl_LightSource[0].constantAttenuation 
                      + gl_LightSource[0].linearAttenuation * d
                      + gl_LightSource[0].quadraticAttenuation * d * d);

    vec3 ambient      = 0.1 * col;
    
    vec3 diffuse_ref  = attenuation
                      * 0.5 * col
                      * dot(n,l);

    vec3 specular_ref = attenuation
                      * 0.8 * col
                      * pow(max(0,dot(r,e)), 0.3 * specular_exponent);


    return vec4(ambient + diffuse_ref + specular_ref, 0);

}


void sphere_intersect(Sphere sph, Ray ray, inout Intersection intersect)
{
  // Only update intersect value if intersection is closer than last cu
  vec3 pc = ray.origin - sph.centre;

  float a = dot(ray.dir, ray.dir);
  float b = dot(2*ray.dir, pc);
  float c = dot(pc, pc) - pow(sph.radius,2);

  float det = pow(b,2) - 4*a*c;
  if(det >= 0) {

    float mu1 = (-b + pow(det, 0.5))/(2*a) ;
    float mu2 = (-b - pow(det, 0.5))/(2*a) ;
    float mu = mu2;

    if(!(mu1 > 0 && mu2 > 0)) { return; }
    if(mu1 >= 0 && mu2 >= 0 && mu1 < mu2) {
      mu = mu1;
    } 
    // calculate intersection point.
    vec3 ip = ray.origin + mu*ray.dir;

    // If no intersection recorded yet or this intersection is closer
    if(intersection != true || distance(ray.origin, ip) < intersect.distance)
    {
      vec3 n = normalize(ip - sph.centre);
      intersect.colour    = sph.colour;
      intersection        = true;
      intersect.point     = ip;
      intersect.distance  = distance(ray.origin, ip);
      intersect.normal    = n;
    }
  }
}

void plane_intersect(Plane pl, Ray ray, inout Intersection intersect)
{

  // Check line and plane not parallel.
  float dn = dot(ray.dir, pl.normal);
  if(dn != 0)
  {

    float mu = -(dot((ray.origin - pl.point), pl.normal) / dn);
    vec3 ip = ray.origin + mu*ray.dir; 

    // if intersection is behind viewing plane and closer than previous intersection
    // update intersect
    if(mu > 0 && (intersection != true || distance(ip, ray.origin) < intersect.distance)) {
   
      if(mod(abs(floor((ip.x))), 2) == 
         mod(abs(floor((ip.z))), 2))
      { 
        pl.colour  = vec3(0,0,0);
      } else 
      {
        pl.colour  = vec3(1,1,1);
      }

      intersect.colour    = pl.colour;
      intersection        = true;
      intersect.point     = ip;
      intersect.distance  = distance(ip, ray.origin);
      intersect.normal    = normalize(pl.normal);
    }
  }

}

Sphere sphere[numSpheres];
Plane plane;
int seed = 0;

float rnd()
{
  seed = int(mod(float(seed)*1364.0+626.0, 509.0));
  return float(seed)/509.0;
}

vec3 computeShadow(in Intersection intersect, vec3 origin)
{
  // Computes soft shadows.void Intersect(Ray r, inout Intersection i)
  
  vec3 col = intersect.colour;
  bool old_intersection = intersection;
  // Note that 200 rays gives a reasonably smooth shadow but
  // makes interaction laggy. 10 rays will give a coarse shadow
  // outline and 500 a very smooth one.
  float num_rays = 1000;
  int shadows = 0;
  float normaliser = 3.0;
  for(int r = 0; r < num_rays; r++) 
  {
    intersection = false;
    Ray shadow_ray;
    shadow_ray.dir    = normalize(vec3(gl_LightSource[0].position) - intersect.point);
    shadow_ray.dir.x  += (rnd()-0.5) / normaliser;
    shadow_ray.dir.y  += (rnd()-0.5) / normaliser;
    shadow_ray.dir.z  += (rnd()-0.5) / normaliser;
    shadow_ray.origin = origin;
  
    for(int i = 0; i < numSpheres; i++)
    {
      sphere_intersect(sphere[i], shadow_ray, intersect);
    }
 
    if(intersection){
      shadows++;
    }
  }
  
  intersection = old_intersection;
  float shade = shadows / num_rays;
  return col - col*shade;
}

void main()
{
  //initial scene definition
  sphere[0].centre   = vec3(-2.0, 1.5, -3.5);
  sphere[0].radius   = 1.5;
  sphere[0].colour = vec3(0.8,0.8,0.8);
  sphere[1].centre   = vec3(-0.5, 0.0, -2.0);
  sphere[1].radius   = 0.6;
  sphere[1].colour = vec3(0.3,0.8,0.3);
  sphere[2].centre   = vec3(1.0, 0.7, -2.2);
  sphere[2].radius   = 0.8;
  sphere[2].colour = vec3(0.3,0.8,0.8);
  sphere[3].centre   = vec3(0.7, -0.3, -1.2);
  sphere[3].radius   = 0.2;
  sphere[3].colour = vec3(0.8,0.8,0.3);
  sphere[4].centre   = vec3(-0.7, -0.3, -1.2);
  sphere[4].radius   = 0.2;
  sphere[4].colour = vec3(0.8,0.3,0.3);
  sphere[5].centre   = vec3(0.2, -0.2, -1.2);
  sphere[5].radius   = 0.3;
  sphere[5].colour = vec3(0.8,0.3,0.8);
  
  plane.point   = vec3(0,-0.5, 0);
  plane.normal  = vec3(0, 1.0, 0);
  plane.colour  = vec3(1, 1, 1);

  // Update object vectors for scene interaction

  seed = int(mod(dir.x * dir.y * 39786038.0, 65536.0));
  //scene definition end

  //make empty for exercise 
  outcolour = vec4(0,0,0,0);

  Ray ray = Ray(origin, dir);
  ray.origin = vec3(modelViewMatrix * vec4(ray.origin, 1)) + vec3(0,0,2);
  ray.dir = vec3(modelViewMatrix * vec4(ray.dir,0));
  // initialise the intersect
  Intersection intersect;
  intersect.colour = vec3(0,0,0);

  intersection = true;
  int depth = 0;
  float k_reflected = 1;
  float ref_co = 0.3;

  while(intersection && depth < 42)
  {
    intersection = false;

    plane_intersect(plane, ray, intersect); 
    for(int i = 0; i < numSpheres; i++){
      sphere_intersect(sphere[i], ray, intersect);
    }

    // Calculate direction and origin of new ray.
    vec3 new_dir = normalize(reflect(ray.dir, intersect.normal));
    vec3 new_ori = intersect.point + eps * new_dir;
    
    intersect.colour = computeShadow(intersect, new_ori);
    outcolour += k_reflected * shade(ray.dir, intersect.normal, intersect.colour);
    
    ray.dir = new_dir;
    ray.origin = new_ori;
    k_reflected *= ref_co;

    depth++;
  }


}
