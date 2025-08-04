import React from "react";
import { Line, Bar } from "react-chartjs-2";
import { useTranslations } from "next-intl";

interface ChartPopupProps {
  setShowPopup: (value: boolean) => void;
  showPopup: boolean;
  tileLayerUrl: string | null;
}

const ChartsPopup: React.FC<ChartPopupProps> = ({
  setShowPopup,
  showPopup,
  tileLayerUrl,
}) => {
  const t = useTranslations("charts");

  const labels = [
    "2025-02-01",
    "2025-02-02",
    "2025-02-03",
    "2025-02-04",
    "2025-02-05",
    "2025-02-06",
    "2025-02-07",
    "2025-02-08",
  ];

  const smiData = [0.48, 0.5, 0.52, 0.49, 0.51, 0.47, 0.53, 0.54];
  const minSMI = Math.min(...smiData);
  const maxSMI = Math.max(...smiData);

  const lineData = {
    labels,
    datasets: [
      {
        label: t("label"),
        data: smiData,
        fill: false,
        borderColor: "rgba(40, 167, 69, 1)",
        backgroundColor: "rgba(40, 167, 69, 0.2)",
        tension: 0.1,
      },
    ],
  };

  const barData = {
    labels,
    datasets: [
      {
        label: t("label"),
        data: smiData,
        borderColor: "rgba(40, 167, 69, 1)",
        backgroundColor: smiData.map((value) =>
          value === maxSMI
            ? "rgba(0, 128, 0, 0.7)"
            : value >= minSMI && value <= minSMI + 0.01
            ? "rgba(255, 165, 0, 0.7)"
            : "rgba(40, 167, 69, 0.2)"
        ),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      {tileLayerUrl && (
        <button onClick={() => setShowPopup(true)} className="showChartsButton">
          📊 {t("open")}
        </button>
      )}

      {showPopup && (
        <div className="chartOverlay">
          <div className="chartContainer">
            <h3 className="chartTitle">{t("title")}</h3>

            <div className="chartRow">
              <div className="chartBox">
                <h4>{t("lineTitle")}</h4>
                <Line data={lineData} />
                <p className="chartDescription">{t("lineDescription")}</p>
              </div>

              <div className="chartBox">
                <h4>{t("barTitle")}</h4>
                <Bar data={barData} />
                <p className="chartDescription">{t("barDescription")}</p>
              </div>
            </div>

            <div className="chart-closeButtonContainer">
              <button onClick={() => setShowPopup(false)} className="chart-closeButton">
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartsPopup;
