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
	maxLabelCount?: number; // Renamed to maxLabelCount to better reflect its purpose
}

const SensorChart: React.FC<SensorChartProps> = ({
	data,
	type,
	maxLabelCount = 4, // Default to 8 labels for clean visualization
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
				<p className="text-gray-500 dark:text-gray-400">
					Not enough data points to display chart
				</p>
			</div>
		);
	}

	// Format dates for better display
	const formatData = validData.map((item) => {
		const date = new Date(item.timestamp);
		return {
			...item,
			formattedTime: `${date.toLocaleDateString([], {
				month: "numeric",
				day: "numeric",
			})} ${date.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			})}`,
		};
	});

	// Calculate the interval for displaying X-axis ticks
	const tickInterval = Math.ceil(formatData.length / (maxLabelCount - 1));

	// Custom tick formatter to only show labels for certain indices and always the last one
	const customTickFormatter = (value: string, index: number) => {
		// Always show first label, labels at interval, and last label
		if (index % tickInterval === 0 || index === formatData.length - 1) {
			return value;
		}
		return "";
	};

	return (
		<ResponsiveContainer width="100%" height={300}>
			<AreaChart
				data={formatData}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 25, // Increased to accommodate longer date format
				}}
			>
				<defs>
					<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor={gradientColor} stopOpacity={0.8} />
						<stop offset="95%" stopColor={gradientColor} stopOpacity={0.1} />
					</linearGradient>
				</defs>
				<CartesianGrid strokeDasharray="3 3" className="dark:opacity-50" />
				<XAxis
					dataKey="formattedTime"
					angle={-45}
					textAnchor="end"
					height={80}
					tickFormatter={customTickFormatter}
					interval={0} // Show all ticks but hide some with formatter
					tick={{ fill: "var(--text-primary, #333)" }}
				/>
				<YAxis tick={{ fill: "var(--text-primary, #333)" }} />
				<Tooltip
					formatter={(value) => [
						`${value}${isTemperature ? "°C" : "%"}`,
						label,
					]}
					labelFormatter={(time) => `Time: ${time}`}
					contentStyle={{
						backgroundColor: "var(--card-bg, #fff)",
						borderColor: "var(--border-color, #ccc)",
						color: "var(--text-primary, #333)",
					}}
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
