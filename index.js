const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

const dataStore = {};
const hashKey = (key) => {
    return crypto.createHash('sha256').update(key).digest();
}
const encrypt = (text, key) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-ctr', hashKey(key), iv);
    let crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

const decrypt = (text, key) => {
    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-ctr', hashKey(key), iv);
        let dec = decipher.update(text, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    } catch (err) {
        console.error('Decryption Failed', err);
        return null;
    }
}

app.post('/store', (req, res) => {
    const {id, key, value} = req.body;
    if (!id || !key || !value) {
        return res.status(400).send('Missing required fields');
    }

    const encryptedValue = encrypt(JSON.stringify(value), key);
    dataStore[id] = encryptedValue;

    res.send({message : 'Data Stored Successfully'});
});

app.get('/retrieve', (req, res) => {
    const {id, key} = req.query
    if (!id || !key) {
        return res.status(400).send('Missing required fields');
    }

    const result = [];
    const keys = id === '*' ? Object.keys(dataStore) : [id];

    keys.forEach(key => {
        if (dataStore[key]) {
            const decryptedValue = decrypt(dataStore[key], key);
            if (decryptedValue) {
                result.push({id: key, value: JSON.parse(decryptedValue)});
            }
        }
    })

    res.send(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})