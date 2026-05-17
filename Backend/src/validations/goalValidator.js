const { body } = require('express-validator');

exports.validateGoal = [
    body('title')
        .notEmpty().withMessage('Goal title is mandatory.')
        .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters.'),
    
    body('weightage')
        .isNumeric().withMessage('Weightage must be a number.')
        .custom((value) => {
            if (value < 10) throw new Error('Minimum weightage per goal is 10%.');
            if (value > 100) throw new Error('Weightage cannot exceed 100%.');
            return true;
        }),
    
    body('target')
        .notEmpty().withMessage('Target metric baseline is required.')
];