const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            minLength: 2,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            minLength: 6,
            required: true
        }
    },
    {
        timestamps: true
    }
);

UsuarioSchema.pre('save', async function () {
    const usuario = this;

    if (!usuario.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(usuario.password, salt);
});

UsuarioSchema.methods.comprobarPassword = async function (passwordLogin) {
    return await bcrypt.compare(passwordLogin, this.password);
};

module.exports = mongoose.model('Usuario', UsuarioSchema);
