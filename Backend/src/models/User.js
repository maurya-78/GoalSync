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
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please provide a valid email']
    },
    password: { 
        type: String, 
        required: [true, 'Please provide a password'], 
        minlength: 6,
        select: false // Default query mein password hide rahega security ke liye
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
        ref: 'User' // Self-referencing (Employee ka manager kaun hai)
    },
    isActive: { 
        type: Boolean, 
        default: true 
    }
}, { 
    timestamps: true // createdAt aur updatedAt automatically handle karega
});

// PASSWORD ENCRYPTION: Save hone se pehle password hash karega
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// PASSWORD MATCHING: Login ke waqt check karne ke liye helper method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);