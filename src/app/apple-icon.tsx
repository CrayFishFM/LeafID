/* eslint-disable @next/next/no-img-element -- ImageResponse renders plain <img>, not next/image */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** The favicon (icon.svg) rendered as a PNG, since iOS home screens don't accept SVG. */
export default async function AppleIcon() {
  const svg = await readFile(join(process.cwd(), 'src/app/icon.svg'));
  return new ImageResponse(
    <img src={`data:image/svg+xml;base64,${svg.toString('base64')}`} width={180} height={180} alt="" />,
    size,
  );
}
