const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      trim: true,
      unique: [true, "User email must be unique"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "User password is required"],
      trim: true,
    },
    passwordChangeAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    profileImg: String,
    phone: String,
    role: {
      type: String,
      enum: ["user", "admin", "manager"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// 2- mongoose middleware
userSchema.post('init', (doc) => {
  if (doc.profileImg) {
    const imageURL = `${process.env.BASE_URL}/users/${doc.profileImg}`;
    doc.profileImg = imageURL;
  }
});

userSchema.post('save', (doc) => {
  if (doc.profileImg) {
    const imageURL = `${process.env.BASE_URL}/users/${doc.profileImg}`;
    doc.profileImg = imageURL;
  }
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
})

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;