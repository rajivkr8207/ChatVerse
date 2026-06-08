import express from 'express';
const app = express();

app.get(/(.*)/, (req, res) => {
    res.send('catch all');
});

app.listen(3000, () => {
    console.log('Listening');
    process.exit(0);
});
