"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_router_1 = __importDefault(require("./user.router"));
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.send('Hello World');
});
router.use('/users', user_router_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map