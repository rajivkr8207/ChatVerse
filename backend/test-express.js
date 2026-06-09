import express from 'express';
const app = express();

app.get(/(.*)/, (req, res) => {
    res.send('catch all');
});

<<<<<<< HEAD
app.listen(8000, () => {
=======
app.listen(3000, () => {
>>>>>>> origin/main
    console.log('Listening');
    process.exit(0);
});
