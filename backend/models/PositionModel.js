const { model } = require('mongoose')
const { PositionSchema } = require('../schemas/PositionSchema');

const Position = new model('Position', PositionSchema);

module.exports = { Position};