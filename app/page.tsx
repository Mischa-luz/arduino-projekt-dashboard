"use client";

import { useState, useEffect } from "react";
import SensorChart from "../components/SensorChart";
import DashboardStats from "../components/DashboardStats";
import {
	fetchSensorData,
	type TimeScale,
	type SensorData,
} from "../utils/dataFetcher";

export default function Home() {
	const [data, setData] = useState<SensorData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [timeScale, setTimeScale] = useState<TimeScale>("24h");

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);
				setError(null);
				const sensorData = await fetchSensorData(timeScale);

				if (sensorData.length === 0) {
					setError("No data available from sensors");
				}

				setData(sensorData);
				setLoading(false);
			} catch (error) {
				console.error("Failed to fetch sensor data:", error);
				setError("Failed to fetch data from sensors. Please try again later.");
				setLoading(false);
			}
		};

		loadData();
		// Set up polling to refresh data every minute
		const intervalId = setInterval(loadData, 60000);

		return () => clearInterval(intervalId);
	}, [timeScale]);

	return (
		<main className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100">
			<div className="max-w-7xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-4xl font-bold text-gray-800 tracking-tight">
						Arduino Sensor Dashboard
					</h1>

					<div className="flex items-center space-x-2">
						<label
							htmlFor="timeScale"
							className="text-sm font-medium text-gray-700"
						>
							Time Scale:
						</label>
						<select
							id="timeScale"
							value={timeScale}
							onChange={(e) => setTimeScale(e.target.value as TimeScale)}
							className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
						>
							{["30m", "1h", "6h", "24h", "7d", "30d", "all"].map((scale) => (
								<option key={scale} value={scale}>
									{scale}
								</option>
							))}
						</select>
					</div>
				</div>

				{loading ? (
					<div className="flex justify-center items-center h-64">
						<div className="animate-pulse text-xl font-medium text-gray-700">
							Loading sensor data...
						</div>
					</div>
				) : error ? (
					<div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-md">
						<div className="flex">
							<div className="flex-shrink-0">
								<svg
									className="h-5 w-5 text-red-500"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<title>Error</title>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
							<div className="ml-3">
								<p className="text-sm text-red-700">{error}</p>
							</div>
						</div>
					</div>
				) : (
					<>
						<DashboardStats data={data} />

						<div className="grid md:grid-cols-2 gap-8 mt-8">
							<div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
								<h2 className="text-2xl font-semibold mb-5 text-gray-700">
									Temperature over Time
								</h2>
								<SensorChart data={data} type="temperature" />
							</div>

							<div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
								<h2 className="text-2xl font-semibold mb-5 text-gray-700">
									Humidity over Time
								</h2>
								<SensorChart data={data} type="humidity" />
							</div>
						</div>
					</>
				)}
			</div>
		</main>
	);
}
