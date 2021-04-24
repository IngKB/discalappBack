import { Controller, Post, Body , Get, Param, Delete} from "@nestjs/common";
import { ActivityResultService,RegisterActivityResultRequest, RegisterGroupActivityResultRequest,  } from "src/Services/activityResult.service";

@Controller('ActivityResult')
export class ActivityResultsController{

    constructor(private activityResultService: ActivityResultService){}
    @Post()
    async addActivityResult( @Body() request:RegisterActivityResultRequest) {
        return await this.activityResultService.insertActivityResult(request);   
    }

    @Post('group')
    async addGroupActivityResult( @Body() request:RegisterGroupActivityResultRequest) {
        return await this.activityResultService.insertGroupActivityResult(request);   
    }

    @Get('sesion/:id')
    async getSesionActivityResults(@Param('id') sesionId:string){
        return await this.activityResultService.getSesionActivityResults(sesionId);
    }

    @Delete(':id')
    async removeActivityResult(@Param('id') activityResultId:string){
        
        return await this.activityResultService.deleteActivityResult(activityResultId);
    }

  
}