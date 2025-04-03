export type TemperatureData = {
	date: string;
	temperature: number;
};

export type HumidityData = {
	date: string;
	humidity: number;
};

export type SensorData = {
	timestamp: string;
	temperature: number;
	humidity: number;
};

// Function to fetch temperature data from the backend
async function fetchTemperature(): Promise<TemperatureData[]> {
	try {
		// Updated to use the internal API endpoint
		const response = await fetch("/api/temperature");
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error("Error fetching temperature data:", error);
		return [];
	}
}

// Function to fetch humidity data from the backend
async function fetchHumidity(): Promise<HumidityData[]> {
	try {
		// Updated to use the internal API endpoint
		const response = await fetch("/api/humidity");
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error("Error fetching humidity data:", error);
		return [];
	}
}

// Function to merge temperature and humidity data based on timestamp
function mergeData(
	temperatureData: TemperatureData[],
	humidityData: HumidityData[],
): SensorData[] {
	const mergedData: Record<string, SensorData> = {};

	// Process temperature data
	for (const item of temperatureData) {
		mergedData[item.date] = {
			timestamp: item.date,
			temperature: item.temperature,
			humidity: 0, // Default value until we find matching humidity data
		};
	}

	// Process humidity data and merge with existing temperature data
	for (const item of humidityData) {
		if (mergedData[item.date]) {
			// If we already have this timestamp from temperature data
			mergedData[item.date].humidity = item.humidity;
		} else {
			// If this timestamp only exists in humidity data
			mergedData[item.date] = {
				timestamp: item.date,
				temperature: 0, // Default value since we don't have temperature for this timestamp
				humidity: item.humidity,
			};
		}
	}

	// Convert the object back to an array and sort by timestamp
	return Object.values(mergedData).sort(
		(a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
	);
}

// Main function to fetch and merge sensor data
export async function fetchSensorData(): Promise<SensorData[]> {
	try {
		// Fetch data from both endpoints in parallel
		const [temperatureData, humidityData] = await Promise.all([
			fetchTemperature(),
			fetchHumidity(),
		]);

		// Merge the data
		return mergeData(temperatureData, humidityData);
	} catch (error) {
		console.error("Failed to fetch sensor data:", error);
		return [];
	}
}
