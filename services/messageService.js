const { getCollection, collections } = require("../config/database");

class MessageService {
  async saveMessage(messageData) {
    try {
      const collection = await getCollection(collections.messages);

      const data = {
        ...messageData,
        status: messageData.status || "Hadir",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.insertOne(data);

      if (!result.acknowledged) {
        throw new Error("Gagal menyimpan pesan");
      }

      return {
        status: "success",
        data: { ...data, _id: result.insertedId },
        message: "Pesan berhasil disimpan",
      };
    } catch (error) {
      console.error("Error in saveMessage service:", error);
      throw error;
    }
  }

  async getMessages(query = {}) {
    try {
      const collection = await getCollection(collections.messages);

      const messages = await collection
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();

      return {
        status: "success",
        data: messages,
        count: messages.length,
        message: "Data berhasil diambil",
      };
    } catch (error) {
      console.error("Error in getMessages service:", error);
      throw error;
    }
  }

  async getMessagesByDate(startDate, endDate) {
    try {
      const collection = await getCollection(collections.messages);

      const query = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };

      const messages = await collection
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();

      return {
        status: "success",
        data: messages,
        count: messages.length,
        message: "Data berhasil diambil",
      };
    } catch (error) {
      console.error("Error in getMessagesByDate service:", error);
      throw error;
    }
  }

  async getMessagesByStudent(studentName) {
    try {
      const collection = await getCollection(collections.messages);

      const messages = await collection
        .find({ name: studentName })
        .sort({ createdAt: -1 })
        .toArray();

      return {
        status: "success",
        data: messages,
        count: messages.length,
        message: "Data berhasil diambil",
      };
    } catch (error) {
      console.error("Error in getMessagesByStudent service:", error);
      throw error;
    }
  }
}

module.exports = new MessageService();
