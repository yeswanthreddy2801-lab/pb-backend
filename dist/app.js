"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const errorHandler_1 = require("./middleware/errorHandler");
const rateLimiter_1 = require("./middleware/rateLimiter");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const foodItems_routes_1 = __importDefault(require("./routes/foodItems.routes"));
const subscriptions_routes_1 = __importDefault(require("./routes/subscriptions.routes"));
const notifications_routes_1 = __importDefault(require("./routes/notifications.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const app = (0, express_1.default)();
// Security middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.env.CORS_ORIGIN,
    credentials: true
}));
// Parsers
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Logging
if (env_1.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// Rate limiters
app.use(rateLimiter_1.generalRateLimiter);
// Routes
const apiRouter = express_1.default.Router();
apiRouter.use('/auth', rateLimiter_1.authRateLimiter, auth_routes_1.default);
apiRouter.use('/users', users_routes_1.default);
apiRouter.use('/food-items', foodItems_routes_1.default);
apiRouter.use('/subscriptions', subscriptions_routes_1.default);
apiRouter.use('/notifications', notifications_routes_1.default);
apiRouter.use('/admin', admin_routes_1.default);
app.use('/api', apiRouter);
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Global error handler
app.use(errorHandler_1.errorHandler);
exports.default = app;
