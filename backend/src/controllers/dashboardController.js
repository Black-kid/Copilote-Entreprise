const Request = require('../models/Request');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { STATUSES, PRIORITIES, ROLES } = require('../config/constants');

// @route   GET /api/dashboard/stats
// @desc    Get comprehensive KPIs, analytics, and operational metrics
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const totalRequests = await Request.countDocuments();
    
    // Status counts
    const statusCounts = {};
    for (const status of Object.values(STATUSES)) {
      statusCounts[status] = await Request.countDocuments({ status });
    }

    // Priority counts
    const priorityCounts = {};
    for (const priority of Object.values(PRIORITIES)) {
      priorityCounts[priority] = await Request.countDocuments({ priority });
    }

    // Department counts
    const departmentAgg = await Request.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const departmentCounts = {};
    departmentAgg.forEach(item => {
      if (item._id) departmentCounts[item._id] = item.count;
    });

    // Category counts
    const categoryAgg = await Request.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const categoryCounts = {};
    categoryAgg.forEach(item => {
      if (item._id) categoryCounts[item._id] = item.count;
    });

    // SLA Metrics
    const now = new Date();
    const activeRequests = await Request.find({
      status: { $nin: [STATUSES.TERMINEE, STATUSES.ARCHIVEE] }
    });

    let slaBreachedActive = 0;
    activeRequests.forEach(reqDoc => {
      if (reqDoc.dueDate && new Date(reqDoc.dueDate) < now) {
        slaBreachedActive++;
      }
    });

    const completedRequests = await Request.find({
      status: { $in: [STATUSES.TERMINEE, STATUSES.ARCHIVEE] }
    });

    // Average hours spent on completed tasks
    let totalActualHours = 0;
    let countedCompleted = 0;
    completedRequests.forEach(reqDoc => {
      if (reqDoc.actualHours && reqDoc.actualHours > 0) {
        totalActualHours += reqDoc.actualHours;
        countedCompleted++;
      }
    });
    const avgResolutionHours = countedCompleted > 0 ? (totalActualHours / countedCompleted).toFixed(1) : 3.5;

    // SLA Compliance rate %
    const totalActive = activeRequests.length;
    const slaComplianceRate = totalActive > 0 
      ? Math.round(((totalActive - slaBreachedActive) / totalActive) * 100)
      : 100;

    // Technician Workload
    const technicians = await User.find({ role: ROLES.TECHNICIAN, isActive: true })
      .select('name email avatar department jobTitle');

    const technicianWorkload = await Promise.all(
      technicians.map(async (tech) => {
        const inProgress = await Request.countDocuments({
          assignedTo: tech._id,
          status: { $in: [STATUSES.ASSIGNEE, STATUSES.EN_COURS] }
        });
        const completed = await Request.countDocuments({
          assignedTo: tech._id,
          status: { $in: [STATUSES.TERMINEE, STATUSES.ARCHIVEE] }
        });
        return {
          _id: tech._id,
          name: tech.name,
          email: tech.email,
          avatar: tech.avatar,
          jobTitle: tech.jobTitle,
          activeTasks: inProgress,
          completedTasks: completed
        };
      })
    );

    // Recent activity (latest 10 system events)
    const recentActivity = await ActivityLog.find()
      .populate('user', 'name role avatar')
      .populate('request', 'ticketNumber title priority status')
      .sort({ createdAt: -1 })
      .limit(10);

    // Recent 7 days trend
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const trendRequests = await Request.find({
      createdAt: { $gte: sevenDaysAgo }
    }).select('createdAt status');

    const daysMap = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const dayLabel = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
      daysMap[dayLabel] = { day: dayLabel, created: 0, completed: 0 };
    }

    trendRequests.forEach(reqDoc => {
      const d = new Date(reqDoc.createdAt);
      const dayLabel = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
      if (daysMap[dayLabel]) {
        daysMap[dayLabel].created++;
        if ([STATUSES.TERMINEE, STATUSES.ARCHIVEE].includes(reqDoc.status)) {
          daysMap[dayLabel].completed++;
        }
      }
    });

    const activityTrend = Object.values(daysMap);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalRequests,
          pendingValidation: statusCounts[STATUSES.EN_ATTENTE] || 0,
          inProgress: (statusCounts[STATUSES.ASSIGNEE] || 0) + (statusCounts[STATUSES.EN_COURS] || 0),
          completed: (statusCounts[STATUSES.TERMINEE] || 0) + (statusCounts[STATUSES.ARCHIVEE] || 0),
          urgentPending: await Request.countDocuments({
            priority: PRIORITIES.URGENTE,
            status: { $nin: [STATUSES.TERMINEE, STATUSES.ARCHIVEE] }
          }),
          slaComplianceRate,
          slaBreachedActive,
          avgResolutionHours
        },
        statusDistribution: statusCounts,
        priorityDistribution: priorityCounts,
        departmentDistribution: departmentCounts,
        categoryDistribution: categoryCounts,
        technicianWorkload,
        activityTrend,
        recentActivity
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
