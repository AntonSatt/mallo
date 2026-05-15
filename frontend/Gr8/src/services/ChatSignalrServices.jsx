import * as signalR from "@microsoft/signalr";

// this file is responsible for managing the SignalR/WebSocket connection and providing 
// methods to send and receive messages in the chat application.

class ChatSignalrService {
    constructor() {
        this.connection = null;
    }

    async startConnection() {
        const token = localStorage.getItem("token");
        console.log("SignalR token:", token);

        this.connection = new signalR.HubConnectionBuilder().withUrl(`${import.meta.env.VITE_API_BASE_URL}/chat/hub`, {
            accessTokenFactory: () => localStorage.getItem("token")
        })
        .withAutomaticReconnect()
        .build();

        await this.connection.start();

        console.log("SignalR connected");
    }

    async stopConnection() {
        if(this.connection){
            await this.connection.stop();
        }
    }
    
    onReceiveMessage(callback){
        if(!this.connection) return;

        this.connection.on("ReceiveMessage", callback);
    }

    async sendMessage(messageData){
        if(!this.connection) return;

        await this.connection.invoke("SendMessage", messageData);
    }
}

export default new ChatSignalrService();