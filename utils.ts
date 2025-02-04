import { createHash } from 'crypto';
import { AquaObject } from './types';

export function getHashSum(data: string | Buffer): string {
  return createHash('sha256').update(data).digest('hex');
}

export function createNewAquaObject(): AquaObject {
  return {
    revisions: {},
    file_index: {}
  };
}

export function checkFileHashAlreadyNotarized(fileHash: string, aquaObject: AquaObject): void {
  if (fileHash in aquaObject.file_index) {
    throw new Error(`File hash ${fileHash} has already been notarized`);
  }
}

export function prepareNonce(): string {
  return getHashSum(Date.now().toString());
}

export function maybeUpdateFileIndex(
  aquaObject: AquaObject, 
  output: VerificationOutput, 
  revisionType: string
): void {
  if (revisionType === 'file' && output.data.file_hash) {
    aquaObject.file_index[output.data.file_hash] = output.verification_hash;
  }
}
