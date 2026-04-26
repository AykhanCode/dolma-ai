import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(dto: CreatePostDto): Promise<Post> {
    const post = this.postRepository.create(dto);
    return this.postRepository.save(post);
  }

  async findAll(businessId?: string): Promise<Post[]> {
    const where = businessId ? { businessId } : {};
    return this.postRepository.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async update(id: string, dto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);
    Object.assign(post, dto);
    return this.postRepository.save(post);
  }

  async remove(id: string): Promise<void> {
    const post = await this.findOne(id);
    await this.postRepository.softRemove(post);
  }

  async publish(id: string): Promise<Post> {
    const post = await this.findOne(id);
    post.status = 'published';
    post.publishedAt = new Date();
    return this.postRepository.save(post);
  }

  async schedule(id: string, scheduledTime: Date): Promise<Post> {
    const post = await this.findOne(id);
    post.status = 'scheduled';
    post.scheduledTime = scheduledTime;
    return this.postRepository.save(post);
  }
}
