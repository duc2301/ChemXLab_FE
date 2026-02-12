import * as signalR from "@microsoft/signalr";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const connection = new signalR.HubConnectionBuilder()
  .withUrl(`${baseUrl}PaymentHub`, {
    accessTokenFactory: () => {
      return localStorage.getItem("jwtToken") || "";
    }
  })
  .withAutomaticReconnect()
  .build();

export async function startConnection() {
  try {
    if (connection.state === signalR.HubConnectionState.Disconnected) {
      await connection.start();
      console.log("SignalR connected:", `${baseUrl}PaymentHub`);
    }
  } catch (error) {
    console.error("SignalR connection error:", error);
    setTimeout(startConnection, 5000);
  }
}

export function getConnection() {
  return connection;
}


let isListenerRegistered = false;

export async function initPaymentSignal(onSuccess: () => void) {
  try {
    await startConnection();

    const conn = getConnection();

    if (isListenerRegistered) return;
    isListenerRegistered = true;

    conn.on("PaymentSuccess", (data?: boolean) => {
      console.log("Received PaymentSuccess event:", data);
      onSuccess();
    });

    console.log("Payment listener registered successfully");
  } catch (err) {
    console.error("Failed to init payment signalR:", err);
  }
}