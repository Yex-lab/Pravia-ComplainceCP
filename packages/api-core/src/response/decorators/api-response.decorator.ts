import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { EntityResponse, EntityListResponse } from '../dto/entity-response.dto';

export const ApiOkBaseResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  isSingleEntity: boolean = false
) =>
  applyDecorators(
    ApiExtraModels(isSingleEntity ? EntityResponse : EntityListResponse, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(isSingleEntity ? EntityResponse : EntityListResponse) },
          {
            properties: {
              body: isSingleEntity
                ? { $ref: getSchemaPath(dataDto) }
                : {
                    type: 'array',
                    items: { $ref: getSchemaPath(dataDto) },
                  },
            },
          },
        ],
      },
    })
  );
