import socketCluster from "socketcluster-client";
import { rand, subscribeChannel, unsubscribeChannel } from "../utils";

const INTERVAL_TIME = 1000;

const marketIndices = ["VN-INDEX", "VN30", "HNX", "HNX30", "UPCOM"];

var channels: any = [];

let interval: NodeJS.Timeout | null = null;

const start = (socket: socketCluster.AGClientSocket) => {
	for (let i = 0; i < marketIndices.length; i++) {
		const channel = subscribeChannel(
			`market.quote.${marketIndices[i]}`,
			socket
		);
		channels.push(channel);
	}

	interval = setInterval(() => {
		for (let i = 0; i < channels.length; i++) {
			const data = {
				s: marketIndices[i],
				ss: "LO",
				ti: 1691998014960,
				o: 11800,
				h: 11900,
				l: 1400,
				c: rand(1000, 1500),
				ch: rand(-500, 1000),
				r: rand(-100, 100),
				mv: 2900,
				vo: 6671700,
				va: 78497000000,
				mb: "BUY",
				a: 11766,
				frBvo: 2600,
				frSvo: 15510,
				frCr: 374835860,
			};
			channels[i].transmitPublish(data);
		}
	}, INTERVAL_TIME);
};

const end = () => {
	clearInterval(interval!);
	for (let i = 0; i < channels.length; i++) {
		unsubscribeChannel(channels[i]);
	}
	channels = [];
};

export const pushMarketIndex = { start, end };
