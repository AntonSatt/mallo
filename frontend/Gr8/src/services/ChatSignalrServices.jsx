import * as signalR from "@microsoft/signalr";

// this file is responsible for managing the SignalR/WebSocket connection and providing 
// methods to send and receive messages in the chat application.

class ChatSignalrService {
    constructor() {
        this.connection = null;
    }

    async startConnection() {
        const token = localStorage.getItem("token");

        this.connection = new signalR.HubConnectionBuilder().withUrl(`${import.meta.env.VITE_API_BASE_URL}/chat/hub`, {
            accessTokenFactory: () => token
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
    
    // Listen for incoming messages through SignalR and update the chat window if the message belongs to the current conversation.
    onReceiveMessage(callback){
        if(!this.connection) return;

        this.connection.on("ReceiveMessage", callback);
    }

    async sendMessage(messageData){
        if(!this.connection) return;

        await this.connection.invoke("SendMessage", messageData);
    }

    // Listen for typing notifications from the other user and show "typing..."
    onUserTyping(callback){
        if(!this.connection) return;

        this.connection.on("UserTyping", callback);
    }

    async sendTyping(receiverId){
        if(!this.connection) return;

        await this.connection.invoke("Typing", receiverId);
    }

    async markConversationAsRead(otherUserId) {
    if (!this.connection) return;

    await this.connection.invoke("MarkConversationAsRead", otherUserId);
}
}

export default new ChatSignalrService();