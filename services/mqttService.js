const mqtt = require("mqtt");
const messageService = require("./messageService");

class MQTTService {
  constructor() {
    this.client = null;
    this.topics = {
      detectedPerson: "lintas_alam/detected_person",
      datasetNames: "lintas_alam/dataset_names",
      door: "lintas_alam/door",
      lamp: "lintas_alam/lampu",
      oled: "lintas_alam/oled",
    };
  }

  connect() {
    try {
      this.client = mqtt.connect("wss://broker.emqx.io:8084/mqtt");

      this.client.on("connect", () => {
        console.log("Terhubung ke MQTT Broker");
        // Subscribe ke semua topic yang diperlukan
        Object.values(this.topics).forEach((topic) => {
          this.client.subscribe(topic);
          console.log(`Subscribed to ${topic}`);
        });
      });

      this.client.on("message", this.handleMessage.bind(this));

      this.client.on("error", (error) => {
        console.error("MQTT Error:", error);
      });

      this.client.on("close", () => {
        console.log("Koneksi MQTT tertutup");
      });
    } catch (error) {
      console.error("Error connecting to MQTT:", error);
      throw error;
    }
  }

  async handleMessage(topic, message) {
    try {
      const payload = JSON.parse(message.toString());
      console.log(`Pesan diterima dari topic ${topic}:`, payload);

      switch (topic) {
        case this.topics.detectedPerson:
          await this.handleDetectedPerson(payload);
          break;
        case this.topics.datasetNames:
          await this.handleDatasetNames(payload);
          break;
        default:
          console.log(`Tidak ada handler untuk topic: ${topic}`);
      }
    } catch (error) {
      console.error(`Error handling message from ${topic}:`, error);
    }
  }

  async handleDetectedPerson(data) {
    try {
      if (!data.name) {
        throw new Error("Data nama tidak ditemukan");
      }

      const messageData = {
        name: data.name,
        timestamp: new Date().toISOString(),
        course: data.course || "Tidak ada jadwal",
        status: "Hadir",
      };

      await messageService.saveMessage(messageData);
      console.log("Data absensi berhasil disimpan:", messageData);
    } catch (error) {
      console.error("Error handling detected person:", error);
    }
  }

  async handleDatasetNames(data) {
    try {
      if (!Array.isArray(data.names)) {
        throw new Error("Format data nama tidak valid");
      }

      console.log("Dataset names received:", data.names);
      // Implementasi penyimpanan dataset names jika diperlukan
    } catch (error) {
      console.error("Error handling dataset names:", error);
    }
  }

  publishMessage(topic, message) {
    if (!this.client || !this.client.connected) {
      throw new Error("MQTT client tidak terhubung");
    }

    return new Promise((resolve, reject) => {
      this.client.publish(topic, JSON.stringify(message), (error) => {
        if (error) {
          console.error("Error publishing message:", error);
          reject(error);
        } else {
          console.log(`Message published to ${topic}:`, message);
          resolve();
        }
      });
    });
  }

  disconnect() {
    if (this.client) {
      this.client.end();
      console.log("Disconnected from MQTT broker");
    }
  }
}

// Export singleton instance
module.exports = new MQTTService();
