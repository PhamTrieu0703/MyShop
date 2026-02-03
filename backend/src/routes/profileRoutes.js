import { getUserById,addDataProfile,putProfile} from '../controllers/profileController.js';
import express from 'express';

const router = express.Router();

router.get('/:id',getUserById);
router.post('/:id',addDataProfile)
router.put('/:id',putProfile)


export default router;