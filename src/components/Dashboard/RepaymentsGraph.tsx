import React from "react";
import { Line } from "react-chartjs-2";

function RepaymentsGraph(props: any) {
  const graphData = {
    labels: props.data.labels,
    datasets: [
      {
        label: "",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "#0770B0",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "#0770B0",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: props.data.values,
      },
    ],
  };

  return (
    <>
      {graphData.datasets[0].data.length > 0 ? (
        <Line data={graphData} />
      ) : (
        <h3 className="font-bold text-xl text-gray-300 text-center">No data</h3>
      )}
    </>
  );
}

export default RepaymentsGraph;
