import { DomainEvents } from '../../src/core/events/domain-events'
import { Student } from '../../src/domain/forum/enterprise/entities/student'
import { StudentsRepository } from '../../src/domain/forum/application/repositories/students-repository'  

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = []

  async findByEmail(email: string) {
    const student = this.items.find((item) => item.email === email)

    if (!student) {
      return null
    }

    return student
  }

  async create(student: Student) {
    this.items.push(student)

    DomainEvents.dispatchEventsForAggregate(student.id)
  }

}
