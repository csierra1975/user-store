import { Request, Response } from "express";
import { CustomError } from "../../domain";
import { FileUploadService } from "../services/file-upload.service";
import { UploadedFile } from "express-fileupload";


export class FileuUloadController {

    constructor(
        private readonly fileUpload: FileUploadService
    ){}

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({error: error.message})
        }

        return res.status(500).json({json: 'Internal server error' })
    }

    uploadFile = async (req: Request, res: Response) => {

        const type = req.params.type
        const file = req.body.files.at(0) as UploadedFile

        this.fileUpload.uploadSingle(file, `uploads/${ type }`)
        .then( uploadFile => res.json(uploadFile))
        .catch( error => this.handleError(error, res))
    }

    uploadMultipleFile = async (req: Request, res: Response) => {
        
        const type = req.params.type
        const files = req.body.files as UploadedFile[]

        this.fileUpload.uploadMultiple(files, `uploads/${ type }`)
        .then( uploadFiles => res.json(uploadFiles))
        .catch( error => this.handleError(error, res))
    }

}