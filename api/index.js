import express from 'express';

const app = express();

app.listen(3000, () => {
    console.log("Server is started on port: 3000")
})