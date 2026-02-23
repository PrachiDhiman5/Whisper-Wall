import express from 'express';
import authMiddleware from "../auth/auth.middleware.js";
import {
    createConfession,
    getAllConfessions,
    getMyConfessions,
    addReaction,
    deleteConfession,
    getUserStats,
    updateConfession
} from '../controllers/confession.controller.js';

const router = express.Router();

router.get('/', getAllConfessions);
router.post('/', authMiddleware, createConfession);
router.get('/my', authMiddleware, getMyConfessions);
router.get('/stats', authMiddleware, getUserStats);
router.patch('/:id/react', addReaction);
router.put('/:id', authMiddleware, updateConfession);
router.delete('/:id', authMiddleware, deleteConfession);

export default router;