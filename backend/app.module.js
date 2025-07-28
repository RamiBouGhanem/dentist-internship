"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientsController = exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const patients_module_1 = require("./patients/patients.module");
const auth_module_1 = require("./auth/auth.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot('mongodb+srv://ramiboughanem:HRxcFgT9Zmy7B9HS@dentist-medical-portal.cvvlnzi.mongodb.net/?retryWrites=true&w=majority&appName=dentist-medical-portal'),
            patients_module_1.PatientsModule,
            auth_module_1.AuthModule,
        ],
    })
], AppModule);
const common_2 = require("@nestjs/common");
const patients_service_1 = require("./patients/patients.service");
const jwt_auth_guard_1 = require("./auth/jwt-auth.guard");
let PatientsController = class PatientsController {
    patientsService;
    constructor(patientsService) {
        this.patientsService = patientsService;
    }
    create(body) {
        return this.patientsService.create(body);
    }
    findAll(req) {
        return this.patientsService.findAll(req.user._id);
    }
    findOne(id) {
        return this.patientsService.findById(id);
    }
    update(id, updateData) {
        return this.patientsService.update(id, updateData);
    }
    addProcedure(id, toothNumber, procedure) {
        return this.patientsService.addProcedure(id, toothNumber, procedure);
    }
    removeProcedure(id, toothNumber, index) {
        return this.patientsService.removeProcedure(id, toothNumber, index);
    }
};
exports.PatientsController = PatientsController;
__decorate([
    (0, common_2.Post)(),
    __param(0, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "create", null);
__decorate([
    (0, common_2.Get)(),
    __param(0, (0, common_2.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "findAll", null);
__decorate([
    (0, common_2.Get)(':id'),
    __param(0, (0, common_2.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "findOne", null);
__decorate([
    (0, common_2.Patch)(':id'),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "update", null);
__decorate([
    (0, common_2.Patch)(':id/teeth/:toothNumber/add-procedure'),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, common_2.Param)('toothNumber')),
    __param(2, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "addProcedure", null);
__decorate([
    (0, common_2.Delete)(':id/teeth/:toothNumber/procedures/:index'),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, common_2.Param)('toothNumber')),
    __param(2, (0, common_2.Param)('index')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "removeProcedure", null);
exports.PatientsController = PatientsController = __decorate([
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_2.Controller)('patients'),
    __metadata("design:paramtypes", [patients_service_1.PatientsService])
], PatientsController);
//# sourceMappingURL=app.module.js.map