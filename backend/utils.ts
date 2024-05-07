import { blob } from "azle";

export function padPrincipalWithZeros(blob: blob): blob {
  let newUin8Array = new Uint8Array(32);
  newUin8Array.set(blob);
  return newUin8Array;
}
