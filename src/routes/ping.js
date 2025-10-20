import {Router} from "express"
var router = Router();

router.get('/', (_req, res) => {
  res.status(200), res.send("");
});

export default router;
