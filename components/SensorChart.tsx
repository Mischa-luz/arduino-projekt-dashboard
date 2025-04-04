import {
	AreaChart,
	Area,
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
	maxDataPoints?: number; // Optional prop to customize the maximum data points
}

const SensorChart: React.FC<SensorChartProps> = ({
	data,
	type,
	maxDataPoints = 30, // Default to 30 data points for clean visualization
}) => {
	const isTemperature = type === "temperature";
	const dataKey = isTemperature ? "temperature" : "humidity";
	const label = isTemperature ? "Temperature (°C)" : "Humidity (%)";
	const color = isTemperature ? "#ff6384" : "#36a2eb";
	const gradientId = isTemperature ? "temperatureGradient" : "humidityGradient";
	const gradientColor = isTemperature
		? "rgb(255, 99, 132)"
		: "rgb(54, 162, 235)";

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

	// Sample data if we have more than maxDataPoints
	const sampleData = () => {
		if (validData.length <= maxDataPoints) {
			return validData; // Return all data if it's less than maxDataPoints
		}

		// Always include the most recent data points by taking the last maxDataPoints items
		return validData.slice(-maxDataPoints);

		// Alternative method: Sampling across the entire dataset
		// const interval = Math.ceil(validData.length / maxDataPoints);
		// return validData.filter((_, index) => index % interval === 0).slice(0, maxDataPoints);
	};

	const sampledData = sampleData();

	// Format dates for better display
	const formatData = sampledData.map((item) => ({
		...item,
		formattedTime: new Date(item.timestamp).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		}),
	}));

	return (
		<ResponsiveContainer width="100%" height={300}>
			<AreaChart
				data={formatData}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 5,
				}}
			>
				<defs>
					<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor={gradientColor} stopOpacity={0.8} />
						<stop offset="95%" stopColor={gradientColor} stopOpacity={0.1} />
					</linearGradient>
				</defs>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis
					dataKey="formattedTime"
					angle={-45}
					textAnchor="end"
					height={60}
					tickCount={10}
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
				<Area
					type="monotone"
					dataKey={dataKey}
					name={label}
					stroke={color}
					fill={`url(#${gradientId})`}
					activeDot={{ r: 6 }}
					dot={{ r: 3 }}
					strokeWidth={2}
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
};

export default SensorChart;
