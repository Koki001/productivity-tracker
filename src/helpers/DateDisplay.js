import { format } from "date-fns";
import { useEffect, useState } from "react";

const DateDisplay = function () {
  const [timeUpdate, setTimeUpdate] = useState(true);
  const today = format(new Date(), "MMM do yyyy h:mmaaaa");

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
    <div className="date-container">
      <h2>
        <span>{today}</span>
      </h2>
    </div>
  );
};

export default DateDisplay;
