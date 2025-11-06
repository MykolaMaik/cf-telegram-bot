import express, { Request, Response } from 'express';
import User from '../../models/User';
import { IUserDocument } from '../../types/user.types';
import { CreateUserRequest, APIResponse } from '../../types/express.types';

const router = express.Router();

router.post('/', async (req: CreateUserRequest, res: Response<APIResponse<IUserDocument>>) => {
  try {
    const { username, firstName, lastName } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Username is required'
      });
    }

    const normalizedUsername = username.replace(/^@/, '').toLowerCase().trim();

    if (!normalizedUsername) {
      return res.status(400).json({
        success: false,
        error: 'Username cannot be empty'
      });
    }

    const existingUser = await User.findOne({ username: normalizedUsername });
    if (existingUser) {
      if (firstName !== undefined) {
        existingUser.firstName = firstName;
      }
      if (lastName !== undefined) {
        existingUser.lastName = lastName || '';
      }
      existingUser.isActive = true;
      await existingUser.save();

      return res.status(200).json({
        success: true,
        message: 'User updated',
        user: existingUser
      });
    }

    const user = new User({
      username: normalizedUsername,
      firstName: firstName || '',
      lastName: lastName || '',
      isActive: true
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: 'User successfully added',
      user: user
    });
  } catch (error) {
    console.error('Error adding user:', error);
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'User with this username already exists'
      });
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

router.get('/', async (_req: Request, res: Response<APIResponse<IUserDocument[]>>) => {
  try {
    const users = await User.find({ isActive: true }).sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    console.error('Error getting users:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

router.get('/:identifier', async (req: Request, res: Response<APIResponse<IUserDocument>>) => {
  try {
    const identifier = req.params.identifier || '';
    
    const telegramId = parseInt(identifier);
    let user: IUserDocument | null = null;
    
    if (!isNaN(telegramId)) {
      user = await User.findOne({ 
        telegramId: telegramId,
        isActive: true 
      });
    }
    
    if (!user && identifier) {
      const normalizedUsername = identifier.toLowerCase().trim().replace(/^@/, '');
      user = await User.findOne({ 
        username: normalizedUsername,
        isActive: true 
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error('Error getting user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

router.delete('/:identifier', async (req: Request, res: Response<APIResponse<IUserDocument>>) => {
  try {
    const identifier = req.params.identifier || '';
    
    const telegramId = parseInt(identifier);
    let user: IUserDocument | null = null;
    
    if (!isNaN(telegramId)) {
      user = await User.findOne({ telegramId: telegramId });
    }
    
    if (!user) {
      const normalizedUsername = identifier.toLowerCase().trim().replace(/^@/, '');
      user = await User.findOne({ username: normalizedUsername });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    user.isActive = false;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'User deactivated',
      user: user
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

export default router;