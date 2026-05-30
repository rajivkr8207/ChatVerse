import UserModel from '../models/user.model.js';
import ChatModel from '../models/chat.model.js';
import MessageModel from '../models/message.model.js';

// ─── Helper: render with layout ─────────────────────────────────────────────
function renderWithLayout(res, view, locals = {}) {
    res.render(view, {
        layout: 'layouts/main-layout',
        ...locals,
    });
}

// ─── Helper: build last-N-days chart labels ──────────────────────────────────
function buildDayLabels(days) {
    return Array.from({ length: days }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (days - 1 - i));
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
export const getDashboard = async (req, res) => {
    try {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

        const [
            totalUsers, activeUsers, bannedUsers, verifiedUsers,
            totalChats, totalMessages, recentUsers,
            usersThisMonth, usersLastMonth,
            chatsThisMonth, chatsLastMonth,
            msgsThisMonth, msgsLastMonth,
        ] = await Promise.all([
            UserModel.countDocuments(),
            UserModel.countDocuments({ isBlocked: false }),
            UserModel.countDocuments({ isBlocked: true }),
            UserModel.countDocuments({ isVerified: true }),
            ChatModel.countDocuments(),
            MessageModel.countDocuments(),
            UserModel.find().sort({ createdAt: -1 }).limit(5).lean(),
            UserModel.countDocuments({ createdAt: { $gte: startOfMonth } }),
            UserModel.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
            ChatModel.countDocuments({ createdAt: { $gte: startOfMonth } }),
            ChatModel.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
            MessageModel.countDocuments({ createdAt: { $gte: startOfMonth } }),
            MessageModel.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
        ]);

        // Percentage change helpers
        const pct = (curr, prev) => prev === 0 ? 100 : Math.round(((curr - prev) / prev) * 100);

        // Build 30-day user growth chart data
        const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
        const userGrowthRaw = await UserModel.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
        ]);

        const labels30 = buildDayLabels(30);
        const rawMap = {};
        userGrowthRaw.forEach(d => { rawMap[d._id] = d.count; });
        const growth30 = labels30.map((_, i) => {
            const key = new Date(); key.setDate(key.getDate() - (29 - i));
            return rawMap[key.toISOString().slice(0, 10)] || 0;
        });

        // Build 14-day messages chart
        const fourteenDaysAgo = new Date(); fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);
        const msgsRaw = await MessageModel.aggregate([
            { $match: { createdAt: { $gte: fourteenDaysAgo } } },
            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
        ]);

        const labels14 = buildDayLabels(14);
        const msgsMap = {};
        msgsRaw.forEach(d => { msgsMap[d._id] = d.count; });
        const msgs14 = labels14.map((_, i) => {
            const key = new Date(); key.setDate(key.getDate() - (13 - i));
            return msgsMap[key.toISOString().slice(0, 10)] || 0;
        });

        const activeToday = await UserModel.countDocuments({ createdAt: { $gte: startOfToday } });

        renderWithLayout(res, 'dashboard/index', {
            pageTitle: 'Dashboard',
            breadcrumb: [],
            stats: {
                totalUsers, activeUsers, bannedUsers, verifiedUsers,
                unverifiedUsers: totalUsers - verifiedUsers,
                totalChats, totalMessages,
                activeToday,
                userChange:        pct(usersThisMonth, usersLastMonth),
                activeTodayChange: 0,
                chatChange:        pct(chatsThisMonth, chatsLastMonth),
                messageChange:     pct(msgsThisMonth, msgsLastMonth),
            },
            recentUsers,
            chartData: {
                userGrowth:     { labels: labels30, data: growth30 },
                messagesPerDay: { labels: labels14, data: msgs14 },
                userStatus:     { data: [activeUsers, bannedUsers, totalUsers - verifiedUsers] },
            },
        });
    } catch (err) {
        console.error('[Admin] getDashboard error:', err);
        res.status(500).render('error/500', { error: err, message: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// USERS LIST
// ─────────────────────────────────────────────────────────────────────────────
export const getUsers = async (req, res) => {
    try {
        const { search = '', isBlocked, isVerified, provider, sortBy = '-createdAt', page = 1 } = req.query;
        const limit = 15;
        const skip = (parseInt(page) - 1) * limit;

        const query = {};
        if (search)     { query.$or = [{ fullName: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }, { username: { $regex: search, $options: 'i' } }]; }
        if (isBlocked !== undefined && isBlocked !== '')  query.isBlocked  = isBlocked  === 'true';
        if (isVerified !== undefined && isVerified !== '') query.isVerified = isVerified === 'true';
        if (provider)   query.provider = provider;

        const [users, total] = await Promise.all([
            UserModel.find(query).sort(sortBy).skip(skip).limit(limit).lean(),
            UserModel.countDocuments(query),
        ]);

        renderWithLayout(res, 'users/index', {
            pageTitle: 'User Management',
            breadcrumb: [{ label: 'Users', href: '/admin/users' }],
            users,
            filters: { search, isBlocked, isVerified, provider, sortBy },
            pagination: { currentPage: parseInt(page), totalPages: Math.ceil(total / limit), total },
        });
    } catch (err) {
        console.error('[Admin] getUsers error:', err);
        res.status(500).render('error/500', { error: err, message: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// USER DETAILS
// ─────────────────────────────────────────────────────────────────────────────
export const getUserDetails = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id).lean();
        if (!user) return res.status(404).render('error/404', { message: 'User not found' });

        const [totalChats, totalMessages, lastMsg, recentChats] = await Promise.all([
            ChatModel.countDocuments({ user: user._id }),
            MessageModel.countDocuments({ user: user._id }),
            MessageModel.findOne({ user: user._id }).sort({ createdAt: -1 }).lean(),
            ChatModel.find({ user: user._id }).sort({ createdAt: -1 }).limit(5).lean(),
        ]);

        renderWithLayout(res, 'users/details', {
            pageTitle: user.fullName || 'User Details',
            breadcrumb: [
                { label: 'Users',  href: '/admin/users' },
                { label: user.fullName || 'Detail', href: `/admin/users/${user._id}` },
            ],
            user,
            recentChats,
            userStats: { totalChats, totalMessages, lastActive: lastMsg?.createdAt || null },
        });
    } catch (err) {
        console.error('[Admin] getUserDetails error:', err);
        res.status(500).render('error/500', { error: err, message: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// USER EDIT – GET
// ─────────────────────────────────────────────────────────────────────────────
export const getEditUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id).lean();
        if (!user) return res.status(404).render('error/404', { message: 'User not found' });

        renderWithLayout(res, 'users/edit', {
            pageTitle: `Edit – ${user.fullName}`,
            breadcrumb: [
                { label: 'Users',  href: '/admin/users' },
                { label: user.fullName || 'User', href: `/admin/users/${user._id}` },
                { label: 'Edit',   href: `/admin/users/${user._id}/edit` },
            ],
            user,
        });
    } catch (err) {
        res.status(500).render('error/500', { error: err, message: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// USER EDIT – POST
// ─────────────────────────────────────────────────────────────────────────────
export const postEditUser = async (req, res) => {
    try {
        const { fullName, username, isVerified, isBlocked } = req.body;
        await UserModel.findByIdAndUpdate(req.params.id, {
            fullName,
            username: username || undefined,
            isVerified: isVerified === 'true' || isVerified === 'on' || isVerified === true,
            isBlocked:  isBlocked  === 'true' || isBlocked  === 'on' || isBlocked  === true,
        });
        res.redirect(`/admin/users/${req.params.id}?success=User+updated+successfully`);
    } catch (err) {
        res.status(500).render('error/500', { error: err, message: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// BAN / UNBAN / VERIFY / DELETE
// ─────────────────────────────────────────────────────────────────────────────
export const banUser = async (req, res) => {
    try {
        await UserModel.findByIdAndUpdate(req.params.id, { isBlocked: true });
        const ref = req.headers.referer || '/admin/users';
        res.redirect(ref);
    } catch (err) {
        res.status(500).render('error/500', { error: err, message: err.message });
    }
};

export const unbanUser = async (req, res) => {
    try {
        await UserModel.findByIdAndUpdate(req.params.id, { isBlocked: false });
        const ref = req.headers.referer || '/admin/users';
        res.redirect(ref);
    } catch (err) {
        res.status(500).render('error/500', { error: err, message: err.message });
    }
};

export const verifyUser = async (req, res) => {
    try {
        await UserModel.findByIdAndUpdate(req.params.id, { isVerified: true, verificationToken: null, verificationTokenExpire: null });
        const ref = req.headers.referer || '/admin/users';
        res.redirect(ref);
    } catch (err) {
        res.status(500).render('error/500', { error: err, message: err.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        await Promise.all([
            UserModel.findByIdAndDelete(userId),
            ChatModel.deleteMany({ user: userId }),
            MessageModel.deleteMany({ user: userId }),
        ]);
        res.redirect('/admin/users?success=User+deleted+successfully');
    } catch (err) {
        res.status(500).render('error/500', { error: err, message: err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS / REPORTS
// ─────────────────────────────────────────────────────────────────────────────
export const getAnalytics = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
        const fourteenDaysAgo = new Date(); fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);

        const [
            totalUsers, activeUsers, bannedUsers, verifiedUsers,
            googleUsers, emailUsers, totalChats, totalMessages,
            userGrowthRaw, msgsRaw,
        ] = await Promise.all([
            UserModel.countDocuments(),
            UserModel.countDocuments({ isBlocked: false }),
            UserModel.countDocuments({ isBlocked: true }),
            UserModel.countDocuments({ isVerified: true }),
            UserModel.countDocuments({ provider: 'google' }),
            UserModel.countDocuments({ provider: 'email' }),
            ChatModel.countDocuments(),
            MessageModel.countDocuments(),
            UserModel.aggregate([
                { $match: { createdAt: { $gte: thirtyDaysAgo } } },
                { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
                { $sort: { _id: 1 } },
            ]),
            MessageModel.aggregate([
                { $match: { createdAt: { $gte: fourteenDaysAgo } } },
                { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
                { $sort: { _id: 1 } },
            ]),
        ]);

        function buildDayLabels(days) {
            return Array.from({ length: days }, (_, i) => {
                const d = new Date(); d.setDate(d.getDate() - (days - 1 - i));
                return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
            });
        }

        const labels30 = buildDayLabels(30);
        const rawMap = {}; userGrowthRaw.forEach(d => { rawMap[d._id] = d.count; });
        const growth30 = labels30.map((_, i) => {
            const key = new Date(); key.setDate(key.getDate() - (29 - i));
            return rawMap[key.toISOString().slice(0, 10)] || 0;
        });

        const labels14 = buildDayLabels(14);
        const msgsMap = {}; msgsRaw.forEach(d => { msgsMap[d._id] = d.count; });
        const msgs14 = labels14.map((_, i) => {
            const key = new Date(); key.setDate(key.getDate() - (13 - i));
            return msgsMap[key.toISOString().slice(0, 10)] || 0;
        });

        renderWithLayout(res, 'users/reports', {
            pageTitle: 'Analytics',
            breadcrumb: [{ label: 'Analytics', href: '/admin/analytics' }],
            stats: { totalUsers, activeUsers, bannedUsers, verifiedUsers, unverifiedUsers: totalUsers - verifiedUsers, googleUsers, emailUsers, totalChats, totalMessages },
            chartData: {
                userGrowth:     { labels: labels30, data: growth30 },
                messagesPerDay: { labels: labels14, data: msgs14 },
            },
        });
    } catch (err) {
        res.status(500).render('error/500', { error: err, message: err.message });
    }
};
