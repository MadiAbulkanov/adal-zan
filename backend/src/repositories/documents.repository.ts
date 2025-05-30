import { AppDataSource } from '@/config/dataSource';
import { DocumentsDto } from '@/dto/documents.dto';
import { Documents } from '@/entities/documents.entity';
import { IDocuments } from '@/interfaces/IDocuments.interface';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { Lawyer } from '@/entities/lawyers.entity';
import { NotificationRepo } from '@/repositories/notification.repository';

export class DocsRepository extends Repository<Documents> {
    private lawyerRepo: Repository<Lawyer>;

    constructor() {
        super(Documents, AppDataSource.createEntityManager());
        this.lawyerRepo = AppDataSource.getRepository(Lawyer);
    }

    async createDoc(docsDto: DocumentsDto) {
        const exitstDocs = await this.findOne({ where: { lawyer: { id: docsDto.lawyerId } }, order: { id: 'desc' } });

        if (exitstDocs) {
            if (exitstDocs.publish === true) {
                return await this.save(docsDto);
            } else {
                return this.update({ id: exitstDocs.id }, { ...docsDto });
            }
        } else {
            return await this.save(docsDto);
        }
    }

    async publishDocs(docId: number, lawyerId: number) {
        const doc = await this.find({ where: { id: docId } });
        const lawyer = await this.lawyerRepo.findOne({ where: { id: lawyerId } });
        if(lawyer) {
            lawyer.isConfirmed = true;
            await this.lawyerRepo.save(lawyer);
        }
        
        doc[0].publish = true;
        return await this.save(doc[0]);
    }

    async getDocs(lawyerId?: number): Promise<IDocuments[]> {
        const queryBuilder = this.createQueryBuilder('documents').leftJoinAndSelect('documents.lawyer', 'lawyer');
        if (lawyerId) {
            queryBuilder.where('documents.lawyerId = :lawyerId', { lawyerId });
        }
        queryBuilder.orderBy('documents.id', 'ASC');

        return await queryBuilder.getMany();
    }

    async getPublishDocs(refreshToken: string): Promise<IDocuments | null> {
        return await this.findOne({
            where: {
                publish: true,
                lawyer: {
                    refreshToken: refreshToken,
                },
            },
            order: {
                id: 'DESC',
            },
        });
    }

    async getNotPublishDocs(): Promise<IDocuments[]> {
        const notPublishDocs = await this.find({
            where: {
                publish: false,
            },
            order: {
                id: 'DESC',
            },
            relations: {
                lawyer: true,
            },
        });

        return notPublishDocs;
    }

    async getOnePublish(req: Request) {
        const msg = req.query.documents as string;
        return await this.find({ where: { id: Number(msg), publish: true }, relations: { lawyer: true } });
    }

    async rejectDoc(refreshToken: string, requestId: string) {
        const notificationRepo = new NotificationRepo();
        const id = Number(requestId);
        const request = await this.findOne({ where: { id }});

        if (!request) {
            throw new Error('Запрос не найден');
        }

        request.publish = false;
        const notification = {
            topic: 'Уведомление от администрации сайта',
            content: 'Мы благодарим вас за предоставленные документы для подтверждения вашей квалификации. К сожалению, мы не можем одобрить вашу заявку, так как предоставленные документы не соответствуют требованиям нашего сайта. Пожалуйста, загрузите обновленные документы в вашем личном кабинете на сайте. С уважением, Администрация сайта',
            sourceLink: null,
            userId: null,
            lawyerId: request.lawyerId,
        }
        await notificationRepo.postQuestion(refreshToken, notification);
        await this.delete(request.id);
        return { message: 'успешно удален' };
    }
}
