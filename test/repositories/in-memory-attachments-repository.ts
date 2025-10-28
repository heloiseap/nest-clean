import { DomainEvents } from '../../src/core/events/domain-events'
import { Attachment } from '../../src/domain/forum/enterprise/entities/attachment'
import { AttachmentsRepository } from '../../src/domain/forum/application/repositories/attachments-repository'  

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = []

  async create(attachment: Attachment) {
    this.items.push(attachment)

  }

}
