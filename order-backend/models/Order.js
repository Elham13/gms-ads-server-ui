const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    executive: String,
    business: String,
    contactPerson: String,
    contactCode: String,
    phone: String,
    orderNo: {
      type: String,
      unique: true, // ensure no duplicate orderNo
      required: true,
    },
    orderDate: String,
    target: String,
    clientType: String,
    rows: [
      {
        requirement: String,
        quantity: Number,
        rate: Number,
        total: Number,
        deliveryDate: String,
        isCompleted: {
          type: Boolean,
          default: false, // helpful for service tracking
        },
      },
    ],
    advance: Number,
    balance: Number,
    advanceDate: String,
    paymentDate: String,
    paymentMethod: String,
    chequeNumber: String,
  },
  {
    timestamps: true, // this adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Order', orderSchema);
