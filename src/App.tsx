import { useEffect, useRef } from "react";
import socketCluster from "socketcluster-client";
import { pushMarketIndex } from "./test-cases/push-market-index";
import { pushStocks } from "./test-cases/push-stocks";
import { socketHostName } from "./constants";
const scCodecMinBin = require("sc-codec-min-bin");

function App() {
	const socketRef = useRef<socketCluster.AGClientSocket>();

	useEffect(() => {
		try {
			if (socketRef.current) return;
			const socket = socketCluster.create({
				hostname: socketHostName,
				port: 443,
				secure: true,
				path: "/ws/",
				autoReconnect: true,
				codecEngine: scCodecMinBin,
			});
			socketRef.current = socket;
			console.log("Connected to socket: ", socket);
		} catch (error) {
			console.log("Error connect socket: ", error);
		}
	}, []);

	return (
		<div className="App">
			<div>
				<h4>Test real-time for 5 market indices</h4>
				<button onClick={() => pushMarketIndex.start(socketRef.current!)}>
					Push market index
				</button>
				<button onClick={pushMarketIndex.end}>Cancel push market index</button>
			</div>
			<div>
				<h4>Test real-time for stocks</h4>
				<button onClick={() => pushStocks.start(socketRef.current!)}>
					Push stocks
				</button>
				<button onClick={pushMarketIndex.end}>Cancel push stocks</button>
			</div>
		</div>
	);
}

export default App;
