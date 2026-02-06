import User from '@/models/User';
import { IUser, IUserCreate, IUserUpdate } from '@/types/models';
import connectDB from '@/lib/db/mongoose';

/**
 * User Repository - Data Access Layer
 */
export class UserRepository {
    /**
     * Find user by ID
     */
    async findById(id: string): Promise<IUser | null> {
        await connectDB();
        const user = await User.findById(id);
        return user ? (user.toJSON() as IUser) : null;
    }

    /**
     * Find user by email
     */
    async findByEmail(email: string): Promise<IUser | null> {
        await connectDB();
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password').lean();
        if (!user) return null;

        // Convert _id to string manually since we're using lean()
        // lean() returns plain JS object and doesn't call toJSON() which strips password
        return {
            ...user,
            _id: user._id.toString(),
        } as IUser;
    }

    /**
     * Find user by verification token
     */
    async findByVerificationToken(token: string): Promise<IUser | null> {
        await connectDB();
        const user = await User.findOne({ verificationToken: token }).select('+verificationToken');
        return user ? (user.toJSON() as IUser) : null;
    }

    /**
     * Find user by reset password token
     */
    async findByResetToken(token: string): Promise<IUser | null> {
        await connectDB();
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiry: { $gt: new Date() },
        }).select('+resetPasswordToken +resetPasswordExpiry');
        return user ? (user.toJSON() as IUser) : null;
    }

    /**
     * Create new user
     */
    async create(userData: IUserCreate & { verificationToken?: string }): Promise<IUser> {
        await connectDB();
        const user = await User.create(userData);
        return user.toJSON() as IUser;
    }

    /**
     * Update user
     */
    async update(id: string, updates: IUserUpdate): Promise<IUser | null> {
        await connectDB();
        const user = await User.findByIdAndUpdate(id, updates, { new: true });
        return user ? (user.toJSON() as IUser) : null;
    }

    /**
     * Update password
     */
    async updatePassword(id: string, hashedPassword: string): Promise<boolean> {
        await connectDB();
        const result = await User.findByIdAndUpdate(id, { password: hashedPassword });
        return !!result;
    }

    /**
     * Verify user email
     */
    async verifyEmail(id: string): Promise<boolean> {
        await connectDB();
        const result = await User.findByIdAndUpdate(id, {
            verified: true,
            verificationToken: undefined,
        });
        return !!result;
    }

    /**
     * Set reset password token
     */
    async setResetToken(id: string, token: string, expiry: Date): Promise<boolean> {
        await connectDB();
        const result = await User.findByIdAndUpdate(id, {
            resetPasswordToken: token,
            resetPasswordExpiry: expiry,
        });
        return !!result;
    }

    /**
     * Clear reset password token
     */
    async clearResetToken(id: string): Promise<boolean> {
        await connectDB();
        const result = await User.findByIdAndUpdate(id, {
            resetPasswordToken: undefined,
            resetPasswordExpiry: undefined,
        });
        return !!result;
    }

    /**
     * Delete user
     */
    async delete(id: string): Promise<boolean> {
        await connectDB();
        const result = await User.findByIdAndDelete(id);
        return !!result;
    }

    /**
     * Get all users (admin only)
     */
    async findAll(page: number = 1, limit: number = 20): Promise<{
        users: IUser[];
        total: number;
    }> {
        await connectDB();
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            User.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
            User.countDocuments(),
        ]);
        return {
            users: users.map((u) => u.toJSON() as IUser),
            total,
        };
    }

    /**
     * Find user by OAuth ID
     */
    async findByOAuthId(provider: string, oauthId: string): Promise<IUser | null> {
        await connectDB();
        const user = await User.findOne({ oauthProvider: provider, oauthId });
        return user ? (user.toJSON() as IUser) : null;
    }
}

export default new UserRepository();
