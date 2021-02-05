import { Injectable } from "@nestjs/common";
import {Sesion} from "../Models/sesion.model";
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose'

@Injectable()
export class SesionService{

    constructor(@InjectModel('Sesion') private readonly sesionModel: Model<Sesion>){}

    async insertSesion(request:RegisterSesionRequest): Promise<DefaultResponse>{

        const newSesion = new this.sesionModel({
            sesion_id: request.sesion_id,
            student: request.student,
            tipo: request.tipo,
            fecha: request.fecha
        }
            );

        await newSesion.save();
        return new DefaultResponse(0,'Sesion registrada');
    }
    
    async getStudentSesions(studentId:string): Promise<SearchClassAllgroupResponse>{
        let state=0;
        const sesions = await this.sesionModel.find({student:studentId},
            function(err,sesiones){
                if(err){
                    state = 1;
                    return [];
                }
                return sesiones;
            });
            
        return new SearchClassAllgroupResponse(state,sesions);
    }  

    async getSesion(sesionCode:string): Promise<SearchSesionResponse>{
        const sesion = await this.findSesion(sesionCode);

        if(sesion!=undefined){
            return new SearchSesionResponse(0,sesion,null);
        }else{
            return new SearchSesionResponse(1,null,'No se encontro la sesion');
        }
    }

    private async findSesion(sesionCode:string): Promise<Sesion>{
        
        try {
            const sesion =  await this.sesionModel.findOne({code:sesionCode});
            return sesion;
        } catch (error) {
            return undefined;
        }
        
    }

    async updateSesion(sesionCode:string, request:UpdateSesionRequest): Promise<DefaultResponse>{
        const updatedSesion = await this.findSesion(sesionCode);
        
        if(updatedSesion!=undefined){
            if(request.fecha){
                updatedSesion.fecha = request.fecha;
            }
            if(request.tipo){
                updatedSesion.tipo = request.tipo
            }
           
        }else{
            return new DefaultResponse(1,'No se encontro la sesion');
        }

        updatedSesion.save();
        return new DefaultResponse(0,'Sesion modificada con exito');
    }

    async deleteSesion(sesionCode:string):Promise<DefaultResponse>{
       const result = await this.sesionModel.deleteOne({code:sesionCode}).exec();
       
       if(result.n ===0){
           return new DefaultResponse(1,'No se encontro la sesion');
       }else{
           return new DefaultResponse(0,'Eliminado con exito');
       }
    }
   
}


export class SearchSesionResponse{
    constructor(
        public state:number,
        public sesion:Sesion,
        public message?:string,
        
    ){}
}

export class SearchClassAllgroupResponse{
    constructor(
        public state:number,
        public sesions:Sesion[],
    ){}
}


export class RegisterSesionRequest{

    constructor(
        public sesion_id:string,
        public student:string,
        public tipo:number,
        public fecha:string
    ){}
}

export class UpdateSesionRequest{

    constructor(
        public tipo:number,
        public fecha:string
    ){}
}

export class DefaultResponse{
    constructor(
        public state:number,
        public message:string
    ){}
}


