"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controller/user.controller");
const userRouter = (0, express_1.Router)();
const controller = new user_controller_1.UserController();
userRouter.get('/', (req, res) => {
    res.send('Hello World');
});
userRouter.post('/', controller.createUser);
exports.default = userRouter;
//# sourceMappingURL=user.router.js.map