const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const USERS_FILE = path.join(__dirname, '../data/users.json');

class User {
    constructor(data) {
        this.username = data.username;
        this.email = data.email;
        this.dob = data.dob;
        this.password = data.password;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.characters = data.characters || [];
        this.campaigns = data.campaigns || [];
    }

    // Read all users from file
    static async readUsers() {
        try {
            const data = await fs.readFile(USERS_FILE, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return {};
            }
            throw error;
        }
    }

    // Write users to file
    static async writeUsers(users) {
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    }

    // Find user by email
    static async findByEmail(email) {
        const users = await User.readUsers();
        const userData = users[email.toLowerCase()];
        return userData ? new User(userData) : null;
    }

    // Create new user
    static async create(userData) {
        const users = await User.readUsers();
        const email = userData.email.toLowerCase();

        if (users[email]) {
            throw new Error('User already exists');
        }

        // Hash password
        const rounds = parseInt(process.env.BCRYPT_ROUNDS);
        const bcryptRounds = (!isNaN(rounds) && rounds >= 10 && rounds <= 15) ? rounds : 10;
        const hashedPassword = await bcrypt.hash(userData.password, bcryptRounds);

        const newUser = new User({
            ...userData,
            email,
            password: hashedPassword
        });

        users[email] = newUser;
        await User.writeUsers(users);

        return newUser;
    }

    // Update user
    static async update(email, updates) {
        const users = await User.readUsers();
        const normalizedEmail = email.toLowerCase();

        if (!users[normalizedEmail]) {
            throw new Error('User not found');
        }

        // If password is being updated, hash it
        if (updates.password) {
            const rounds = parseInt(process.env.BCRYPT_ROUNDS);
            const bcryptRounds = (!isNaN(rounds) && rounds >= 10 && rounds <= 15) ? rounds : 10;
            updates.password = await bcrypt.hash(updates.password, bcryptRounds);
        }

        users[normalizedEmail] = { ...users[normalizedEmail], ...updates };
        await User.writeUsers(users);

        return new User(users[normalizedEmail]);
    }

    // Verify password
    async verifyPassword(password) {
        return bcrypt.compare(password, this.password);
    }

    // Get user without sensitive data
    toSafeObject() {
        return {
            username: this.username,
            email: this.email,
            dob: this.dob,
            createdAt: this.createdAt,
            characters: this.characters,
            campaigns: this.campaigns
        };
    }
}

module.exports = User;
