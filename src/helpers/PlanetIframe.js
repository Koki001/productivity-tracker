const PlanetIframe = function (props) {
  return (
    <div className="planet-iframe">
      {props.name === "Mercury" ? (
        <iframe
          src="https://solarsystem.nasa.gov/gltf_embed/2369"
          width="100%"
          height="450px"
          frameborder="0"
        />
      ) : props.name === "Venus" ? (
        <iframe
          src="https://solarsystem.nasa.gov/gltf_embed/2343"
          width="100%"
          height="450px"
          frameborder="0"
        />
      ) : props.name === "Earth" ? (
        <iframe
          src="https://solarsystem.nasa.gov/gltf_embed/2392"
          width="100%"
          height="450px"
          frameborder="0"
        />
      ) : props.name === "Mars" ? (
        <iframe
          src="https://solarsystem.nasa.gov/gltf_embed/2372"
          width="100%"
          height="450px"
          frameborder="0"
        />
      ) : props.name === "Jupiter" ? (
        <iframe
          src="https://solarsystem.nasa.gov/gltf_embed/2375"
          width="100%"
          height="450px"
          frameborder="0"
        />
      ) : props.name === "Saturn" ? (
        <iframe
          src="https://solarsystem.nasa.gov/gltf_embed/2355"
          width="100%"
          height="450px"
          frameborder="0"
        />
      ) : props.name === "Uranus" ? (
        <iframe
          src="https://solarsystem.nasa.gov/gltf_embed/2344"
          width="100%"
          height="450px"
          frameborder="0"
        />
      ) : props.name === "Neptune" ? (
        <iframe
          src="https://solarsystem.nasa.gov/gltf_embed/2364"
          width="100%"
          height="450px"
          frameborder="0"
        />
      ) : null}
    </div>
  );
};

export default PlanetIframe;
