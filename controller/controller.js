const User = require('../models/userModel');
const Slot = require('../models/slotModel');
const jwt = require('jsonwebtoken')

// Register a new user
exports.register = async (req, res) => {
    try {
        const { name, phoneNumber, age, pincode, aadharNo, password } = req.body;
    
        // Check if a user with the provided phone number already exists
        const existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
          return res.status(400).json({ message: 'User with this phone number already exists.' });
        }
    
        // Create a new user
        const user = new User({ name, phoneNumber, age, pincode, aadharNo, password });
        await user.save();
    
        res.status(201).json({ message: 'User registered successfully.', data:user });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
};

// Log in a user
exports.login = async (req, res) => {
    try {
        const data = req.body;
        let { phoneNumber, password } = data;
        if (Object.keys(data).length != 0) {
            if(!phoneNumber){
                return res.status(400).send({ status: false, message: "Phone Number is mandatory and can not be empty." });

            }
            if (password && typeof password != "string") {
                return res.status(400).send({ status: false, message: "password must be in string" });
            }
            if (!password || !password.trim()) {
                return res.status(400).send({ status: false, message: "Password is mandatory and can not be empty." });
            }

            const userData = await User.findOne({ phoneNumber: phoneNumber, password: password });
            if (!userData) {
                return res.status(404).send({ status: false, message: "No such user exist. Please Enter a valid Email and Passowrd." });
            }

            let token = jwt.sign({
                userId: userData._id.toString(),
                exp: Math.floor(Date.now() / 1000) + (120 * 60),
                iat: Math.floor(Date.now())
            }, 'vaccine');

            res.setHeader("x-api-key", token);
            res.status(200).send({ status: true, message: "Successfully Login.", data: { "token": token } });
        } else {
            return res.status(400).send({ status: false, message: "Body can not be empty" });
        }
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};



// View available slots
exports.getAvailableSlots = async (req, res) => {
  try {
    const slots = await Slot.find({ ...req.query });
    if (slots.length == 0) {
        return res.status(404).json({ status: false, message: 'No slots found' });
    }
    res.status(200).json({ status: true, message: 'slots', data: slots });
  } catch (error) {
    
    res.status(500).json({ message: error.message});
  }
};


// Register for a slot
exports.registerSlot = async (req, res) => {
    try{
        let { date, time, dose, registeredUsers} = req.body
        if(!date){
            res.status(404).send({status:false, message:"Please provide a date"})
        }
        if(!time){
            res.status(404).send({status:false, message:"Please provide a proper timimg"})
        }
        if(!dose){
            res.status(404).send({status:false, message:"Please provide a dose"})
        }
        const user = await User.findOne({ _id: registeredUsers });
        if(!user){
            res.status(404).send({status:false, message:"user not found"})
        }
        const slot = await Slot.create(req.body)
        res.status(200).send({status:true, message:"slot added successfully",data:slot})
    }catch(error){
        res.status(500).send({status:false, message:error.message })
    }
};

// Update/change a registered slot
exports.updateSlot = async (req, res) => {
    let slotID = req.params.slotId;
    let data = req.body
    const {date, time, dose} = data
    if (Object.keys(data).length != 0) {

        if (!date && !time && !dose) {
            return res.status(400).send({ status: false, message: "At least one field is required." });
        }
        let updateData = {};

        const checkDate = await Slot.findOne({ date: date });
        if (checkDate) {
            return res.status(400).send({ status: false, message: `The date ${date} is already is in use for a slot.Try another one.` });
        }
        updateData.date = date;
        

        if (time) {
            const checkTime = await Slot.findOne({ time: time})
            if (checkTime) {
                return res.status(400).send({ status: false, message: `The time ${time} is already is in use for a slot.Try another one.` });
            }
            updateData.time = time;
        }


        if (dose) {
            const checkDose = await Slot.findOne({ dose: dose})
            if (checkDose) {
                return res.status(400).send({ status: false, message: `The Dose ${dose} is already is in use for a slot.Try another one.` });
            }
            updateData.dose = dose;
        }

        const updateSlot = await Slot.findOneAndUpdate(
            { _id: slotID },
            updateData,
            { new: true }
        );

        if (!updateSlot) {
            return res.status(404).send({ status: false, message: "No data found for updation." });
        }

        return res.status(200).send({ status: true, message: "Success", data: updateSlot });
    } else {
        return res.status(400).send({ status: false, message: "Invalid" })
    }
};
