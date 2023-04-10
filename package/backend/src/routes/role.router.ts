import { Router } from 'express';

import { RoleController } from '../controller/role.controller';
import { auth } from '../middlewares/security/auth';
import { hasRole } from '../middlewares/security/hasRole';
import { createRoleV, deleteRoleV, updateRoleV,getRoleByIdV} from '../middlewares/validators/role.validator';

const roleRouter = Router();

const controller = new RoleController();

roleRouter.use(auth,hasRole('admin'));

roleRouter.get('/', controller.getAllRoles);
roleRouter.get('/:id',getRoleByIdV, controller.getRoleByID);
roleRouter.post('/',createRoleV, controller.createRole);
roleRouter.put('/:id',updateRoleV, controller.updateRole);
roleRouter.delete('/:id',deleteRoleV, controller.deleteRole);


export default roleRouter;