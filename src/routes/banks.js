import express from 'express';
import { validateToken } from '../middleware/authenticate';
import { BankController } from '../controllers/bankController';

const router = express.Router();

// get list of banks
router.get('/', validateToken, BankController.getBanks);

export default router;
