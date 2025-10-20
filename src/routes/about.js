import {Router} from "express"
import aboutDate from "../services/about.json" with {type: "json"}
var router = Router();

router.get('/', (_req, res) => {
  res.json(aboutDate);
});

export default router;
