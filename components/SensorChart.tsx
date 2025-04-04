import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import type { SensorData } from "../utils/dataFetcher";

type ChartType = "temperature" | "humidity";

interface SensorChartProps {
	data: SensorData[];
	type: ChartType;
}

const SensorChart: React.FC<SensorChartProps> = ({ data, type }) => {
	const isTemperature = type === "temperature";
	const dataKey = isTemperature ? "temperature" : "humidity";
	const label = isTemperature ? "Temperature (°C)" : "Humidity (%)";
	const color = isTemperature ? "#ff6384" : "#36a2eb";

	// Check if we have enough valid data points
	const validData = data.filter(
		(item) =>
			item?.timestamp &&
			typeof item[dataKey] === "number" &&
			!Number.isNaN(item[dataKey]),
	);

	if (validData.length < 2) {
		return (
			<div className="flex justify-center items-center h-64">
				<p className="text-gray-500">Not enough data points to display chart</p>
			</div>
		);
	}

	// Format dates for better display and reverse the array to display from left to right
	const formatData = validData
		.map((item) => ({
			...item,
			formattedTime: new Date(item.timestamp).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
		}))
		.reverse();

	return (
		<ResponsiveContainer width="100%" height={300}>
			<LineChart
				data={formatData}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 5,
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis
					dataKey="formattedTime"
					angle={-45}
					textAnchor="end"
					height={60}
				/>
				<YAxis />
				<Tooltip
					formatter={(value) => [
						`${value}${isTemperature ? "°C" : "%"}`,
						label,
					]}
					labelFormatter={(time) => `Time: ${time}`}
				/>
				<Legend />
				<Line
					type="monotone"
					dataKey={dataKey}
					name={label}
					stroke={color}
					activeDot={{ r: 6 }}
					dot={{ r: 3 }}
					strokeWidth={2}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
};

export default SensorChart;
