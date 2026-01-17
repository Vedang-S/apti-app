import { app } from "./src/app.js";

let PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`SERVER IS LISTENING ON PORT ${PORT}`);
});
