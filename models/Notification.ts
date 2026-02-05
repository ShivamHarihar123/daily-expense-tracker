import mongoose, { Schema, Model } from 'mongoose';
import { INotification } from '@/types/models';
import { NotificationType } from '@/types/enums';

const NotificationSchema = new Schema<INotification>(
    {
        userId: {
            type: String,
            required: [true, 'User ID is required'],
            index: true,
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
            maxlength: [1000, 'Message cannot exceed 1000 characters'],
        },
        type: {
            type: String,
            enum: Object.values(NotificationType),
            required: [true, 'Notification type is required'],
        },
        readStatus: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: function (doc, ret) {
                ret._id = ret._id.toString();
                delete ret.__v;
                return ret;
            },
        },
    }
);

// Compound indexes for efficient queries
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, readStatus: 1 });

const Notification: Model<INotification> =
    mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
