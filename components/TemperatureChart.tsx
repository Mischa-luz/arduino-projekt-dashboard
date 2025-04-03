"use client";

import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

type DataPoint = {
	timestamp: string;
	temperature: number;
	humidity: number;
};

type TemperatureChartProps = {
	data: DataPoint[];
};

export default function TemperatureChart({ data }: TemperatureChartProps) {
	const chartRef = useRef<HTMLCanvasElement | null>(null);
	const chartInstance = useRef<Chart | null>(null);

	useEffect(() => {
		if (chartRef.current && data.length > 0) {
			const ctx = chartRef.current.getContext("2d");

			if (ctx) {
				// Destroy existing chart if it exists
				if (chartInstance.current) {
					chartInstance.current.destroy();
				}

				// Filter out any data points that don't have valid temperature readings
				const validData = data.filter((d) => d.temperature !== 0);

				// Only proceed if we have valid data points
				if (validData.length === 0) {
					// Draw a message on the canvas if no valid data
					ctx.font = "16px 'Inter', sans-serif";
					ctx.fillStyle = "#666";
					ctx.textAlign = "center";
					ctx.fillText(
						"No temperature data available",
						chartRef.current.width / 2,
						chartRef.current.height / 2,
					);
					return;
				}

				// Prepare data for the chart
				const timestamps = validData.map((d) =>
					new Date(d.timestamp).toLocaleTimeString(),
				);
				const temperatures = validData.map((d) => d.temperature);

				// Create new chart
				chartInstance.current = new Chart(ctx, {
					type: "line",
					data: {
						labels: timestamps,
						datasets: [
							{
								label: "Temperature (°C)",
								data: temperatures,
								borderColor: "rgb(59, 130, 246)",
								backgroundColor: "rgba(59, 130, 246, 0.1)",
								tension: 0.3,
								pointRadius: 4,
								borderWidth: 3,
								pointBackgroundColor: "rgb(59, 130, 246)",
								fill: true,
							},
						],
					},
					options: {
						responsive: true,
						maintainAspectRatio: false,
						plugins: {
							tooltip: {
								mode: "index",
								intersect: false,
								backgroundColor: "rgba(0, 0, 0, 0.8)",
								bodyFont: {
									size: 14,
									family: "'Inter', 'system-ui', sans-serif",
									weight: 500,
								},
								padding: 10,
							},
							legend: {
								position: "top",
								labels: {
									font: {
										size: 13,
										family: "'Inter', 'system-ui', sans-serif",
										weight: 500,
									},
								},
							},
							title: {
								display: true,
								text: "Temperature Over Time",
								font: {
									size: 16,
									family: "'Inter', 'system-ui', sans-serif",
									weight: 600,
								},
							},
						},
						scales: {
							y: {
								beginAtZero: false,
								title: {
									display: true,
									text: "°C",
									font: {
										size: 14,
										family: "'Inter', 'system-ui', sans-serif",
										weight: 500,
									},
								},
								ticks: {
									font: {
										size: 12,
										family: "'Inter', 'system-ui', sans-serif",
									},
								},
							},
							x: {
								title: {
									display: true,
									text: "Time",
									font: {
										size: 14,
										family: "'Inter', 'system-ui', sans-serif",
										weight: 500,
									},
								},
								ticks: {
									font: {
										size: 12,
										family: "'Inter', 'system-ui', sans-serif",
									},
									maxRotation: 45,
									minRotation: 45,
								},
							},
						},
					},
				});
			}
		} else if (chartRef.current && data.length === 0) {
			// Handle empty data case
			const ctx = chartRef.current.getContext("2d");
			if (ctx) {
				ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height);
				ctx.font = "16px 'Inter', sans-serif";
				ctx.fillStyle = "#666";
				ctx.textAlign = "center";
				ctx.fillText(
					"No data available",
					chartRef.current.width / 2,
					chartRef.current.height / 2,
				);
			}
		}

		return () => {
			if (chartInstance.current) {
				chartInstance.current.destroy();
			}
		};
	}, [data]);

	return (
		<div className="w-full h-72">
			<canvas ref={chartRef} />
		</div>
	);
}
