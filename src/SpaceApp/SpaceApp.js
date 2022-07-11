import { useEffect, useState } from "react";
import axios from "axios";
import OurSolarSystem from "../Components/OurSolarSystem";
import Button from "@mui/material/Button";
import GeneralSpace from "../Components/GeneralSpace";

const SpaceApp = function () {
  const [planetData, setPlanetData] = useState([]);
  const [solarSystem, setSolarSystem] = useState([]);
  const [goToSolar, setGoToSolar] = useState(false);
  const [goToGeneral, setGoToGeneral] = useState(false);

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
  const handleSolar = function () {
    setGoToSolar(true);
    setGoToGeneral(false)
  };
  const handleGeneralSpace = function () {
    setGoToGeneral(true);
    setGoToSolar(false)
  };
  return (
    <div className="space-app-main">
      <div className="space-app-container wrapper">
        <div className="space-selections">
          <Button onClick={handleSolar} variant="outlined">
            Explore Our Solar System
          </Button>
          <Button onClick={handleGeneralSpace} variant="outlined">
            General Space Facts
          </Button>
        </div>
        {goToSolar && <OurSolarSystem data={solarSystem} />}
        {goToGeneral && <GeneralSpace />}
      </div>
    </div>
  );
};

export default SpaceApp;
