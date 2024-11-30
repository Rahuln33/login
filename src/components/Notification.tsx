import React, { useEffect, useState } from "react";
import mqtt, { MqttClient } from "mqtt";

interface UserDetails {
  name: string;
  rank: string;
  role: string;
  ship: string;
  approvalstatus: string;
}

interface NotificationMessage {
  message: string;
  user_details: UserDetails;
}

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Connecting...");

  useEffect(() => {
    // Connect to the MQTT broker
    // import mqtt from "mqtt";

    const client = mqtt.connect("ws://192.168.0.104:6000");

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe("admin/notifications", (err) => {
        if (!err) {
          console.log("Subscribed to topic: admin/notifications");
        }
      });
    });

    client.on("message", (topic, message) => {
      console.log("Message received on topic:", topic);
      console.log("Message:", message.toString());
    });

    // Listen for messages
    client.on("message", (topic, message) => {
      if (topic === "admin/notifications") {
        try {
          const notification: NotificationMessage = JSON.parse(
            message.toString()
          );
          // Add notification to state
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            notification,
          ]);
        } catch (error) {
          console.error("Error parsing MQTT message:", error);
        }
      }
    });

    // Cleanup on component unmount
    return () => {
      client.end();
    };
  }, []);

  if (loading) {
    return <div>{connectionStatus}</div>;
  }

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.length > 0 ? (
          notifications.map((notif, index) => (
            <li key={index}>
              <p>{notif.message}</p>
              <pre>
                {`User Details: 
                    Name: ${notif.user_details.name} 
                    Rank: ${notif.user_details.rank} 
                    Role: ${notif.user_details.role} 
                    Ship: ${notif.user_details.ship} 
                    Approval Status: ${notif.user_details.approvalstatus}`}
              </pre>
            </li>
          ))
        ) : (
          <li>No notifications yet</li>
        )}
      </ul>
    </div>
  );
};

export default NotificationPage;
