// const mongoose = require('mongoose');

// const InvoiceItemSchema = new mongoose.Schema({
//   itemName: { type: String, required: true },
//   basePrice: { type: Number, required: true, default: 0 },
//   commission: { type: Number, required: true, default: 0 },
//   tax: { type: Number, required: true, default: 0 },
//   qty: { type: Number, required: true, default: 1 },
// });

// const InvoiceSchema = new mongoose.Schema({
//   invoiceNumber: { type: String, required: true, unique: true },
//   date: { type: Date, required: true, default: Date.now },
//   customerName: { type: String, required: true },
//   customerNumber: { type: String, required: true },
//   description: { type: String },
//   items: [InvoiceItemSchema],
//   subtotal: { type: Number, required: true, default: 0 },
//   totalCommission: { type: Number, required: true, default: 0 },
//   totalTax: { type: Number, required: true, default: 0 },
//   grandTotal: { type: Number, required: true, default: 0 },
// }, {
//   timestamps: true
// });



// module.exports = mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);


const mongoose = require('mongoose');

const InvoiceItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  basePrice: { type: Number, required: true, default: 0 },
  commission: { type: Number, required: true, default: 0 },
  tax: { type: Number, required: true, default: 0 }, // Tax in percentage
  quantity: { type: Number, required: true, default: 1 },
  subtotal: { type: Number, required: true, default: 0 },
  total:{type:String,required:true}
});

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  date: { type: Date, required: true, default: Date.now },
  customerName: { type: String, required: true },
  customerNumber: { type: String, required: true },
  description: { type: String },

  items: {
    type: [InvoiceItemSchema],
    validate: [(val) => val.length > 0, 'Invoice must have at least one item']
  },

 
  totalCommission: { type: Number, required: true, default: 0 },
  totalTax: { type: Number, required: true, default: 0 },
  grandTotal: { type: Number, required: true, default: 0 },

  status: {
    type: String,
    enum: ['Draft', 'Finalized', 'Paid'],
    default: 'Draft'
  },
  currency: {
    type: String,
    default: 'INR' // ₹ symbol refers to Indian Rupees
  }

}, {
  timestamps: true
});

module.exports = mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);

