const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    link: [{type: Types.ObjectId, ref: "Link"}],
    name: {type: String, required: true},
    id: {type: int, required: true, unique: true, allowNull: false, primaryKey: true, autoIncrement: true}
    
});

module.exports = model('User', schema) // если будет е, то напиши name: