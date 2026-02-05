import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import UserRepository from '@/repositories/UserRepository';
import { IUser, IUserCreate, ILoginCredentials, IAuthTokens } from '@/types/models';
import { generateTokens } from '@/lib/auth/jwt';
import { sanitizeEmail, sanitizeInput } from '@/lib/utils/sanitization';

/**
 * Authentication Service - Business Logic Layer
 */
export class AuthService {
    /**
     * Register new user
     */
    async signup(credentials: IUserCreate): Promise<{ user: IUser; tokens: IAuthTokens }> {
        // Sanitize inputs
        const email = sanitizeEmail(credentials.email);
        const name = sanitizeInput(credentials.name);

        // Check if user already exists
        const existingUser = await UserRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(credentials.password, 10);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Create user
        const user = await UserRepository.create({
            name,
            email,
            password: hashedPassword,
            verificationToken,
        });

        // Generate tokens
        const tokens = generateTokens(user);

        // TODO: Send verification email
        console.log('Verification token:', verificationToken);

        return { user, tokens };
    }

    /**
     * Login user
     */
    async login(credentials: ILoginCredentials): Promise<{ user: IUser; tokens: IAuthTokens }> {
        const email = sanitizeEmail(credentials.email);

        // Find user
        const user = await UserRepository.findByEmail(email);
        if (!user || !user.password) {
            throw new Error('Invalid email or password');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        // Generate tokens
        const tokens = generateTokens(user);

        // Remove password from response
        delete user.password;

        return { user, tokens };
    }

    /**
     * Verify email
     */
    async verifyEmail(token: string): Promise<IUser> {
        const user = await UserRepository.findByVerificationToken(token);
        if (!user) {
            throw new Error('Invalid or expired verification token');
        }

        await UserRepository.verifyEmail(user._id);

        const updatedUser = await UserRepository.findById(user._id);
        if (!updatedUser) {
            throw new Error('User not found');
        }

        return updatedUser;
    }

    /**
     * Request password reset
     */
    async requestPasswordReset(email: string): Promise<void> {
        const sanitizedEmail = sanitizeEmail(email);
        const user = await UserRepository.findByEmail(sanitizedEmail);

        if (!user) {
            // Don't reveal if user exists
            return;
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpiry = new Date(Date.now() + 3600000); // 1 hour

        await UserRepository.setResetToken(user._id, resetToken, resetExpiry);

        // TODO: Send reset email
        console.log('Reset token:', resetToken);
    }

    /**
     * Reset password
     */
    async resetPassword(token: string, newPassword: string): Promise<void> {
        const user = await UserRepository.findByResetToken(token);
        if (!user) {
            throw new Error('Invalid or expired reset token');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset token
        await UserRepository.updatePassword(user._id, hashedPassword);
        await UserRepository.clearResetToken(user._id);
    }

    /**
     * Change password (authenticated user)
     */
    async changePassword(
        userId: string,
        currentPassword: string,
        newPassword: string
    ): Promise<void> {
        const user = await UserRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const userWithPassword = await UserRepository.findByEmail(user.email);
        if (!userWithPassword || !userWithPassword.password) {
            throw new Error('User not found');
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, userWithPassword.password);
        if (!isPasswordValid) {
            throw new Error('Current password is incorrect');
        }

        // Hash and update new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await UserRepository.updatePassword(userId, hashedPassword);
    }

    /**
     * Google OAuth login/signup
     */
    async googleOAuth(profile: {
        id: string;
        email: string;
        name: string;
        picture?: string;
    }): Promise<{ user: IUser; tokens: IAuthTokens; isNewUser: boolean }> {
        // Check if user exists with OAuth ID
        let user = await UserRepository.findByOAuthId('google', profile.id);
        let isNewUser = false;

        if (!user) {
            // Check if user exists with email
            user = await UserRepository.findByEmail(profile.email);

            if (user) {
                // Link OAuth to existing account
                await UserRepository.update(user._id, {
                    oauthProvider: 'google',
                    oauthId: profile.id,
                });
            } else {
                // Create new user
                user = await UserRepository.create({
                    name: profile.name,
                    email: profile.email,
                    password: '', // No password for OAuth users
                    verified: true, // Auto-verify OAuth users
                    oauthProvider: 'google',
                    oauthId: profile.id,
                    avatar: profile.picture,
                } as any);
                isNewUser = true;
            }
        }

        const tokens = generateTokens(user);

        return { user, tokens, isNewUser };
    }
}

export default new AuthService();
