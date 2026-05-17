const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

    name: {

        type: String,

        required: [true, 'Please provide a name'],

        trim: true

    },

    email: {

        type: String,

        required: [true, 'Please provide an email'],

        unique: true,

        lowercase: true,

        trim: true,

        match: [

            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,

            'Please provide a valid email'

        ]

    },

    password: {

        type: String,

        required: [true, 'Please provide a password'],

        minlength: 6,

        select: false

    },

    role: {

        type: String,

        enum: ['Admin', 'Manager', 'Employee'],

        default: 'Employee'

    },

    department: {

        type: mongoose.Schema.Types.ObjectId,

        ref: 'Department'

    },

    team: {

        type: mongoose.Schema.Types.ObjectId,

        ref: 'Team'

    },

    manager: {

        type: mongoose.Schema.Types.ObjectId,

        ref: 'User'

    },

    isActive: {

        type: Boolean,

        default: true

    }

}, {

    timestamps: true

});

// ==========================================
// PASSWORD HASHING
// ==========================================

userSchema.pre(

    'save',

    async function (next) {

        try {

            // ==================================
            // AGAR PASSWORD CHANGE NAHI HUA
            // ==================================

            if (!this.isModified('password')) {

                return next();

            }

            // ==================================
            // GENERATE SALT
            // ==================================

            const salt = await bcrypt.genSalt(10);

            // ==================================
            // HASH PASSWORD
            // ==================================

            this.password = await bcrypt.hash(

                this.password,

                salt

            );

            next();

        } catch (error) {

            next(error);

        }

    }

);

// ==========================================
// PASSWORD MATCHING
// ==========================================

userSchema.methods.matchPassword = async function (

    enteredPassword

) {

    return await bcrypt.compare(

        enteredPassword,

        this.password

    );

};

// ==========================================
// EXPORT MODEL
// ==========================================

module.exports = mongoose.model(

    'User',

    userSchema

);