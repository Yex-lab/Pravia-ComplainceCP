import { SetMetadata } from '@nestjs/common';

export const ResponseMessageKey = 'ResponseMessageKey';
export const ResponseMessage = (message: string) => SetMetadata(ResponseMessageKey, message);

export const ResponseAsStreamKey = 'ResponseAsStreamKey';
export const ResponseAsStream = (isStream: boolean) => SetMetadata(ResponseAsStreamKey, isStream);
