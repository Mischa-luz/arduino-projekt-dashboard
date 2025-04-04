import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	type ChartOptions,
} from "chart.js";
import type { SensorData } from "../utils/dataFetcher";

// Register ChartJS components
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
);

interface TemperatureChartProps {
	data: SensorData[];
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({ data }) => {
	// Check if we have enough valid data points
	const validData = data.filter(
		(item) =>
			item?.timestamp &&
			typeof item.temperature === "number" &&
			!Number.isNaN(item.temperature),
	);

	if (validData.length < 2) {
		return (
			<div className="flex justify-center items-center h-64">
				<p className="text-gray-500">Not enough data points to display chart</p>
			</div>
		);
	}

	// Format dates for better display
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	};

	const chartData = {
		labels: validData.map((item) => formatDate(item.timestamp)),
		datasets: [
			{
				label: "Temperature (°C)",
				data: validData.map((item) => item.temperature),
				borderColor: "rgb(255, 99, 132)",
				backgroundColor: "rgba(255, 99, 132, 0.5)",
				tension: 0.3, // Decrease line tension for smoother curves
				pointRadius: 3,
				pointHoverRadius: 5,
			},
		],
	};

	const options: ChartOptions<"line"> = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: "top" as const,
			},
			tooltip: {
				mode: "index",
				intersect: false,
			},
		},
		scales: {
			x: {
				ticks: {
					maxRotation: 45,
					minRotation: 45,
				},
			},
			y: {
				beginAtZero: false,
			},
		},
	};

	return (
		<div style={{ height: "300px" }}>
			<Line data={chartData} options={options} />
		</div>
	);
};

export default TemperatureChart;
