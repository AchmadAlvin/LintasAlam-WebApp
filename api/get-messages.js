const messageService = require("../services/messageService");

async function getMessages(req, res) {
  try {
    // Parse query parameters
    const { startDate, endDate, studentName } = req.query;

    let result;

    // Pilih metode service yang sesuai berdasarkan parameter
    if (startDate && endDate) {
      result = await messageService.getMessagesByDate(startDate, endDate);
    } else if (studentName) {
      result = await messageService.getMessagesByStudent(studentName);
    } else {
      result = await messageService.getMessages();
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getMessages controller:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data: " + error.message,
    });
  }
}

module.exports = getMessages;
