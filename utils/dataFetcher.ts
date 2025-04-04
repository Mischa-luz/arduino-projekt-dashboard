export type SensorData = {
	timestamp: string;
	temperature: number;
	humidity: number;
};

export type DataResponse = {
	timestamp: number;
	temperature: number;
	humidity: number;
	deviceId?: string;
}[];

const BACKEND_URL = "https://api-arduino-projekt.mischa-fischer.com";

export type TimeScale = "30m" | "1h" | "6h" | "24h" | "7d" | "30d" | "all";

function convertBackendData(backendData: DataResponse): SensorData[] {
	// Filter out any entries with invalid data
	const validData = backendData.filter(
		(item) =>
			typeof item.timestamp === "number" &&
			!Number.isNaN(item.timestamp) &&
			typeof item.temperature === "number" &&
			!Number.isNaN(item.temperature) &&
			typeof item.humidity === "number" &&
			!Number.isNaN(item.humidity),
	);

	return validData.map((item) => ({
		timestamp: new Date(item.timestamp).toISOString(),
		temperature: item.temperature,
		humidity: item.humidity,
	}));
}

export const fetchSensorData = async (
	timeScale = "24h",
): Promise<SensorData[]> => {
	try {
		const response = await fetch(
			`${BACKEND_URL}/v1/data?timeScale=${timeScale}`,
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json<DataResponse>();

		// Ensure data is an array
		if (!Array.isArray(data)) {
			console.error("Invalid data format: expected array");
			return [];
		}

		return convertBackendData(data);
	} catch (error) {
		console.error("Error fetching sensor data:", error);
		throw error;
	}
};
