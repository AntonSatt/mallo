import * as signalR from "@microsoft/signalr";

// this file is responsible for managing the SignalR/WebSocket connection and providing 
// methods to send and receive messages in the chat application.

class ChatSignalrService {
    constructor() {
        this.connection = null;
    }

    createConnection() {
        if (this.connection) {
            return this.connection;
        }

        const token = localStorage.getItem("token");

        this.connection = new signalR.HubConnectionBuilder().withUrl(`${import.meta.env.VITE_API_BASE_URL}/chat/hub`, {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .build();

        return this.connection;
    }
    async startConnection() {
        const connection = this.createConnection();

        if (connection.state === signalR.HubConnectionState.Connected) {
            return connection;
        }

        if (connection.state === signalR.HubConnectionState.Connecting) {
            return connection;
        }

        await connection.start();

        console.log("SignalR connected");

        return connection;
    }

    async stopConnection() {
        if (!this.connection) {
            return;
        }

        await this.connection.stop();
        this.connection = null;

        console.log("signalR disconnected")
    }

    // Listen for incoming messages through SignalR and update the chat window if the message belongs to the current conversation.
    onReceiveMessage(callback) {
        const connection = this.createConnection();

        connection.on("ReceiveMessage", callback);
    }

    async sendMessage(messageData) {
        if (!this.connection) return;

        await this.connection.invoke("SendMessage", messageData);
    }

    // Listen for typing notifications from the other user and show "typing..."
    onUserTyping(callback) {
        const connection = this.createConnection();

        connection.on("UserTyping", callback);
    }

    async sendTyping(receiverId) {
        if (!this.connection) return;

        await this.connection.invoke("Typing", receiverId);
    }

    onUserOnline(callback) {
        const connection = this.createConnection();

        connection.on("UserOnline", callback);
    }

    onUserOffline(callback) {
        const connection = this.createConnection();

        connection.on("UserOffline", callback);
    }

    onOnlineUsers(callback) {
        const connection = this.createConnection();

        connection.on("OnlineUsers", callback);
    }

    async markConversationAsRead(otherUserId) {
        await this.startConnection();

        return this.connection.invoke("MarkConversationAsRead", otherUserId);
    }

    async deleteConversation(otherUserId) {
        if (!this.connection) return;

        await this.connection.invoke("DeleteConversation", otherUserId);
    }
}

export default new ChatSignalrService();