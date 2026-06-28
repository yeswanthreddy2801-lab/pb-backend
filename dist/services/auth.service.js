"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAdmin = exports.loginUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const supabase_1 = require("../config/supabase");
const jwt_1 = require("../utils/jwt");
const loginUser = async (mobile) => {
    // Check if user exists
    const { data: existingUser, error: findError } = await supabase_1.supabase
        .from('users')
        .select('*')
        .eq('mobile', mobile)
        .single();
    if (findError && findError.code !== 'PGRST116') {
        throw new Error('Database error while finding user');
    }
    let user = existingUser;
    let isNewUser = false;
    if (!user) {
        // Create new user
        const { data: newUser, error: createError } = await supabase_1.supabase
            .from('users')
            .insert([{ mobile, is_new_user: true }])
            .select('*')
            .single();
        if (createError) {
            throw new Error('Failed to create new user');
        }
        user = newUser;
        isNewUser = true;
    }
    else {
        // Optionally update is_new_user to false on subsequent logins
        if (user.is_new_user) {
            await supabase_1.supabase
                .from('users')
                .update({ is_new_user: false })
                .eq('id', user.id);
            isNewUser = false;
        }
    }
    const token = (0, jwt_1.generateUserToken)({
        userId: user.id,
        mobile: user.mobile,
        isNewUser,
    });
    return { token, isNewUser, user };
};
exports.loginUser = loginUser;
const loginAdmin = async (mobile, passwordPlain) => {
    const { data: admin, error: findError } = await supabase_1.supabase
        .from('admins')
        .select('*')
        .eq('mobile', mobile)
        .single();
    if (findError || !admin) {
        throw new Error('Invalid credentials');
    }
    if (!admin.is_active) {
        throw new Error('Admin account is disabled');
    }
    const isMatch = await bcrypt_1.default.compare(passwordPlain, admin.password_hash);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }
    const token = (0, jwt_1.generateAdminToken)({
        adminId: admin.id,
        mobile: admin.mobile,
    });
    return { token, admin: { id: admin.id, name: admin.name, role: admin.role } };
};
exports.loginAdmin = loginAdmin;
