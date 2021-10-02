import express from 'express';

type BoostrapOptions = {
    port: number;
}

function boostrap({ port }: BoostrapOptions) {
    const app = express();

    app.listen(port, () => {
        console.log(`Listening on port: ${port}`);
    });
}

export default boostrap;