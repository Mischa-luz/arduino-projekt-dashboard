interface DataPoint {
	timestamp: string;
	temperature: number;
	humidity: number;
}

interface DashboardStatsProps {
	data: DataPoint[];
}

export default function DashboardStats({ data }: DashboardStatsProps) {
	// Calculate stats if data is available
	if (!data || data.length === 0) {
		return <div className="text-gray-500 font-medium">No data available</div>;
	}

	// Filter out entries with valid temperature and humidity values
	const validTemperatureData = data.filter((d) => d.temperature !== 0);
	const validHumidityData = data.filter((d) => d.humidity !== 0);

	// Calculate current, min, max for both temperature and humidity
	const currentTemp =
		validTemperatureData.length > 0
			? validTemperatureData[validTemperatureData.length - 1].temperature
			: null;

	const currentHumidity =
		validHumidityData.length > 0
			? validHumidityData[validHumidityData.length - 1].humidity
			: null;

	const minTemp =
		validTemperatureData.length > 0
			? Math.min(...validTemperatureData.map((d) => d.temperature))
			: null;

	const maxTemp =
		validTemperatureData.length > 0
			? Math.max(...validTemperatureData.map((d) => d.temperature))
			: null;

	const minHumidity =
		validHumidityData.length > 0
			? Math.min(...validHumidityData.map((d) => d.humidity))
			: null;

	const maxHumidity =
		validHumidityData.length > 0
			? Math.max(...validHumidityData.map((d) => d.humidity))
			: null;

	const lastUpdated = new Date(
		data[data.length - 1].timestamp,
	).toLocaleString();

	const formatValue = (value: number | null, unit: string): string => {
		return value !== null ? `${value.toFixed(1)}${unit}` : "N/A";
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-300">
				<h3 className="text-sm font-medium text-gray-600 uppercase mb-1">
					Current Temperature
				</h3>
				<p className="text-3xl font-bold text-blue-600">
					{formatValue(currentTemp, "°C")}
				</p>
			</div>

			<div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow duration-300">
				<h3 className="text-sm font-medium text-gray-600 uppercase mb-1">
					Current Humidity
				</h3>
				<p className="text-3xl font-bold text-green-600">
					{formatValue(currentHumidity, "%")}
				</p>
			</div>

			<div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-purple-500 hover:shadow-lg transition-shadow duration-300">
				<h3 className="text-sm font-medium text-gray-600 uppercase mb-1">
					Temperature Range
				</h3>
				<p className="text-3xl font-bold text-gray-800">
					{minTemp !== null && maxTemp !== null
						? `${minTemp.toFixed(1)}°C - ${maxTemp.toFixed(1)}°C`
						: "N/A"}
				</p>
			</div>

			<div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-amber-500 hover:shadow-lg transition-shadow duration-300">
				<h3 className="text-sm font-medium text-gray-600 uppercase mb-1">
					Humidity Range
				</h3>
				<p className="text-3xl font-bold text-gray-800">
					{minHumidity !== null && maxHumidity !== null
						? `${minHumidity.toFixed(1)}% - ${maxHumidity.toFixed(1)}%`
						: "N/A"}
				</p>
			</div>

			<div className="col-span-1 md:col-span-2 lg:col-span-4 bg-white p-4 rounded-lg shadow-md text-center">
				<p className="text-sm font-medium text-gray-600">
					Last updated: <span className="text-gray-800">{lastUpdated}</span>
				</p>
			</div>
		</div>
	);
}
