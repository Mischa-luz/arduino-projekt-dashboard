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

export type TimeScale =
	| "raw"
	| "30s"
	| "1m"
	| "5m"
	| "1h"
	| "6h"
	| "24h"
	| "7d"
	| "30d";

function convertBackendData(backendData: DataResponse): SensorData[] {
	return backendData.map((item) => ({
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
		return convertBackendData(data);
	} catch (error) {
		console.error("Error fetching sensor data:", error);
		throw error;
	}
};
