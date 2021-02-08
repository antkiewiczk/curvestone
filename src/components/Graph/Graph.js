import React from "react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const Graph = ({ graphData }) => {
  return (
    <div className="graphWrapper">
      {graphData.map((data) => {
        return (
          <div key={data.title.text} className="graph">
            <HighchartsReact highcharts={Highcharts} options={data} />
          </div>
        );
      })}
    </div>
  );
};

export default Graph;
