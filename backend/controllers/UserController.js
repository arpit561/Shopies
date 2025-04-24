const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const otpGenerator = require("otp-generator");
const Otp = require("../models/Otp");
require("dotenv").config();

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const checkUserPresnt = await User.findOne({ email });
    if (checkUserPresnt) {
      return res.status(401).json({
        success: false,
        message: "User already registered!",
      });
    }
    // generate otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("Otp: ", otp);
    // check unique otp or not
    const result = await Otp.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      const result = await Otp.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    const otpBody = await Otp.create(otpPayload);
    console.log(otpBody);

    return res.status(200).json({
      success: true,
      message: "Otp send successfully",
      otp,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.registerUser = async (req, res) => {
  try {
    const { name, phone, email, password, confirmPassword, role, otp } = req.body;

    if (!name || !email|| !phone || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists!" });
    }

    const recentOtp= await Otp.findOne({email}).sort({createdAt: -1}).limit(1);

    if(recentOtp.length === 0){
      return res.status(400).json({
        success: false,
        message: "Otp not found",
      })
    } else if(otp !== recentOtp.otp){
      return res.status(400).json({
        success: false,
        message: "Invalid Otp",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      phone,
      email,
      password: hashedPassword,
      role,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
    });

    await user.save();
    res
      .status(201)
      .json({ success: true, message: "User registered successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error registering user",
        error: error.message,
      });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if(!email || !password){
      return res.status(401).json({ 
          success: false, 
          message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials!" });
    }

    const matchedPassword = await bcrypt.compare(password, user.password);
    if (!matchedPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials!" });
    }

    const payload= {
      email: user.email,
      id: user._id,
      role: user.role,
    }

    const token = jwt.sign(
      payload,
      process.env.SECRET_KEY,
      { expiresIn: "2h" } 
    );
    user.token= token;
    user.password= undefined;

    // create cookie
    const options= {
      expires: new Date(Date.now()+ 3*24*60*60*1000),
      httpOnly: true,
    }
     res.cookie("token", token, options).status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user,
    })

    // return res.status(200).json({ success: true, token, user });
  } catch (error) {
    return res.status(500).json({
       success: false, 
       message: "Login Failure", 
       error: error.message 
      });
  }
};
