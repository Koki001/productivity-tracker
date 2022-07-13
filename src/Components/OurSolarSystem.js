import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import NasaPlanetDescriptions from "../helpers/NasaPlanetDescriptions";
import PlanetIframe from "../helpers/PlanetIframe";

const OurSolarSystem = function (props) {
  const [solarSystem, setSolarSystem] = useState([]);
  const [planet, setPlanet] = useState([]);
  const [callPlanet, setCallPlanet] = useState("");
  const [planetRevolution, setPlanetRevolution] = useState(null);
  const [planetRotation, setPlanetRotation] = useState(null);
  const [planetRevolutionYears, setPlanetRevolutionYears] = useState(null);
  const [planetSize, setPlanetSize] = useState(null);
  const [planetTempC, setPlanetTempC] = useState(null);
  const [planetTempF, setPlanetTempF] = useState(null);
  const [planetMoons, setPlanetMoons] = useState(null);

  useEffect(
    function () {
      setSolarSystem(props.data);
    },
    [props]
  );

  const handleMercury = function () {
    setCallPlanet("mercure");
  };
  const handleVenus = function () {
    setCallPlanet("venus");
  };
  const handleEarth = function () {
    setCallPlanet("terre");
  };
  const handleMars = function () {
    setCallPlanet("mars");
  };
  const handleJupiter = function () {
    setCallPlanet("jupiter");
  };
  const handleSaturn = function () {
    setCallPlanet("saturne");
  };
  const handleUranus = function () {
    setCallPlanet("uranus");
  };
  const handleNeptune = function () {
    setCallPlanet("neptune");
  };
  const handleSun = function () {
    setCallPlanet("soleil");
  };
  useEffect(
    function () {
      if (callPlanet !== "") {
        axios({
          url: `https://api.le-systeme-solaire.net/rest/bodies/${callPlanet}`,
          method: "GET",
        }).then(function (res) {
          setPlanet(res.data);
          setPlanetRevolution(
            Math.abs(res.data.sideralOrbit).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })
          );
          setPlanetRotation(
            Math.abs(res.data.sideralRotation).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })
          );
          setPlanetRevolutionYears(
            Math.abs(res.data.sideralOrbit / 365).toFixed(1)
          );
          setPlanetTempC((res.data.avgTemp - 273.15).toFixed(0));
          setPlanetTempF((1.8 * (res.data.avgTemp - 273) + 32).toFixed(0));
          setPlanetSize(
            (res.data.meanRadius * 2).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })
          );
          if (res.data.moons) {
            setPlanetMoons(res.data.moons.length);
          } else if (res.data.moons === null) {
            setPlanetMoons("No moons");
          }
        });
      }
    },
    [callPlanet]
  );
  return (
    <div className="solar-system-container">
      <div className="solar-nav">
        <div>
          <h2>Star</h2>
          <ul>
            <li onClick={handleSun}>Sun</li>
          </ul>
        </div>
        <div>
        <h2>Planets</h2>
          <ul>
            <li onClick={handleMercury}>Mercury</li>
            <li onClick={handleVenus}>Venus</li>
            <li onClick={handleEarth}>Earth</li>
            <li onClick={handleMars}>Mars</li>
            <li onClick={handleJupiter}>Jupiter</li>
            <li onClick={handleSaturn}>Saturn</li>
            <li onClick={handleUranus}>Uranus</li>
            <li onClick={handleNeptune}>Neptune</li>
          </ul>
        </div>
      </div>
      {(planet !== []) & (planetSize !== null) & (planet.id !== "soleil") ? (
        <div className="planet-info">
          <div className="planet-info-top">
            <PlanetIframe name={planet.englishName} />
            <div className="nasa-description">
              <p>{NasaPlanetDescriptions[planet.englishName]}</p>
            </div>
          </div>
          <div className="planet-info-bottom">
            <h4>
              Full rotation: <br /> {planetRotation} hours
            </h4>
            <h4>
              Revolution around Sun: <br /> {planetRevolution} days or ({" "}
              {planetRevolutionYears} year(s) )
            </h4>
            <h4>
              Diameter: <br /> {planetSize} km
            </h4>
            <h4>
              Average Temperature: <br /> {planetTempC}°C / {planetTempF}°F
            </h4>
            <h4>
              Number of moons: <br /> {planetMoons}
            </h4>
          </div>
        </div>
      ) : (planetSize !== null) & (planet?.id === "soleil") ? (
        <div className="planet-info">
          <div className="planet-info-top">
            <PlanetIframe name={planet.englishName} />
            <div className="nasa-description">
              <p>{NasaPlanetDescriptions[planet.englishName]}</p>
            </div>
          </div>
          <div className="planet-info-bottom">
            <h4>
              Star Type: <br /> Yellow Dwarf
            </h4>
            <h4>
              Age: <br /> 4.603 billion years
            </h4>
            <h4>
              Diameter: <br /> {planetSize} km
            </h4>
            <h4>
              Corona temperature: <br /> 2,000,000°C / 3,500,000°F
            </h4>
            <h4>
              Surface Temperature: <br /> 5,500°C / 10,000°F
            </h4>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default OurSolarSystem;
