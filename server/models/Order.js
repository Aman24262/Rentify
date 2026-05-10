const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rentalDays: {
      type: Number,
      required: [true, "Rental duration is required"],
      min: [1, "Must rent for at least 1 day"],
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Returned", "Cancelled"],
      default: "Pending",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    message: {
      type: String,
      default: "",
    },
    deliveryName: {
      type: String,
      default: "",
    },
    deliveryAddress: {
      type: String,
      default: "",
    },
    contactNumber: {
      type: String,
      default: "",
    },
    paymentMethod: {
      type: String,
      default: "Cash on Delivery",
    },
  },
  { timestamps: true }
);

// Auto-calculate end date before saving
orderSchema.pre("save", function (next) {
  if (this.rentalDays) {
    const start = this.startDate || new Date();
    this.endDate = new Date(
      start.getTime() + this.rentalDays * 24 * 60 * 60 * 1000
    );
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
