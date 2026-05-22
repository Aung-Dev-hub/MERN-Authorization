import { app } from "./app.js";

app.listen(process.env.PORT, ()=> {
    console.log(`Server is connected to ${process.env.PORT}`);
})