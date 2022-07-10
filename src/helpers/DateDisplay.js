import { format } from "date-fns";
import { useEffect, useState } from "react";

const DateDisplay = function () {
  const [timeUpdate, setTimeUpdate] = useState(true);
  const today = format(new Date(), "MMM do yyyy h:mm aaaa");

  useEffect(
    function () {
      const updateTime = function () {
        setTimeUpdate(!timeUpdate);
      };
      setTimeout(updateTime, 10000);
      clearTimeout(updateTime);
    },
    [timeUpdate]
  );

  return (
    <h2 className="date-container">
      <span>{today}</span>
    </h2>
  );
};

export default DateDisplay;
