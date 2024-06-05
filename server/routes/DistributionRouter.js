const express = require("express");
const router = express.Router();
const { authMiddleware, adminCheck } = require("../middleware/authMiddleware");

const {
  addDistribution,
  getDistributions,
  updateDistribution,
  deleteDistribution,
  getOneDistribution
} = require("../controllers/DistributionController");

router.post("/add", authMiddleware, addDistribution);
router.get("/", authMiddleware, getDistributions);
router.get("/:id", authMiddleware, getOneDistribution);
router.put("/:id", authMiddleware, updateDistribution);
router.delete("/:id", authMiddleware, deleteDistribution);

module.exports = router;
