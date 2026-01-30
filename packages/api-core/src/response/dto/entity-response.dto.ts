import { ApiProperty } from '@nestjs/swagger';

export class EntityResponse<T> {
  @ApiProperty({ example: 200 })
  statusCode: number = 200;

  @ApiProperty({ example: 'OK' })
  statusMessage?: string;

  @ApiProperty({ example: 'The request succeeded', required: false })
  statusDescription?: string;

  @ApiProperty({ nullable: true })
  body?: T | null;

  @ApiProperty({ nullable: true })
  message?: string;

  constructor(
    body: T | null = null,
    message?: string,
    statusCode = 200,
    statusMessage?: string,
    statusDescription?: string,
  ) {
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
    this.statusDescription = statusDescription;
    this.body = body;
    this.message = message;
  }
}

export class EntityListResponse<T> {
  @ApiProperty({ example: 200 })
  statusCode: number = 200;

  @ApiProperty({ example: 'OK' })
  statusMessage?: string;

  @ApiProperty({ example: 'The request succeeded', required: false })
  statusDescription?: string;

  @ApiProperty({ type: Object, isArray: true, nullable: true })
  body?: T[] | null;

  @ApiProperty({ nullable: true })
  message?: string;

  constructor(
    body: T[] | null = null,
    message?: string,
    statusCode = 200,
    statusMessage?: string,
    statusDescription?: string,
  ) {
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
    this.statusDescription = statusDescription;
    this.body = body;
    this.message = message;
  }
}
