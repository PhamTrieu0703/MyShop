import { protect } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/role.middleware";

router.post(
  '/products',
  protect,
  isAdmin,
  createProduct
)