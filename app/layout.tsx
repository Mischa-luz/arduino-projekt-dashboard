import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Arduino Sensor Dashboard",
	description: "Monitor temperature and humidity data from Arduino sensors",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
