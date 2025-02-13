const Guide = require("../models/Guide");
const User = require("../models/User");  // Pastikan model User ada di sini

// Get all guides
exports.getAllGuides = async (req, res) => {
  try {
    const guides = await Guide.find().populate("user"); // Menggunakan populate untuk mendapatkan data user
    res.status(200).json(guides);
  } catch (error) {
    res.status(500).json({ message: "Error fetching guides", error });
  }
};

// Get a guide by ID
exports.getGuideById = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id).populate("user"); // Menggunakan populate untuk mendapatkan data user
    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }
    res.status(200).json(guide);
  } catch (error) {
    res.status(500).json({ message: "Error fetching guide", error });
  }
};

// Create a new guide
exports.createGuide = async (req, res) => {
  const { customer, pemandu, pengalaman, kebiasaan, gender, alamat, harga, status_aktif } = req.body;

  try {
    if (!customer || !pemandu) {
      return res.status(400).json({ message: "Customer ID and Pemandu ID are required." });
    }

    // Validasi customer dan pemandu
    const foundCustomer = await User.findById(customer);
    const foundPemandu = await User.findById(pemandu);
    if (!foundCustomer || !foundPemandu) {
      return res.status(400).json({ message: "Invalid Customer ID or Pemandu ID." });
    }

    const newGuide = new Guide({
      customer,
      pemandu,
      pengalaman,
      kebiasaan,
      gender,
      alamat,
      harga,
      status_aktif,
    });

    await newGuide.save();
    res.status(201).json(newGuide);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating guide", error });
  }
};


// Update a guide
exports.updateGuide = async (req, res) => {
  const { user, pengalaman, kebiasaan, gender, alamat, harga, status_aktif } = req.body;

  try {
    const guide = await Guide.findById(req.params.id);
    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    guide.user = user || guide.user;
    guide.pengalaman = pengalaman || guide.pengalaman;
    guide.kebiasaan = kebiasaan || guide.kebiasaan;
    guide.gender = gender || guide.gender;
    guide.alamat = alamat || guide.alamat;
    guide.harga = harga || guide.harga;
    guide.status_aktif = status_aktif || guide.status_aktif;

    await guide.save();
    res.status(200).json(guide);
  } catch (error) {
    res.status(500).json({ message: "Error updating guide", error });
  }
};

// Delete a guide
exports.deleteGuide = async (req, res) => {
  try {
    const guide = await Guide.findByIdAndDelete(req.params.id);
    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }
    res.status(200).json({ message: "Guide deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting guide", error });
  }
};
