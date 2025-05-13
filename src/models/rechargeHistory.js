const mongoose = require('mongoose');

const rechargeHistorySchema = new mongoose.Schema({
  agentId: {
    type: String,
    required: true
  },
  agentName: {
    type: String,
    required: true
  },
  dateTime: {
    type: Date,
    required: true
  },
  balanceBefore: {
    type: Number,
    required: true
  },
  rechargeAmount: {
    type: Number,
    required: true
  },
  balanceAfter: {
    type: Number,
    required: true
  }
});
delete mongoose.models.RechargeHistory
module.exports = mongoose.model('RechargeHistory', rechargeHistorySchema);