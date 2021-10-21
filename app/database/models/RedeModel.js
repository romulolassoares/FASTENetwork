const mongoose = require('mongoose')
const RedeSchema = new mongoose.Schema({
    nomeRede:{
        type: String,
        required: true
    },
    descricaoRede:{
        type: String,
        required: true
    },

    Org:{
        type: Object,
        required: true
    },
    nomeCanal:{
        type: String,
        required: true
    },
    Data_de_Criação:{
        type: Date,
        required: true,
        default: Date.now

    },
    isOnline: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('RedeDatabase', RedeSchema)