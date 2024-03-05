import socketCluster from "socketcluster-client";
import { rand, subscribeChannel, unsubscribeChannel } from "../utils";
import { baseUrl } from "../constants";

const INTERVAL_TIME = 1000;

var channels: any = [];

let interval: NodeJS.Timeout | null = null;

const start = async (socket: socketCluster.AGClientSocket) => {
	const response = await fetch(`${baseUrl}/media/symbol_static_data.json`);
	const json = await response.json();
	const stocks = json.filter(
		(e: any) => e["m"] === "HOSE" && e["t"] === "STOCK"
	);
	for (let i = 0; i < stocks.length; i++) {
		const channel = subscribeChannel(`market.quote.${stocks[i]["s"]}`, socket);
		channels.push(channel);
	}
	interval = setInterval(() => {
		for (let i = 0; i < channels.length; i++) {
			const data = {
				s: stocks[i]["s"],
				ss: "LO",
				ti: 1691998014960,
				o: 11800,
				h: 11900,
				l: 1400,
				c: rand(14000, 80000),
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

export const pushStocks = { start, end };
