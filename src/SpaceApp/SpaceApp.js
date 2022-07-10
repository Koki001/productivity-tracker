import { useEffect, useState } from "react";
import axios from "axios";

const SpaceApp = function () {
  const [planetData, setPlanetData] = useState([]);
  const [solarSystem, setSolarSystem] = useState([]);

  const kelToCel = function (num) {
    return num - 273.15;
  };
  const kelToFah = function (num) {
    return 1.8 * (num - 273) + 32;
  };

  useEffect(function () {
    if (planetData !== []) {
      axios({
        url: `https://api.le-systeme-solaire.net/rest/bodies`,
        method: "GET",
      }).then(function (res) {
        setPlanetData(res.data.bodies);
      });
    }
  }, []);
  console.log(solarSystem);
  useEffect(
    function () {
      if (planetData) {
        const solarArr = [];
        planetData.map(function (item) {
          if (
            item.englishName === "Earth" ||
            item.englishName === "Mercury" ||
            item.englishName === "Venus" ||
            item.englishName === "Mars" ||
            item.englishName === "Jupiter" ||
            item.englishName === "Saturn" ||
            item.englishName === "Uranus" ||
            item.englishName === "Neptune" ||
            item.englishName === "Sun"
          ) {
            solarArr.push(item);
          }
        });
        setSolarSystem(solarArr);
      }
    },
    [planetData]
  );
  return (
    <div className="space-app-container wrapper">
      <div className="solar-system-container">
        {solarSystem !== [] &&
          solarSystem.map(function (planet, i) {
            return (
              <div key={planet.name + i} className="planet">
                <h2>{planet.englishName}</h2>
                <img src={`/assets/solarSystem/${planet.englishName}.png`} alt="" />

              </div>
            );
          })}
      </div>
    </div>
  );
};

export default SpaceApp;
