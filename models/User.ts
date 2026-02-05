import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from '@/types/models';
import { UserRole } from '@/types/enums';

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        password: {
            type: String,
            select: false, // Don't return password by default
        },
        avatar: {
            type: String,
            default: null,
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.USER,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
            select: false,
        },
        resetPasswordToken: {
            type: String,
            select: false,
        },
        resetPasswordExpiry: {
            type: Date,
            select: false,
        },
        oauthProvider: {
            type: String,
            enum: ['google', 'local'],
            default: 'local',
        },
        oauthId: {
            type: String,
            sparse: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: function (doc, ret) {
                ret._id = ret._id.toString();
                delete ret.__v;
                delete ret.password;
                delete ret.verificationToken;
                delete ret.resetPasswordToken;
                delete ret.resetPasswordExpiry;
                return ret;
            },
        },
    }
);

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ verificationToken: 1 });
UserSchema.index({ resetPasswordToken: 1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
