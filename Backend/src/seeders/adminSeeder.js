const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Department = require('../models/Department');
const Team = require('../models/Team');
const GoalCycle = require('../models/GoalCycle');

dotenv.config();

const runSeeder = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Purging local database tables...');
    await User.deleteMany();
    await Department.deleteMany();
    await Team.deleteMany();
    await GoalCycle.deleteMany();

    const engineering = await Department.create({ name: 'Engineering Services', code: 'ENG' });
    const cycles = await GoalCycle.create({
      name: 'FY 2026 Core Cycle Evaluation',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31')
    });

    const rootAdmin = await User.create({
      name: 'Root Workspace Admin',
      email: 'admin@goalsync.corp',
      password: 'SecureAdminPassword2026!',
      role: 'Admin',
      department: engineering._id
    });

    const standardManager = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah.j@goalsync.corp',
      password: 'ManagerPassword2026!',
      role: 'Manager',
      department: engineering._id
    });

    const coreTeam = await Team.create({
      name: 'Architecture & Scalability Unit',
      manager: standardManager._id,
      department: engineering._id
    });

    await User.create({
      name: 'Alex Rivera',
      email: 'alex.r@goalsync.corp',
      password: 'EmployeePassword2026!',
      role: 'Employee',
      department: engineering._id,
      team: coreTeam._id,
      manager: standardManager._id
    });

    console.log('Enterprise structural seed data generation executed successfully.');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding structural failure: ${error.message}`);
    process.exit(1);
  }
};

runSeeder();