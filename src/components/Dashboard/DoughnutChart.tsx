import React from "react";
import { Doughnut } from "react-chartjs-2";

function DoughnutChart(props: any) {
  const doughnutChartEntries = {
    labels: props.data.labels,
    datasets: [
      {
        data: props.data.values,
        backgroundColor: [
          "#0A54A2",
          "#14787e",
          "#F005CB",
          "#4a4a4a",
          "#750eac",
        ],
        hoverBackgroundColor: ["#083a6f", "#1d6469", "#92067c", "#363636", "#4f0d72"],
      },
    ],
  };

  return (
    <>
      {doughnutChartEntries.datasets[0].data.length > 0 ? (
        <Doughnut
          width={100}
          height={100}
          data={doughnutChartEntries}
          legend={{ display: false }}
        />
      ) : (
        <h3 className="font-bold text-xl text-gray-300 text-center">No data</h3>
      )}
    </>
  );
}

export default DoughnutChart;
