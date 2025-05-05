const messageService = require("../services/messageService");
const { validateRequest } = require("../middleware/errorHandler");
const Joi = require("joi");

// Schema validasi untuk message
const messageSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Nama tidak boleh kosong",
    "any.required": "Nama harus diisi",
  }),
  timestamp: Joi.string().required().messages({
    "string.empty": "Timestamp tidak boleh kosong",
    "any.required": "Timestamp harus diisi",
  }),
  status: Joi.string().default("Hadir"),
  course: Joi.string().allow("").default("Tidak ada jadwal"),
});

async function saveMessage(req, res) {
  try {
    // Validasi request body menggunakan Joi
    const { error, value } = messageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "error",
        message: "Validasi gagal",
        errors: error.details.map((detail) => detail.message),
      });
    }

    // Gunakan service untuk menyimpan pesan
    const result = await messageService.saveMessage(value);

    // Kirim response
    res.status(201).json(result);
  } catch (error) {
    console.error("Error in saveMessage controller:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal menyimpan pesan: " + error.message,
    });
  }
}

module.exports = saveMessage;
