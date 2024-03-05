import socketCluster from "socketcluster-client";

export const rand = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1) + min);

export const subscribeChannel = (
	name: string,
	socket: socketCluster.AGClientSocket
) => {
	const channel = socket.subscribe(name);
	console.log("Subscribe to channel: ", channel);
	return channel;
};

export const unsubscribeChannel = (channel: any) => {
	channel.unsubscribe();
	console.log("Unsubscribe channel: ", channel);
};
